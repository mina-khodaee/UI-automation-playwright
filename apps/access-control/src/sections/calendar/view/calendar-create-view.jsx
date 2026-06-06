import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CalendarNewEditForm } from '../calendar-new-edit-form';

// ----------------------------------------------------------------------

export function CalendarCreateView() {
  const {t} = useTranslate('device');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
         heading={t('breadCrumb.newCalendar')}
         links={[
           { name: t('breadCrumb.dashboard'), href: paths.dashboard.root },
           { name: t('breadCrumb.calendar') , href: paths.dashboard.calendar.root },
           { name: t('breadCrumb.newCalendar') },
         ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
    <CalendarNewEditForm />
    </DashboardContent>
  );
}
