import moment from 'moment-jalaali';
import { useRef, useState, useCallback } from 'react';

import { useResponsive } from 'src/hooks/use-responsive';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function useCalendar() {
  const calendarRef = useRef(null);
  const { currentLang } = useTranslate();
  const initialDate = currentLang?.value === 'fa-IR'
  ? moment().startOf('jMonth').toDate()
  : new Date();
  const smUp = useResponsive('up', 'sm');
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(smUp ? 'dayGridMonth' : 'listWeek');

  const onInitialView = useCallback(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = smUp ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [smUp]);

  const onChangeView = useCallback(
    (newView) => {
      const calendarEl = calendarRef.current; // Access directly here
      if (calendarEl) {
        const calendarApi = calendarEl.getApi();
        calendarApi.changeView(newView);
        setView(newView);
      }
    },
    []
  );

  const onDateToday = useCallback(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  }, []);

  const onDatePrev = useCallback(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  }, []);

  const onDateNext = useCallback(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  }, []);

  return {
    calendarRef,
    view,
    date,
    onDatePrev,
    onDateNext,
    onDateToday,
    onChangeView,
    onInitialView,
  };
}
