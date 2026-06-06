// VehicleSection.jsx
'use client';

import { Grid, Box, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export function VehicleSection({ control }) {
  const inputSx = {
    '& .MuiInputBase-root': { height: 38, fontSize: 13 },
    '& .MuiInputBase-input': { padding: '6px 10px' },
    '& .MuiInputLabel-root': { fontSize: 12, top: '-3px' },
    '& .MuiOutlinedInput-notchedOutline': { borderRadius: 1 },
  };

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
          }}
        >
          <Grid
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1,
              width: '33rem',
            }}
          >
            <Controller
              name="vehicle.plateNumber"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="شماره پلاک"
                  size="small"
                  sx={inputSx}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="vehicle.model"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="مدل خودرو"
                  size="small"
                  sx={inputSx}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
