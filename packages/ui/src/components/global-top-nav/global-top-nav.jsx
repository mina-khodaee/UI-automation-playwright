'use client';

import { useMemo, useState } from 'react';

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useColorScheme as useMuiColorScheme } from '@mui/material/styles';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import { useAuthContext } from '@repo/ui/auth-hooks';

export function GlobalTopNav({
  title = 'Dejban Portal',
  onOpenApps,
  onOpenSettings,
  onOpenNotifications,
  onLogout,
}) {
  const { user, logout } = useAuthContext();
  const { colorScheme, setMode } = useMuiColorScheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const darkMode = colorScheme === 'dark';

  const handleLogout = async () => {
    setAnchorEl(null);

    if (onLogout) {
      await onLogout();
      return;
    }

    await logout();
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ minHeight: 64 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1, minWidth: 0 }}>
          <Tooltip title="Apps">
            <IconButton onClick={onOpenApps} color="primary">
              <AppsRoundedIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.name || user?.username || user?.email || 'Signed in'}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Notifications">
            <IconButton onClick={onOpenNotifications}>
              <Badge color="error" variant="dot" invisible>
                <NotificationsNoneRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={() => setMode(darkMode ? 'light' : 'dark')}>
              {darkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton onClick={onOpenSettings}>
              <SettingsRoundedIcon />
            </IconButton>
          </Tooltip>

          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            <Avatar src={user?.avatar || ''} alt={user?.name || user?.username || 'User'}>
              {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Stack>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled>{user?.name || user?.username || user?.email || 'User'}</MenuItem>
          {user?.email && <MenuItem disabled>{user.email}</MenuItem>}
          <MenuItem onClick={handleLogout}>
            <LogoutRoundedIcon sx={{ mr: 1.5, color: 'error.main' }} />
            <Typography color="error.main">Sign out</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default GlobalTopNav;
