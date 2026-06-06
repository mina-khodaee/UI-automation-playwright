'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment-jalaali';

import { useGetSelectVisitorTypesList } from 'src/services/visitorTypes/visitorTypes.service';
import * as visitorsData from 'src/services/visitor/visitor.service';

import { useTranslate } from 'src/locales';
import { ToggleSwitchGroup } from '@repo/ui/custom-mui-switch';
import { Field } from 'src/components/hook-form';

export function GuestSection({ resetCount }) {
  const inputSx = {
    '& .MuiInputBase-root': { height: 38, fontSize: 13 },
    '& .MuiInputBase-input': { padding: '6px 10px' },
    '& .MuiInputLabel-root': { fontSize: 12, top: '-3px' },
    '& .MuiOutlinedInput-notchedOutline': { borderRadius: 1 },
  };

  const { t: t_guestVisitor } = useTranslate('guest-visitor');
  const { currentLang } = useTranslate();
  const langKey = currentLang?.value || 'fa-IR';

  const { control, watch, setValue, setError, clearErrors, formState } = useFormContext();
  const { errors, submitCount } = formState;

  const visitorTypeId = watch('visitorTypeId');
  const nationalCode = watch('nationalCode');
  const passportNumber = watch('passportNumber');
  const inclusiveNumber = watch('inclusiveNumber');

  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const approvalOptions = [
    { value: 'WithApproval', label: 'با هماهنگی' },
    { value: 'WithoutApproval', label: 'بدون هماهنگی' },
  ];

  const { data: visitorTypes, refetch, isFetching } = useGetSelectVisitorTypesList();

  const guestTypeName = visitorTypes?.find((v) => v.id === visitorTypeId)?.name?.value;
  const isForeigner = guestTypeName === 'Foreigner';

  useEffect(() => {
    if (submitCount === 0) {
      return;
    }

    if (isForeigner) {
      if (!passportNumber || passportNumber.trim() === '') {
        setError('passportNumber', {
          type: 'manual',
          message: 'شماره پاسپورت الزامی است',
        });
      } else {
        clearErrors('passportNumber');
      }

      if (!inclusiveNumber || inclusiveNumber.trim() === '') {
        setError('inclusiveNumber', {
          type: 'manual',
          message: 'شماره فراگیر الزامی است',
        });
      } else {
        clearErrors('inclusiveNumber');
      }

      clearErrors('nationalCode');
    } else {
      if (!nationalCode || nationalCode.trim() === '') {
        setError('nationalCode', {
          type: 'manual',
          message: 'کد ملی الزامی است',
        });
      } else if (!/^\d{10}$/.test(nationalCode)) {
        setError('nationalCode', {
          type: 'manual',
          message: 'کد ملی باید ۱۰ رقم باشد',
        });
      } else {
        clearErrors('nationalCode');
      }

      clearErrors('passportNumber');
      clearErrors('inclusiveNumber');
    }
  }, [
    nationalCode,
    passportNumber,
    inclusiveNumber,
    isForeigner,
    submitCount,
    setError,
    clearErrors,
  ]);

  const { data: visitorsDataRes, isFetching: isSearching } = visitorsData.useGetVisitors(
    { searchTerm },
    true
  );
  const visitors = visitorsDataRes?.items || [];

  const handleNationalCodeSelect = (selectedCode) => {
    if (!selectedCode) return;

    const matched = visitors.find((v) => v.nationalCode === selectedCode);

    if (matched) {
      setValue('visitorTypeId', matched.visitorType?.id || '');
      const scheduleTypeValue =
        matched.scheduleType?.value || matched.scheduleType || 'WithApproval';
      setValue('scheduleType', scheduleTypeValue);
      setValue('visitorTypeName', matched.visitorType?.name || '');
      setValue('firstName', matched.firstName || '');
      setValue('lastName', matched.lastName || '');
      setValue('mobileNumber', matched.mobileNumber || '');
      setValue('gender', matched.gender === 'مرد' ? 'Male' : 'Female');
      setValue('dateOfBirth', matched.dateOfBirth || null);
      setValue('passportNumber', '');
      setValue('inclusiveNumber', '');
      setIsAutoFilled(true);
      clearErrors('nationalCode');
    } else {
      setValue('visitorTypeId', '');
      setValue('scheduleType', 'WithApproval');
      setValue('visitorTypeName', '');
      setValue('firstName', '');
      setValue('lastName', '');
      setValue('mobileNumber', '');
      setValue('gender', '');
      setValue('dateOfBirth', null);
      setValue('passportNumber', '');
      setValue('inclusiveNumber', '');
      setIsAutoFilled(false);
    }
  };

  useEffect(() => {
    if (resetCount) {
      setIsAutoFilled(false);
      setSearchTerm('');
    }
  }, [resetCount]);

  const transformedData = useMemo(() => {
    if (!visitorTypes) return [];
    return visitorTypes.map((item) => ({
      id: item.id,
      displayName: item.name.displayValues[langKey] || item.name.value,
      original: item,
    }));
  }, [visitorTypes, langKey]);

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <Box display="flex" flexDirection="column">
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              اطلاعات مهمان و ملاقات
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 1.5,
              minHeight: 64,
            }}
          >
            <Field.Select
              name="visitorTypeId"
              label={t_guestVisitor('formsInputs.visitorType')}
              data={transformedData}
              valueExp="id"
              displayExp="displayName"
              loading={isFetching}
              onOpen={refetch}
              disabled={isAutoFilled}
              sx={inputSx}
              size="small"
            />

            <Field.Select
              name="scheduleType"
              label="نوع هماهنگی"
              data={approvalOptions}
              valueExp="value"
              displayExp="label"
              sx={inputSx}
              size="small"
            />

            {isForeigner ? (
              <>
                <Field.Autocomplete
                  name="passportNumber"
                  label={t_guestVisitor('formsInputs.passportNumber')}
                  options={[]}
                  freeSolo
                  disabled={isAutoFilled}
                  error={!!errors?.passportNumber}
                  helperText={errors?.passportNumber?.message}
                  sx={inputSx}
                  slotProps={{ textField: { size: 'small' } }}
                />

                <Field.Autocomplete
                  name="inclusiveNumber"
                  label={t_guestVisitor('formsInputs.inclusiveNumber')}
                  options={[]}
                  freeSolo
                  disabled={isAutoFilled}
                  error={!!errors?.inclusiveNumber}
                  helperText={errors?.inclusiveNumber?.message}
                  sx={inputSx}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </>
            ) : (
              <Field.Autocomplete
                name="nationalCode"
                label={t_guestVisitor('formsInputs.nationalCode')}
                options={visitors.map((v) => v?.nationalCode).filter(Boolean)}
                freeSolo
                loading={isSearching}
                disabled={isAutoFilled}
                error={!!errors?.nationalCode}
                helperText={errors?.nationalCode?.message}
                onInputChange={(event, value) => {
                  setSearchTerm(value);
                }}
                onValueChange={(newValue) => {
                  handleNationalCodeSelect(newValue);
                }}
                sx={inputSx}
                slotProps={{ textField: { size: 'small' } }}
              />
            )}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 1.5,
              minHeight: 64,
            }}
          >
            <Field.Autocomplete
              name="mobileNumber"
              label={t_guestVisitor('formsInputs.mobileNumber')}
              options={[]}
              freeSolo
              disabled={isAutoFilled}
              sx={inputSx}
              slotProps={{ textField: { size: 'small' } }}
            />

            <Field.Autocomplete
              name="firstName"
              label={t_guestVisitor('formsInputs.firstName')}
              options={[]}
              freeSolo
              disabled={isAutoFilled}
              sx={inputSx}
              slotProps={{ textField: { size: 'small' } }}
            />

            <Field.Autocomplete
              name="lastName"
              label={t_guestVisitor('formsInputs.lastName')}
              options={[]}
              freeSolo
              disabled={isAutoFilled}
              sx={inputSx}
              slotProps={{ textField: { size: 'small' } }}
            />

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
                      helperText: fieldState.error?.message || '',
                    },
                  }}
                />
              )}
            />

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
