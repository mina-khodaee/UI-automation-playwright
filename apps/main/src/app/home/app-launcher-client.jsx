'use client';

import { useMemo, useCallback } from 'react';

import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import {
  Box,
  Card,
  Grid,
  Stack,
  alpha,
  Avatar,
  Container,
  Typography,
  CardContent,
  CardActionArea,
} from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { useTranslate } from 'src/locales';

const APPS = [
  {
    id: 'dejban',
    nameKey: 'apps.dejban',
    descriptionKey: 'apps.dejbanDescription',
    route: '/dejban',
    color: '#006c9c',
    requiredClaims: [],
    icon: SecurityRoundedIcon,
  },
  {
    id: 'access-control',
    nameKey: 'apps.accessControl',
    descriptionKey: 'apps.accessControlDescription',
    route: '/access-control',
    color: '#7635dc',
    requiredClaims: [],
    icon: AccessibilityIcon,
  },
];

/**
 * Check if user has required claims to access an app
 * Claims-based access control allows selective visibility based on user permissions
 */
function userCanOpenApp(app, siteClaims) {
  if (!app.requiredClaims?.length) return true;

  const ownedClaims = new Set(
    (siteClaims || []).map((claim) => claim?.Value || claim?.value || claim?.Name || claim?.name || claim)
  );

  return app.requiredClaims.every((claim) => ownedClaims.has(claim));
}

export default function AppLauncherClient() {
  const { siteClaims } = useAuthContext();
  const { t } = useTranslate('appLauncher');

  // Filter apps based on user's claims (access control)
  const visibleApps = useMemo(
    () => APPS.filter((app) => userCanOpenApp(app, siteClaims)),
    [siteClaims]
  );

  // Navigate to app via client-side routing.
  // With the dev proxy (port 3000) all apps are same-origin → auth works.
  // In production, the main app's rewrites serve sub-apps from the same origin.
  const handleOpenApp = useCallback((app) => {
    window.location.href = app.route;
  }, []);

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          {/* Page Header */}
          <Stack spacing={1} sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -1 }}>
              {t('title')}
            </Typography>
          </Stack>

          {/* Apps Grid */}
          {visibleApps.length > 0 ? (
            <Grid container spacing={3}>
              {visibleApps.map((app) => (
                <Grid key={app.id} size={{ xs: 12, sm: 6, md:4 }}>
                  <Card
                    sx={{
                      height: '100%',
                      border: 1,
                      borderColor: 'divider',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                        borderColor: app.color,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleOpenApp(app)}
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Stack spacing={2.5} sx={{ height: '100%' }}>
                          {/* App Icon */}
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 64,
                              height: 64,
                              bgcolor: alpha(app.color, 0.12),
                              color: app.color,
                              fontSize: '1.75rem',
                            }}
                          >
                            <app.icon sx={{ fontSize: 'inherit' }} />
                          </Avatar>

                          {/* App Name and Description */}
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                mb: 0.75,
                                fontWeight: 700,
                                letterSpacing: -0.3,
                                color: 'text.primary',
                              }}
                            >
                              {t(app.nameKey)}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                lineHeight: 1.4,
                                minHeight: '2.8em',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {t(app.descriptionKey)}
                            </Typography>
                          </Box>                          
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            /* Empty State */
            <Box
              sx={{
                py: 10,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <AppsRoundedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {t('emptyState.title')}
              </Typography>
              <Typography color="text.disabled">
                {t('emptyState.description')}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
  );
}
