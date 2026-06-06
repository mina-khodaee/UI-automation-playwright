import React from 'react';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, Stack, Typography } from '@mui/material';

export function PersonnelSelectField({
  control,
  name,
  label,
  personnels,
  personnelsLoading,
  required = false,
}) {
  const findPersonnelByCode = (code) =>
    personnels.find((p) => p.personnelCode === code) || null;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          options={personnels}
          loading={personnelsLoading}
          getOptionLabel={(option) => {
            if (!option) return '';
            return `${option.personnelCode} - ${option.firstName || ''} ${
              option.lastName || ''
            }`.trim();
          }}
          isOptionEqualToValue={(option, value) =>
            option.personnelCode === value?.personnelCode ||
            option.personnelCode === value
          }
          onChange={(_, newValue) => {
            field.onChange(newValue?.personnelCode || '');
          }}
          value={findPersonnelByCode(field.value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              size="small"
              required={required}
              error={!!error}
              helperText={error ? error.message : ''}
              placeholder="کد پرسنلی یا نام را وارد کنید..."
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Stack>
                <Typography variant="body2">
                  {option.personnelCode} - {option.firstName} {option.lastName}
                </Typography>
                {option.position && (
                  <Typography variant="caption" color="text.secondary">
                    {option.position}
                  </Typography>
                )}
              </Stack>
            </li>
          )}
        />
      )}
    />
  );
}