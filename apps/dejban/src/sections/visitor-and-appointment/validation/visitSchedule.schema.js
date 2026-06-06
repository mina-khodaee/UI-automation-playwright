import { z } from 'zod';

export const companionSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  gender: z.enum(['Male', 'Female']).nullable().optional(),
  nationalCode: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
});

export const createVisitScheduleSchema = (t, visitorTypes) =>
  z.object({
    /** TAB 1 – Guest */
    scheduleType: z.string().min(1, t.guest('نوع هماهنگی الزامی است')),
    entryDateTime: z.string().nullable().optional(),
    exitDateTime: z.string().nullable().optional(),
    firstName: z.string().min(1, t.guest('formValidationErrors.firstName')).nullable().optional(),
    lastName: z.string().min(1, t.guest('formValidationErrors.lastName')).nullable().optional(),
    gender: z.string().min(1, t.guest('formValidationErrors.gender')),
    // nationalCode: z.string().length(10).regex(/^\d+$/).nullable().optional(),
    nationalCode: z.string().optional(),

    mobileNumber: z
      .string()
      .min(1, t.guest('formValidationErrors.mobileNumber'))
      .regex(/^09[0-9]{9}$/, t?.guest?.mobileInvalid || 'شماره موبایل نامعتبر است')
      .nullable()
      .optional(),
    visitorTypeId: z.string().min(1, t.guest('formValidationErrors.visitorType')),

    dateOfBirth: z.string().min(1, t?.guest?.dateOfBirth || 'تاریخ تولد الزامی است'),
    passportNumber: z.string().optional(),
    inclusiveNumber: z.string().optional(),

    visitorCardId: z.string().nullable().optional(),
    cardType: z.string().min(1, t.appointment('formValidationErrors.cardType')),

    visitorItemIds: z.array(z.string()).nullable().optional(),
    hostId: z.string().min(1, t.appointment('formValidationErrors.hostId')),
    visitReasonId: z.string().min(1, t.appointment('formValidationErrors.visitReasonId')),

    visitDate: z.string().min(1, t?.appointment?.visitDateRequired || 'تاریخ ملاقات الزامی است'),
    visitEndDate: z.string().min(1, t.appointment('formValidationErrors.visitEndDate')),
    note: z.string().nullable().optional(),
    companions: z.array(companionSchema).nullable().optional(),

    entryDoor: z.string().min(1, 'درب ورود الزامی است'),
    entryDeviceIds: z
      .union([
        z.array(z.string().min(1, 'دستگاه ورود الزامی است')),
        z.string().min(1, 'دستگاه ورود الزامی است'),
      ])
      .transform((val) => (Array.isArray(val) ? val : val ? [val] : [])),

    exitDoor: z.string().min(1, 'درب خروج الزامی است'),
    exitDeviceIds: z
      .union([
        z.array(z.string().min(1, 'دستگاه خروج الزامی است')),
        z.string().min(1, 'دستگاه خروج الزامی است'),
      ])
      .transform((val) => (Array.isArray(val) ? val : val ? [val] : [])),
  });
// .superRefine((data, ctx) => {
//   const guestTypeName = visitorTypes?.find((v) => v.id === data.visitorTypeId)?.name?.value;
//   console.log('guestTypeName', guestTypeName);
//   console.log('SuperRefine running - guestTypeName:', guestTypeName);
//   console.log('Current data:', {
//     visitorTypeId: data.visitorTypeId,
//     nationalCode: data.nationalCode,
//     passportNumber: data.passportNumber,
//   });
//
//   // Only validate based on visitor type
//   if (guestTypeName === 'Foreigner') {
//     // For foreigners: passport number is required
//     if (!data.passportNumber || data.passportNumber.trim().length === 0) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: t?.guest?.passportRequired || 'شماره پاسپورت برای اتباع خارجی الزامی است',
//         path: ['passportNumber'],
//       });
//     }
//     // National code is optional for foreigners - NO ERROR ADDED
//   } else if (guestTypeName === 'Citizen' || guestTypeName === 'Resident') {
//     // For citizens/residents: national code is required and must be 10 digits
//     if (!data.nationalCode || data.nationalCode.trim().length === 0) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: t?.guest?.nationalCodeRequired || 'کد ملی الزامی است',
//         path: ['nationalCode'],
//       });
//     } else if (!/^\d{10}$/.test(data.nationalCode)) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: t?.guest?.nationalCodeInvalid || 'کد ملی باید ۱۰ رقم باشد',
//         path: ['nationalCode'],
//       });
//     }
//     // No passport validation for citizens
//   }
//   // If guestTypeName is undefined or other type - no validation needed
// });
// Conditional validation based on visitor type
// .superRefine((data, ctx) => {
//   // Find if the selected visitor type is Foreigner
//   let isForeigner = false;
//
//   if (visitorTypes && visitorTypes.length > 0) {
//     // Find the visitor type object that matches the selected ID
//     const selectedVisitorType = visitorTypes.find(
//       (type) => type.id === data.visitorTypeId || type.name?.value === data.visitorTypeId
//     );
//     isForeigner = selectedVisitorType?.name?.value === 'Foreigner';
//   } else {
//     // Fallback: check if the value itself is 'Foreigner'
//     isForeigner = data.visitorTypeId === 'Foreigner';
//   }
//
//   // Case 1: Foreigner visitor
//   if (isForeigner) {
//     // Passport number is required
//     if (!data.passportNumber || data.passportNumber.trim() === '') {
//       ctx.addIssue({
//         path: ['passportNumber'],
//         message: t.guest('formValidationErrors.passportNumber'),
//         code: z.ZodIssueCode.custom,
//       });
//     }
//
//     // Inclusive number is required
//     if (!data.inclusiveNumber || data.inclusiveNumber.trim() === '') {
//       ctx.addIssue({
//         path: ['inclusiveNumber'],
//         message: t.guest('formValidationErrors.inclusiveNumber'),
//         code: z.ZodIssueCode.custom,
//       });
//     }
//
//     // National code should be empty or null for foreigners
//     if (data.nationalCode && data.nationalCode.trim() !== '') {
//       ctx.addIssue({
//         path: ['nationalCode'],
//         message: 'کد ملی فقط برای اتباع ایرانی الزامی است',
//         code: z.ZodIssueCode.custom,
//       });
//     }
//
//     return;
//   }
//
//   // Case 2: Iranian visitor (any type except Foreigner)
//   if (data.visitorTypeId && data.visitorTypeId !== 'Foreigner') {
//     // National code is required for Iranian visitors
//     if (!data.nationalCode || data.nationalCode.trim() === '') {
//       ctx.addIssue({
//         path: ['nationalCode'],
//         message: t.guest('formValidationErrors.nationalCode'),
//         code: z.ZodIssueCode.custom,
//       });
//     }
//
//     // National code must be exactly 10 digits
//     if (
//       data.nationalCode &&
//       data.nationalCode.trim() !== '' &&
//       !/^\d{10}$/.test(data.nationalCode)
//     ) {
//       ctx.addIssue({
//         path: ['nationalCode'],
//         message: 'کد ملی باید ۱۰ رقم باشد',
//         code: z.ZodIssueCode.custom,
//       });
//     }
//
//     // Passport and inclusive numbers should be empty for Iranians
//     if (data.passportNumber && data.passportNumber.trim() !== '') {
//       ctx.addIssue({
//         path: ['passportNumber'],
//         message: 'شماره پاسپورت فقط برای اتباع خارجی است',
//         code: z.ZodIssueCode.custom,
//       });
//     }
//
//     if (data.inclusiveNumber && data.inclusiveNumber.trim() !== '') {
//       ctx.addIssue({
//         path: ['inclusiveNumber'],
//         message: 'شماره اینکلوزیو فقط برای اتباع خارجی است',
//         code: z.ZodIssueCode.custom,
//       });
//     }
//   }
// })
// // Validate physical card requirement
// .refine((data) => data.cardType !== 'Physical' || !!data.visitorCardId, {
//   path: ['visitorCardId'],
//   message: t.appointment('formValidationErrors.visitorCardId'),
// });
