'use client';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import moment from 'moment-jalaali';

// ----------------------------------------------------------------------

/**
 * Day.js format reference:
 * https://day.js.org/docs/en/display/format
 */

/**
 * Timezone reference:
 * https://day.js.org/docs/en/timezone/set-default-timezone
 */

/**
 * UTC usage:
 * https://day.js.org/docs/en/plugin/utc
 * Example:
 * import utc from 'dayjs/plugin/utc';
 * dayjs.extend(utc);
 * dayjs().utc().format()
 */

dayjs.extend(duration);
dayjs.extend(relativeTime);

// ----------------------------------------------------------------------

function getCookie(name) {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

const locale = getCookie('i18next');
moment.locale(locale);
const persianCalendar = 'fa-IR';
if (locale === persianCalendar) {
  moment.loadPersian({
    dialect: 'persian-modern',
    usePersianDigits: false,
  });
}

// export const formatPatterns = {
//   dateTime: locale === persianCalendar ? 'jDD jMMMM jYYYY HH:mm' : 'DD MMM YYYYHH:mm',
//   date: locale === persianCalendar ? 'jDD jMMMM jYYYY' : 'DD MMM YYYY',
//   time: 'HH:mm',
//   split: {
//     dateTime: locale === persianCalendar ? 'jDD/jMM/jYYYY HH:mm' : 'DD/MM/YYYYHH:mm',
//     date: locale === persianCalendar ? 'jDD/jMM/jYYYY' : 'DD/MM/YYYY',
//   },
//   paramCase: {
//     dateTime: locale === persianCalendar ? 'jDD-jMM-jYYYY HH:mm' : 'DD-MM-YYYY HH:mm',
//     date: locale === persianCalendar ? 'jDD-jMM-jYYYY' : 'DD-MM-YYYY',
//   },
// };
export const formatPatterns = {
  dateTime: locale === persianCalendar ? 'jYYYY/jMM/jDD' : 'YYYY/MM/DD',  // این خط تغییر کرد
  date: locale === persianCalendar ? 'jDD jMMMM jYYYY' : 'DD MMM YYYY',
  time: 'HH:mm',
  split: {
    dateTime: locale === persianCalendar ? 'jDD/jMM/jYYYY HH:mm' : 'DD/MM/YYYYHH:mm',
    date: locale === persianCalendar ? 'jDD/jMM/jYYYY' : 'DD/MM/YYYY',
  },
  paramCase: {
    dateTime: locale === persianCalendar ? 'jDD-jMM-jYYYY HH:mm' : 'DD-MM-YYYY HH:mm',
    date: locale === persianCalendar ? 'jDD-jMM-jYYYY' : 'DD-MM-YYYY',
  },
};

export const FORMAT_PATTERNS = {
  dateTime: 'DD MMM YYYY h:mm a', // 17 Apr 2022 12:00 am
  date: 'DD MMM YYYY', // 17 Apr 2022
  time: 'h:mm a', // 12:00 am
  split: {
    dateTime: 'DD/MM/YYYY h:mm a', // 17/04/2022 12:00 am
    date: 'DD/MM/YYYY', // 17/04/2022
  },
  paramCase: {
    dateTime: 'DD-MM-YYYY h:mm a', // 17-04-2022 12:00 am
    date: 'DD-MM-YYYY', // 17-04-2022
  },
};

const INVALID_DATE = 'Invalid';

// ----------------------------------------------------------------------

export function today_dayjs(template) {
  return dayjs(new Date()).startOf('day').format(template);
}

export function today(template) {
  return moment().startOf('day').format(template);
}

// ----------------------------------------------------------------------

/**
 * Formats a date-time string.
 * @returns Formatted date-time string or 'Invalid'.
 * @example
 * fDateTime('17-04-2022') // '17 Apr 2022 12:00 am'
 */
export function fDateTime_dayjs(input, template = FORMAT_PATTERNS.dateTime) {
  if (!input) return '';

  const date = dayjs(input);
  if (!date.isValid()) return INVALID_DATE;

  return date.format(template);
}

export function fDateTime(date, keepUTC, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  if (keepUTC) {
    return moment(date)
      .utc()
      .format(template ?? formatPatterns.dateTime);
  }

  return moment(date).format(template ?? formatPatterns.dateTime);
}

// ----------------------------------------------------------------------

/**
 * Formats a date string.
 * @returns Formatted date string or 'Invalid'.
 * @example
 * fDate('17-04-2022') // '17 Apr 2022'
 */
export function fDate_dayjs(input, template = FORMAT_PATTERNS.date) {
  if (!input) return '';

  const date = dayjs(input);
  if (!date.isValid()) return INVALID_DATE;

  return date.format(template);
}

export function fDate(date, keepUTC, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  if (keepUTC) {
    return moment(date)
      .utc()
      .format(template ?? formatPatterns.date);
  }

  return moment(date).format(template ?? formatPatterns.date);
}

// ----------------------------------------------------------------------

/**
 * Formats a time string.
 * @returns Formatted time string or 'Invalid'.
 * @example
 * fTime('2022-04-17T00:00:00') // '12:00 am'
 */
export function fTime_dayjs(input, template = FORMAT_PATTERNS.time) {
  if (!input) return '';

  const date = dayjs(input);
  if (!date.isValid()) return INVALID_DATE;

  return date.format(template);
}

export function fTime(date, keepUTC, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  if (keepUTC) {
    return moment(date)
      .utc()
      .format(template ?? formatPatterns.time);
  }

  return moment(date).format(template ?? formatPatterns.time);
}

// ----------------------------------------------------------------------

/**
 * Converts a date input to timestamp.
 * @returns Timestamp in milliseconds or 'Invalid'.
 * @example
 * fTimestamp('2022-04-17') // 1650153600000
 */
export function fTimestamp_dayjs(input) {
  if (!input) return '';

  const date = dayjs(input);
  if (!date.isValid()) return INVALID_DATE;

  return date.valueOf();
}

export function fTimestamp(date) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return moment(date).valueOf();
}

// ----------------------------------------------------------------------

/**
 * Returns relative time from now to the input.
 * @returns A relative time string.
 * @example
 * fToNow(dayjs().subtract(2, 'days')) // '2 days'
 */
export function fToNow_dayjs(input) {
  if (!input) return '';

  const date = dayjs(input);
  if (!date.isValid()) return INVALID_DATE;

  return date.toNow(true);
}

export function fToNow(date) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return moment(date).fromNow(true);
}

// ----------------------------------------------------------------------

/**
 * Checks if a date is between two dates (inclusive).
 * @returns `true` if input is between start and end.
 * @example
 * fIsBetween('2024-01-02', '2024-01-01', '2024-01-03') // true
 */
export function fIsBetween_dayjs(input, start, end) {
  if (!input || !start || !end) return false;

  const inputDate = dayjs(input);
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (!inputDate.isValid() || !startDate.isValid() || !endDate.isValid()) {
    return false;
  }

  const inputValue = inputDate.valueOf();
  const startValue = startDate.valueOf();
  const endValue = endDate.valueOf();

  return (
    inputValue >= Math.min(startValue, endValue) && inputValue <= Math.max(startValue, endValue)
  );
}

export function fIsBetween(inputDate, startDate, endDate) {
  if (!isValidDate(inputDate) || !isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  const formattedInputDate = moment(inputDate);
  const formattedStartDate = moment(startDate);
  const formattedEndDate = moment(endDate);

  return formattedInputDate.isBetween(formattedStartDate, formattedEndDate, null, '[]');
}

// ----------------------------------------------------------------------

/**
 * Checks if one date is after another.
 * @returns `true` if start is after end.
 * @example
 * fIsAfter('2024-05-01', '2024-04-01') // true
 */
export function fIsAfter_dayjs(start, end) {
  if (!start || !end) return false;

  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (!startDate.isValid() || !endDate.isValid()) {
    return false;
  }

  return startDate.isAfter(endDate);
}

export function fIsAfter(startDate, endDate) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  return moment(startDate).isAfter(moment(endDate));
}

// ----------------------------------------------------------------------

/**
 * Checks if two dates are the same by a given unit.
 * @returns `true` if equal by unit.
 * @example
 * fIsSame('2024-04-01', '2024-05-01', 'year') // true
 * fIsSame('2024-04-01', '2023-05-01', 'year') // false
 */
export function fIsSame_dayjs(start, end, unit = 'year') {
  if (!start || !end) return false;

  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (!startDate.isValid() || !endDate.isValid()) {
    return false;
  }

  return startDate.isSame(endDate, unit);
}

export function fIsSame(startDate, endDate, unitToCompare) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  return moment(startDate).isSame(moment(endDate), unitToCompare ?? 'year');
}

// ----------------------------------------------------------------------

/**
 * Formats a compact label for a date range based on similarity.
 * @returns Formatted range label or 'Invalid'.
 * @example
 * fDateRangeShortLabel('2024-04-26', '2024-04-26') // '26 Apr 2024'
 * fDateRangeShortLabel('2024-04-25', '2024-04-26') // '25 - 26 Apr 2024'
 * fDateRangeShortLabel('2024-04-25', '2024-05-26') // '25 Apr - 26 May 2024'
 * fDateRangeShortLabel('2023-12-25', '2024-01-01') // '25 Dec 2023 - 01 Jan 2024'
 */
export function fDateRangeShortLabel_dayjs(start, end, initial) {
  if (!start || !end) return '';

  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (!startDate.isValid() || !endDate.isValid() || startDate.isAfter(endDate)) {
    return INVALID_DATE;
  }

  if (initial) {
    return `${fDate(startDate)} - ${fDate(endDate)}`;
  }

  const isSameDay = startDate.isSame(endDate, 'day');
  const isSameMonth = startDate.isSame(endDate, 'month');
  const isSameYear = startDate.isSame(endDate, 'year');

  if (isSameDay) {
    return fDate(endDate);
  }

  if (isSameMonth) {
    return `${fDate(startDate, 'DD')} - ${fDate(endDate)}`;
  }

  if (isSameYear) {
    return `${fDate(startDate, 'DD MMM')} - ${fDate(endDate)}`;
  }

  return `${fDate(startDate)} - ${fDate(endDate)}`;
}

export function fDateRangeShortLabel(startDate, endDate, initial) {
  if (!isValidDate(startDate) || !isValidDate(endDate) || fIsAfter(startDate, endDate)) {
    return 'Invalid date';
  }

  let label = `${fDate(startDate)} - ${fDate(endDate)}`;

  if (initial) {
    return label;
  }

  const isSameYear = fIsSame(startDate, endDate, 'year');
  const isSameMonth = fIsSame(startDate, endDate, 'month');
  const isSameDay = fIsSame(startDate, endDate, 'day');

  if (isSameYear && !isSameMonth) {
    label = `${fDate(startDate, 'jDD jMMM')} - ${fDate(endDate)}`;
  } else if (isSameYear && isSameMonth && !isSameDay) {
    label = `${fDate(startDate, 'jDD')} - ${fDate(endDate)}`;
  } else if (isSameYear && isSameMonth && isSameDay) {
    label = `${fDate(endDate)}`;
  }

  return label;
}

// ----------------------------------------------------------------------

export function convertIsoDateToShamsiDate(isoDate) {
  if (!isoDate) return '';

  const m = moment(isoDate);
  if (!m.isValid()) return 'Invalid date';

  return m.format('jYYYY/jMM/jDD');
}

/**
 * Adds duration to the current time.
 * @returns ISO formatted string with the result.
 * @example
 * fAdd({ days: 3 }) // '2025-08-08T12:34:56+00:00'
 */

export function fAdd_dayjs({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const result = dayjs()
    .add(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

export function fAdd({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  return moment()
    .add({
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
    })
    .format();
}

// ----------------------------------------------------------------------

/**
 * Subtracts duration from the current time.
 * @returns ISO formatted string with the result.
 * @example
 * fSub({ months: 1 }) // '2025-07-05T12:34:56+00:00'
 */
export function fSub_dayjs({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const result = dayjs()
    .subtract(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

export function fSub({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  return moment()
    .subtract({
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
    })
    .format();
}

const isValidDate = (date) => date !== null && date !== undefined && dayjs(date).isValid();

export function formatUTCDate(value) {
  if (!value) return '';

  const m = moment(value);

  if (!m.isValid()) return '';

  return m.format('YYYY-MM-DD[T]HH:mm:ss[Z]');
}

export function fFulldateTime(date, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }
  return moment(date).format(template ?? formatPatterns.split.date);
}
