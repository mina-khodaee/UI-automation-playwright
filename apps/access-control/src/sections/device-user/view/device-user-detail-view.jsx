import { MdArrowBackIosNew } from 'react-icons/md';
import { DashboardContent } from '@repo/ui/layouts-dashboard';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import { EmptyContent } from 'src/components/empty-content';

import { DeviceUserDetailItem } from '../device-user-detail-item';
import { DeviceUserDetailSkeleton } from '../device-user-skeleton';
import { DeviceUserDetailToolbar } from '../device-user-detail-toolbar';

// ----------------------------------------------------------------------

export function DeviceUserDetailView({ deviceUser, loading, error }) {

  const { t: t_common } = useTranslate();

  if (loading) {
    return (
      <DashboardContent maxWidth={false}>
        <DeviceUserDetailSkeleton />
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent maxWidth={false}>
        <EmptyContent
          filled
          title={t_common('commonTexts.noData')}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.aclUserManagement.root}
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
      <Container sx={{ py: { sm: 4 }, px: { xs: 0 } }}>
        <DeviceUserDetailToolbar
          backLink={paths.dashboard.aclUserManagement.root}
          editLink={paths.dashboard.aclUserManagement.edit(deviceUser?.userID)}
        />
        <DeviceUserDetailItem deviceUser={deviceUser} />
      </Container>
    </DashboardContent>
  );
}
