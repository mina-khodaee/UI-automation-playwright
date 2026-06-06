import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeviceUserNewEditForm } from '../device-user-new-edit-form';

// ----------------------------------------------------------------------

export function DeviceUserCreateView() {
  const {t} = useTranslate('user');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
         heading={t('breadcrumb.newDeviceUser')}
         links={[
           { name: t('breadcrumb.dashboard'), href: paths.dashboard.root },
           { name: t('breadcrumb.deviceUsers') , href: paths.dashboard.aclUserManagement.root },
           { name: t('breadcrumb.newDeviceUser') },
         ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DeviceUserNewEditForm />
    </DashboardContent>
  );
}
