import { MdArrowBackIosNew } from 'react-icons/md';
import { DashboardContent } from '@repo/ui/layouts-dashboard';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import { EmptyContent } from 'src/components/empty-content';

import { DeviceDetailItem } from '../device-detail-item';
import { DeviceDetailSkeleton } from '../device-skeleton';
import { DeviceDetailToolbar } from '../device-detail-toolbar';

// ----------------------------------------------------------------------

export function DeviceDetailView({ device, loading, error }) {

  const { t: t_common } = useTranslate();

  if (loading) {
    return (
      <DashboardContent  disablePadding>
        <DeviceDetailSkeleton />
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent >
        <EmptyContent
          filled
          title={t_common('commonTexts.noData')}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.device.root}
              startIcon={<MdArrowBackIosNew width={16} />}
              sx={{ mt: 3 }}
            >
              {t_common('button.back')}
            </Button>
          }
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth={1} sx={{ py: { sm: 4 }, px: { xs: 0 } }}>
        <DeviceDetailToolbar
          backLink={paths.dashboard.device.root}
          editLink={paths.dashboard.device.edit(device.id)}
        />
      </Container>
      <DeviceDetailItem device={device} />
    </DashboardContent>
  );
}
