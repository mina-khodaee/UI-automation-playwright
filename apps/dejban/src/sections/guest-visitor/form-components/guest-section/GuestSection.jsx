'use client';

import { Controller } from 'react-hook-form';
import { Grid, Card, Box, TextField, MenuItem, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment-jalaali';

import * as visitorTypesData from 'src/services/visitorTypes/visitorTypes.service';
import { Field } from 'src/components/hook-form';
import { fData } from '@repo/ui/utils';
import { useTranslate } from 'src/locales/use-locales';
import * as React from 'react';

export function GuestSection({ control, watch }) {
  const { currentLang } = useTranslate();
  const langKey = currentLang?.value;

  const GUEST_TYPE = {
    FOREIGN: 'Foreigner',
  };

  const visitorTypeId = watch('visitorTypeId');

  const {
    data: visitorTypes,
    refetch,
    isFetching,
  } = visitorTypesData.useGetSelectVisitorTypesList();

  const guestTypeName = visitorTypes?.find((v) => v.id === visitorTypeId)?.name?.value;

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid size={{ xs: 12 }}>
        <Card sx={{ p: 3, width: '100%' }}>
          <Box display="grid" gap={2} gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}>
            {/* Visitor Type */}
            <Controller
              name="visitorTypeId"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="نوع مهمان"
                  size="small"
                  onFocus={refetch}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
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

            <Controller
              name="coordinationTypeId"
              control={control}
              render={({ field, fieldState }) => (
                <Field.Select
                  {...field}
                  name="doorId"
                  label="نوع هماهنگی"
                  size="small"
                  data={coordinationOptions}
                  valueExp="label"
                  displayExp="value"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ' '}
                />
              )}
            />

            {guestTypeName === GUEST_TYPE.FOREIGN ? (
              <>
                <Controller
                  name="passportNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="پاسپورت"
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="inclusiveNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="شماره فراگیر"
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
              </>
            ) : (
              <Controller
                name="nationalCode"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="کد ملی"
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                  />
                )}
              />
            )}
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="شماره موبایل"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="نام"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="نام خانوادگی"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="جنسیت"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  <MenuItem value="Male">مرد</MenuItem>
                  <MenuItem value="Female">زن</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="تاریخ تولد"
                  size="small"
                  value={field.value ? moment(field.value) : null}
                  onChange={(v) => field.onChange(v ? v.toISOString() : null)}
                  slotProps={{
                    textField: {
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Avatar & Public */}
          <Box mt={4} textAlign="center">
            <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography variant="caption" color="text.disabled">
                  *.jpg *.png *.gif — {fData(3145728)}
                </Typography>
              }
            />

            <Field.Switch name="isPublic" label="Public profile" sx={{ mt: 3 }} />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
