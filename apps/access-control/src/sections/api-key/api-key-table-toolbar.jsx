import { IoSearch } from 'react-icons/io5';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function APIKeyTableToolbar({ filters, onSearch }) {
  const { t: t_common } = useTranslate();

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            value={filters.state.search}
            onChange={onSearch}
            placeholder={t_common('placeholders.search')}
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
