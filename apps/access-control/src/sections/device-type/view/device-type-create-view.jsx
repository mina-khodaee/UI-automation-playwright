import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeviceTypeNewEditForm } from '../device-type-new-edit-form';

// ----------------------------------------------------------------------

export function DeviceTypeCreateView() {
  const {t} = useTranslate('device');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
         heading={t('breadCrumb.addDeviceType')}
         links={[
           { name: t('breadCrumb.dashboard'), href: paths.dashboard.root },
           { name: t('breadCrumb.deviceType') , href: paths.dashboard.deviceType.root },
           { name: t('breadCrumb.addDeviceType') },
         ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DeviceTypeNewEditForm />
    </DashboardContent>
  );
}
