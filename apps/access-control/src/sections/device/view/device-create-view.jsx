import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeviceNewEditForm } from '../device-new-edit-form';

// ----------------------------------------------------------------------

export function DeviceCreateView() {
  const {t} = useTranslate('device');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
         heading={t('breadCrumb.add')}
         links={[
           { name: t('breadCrumb.dashboard'), href: paths.dashboard.root },
           { name: t('breadCrumb.device') , href: paths.dashboard.device.root },
           { name: t('breadCrumb.add') },
         ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DeviceNewEditForm />
    </DashboardContent>
  );
}
