import dayjs from 'dayjs';
import moment from 'moment-jalaali';
import jMoment from 'moment-jalaali';

// ----------------------------------------------------------------------

const locale = localStorage.getItem('i18nextLng');
jMoment.locale(locale);
const persianCalendar = 'fa-IR';
if (locale === persianCalendar) {
  jMoment.loadPersian({
    dialect: 'persian-modern',
    usePersianDigits: false
  });
}
export const formatPatterns = {
  dateTime: locale === persianCalendar ? 'jDD jMMMM jYYYY HH:mm' : 'DD MMM YYYYHH:mm',
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
const isValidDate = (date) => date !== null && date !== undefined && dayjs(date).isValid();

// ----------------------------------------------------------------------
export function today(template) {

  return jMoment().startOf('day').format(template);
}

// ----------------------------------------------------------------------

export function formatUTCDate(value) {
  if (!value) return '';

  const m = moment(value);

  if (!m.isValid()) return '';

  return m.format('YYYY-MM-DD[T]HH:mm:ss[Z]');
}


// ----------------------------------------------------------------------

export function fDateTime(date, keepUTC, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  if (keepUTC) {
    return jMoment(date).utc().format(template ?? formatPatterns.dateTime);
  }

  return jMoment(date).format(template ?? formatPatterns.dateTime);
}

// ----------------------------------------------------------------------

export function fDate(date, keepUTC, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  if (keepUTC) {
    return jMoment(date).utc().format(template ?? formatPatterns.date);
  }

  return jMoment(date).format(template ?? formatPatterns.date);
}

// ----------------------------------------------------------------------

export function fFulldateTime(date, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }
  return jMoment(date).format(template ?? formatPatterns.split.date);
}

// ----------------------------------------------------------------------

export function fTime(date, keepUTC, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  if (keepUTC) {
    return jMoment(date).utc().format(template ?? formatPatterns.time);
  }

  return jMoment(date).format(template ?? formatPatterns.time);
}

// ----------------------------------------------------------------------

export function fTimestamp(date) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return jMoment(date).valueOf();
}

// ----------------------------------------------------------------------

export function fToNow(date) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return jMoment(date).fromNow(true);
}

// ----------------------------------------------------------------------

export function fIsBetween(inputDate, startDate, endDate) {
  if (!isValidDate(inputDate) || !isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  const formattedInputDate = jMoment(inputDate);
  const formattedStartDate = jMoment(startDate);
  const formattedEndDate = jMoment(endDate);

  return formattedInputDate.isBetween(formattedStartDate, formattedEndDate, null, '[]');
}

// ----------------------------------------------------------------------

export function fIsAfter(startDate, endDate) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  return jMoment(startDate).isAfter(jMoment(endDate));
}

// ----------------------------------------------------------------------

export function fIsSame(startDate, endDate, unitToCompare) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  return jMoment(startDate).isSame(jMoment(endDate), unitToCompare ?? 'year');
}

// ----------------------------------------------------------------------

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

export function fAdd({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  return jMoment()
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

export function fSub({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  return jMoment()
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






// export function today(template) {
//   return dayjs(new Date()).startOf('day').format(template);
// }

// // ----------------------------------------------------------------------

// /**
//  * @output 17 Apr 2022 12:00 am
//  */

// // ----------------------------------------------------------------------

// export function fDateTime(date, template) {
//   if (!isValidDate(date)) {
//     return 'Invalid date';
//   }

//   return dayjs(date).format(template ?? formatPatterns.dateTime);
// }

// // ----------------------------------------------------------------------

// /**
//  * @output 17 Apr 2022
//  */

// // ----------------------------------------------------------------------

// export function fDate(date, template) {
//   if (!isValidDate(date)) {
//     return 'Invalid date';
//   }

//   return dayjs(date).format(template ?? formatPatterns.date);
// }

// // ----------------------------------------------------------------------

// /**
//  * @output 12:00 am
//  */

// // ----------------------------------------------------------------------

// export function fTime(date, template) {
//   if (!isValidDate(date)) {
//     return 'Invalid date';
//   }

//   return dayjs(date).format(template ?? formatPatterns.time);
// }

// // ----------------------------------------------------------------------

// /**
//  * @output 1713250100
//  */

// // ----------------------------------------------------------------------

// export function fTimestamp(date) {
//   if (!isValidDate(date)) {
//     return 'Invalid date';
//   }

//   return dayjs(date).valueOf();
// }

// // ----------------------------------------------------------------------

// /**
//  * @output a few seconds, 2 years
//  */

// // ----------------------------------------------------------------------

// export function fToNow(date) {
//   if (!isValidDate(date)) {
//     return 'Invalid date';
//   }

//   return dayjs(date).toNow(true);
// }

// // ----------------------------------------------------------------------

// /**
//  * @output boolean
//  */

// // ----------------------------------------------------------------------

// export function fIsBetween(inputDate, startDate, endDate) {
//   if (!isValidDate(inputDate) || !isValidDate(startDate) || !isValidDate(endDate)) {
//     return false;
//   }

//   const formattedInputDate = fTimestamp(inputDate);
//   const formattedStartDate = fTimestamp(startDate);
//   const formattedEndDate = fTimestamp(endDate);

//   if (
//     formattedInputDate === 'Invalid date' ||
//     formattedStartDate === 'Invalid date' ||
//     formattedEndDate === 'Invalid date'
//   ) {
//     return false;
//   }

//   return formattedInputDate >= formattedStartDate && formattedInputDate <= formattedEndDate;
// }

// // ----------------------------------------------------------------------

// /**
//  * @output boolean
//  */

// // ----------------------------------------------------------------------

// export function fIsAfter(startDate, endDate) {
//   if (!isValidDate(startDate) || !isValidDate(endDate)) {
//     return false;
//   }

//   return dayjs(startDate).isAfter(endDate);
// }

// // ----------------------------------------------------------------------

// /**
//  * @output boolean
//  */

// // ----------------------------------------------------------------------

// export function fIsSame(startDate, endDate, unitToCompare) {
//   if (!isValidDate(startDate) || !isValidDate(endDate)) {
//     return false;
//   }

//   return dayjs(startDate).isSame(endDate, unitToCompare ?? 'year');
// }

// /**
//  * @output
//  * Same day: 26 Apr 2024
//  * Same month: 25 - 26 Apr 2024
//  * Same month: 25 - 26 Apr 2024
//  * Same year: 25 Apr - 26 May 2024
//  */

// // ----------------------------------------------------------------------

// export function fDateRangeShortLabel(startDate, endDate, initial) {
//   if (!isValidDate(startDate) || !isValidDate(endDate) || fIsAfter(startDate, endDate)) {
//     return 'Invalid date';
//   }

//   let label = `${fDate(startDate)} - ${fDate(endDate)}`;

//   if (initial) {
//     return label;
//   }

//   const isSameYear = fIsSame(startDate, endDate, 'year');
//   const isSameMonth = fIsSame(startDate, endDate, 'month');
//   const isSameDay = fIsSame(startDate, endDate, 'day');

//   if (isSameYear && !isSameMonth) {
//     label = `${fDate(startDate, 'DD MMM')} - ${fDate(endDate)}`;
//   } else if (isSameYear && isSameMonth && !isSameDay) {
//     label = `${fDate(startDate, 'DD')} - ${fDate(endDate)}`;
//   } else if (isSameYear && isSameMonth && isSameDay) {
//     label = `${fDate(endDate)}`;
//   }

//   return label;
// }

// // ----------------------------------------------------------------------

// export function fAdd({
//   years = 0,
//   months = 0,
//   days = 0,
//   hours = 0,
//   minutes = 0,
//   seconds = 0,
//   milliseconds = 0,
// }) {
//   const result = dayjs()
//     .add(
//       dayjs.duration({
//         years,
//         months,
//         days,
//         hours,
//         minutes,
//         seconds,
//         milliseconds,
//       })
//     )
//     .format();

//   return result;
// }

// /**
//  * @output 2024-05-28T05:55:31+00:00
//  */

// // ----------------------------------------------------------------------

// export function fSub({
//   years = 0,
//   months = 0,
//   days = 0,
//   hours = 0,
//   minutes = 0,
//   seconds = 0,
//   milliseconds = 0,
// }) {
//   const result = dayjs()
//     .subtract(
//       dayjs.duration({
//         years,
//         months,
//         days,
//         hours,
//         minutes,
//         seconds,
//         milliseconds,
//       })
//     )
//     .format();

//   return result;
// }
