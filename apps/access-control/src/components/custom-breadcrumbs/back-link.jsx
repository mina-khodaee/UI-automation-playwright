import { IoArrowBack } from "react-icons/io5";

import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { IconifyLocal, iconifyClasses } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function BackLink({ sx, label, ...other }) {
  return (
    <Link
      component={RouterLink}
      color="inherit"
      underline="none"
      sx={[
        (theme) => ({
          verticalAlign: 'middle',
          [`& .${iconifyClasses.root}`]: {
            verticalAlign: 'inherit',
            transform: 'translateY(-2px)',
            ml: {
              xs: '-14px',
              md: '-18px',
            },
            transition: theme.transitions.create(['opacity'], {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.sharp,
            }),
          },
          '&:hover': {
            [`& .${iconifyClasses.root}`]: {
              opacity: 0.48,
            },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <IconifyLocal width={18}><IoArrowBack /></IconifyLocal>
      {label}
    </Link>
  );
}
