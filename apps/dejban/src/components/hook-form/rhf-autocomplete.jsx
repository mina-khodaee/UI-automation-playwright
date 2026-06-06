// src/components/hook-form/rhf-autocomplete.jsx

import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

export function RHFAutocomplete({
  name,
  label,
  slotProps,
  helperText,
  placeholder,
  options = [],
  freeSolo = false,
  multiple = false,
  getOptionLabel,
  isOptionEqualToValue,
  onInputChange,
  onValueChange,
  rules,
  ...other
}) {
  const { control } = useFormContext();
  const { textField, ...otherSlotProps } = slotProps ?? {};

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        let processedValue = field.value;
        const isObjectOptions = options.length > 0 && typeof options[0] === 'object';

        //  Handle multiple selection
        if (multiple) {
          // For multiple, value should be an array
          if (!Array.isArray(field.value)) {
            processedValue = [];
          } else if (isObjectOptions) {
            processedValue = field.value
              .map((v) => options.find((option) => option.value === v))
              .filter(Boolean);
          }
        } else {
          // Single selection logic (existing)
          if (isObjectOptions && typeof field.value === 'string' && field.value !== '') {
            processedValue = options.find((option) => option.value === field.value) || null;
          }
        }

        return (
          <Autocomplete
            multiple={multiple}
            freeSolo={freeSolo}
            options={options}
            getOptionLabel={
              getOptionLabel ||
              (isObjectOptions
                ? (option) => {
                    if (typeof option === 'string') return option;
                    return option?.label ?? '';
                  }
                : undefined)
            }
            isOptionEqualToValue={
              isOptionEqualToValue ||
              (isObjectOptions
                ? (option, value) => {
                    if (multiple) {
                      return value?.some((v) => v.value === option.value);
                    }
                    return option?.value === value?.value;
                  }
                : undefined)
            }
            value={processedValue ?? (multiple ? [] : null)}
            onChange={(_, newValue, reason) => {
              if (multiple) {
                if (isObjectOptions) {
                  field.onChange(newValue.map((v) => v.value));
                } else {
                  field.onChange(newValue);
                }
              } else {
                if (newValue === null) {
                  field.onChange('');
                } else if (typeof newValue === 'string') {
                  field.onChange(newValue);
                } else if (isObjectOptions && newValue?.value !== undefined) {
                  field.onChange(newValue.value);
                } else {
                  field.onChange(newValue);
                }
              }
              if (onValueChange) {
                onValueChange(newValue, reason);
              }
            }}
            onInputChange={(event, value, reason) => {
              // ✅ فقط در حالت freeSolo مقدار را به فرم بفرست
              // در غیر این صورت فرم را بی‌جهت به روز نکن
              if (freeSolo) {
                field.onChange(value);
              }

              if (onInputChange) {
                onInputChange(event, value, reason);
              }
            }}
            id={`${name}-rhf-autocomplete`}
            renderInput={(params) => (
              <TextField
                {...params}
                {...textField}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error ? error?.message : helperText || ' '}
                slotProps={{
                  ...textField?.slotProps,
                  htmlInput: {
                    ...params.inputProps,
                    ...textField?.slotProps?.htmlInput,
                    autoComplete: 'new-password',
                  },
                }}
              />
            )}
            slotProps={{
              ...otherSlotProps,
              chip: {
                size: 'small',
                variant: 'soft',
                ...otherSlotProps?.chip,
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}
