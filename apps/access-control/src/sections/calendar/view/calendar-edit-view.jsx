import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CalendarNewEditForm } from '../calendar-new-edit-form';

// ----------------------------------------------------------------------

export function CalendarEditView({ calendar, calendarLoading }) {
  const {t} = useTranslate('device');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('breadCrumb.updateCalendar')}
        links={[
          { name: t('breadCrumb.dashboard'), href: paths.dashboard.root },
          { name: t('breadCrumb.calendar') , href: paths.dashboard.calendar.root },
          { name: t('breadCrumb.updateCalendar') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CalendarNewEditForm currentCalendar={calendar} calendarLoading={calendarLoading} />
    </DashboardContent>
  );
}
