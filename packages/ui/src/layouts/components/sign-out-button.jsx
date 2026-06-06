'use client';

import { useCallback } from 'react';
import { useAuthContext } from '@repo/ui/auth-hooks';

import Button from '@mui/material/Button';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export function SignOutButton({ onClose, sx, ...other }) {
  const { t: t_user } = useTranslate('user');
  const { t: t_navbar } = useTranslate('navbar');

  const { logout } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success(t_user('toastMessages.logoutSuccess'));
      onClose?.();
    } catch (error) {
      console.log(error);
      toast.error(t_user('toastMessages.logoutError'));
    }
  }, [logout, onClose]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      {t_navbar('sidebar.logout')}
    </Button>
  );
}
