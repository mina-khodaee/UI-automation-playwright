import { useEffect } from 'react';
import { useTheme } from '@emotion/react';
import Calendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MdArrowBackIosNew } from "react-icons/md";
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { DashboardContent } from '@repo/ui/layouts-dashboard';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Box, Card, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { WEEK_DAYS } from 'src/_mock';
import { useTranslate } from 'src/locales';

import { EmptyContent } from 'src/components/empty-content';

import { StyledCalendar } from '../styles';
import { useCalendar } from '../hooks/use-calendar';
import { CalendarToolbar } from '../calendar-toolbar';
import { CalendarDetailToolbar } from '../calendar-detail-toolbar';
import { CalendarDetailSkeleton } from '../calendar-list-skeleton';

// ----------------------------------------------------------------------

export function CalendarDetailView({ calendar, loading, error }) {
  const theme = useTheme();

  const { t: t_device } = useTranslate('device');
  const { t: t_common, currentLang } = useTranslate();
  const [locale, direction, firstDayOfWeek] = currentLang.value === 'fa-IR' ? ['fa', 'rtl', 6] : ['en', 'ltr', 0];

  const shifts = Array.isArray(calendar?.weekDays)
    ? calendar.weekDays.flatMap((day, index) =>
      day.shifts.map((shift) => ({
        id: `${index + 1}-${shift.shiftNumber}`,
        title: `${t_device('formsInputs.shiftNumber')} ${shift.shiftNumber}`,
        startTime: shift.startTime,
        endTime: shift.endTime,
        allDay: false,
        daysOfWeek: WEEK_DAYS.filter((dayOfWeek) => dayOfWeek.value === day.dayOfWeek).map((dayOfWeek) => dayOfWeek.index),
        textColor: theme.palette.text.primary,
      }))
    )
    : [];

  const holidays = Array.isArray(calendar?.weekDays)
    ? calendar.holidays.map((holiday) => ({
      id: holiday.date,
      title: holiday.name,
      start: holiday.date,
      allDay: true,
      textColor: theme.palette.error.main,
    })) : [];
  const events = [...shifts, ...holidays];

  const {
    calendarRef,
    //
    view,
    date,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onChangeView,
    onInitialView,
  } = useCalendar();

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  const flexProps = { flex: '1 1 auto', display: 'flex', flexDirection: 'column' };

  if (loading) {
    return (
      <DashboardContent maxWidth={false} disablePadding>
        <CalendarDetailSkeleton />
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent maxWidth={false}>
        <EmptyContent
          filled
          title={t_device('texts.noData')}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.calendar.root}
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
    <>
      <DashboardContent>
        <Container sx={{ py: { sm: 4 }, px: { xs: 0 } }}>
          <CalendarDetailToolbar
            backLink={paths.dashboard.calendar.root}
            editLink={paths.dashboard.calendar.edit(calendar.id)}
          />
        </Container>
        <Card sx={{ ...flexProps, minHeight: '50vh' }}>
          <Box
            sx={{
              p: 4,
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              whiteSpace: 'normal',
              width: '100%',
            }}
          >
            <Typography>{t_device('formsInputs.description')}:</Typography>
            <Typography variant="body2" color="text.secondary">
              {calendar.description}
            </Typography>
          </Box>
          <StyledCalendar sx={{ ...flexProps, '.fc.fc-media-screen': { flex: '1 1 auto' } }}>
            <CalendarToolbar
              date={fDate(date)}
              view={view}
              loading={loading}
              onNextDate={onDateNext}
              onPrevDate={onDatePrev}
              onToday={onDateToday}
              onChangeView={onChangeView}
            />

            <Calendar
              weekends
              direction={direction}
              firstDay={firstDayOfWeek}
              locale={locale}
              rerenderDelay={1}
              allDayMaintainDuration
              allDayText={t_device('texts.allDay')}
              eventResizableFromStart
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              displayEventTime={false}
              events={events}
              headerToolbar={false}
              aspectRatio={3}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>

      </DashboardContent>
    </>
  );
}
