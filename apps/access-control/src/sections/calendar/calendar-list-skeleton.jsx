import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export function CalendarListSkeleton({ sx, amount = 8, variant = 'vertical', ...other }) {
  const xsUp = useResponsive('up', 'xs');

    return [...Array(amount)].map((_, index) => (
      <Stack
        key={index}
        direction="row"
        sx={{
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          ...sx,
        }}
        {...other}
      >
        <Stack spacing={2} flexGrow={1} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Skeleton sx={{ width: 24, height: 12 }} />
          </Stack>
          <Skeleton sx={{ width: 1, height: 10 }} />
          <Skeleton sx={{ width: `calc(100% - 40px)`, height: 10 }} />
          <Skeleton sx={{ width: `calc(100% - 80px)`, height: 10 }} />
        </Stack>

        {xsUp && (
          <Stack sx={{ p: 1 }}>
            <Skeleton sx={{ width: 170, height: 240, flexShrink: 0 }} />
          </Stack>
        )}
      </Stack>
    ));
}

// ----------------------------------------------------------------------

export function CalendarDetailSkeleton({ ...other }) {
  return (
    <Grid container spacing={8} {...other}>
    <Grid size={{ xs: 12, md: 6, lg: 7}}>
      <Skeleton sx={{ pt: '100%' }} />
    </Grid>

    <Grid size={{ xs: 12, md: 6, lg: 5}}>
      <Stack spacing={3}>
        <Skeleton sx={{ height: 16, width: 48 }} />
        <Skeleton sx={{ height: 16, width: 80 }} />
        <Skeleton sx={{ height: 16, width: 0.5 }} />
        <Skeleton sx={{ height: 16, width: 0.75 }} />
        <Skeleton sx={{ height: 120 }} />
      </Stack>
    </Grid>

    <Grid size={{ xs: 12 }}>
      <Stack direction="row" alignItems="center">
        {[...Array(3)].map((_, index) => (
          <Stack
            key={index}
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ width: 1 }}
          >
            <Skeleton variant="circular" sx={{ width: 80, height: 80 }} />
            <Skeleton sx={{ height: 16, width: 160 }} />
            <Skeleton sx={{ height: 16, width: 80 }} />
          </Stack>
        ))}
      </Stack>
    </Grid>
  </Grid>
  );
}
