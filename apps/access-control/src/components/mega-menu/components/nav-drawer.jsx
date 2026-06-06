import { IoArrowBack } from "react-icons/io5";
import { IconifyLocal } from '@repo/ui/iconify-local';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';


// ----------------------------------------------------------------------

export const NavDrawerHeader = styled(({ onBack, title, ...other }) => (
  <div {...other}>
    <IconButton onClick={onBack}>
      <IconifyLocal
        width={16}
        sx={(theme) => ({ ...(theme.direction === 'rtl' && { transform: 'scaleX(-1)' }) })}>
        <IoArrowBack />
      </IconifyLocal>
    </IconButton>
    {title}
  </div>
))(({ theme }) => ({
  ...theme.typography.subtitle1,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 1),
}));
