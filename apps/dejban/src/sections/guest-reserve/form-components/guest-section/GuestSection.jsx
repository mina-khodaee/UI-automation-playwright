'use client';

import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Grid, Box, TextField, MenuItem, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment-jalaali';

import * as visitorTypesData from 'src/services/visitorTypes/visitorTypes.service';
import * as visitorsData from 'src/services/visitor/visitor.service';

import { useTranslate } from 'src/locales';
import { ToggleSwitchGroup } from '@repo/ui/custom-mui-switch';

export function GuestSection({ control, watch, setValue, setError, clearErrors }) {
  /* ===================== styles ===================== */
  const inputSx = {
    '& .MuiInputBase-root': { height: 38, fontSize: 13 },
    '& .MuiInputBase-input': { padding: '6px 10px' },
    '& .MuiInputLabel-root': { fontSize: 12, top: '-3px' },
    '& .MuiOutlinedInput-notchedOutline': { borderRadius: 1 },
  };

  /* ===================== i18n ===================== */
  const { t: t_guestVisitor } = useTranslate('guest-visitor');
  const { currentLang } = useTranslate();
  const langKey = currentLang?.value;

  /* ===================== form watch ===================== */
  const visitorTypeId = watch('visitorTypeId');
  const nationalCodeValue = watch('nationalCode');

  /* ===================== local state ===================== */
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  /* ===================== constants ===================== */
  const GUEST_TYPE = {
    FOREIGN: 'Foreigner',
  };

  /* ===================== data ===================== */

  // Visitor types
  const {
    data: visitorTypes,
    refetch,
    isFetching,
  } = visitorTypesData.useGetSelectVisitorTypesList();

  // Visitors (duplicate check)
  const { data: visitorsDataRes } = visitorsData.useGetVisitors({ searchTerm }, true);
  const visitors = visitorsDataRes?.items || [];

  const guestTypeName = visitorTypes?.find((v) => v.id === visitorTypeId)?.name?.value;

  /* ===================== EFFECT: National Code Logic ===================== */
  useEffect(() => {
    if (!nationalCodeValue) return;
    //  duplicate check
    // const exists = visitors.some((v) => v.nationalCode === nationalCodeValue);
    // if (exists) {
    //   setError('nationalCode', {
    //     type: 'manual',
    //     message: 'این کد ملی قبلاً ثبت شده است',
    //   });
    //   return;
    // }
    // clearErrors('nationalCode');
  }, [nationalCodeValue, visitors, setError, clearErrors]);

  /* ===================== UI ===================== */
  return (
    <Grid container>
      <Grid size={{ xs: 12}}>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* ===================== TOP ROW ===================== */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 1.5,
              width: '87%',
            }}
          >
            {/* Visitor Type */}
            <Controller
              name="visitorTypeId"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  value={field.value || ''}
                  label={t_guestVisitor('formsInputs.visitorType')}
                  size="small"
                  sx={inputSx}
                  onFocus={refetch}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    const selected = visitorTypes?.find((v) => v.id === e.target.value);
                    setValue('visitorTypeName', selected?.name?.value || '');
                  }}
                  disabled={isAutoFilled}
                >
                  {isFetching ? (
                    <MenuItem disabled>در حال بارگذاری...</MenuItem>
                  ) : (
                    visitorTypes?.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name.displayValues[langKey] || type.name.value}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              )}
            />

            {/* Foreign Guest */}
            {guestTypeName === GUEST_TYPE.FOREIGN ? (
              <>
                <Controller
                  name="passportNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={t_guestVisitor('formsInputs.passportNumber')}
                      size="small"
                      sx={inputSx}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      disabled={isAutoFilled}
                    />
                  )}
                />

                <Controller
                  name="inclusiveNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={t_guestVisitor('formsInputs.inclusiveNumber')}
                      size="small"
                      sx={inputSx}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      disabled={isAutoFilled}
                    />
                  )}
                />
              </>
            ) : (
              /* National Code */
              <Controller
                name="nationalCode"
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    freeSolo
                    options={visitors.map((v) => v?.nationalCode)}
                    value={field.value || ''}
                    onInputChange={(_, value) => {
                      setSearchTerm(value);
                      field.onChange(value);
                    }}
                    onChange={(_, value) => {
                      field.onChange(value || '');
                      const matched = visitors.find((v) => v.nationalCode === value);
                      if (matched) {
                        setValue('visitorTypeId', matched.visitorType.id || '');
                        setValue('visitorTypeName', matched.visitorType.name || '');
                        setValue('firstName', matched.firstName || '');
                        setValue('lastName', matched.lastName || '');
                        setValue('mobileNumber', matched.mobileNumber || '');
                        setValue('gender', matched.gender || '');
                        setValue('dateOfBirth', matched.dateOfBirth || null);
                        setIsAutoFilled(true);
                      } else {
                        setValue('visitorTypeId', '');
                        setValue('visitorTypeName', '');
                        setValue('firstName', '');
                        setValue('lastName', '');
                        setValue('mobileNumber', '');
                        setValue('gender', '');
                        setValue('dateOfBirth', null);
                        setIsAutoFilled(false);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        label="کد ملی"
                        size="small"
                        error={!!fieldState.error}
                        helperText={!!fieldState.error}
                        disabled={isAutoFilled}
                      />
                    )}
                  />
                )}
              />
            )}
          </Box>

          {/* ===================== BOTTOM ROW ===================== */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 1.5,
              width: '87%',
            }}
          >
            {/* Mobile */}
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t_guestVisitor('formsInputs.mobileNumber')}
                  size="small"
                  sx={inputSx}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isAutoFilled}
                />
              )}
            />

            {/* First Name */}
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t_guestVisitor('formsInputs.firstName')}
                  size="small"
                  sx={inputSx}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isAutoFilled}
                />
              )}
            />

            {/* Last Name */}
            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t_guestVisitor('formsInputs.lastName')}
                  size="small"
                  sx={inputSx}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isAutoFilled}
                />
              )}
            />

            {/* Date of Birth */}
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label={t_guestVisitor('formsInputs.dateOfBirth')}
                  value={field.value ? moment(field.value) : null}
                  onChange={(v) => field.onChange(v ? v.toISOString() : null)}
                  disabled={isAutoFilled}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: inputSx,
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                />
              )}
            />

            {/* Gender */}
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <ToggleSwitchGroup
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isAutoFilled}
                  options={[
                    { label: 'مرد', value: 'Male' },
                    { label: 'زن', value: 'Female' },
                  ]}
                />
              )}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
