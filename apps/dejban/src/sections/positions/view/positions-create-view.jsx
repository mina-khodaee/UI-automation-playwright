'use client';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PositionNewEditForm } from '../position-new-edit-form';

// ----------------------------------------------------------------------

export function PositionCreateView() {
  const { t } = useTranslate('positions');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('breadcrumb.newPosition')}
        links={[
          { name: t('breadcrumb.dashboard'), href: paths.dashboard.root },
          { name: t('breadcrumb.positions'), href: paths.dashboard.Positions.root },
          { name: t('breadcrumb.newPosition') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PositionNewEditForm />
    </DashboardContent>
  );
}
