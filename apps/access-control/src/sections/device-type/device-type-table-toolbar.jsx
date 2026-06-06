import { useCallback } from 'react';
import { IoSearch } from 'react-icons/io5';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function DeviceTypeTableToolbar({ filters, options, onSearch, onFilter }) {
  const { t } = useTranslate();
  const { t: t_device } = useTranslate('device');
  const handleFilterBrand = useCallback(
    (event) => {
      console.log(event.target.value);
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
      filters.setState({ brand: newValue });
      onFilter(newValue);
    },
    [filters, onFilter]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="user-filter-brand-select-label">{t_device('formsInputs.brand')}</InputLabel>
          <Select
            multiple
            value={filters.state.brand}
            onChange={handleFilterBrand}
            input={<OutlinedInput label={t_device('formsInputs.brand')} />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'user-filter-brand-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            {Array.isArray(options?.brand) && options?.brand?.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.state.brand.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.state.search}
            onChange={onSearch}
            placeholder={t('placeholders.search')}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IoSearch sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }

            }}
          />
        </Stack>
      </Stack>
    </>
  );
}
