import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { DeviceUserNewEditForm } from '../device-user-new-edit-form';
import { PositionNewEditForm } from '../position-new-edit-form';

// ----------------------------------------------------------------------

export function PositionEditView({ position, positionLoading }) {
  const { t } = useTranslate('positions');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('breadcrumb.updatePosition')}
        links={[
          { name: t('breadcrumb.dashboard'), href: paths.dashboard.root },
          { name: t('breadcrumb.positions'), href: paths.dashboard.aclUserManagement.root },
          { name: t('breadcrumb.updatePosition') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {!positionLoading && <PositionNewEditForm currentPosition={position} />}
    </DashboardContent>
  );
}
