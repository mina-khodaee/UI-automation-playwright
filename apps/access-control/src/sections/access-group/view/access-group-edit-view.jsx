import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AccessGroupNewEditForm } from '../access-group-new-edit-form';

// ----------------------------------------------------------------------

export function AccessGroupEditView({ accessGroup }) {
  const {t} = useTranslate('device');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('breadCrumb.updateAccessGroup')}
        links={[
          { name: t('breadCrumb.dashboard'), href: paths.dashboard.root },
          { name: t('breadCrumb.accessGroup') , href: paths.dashboard.accessGroup.root },
          { name: t('breadCrumb.updateAccessGroup') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AccessGroupNewEditForm currentAccessGroup={accessGroup} />
    </DashboardContent>
  );
}
