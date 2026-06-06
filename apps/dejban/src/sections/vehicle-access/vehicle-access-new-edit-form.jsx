// 'use client';

// import { z as zod } from 'zod';
// import { useEffect, useMemo, useState } from 'react';
// import { Controller, useForm, useFieldArray, FormProvider } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import moment from 'moment-jalaali';
// import {
//   Box,
//   Button,
//   Card,
//   Divider,
//   Grid,
//   InputAdornment,
//   Typography,
//   Alert,
//   IconButton,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TextField,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   MenuItem,
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import { Iconify } from 'src/components/iconify';
// import { useTranslate } from 'src/locales';
// import { toast } from 'src/components/snackbar';
// import { Field } from 'src/components/hook-form';
// import { useGetDoors } from 'src/services/doors/doors.service';
// import { useGetVehicles } from 'src/services/vehicle/vehicle.service';
// import {
//   useCreateVehicleAccessLog,
//   useUpdateVehicleAccessLog,
// } from 'src/services/vehicle-accessLogs/vehicle-accessLogs.service';
// import { convertEnToFa, formatPlateForDisplay } from '@repo/ui/utils';
// import { useGetActiveVehicleAssignmentsByVehicleId } from 'src/services/vehicle-assignment/vehicle-assignment.service';
// import { useGetPersonnelById } from 'src/services/personnels/personnels.servise';
// import { skipToken } from '@tanstack/react-query';

// // ----------------------------------------------------------------------
// export function VehicleAccessNewEditForm({ onRefetch, currentItem, onClose }) {
//   const { t: t_common } = useTranslate();
//   const { t: t_vehicleAccess } = useTranslate('vehicle-access');

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [originalPlate, setOriginalPlate] = useState('');
//   const [originalOwnerId, setOriginalOwnerId] = useState('');
//   const [originalOwnerName, setOriginalOwnerName] = useState('');
//   const [entryAccordionExpanded, setEntryAccordionExpanded] = useState(false);

//   const createVehicleAccessLog = useCreateVehicleAccessLog();
//   const updateVehicleAccessLog = useUpdateVehicleAccessLog();

//   const { data: vehicles, isLoading: isVehicleLoading } = useGetVehicles({ searchTerm });
//   const vehiclesData = vehicles?.items || [];

//   const { data: doors, isLoading: isDoorLoading } = useGetDoors({});
//   const DoorsData = doors?.items?.map((door) => ({
//     label: door.doorName,
//     value: door.id,
//   }));

//   const trafficModeOptions = [
//     { label: 'ورود', value: 'Entry' },
//     { label: 'خروج', value: 'Exit' },
//   ];

//   // 1. دریافت تخصیص راننده خودرو انتخاب‌شده
//   const { data: assignmentData, isLoading: assignmentLoading } =
//     useGetActiveVehicleAssignmentsByVehicleId(selectedVehicle?.id ?? skipToken);

//   // 2. تعیین driverId از تخصیص (در ایجاد) یا آیتم ویرایشی (در ویرایش)
//   const driverId = assignmentData?.[0]?.driverId || currentItem?.deriverId || null;

//   // 3. دریافت نام راننده از سرویس پرسنل تنها در صورتی که driverId وجود داشته باشد
//   const { data: personnelData, isLoading: personnelLoading } = useGetPersonnelById(
//     driverId ?? skipToken
//   );


//   // استخراج نام نهایی
//   const driverNameFromApi = personnelData ? personnelData?.firstName + ' ' + personnelData?.lastName : '';
//   const finalDriverName = currentItem ? (currentItem.deriverName || '') : driverNameFromApi;

//   console.log('driverId',personnelData)
//   // اسکیمای فرم
//   const VehicleAccessSchema = zod.object({
//     searchQuery: zod.string().optional(),
//     driverName: zod.string().optional(),
//     vehicleType: zod.string().optional(),
//     vehiclePlate: zod.string().optional(),
//     selectedVehicleId: zod.string().optional(),

//     trafficMode: zod.string().min(1, t_vehicleAccess('formValidationErrors.trafficMode')),
//     doorId: zod.string().min(1, t_vehicleAccess('formValidationErrors.doorId')),
//     date: zod.string().min(1, t_vehicleAccess('formValidationErrors.date')),

//     entryOccupants: zod.array(
//       zod.object({
//         id: zod.string().nullable().optional(),
//         fullName: zod.string().min(1, 'نام الزامی است'),
//         nationalCode: zod.string().nullable().optional(),
//       })
//     ).optional().default([]),
//   });

//   const defaultValues = useMemo(() => ({
//     searchQuery: '',
//     driverName: '',
//     vehicleType: '',
//     vehiclePlate: '',
//     selectedVehicleId: '',
//     trafficMode: '',
//     doorId: '',
//     date: '',
//     entryOccupants: [],
//   }), []);

//   const methods = useForm({
//     resolver: zodResolver(VehicleAccessSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     control,
//     setValue,
//     watch,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const {
//     fields: occupantFields,
//     append: appendOccupant,
//     remove: removeOccupant,
//   } = useFieldArray({ control, name: 'entryOccupants' });

//   // ---------- توابع کمکی ----------
//   const getPlateValue = (vehicle) =>
//     !vehicle?.plate ? '' : typeof vehicle.plate === 'object' ? (vehicle.plate.value || '') : vehicle.plate;

//   const getVehicleTypeValue = (vehicle) =>
//     !vehicle?.vehicleType ? '' : typeof vehicle.vehicleType === 'object' ? (vehicle.vehicleType.name || '') : vehicle.vehicleType;

//   const getOwnerInfo = (vehicle) => {
//     if (!vehicle) return { ownerId: '', ownerName: '' };
//     let ownerId = '', ownerName = '';
//     if (vehicle.ownerships?.length) {
//       const first = vehicle.ownerships[0];
//       ownerId = first.ownerId || '';
//       ownerName = first.ownerName || first.owner?.name || first.owner?.fullName || '';
//     }
//     if (!ownerId) ownerId = vehicle.ownerId || '';
//     if (!ownerName) ownerName = vehicle.ownerName || vehicle.owner?.name || vehicle.owner?.fullName || '';
//     if (!ownerName && ownerId) ownerName = 'مالک';
//     return { ownerId, ownerName };
//   };

//   // ---------- مقداردهی اولیه برای ویرایش ----------
//   useEffect(() => {
//     if (!currentItem) return;

//     const plateValue = currentItem.plate || '';
//     setOriginalPlate(plateValue);

//     const { ownerId, ownerName } = getOwnerInfo(currentItem);
//     setOriginalOwnerId(ownerId);
//     setOriginalOwnerName(ownerName);

//     setSelectedVehicle({
//       id: currentItem.vehicleId,
//       plate: plateValue,
//       vehicleType: currentItem.vehicleType || '',
//       driverName: currentItem.deriverName || '',
//       ownerName,
//     });

//     setValue('selectedVehicleId', currentItem.vehicleId || '');
//     setValue('driverName', currentItem.deriverName || '');
//     setValue('vehicleType', currentItem.vehicleType || '');
//     setValue('vehiclePlate', formatPlateForDisplay(plateValue));
//     setValue('searchQuery', formatPlateForDisplay(plateValue));

//     if (currentItem.trafficMode?.value) setValue('trafficMode', currentItem.trafficMode.value);
//     if (currentItem.door?.doorId) setValue('doorId', currentItem.door.doorId);
//     if (currentItem.dateTime) setValue('date', moment(currentItem.dateTime).toISOString());
//     if (currentItem.occupants?.length) {
//       setValue('entryOccupants', currentItem.occupants);
//       setEntryAccordionExpanded(true);
//     }
//   }, [currentItem, setValue]);

//   // ---------- به‌روزرسانی فیلد نام راننده ----------
//   useEffect(() => {
//     setValue('driverName', finalDriverName);
//   }, [finalDriverName, setValue]);

//   // ---------- ارسال فرم ----------
//   const formatDateToDateTime = (date) => moment(date).startOf('day').toISOString();

//   const onSubmit = async (data) => {
//     try {
//       if (!selectedVehicle && !currentItem) {
//         toast.error(t_vehicleAccess('formValidationErrors.searchQuery'));
//         return;
//       }

//       const plateToSend = originalPlate || '';
//       const ownerIdToSend = originalOwnerId || null;

//       const entryOccupantsData = (data.entryOccupants || []).map((o) => ({
//         id: o.id || null,
//         fullName: o.fullName || '',
//         nationalCode: o.nationalCode || null,
//       }));

//       const combinedDateTime = formatDateToDateTime(data.date);

//       const baseData = {
//         vehicleId: selectedVehicle?.id || null,
//         vehicleType: data.vehicleType || '',
//         plate: plateToSend,
//         driverId: driverId,
//         driverName: finalDriverName,
//         ownerId: ownerIdToSend,
//         ownerName: selectedVehicle?.ownerName || originalOwnerName || '',
//       };

//       let apiData;
//       if (!currentItem) {
//         apiData = {
//           ...baseData,
//           dateTime: combinedDateTime,
//           doorId: data.doorId,
//           trafficMode: data.trafficMode,
//           occupants: entryOccupantsData,
//         };
//       } else {
//         apiData = {
//           ...baseData,
//           entry: data.trafficMode === 'Entry' ? {
//             id: currentItem.entry?.id || null,
//             dateTime: combinedDateTime,
//             doorId: data.doorId,
//             occupants: entryOccupantsData,
//           } : null,
//           exit: data.trafficMode === 'Exit' ? {
//             id: currentItem.exit?.id || null,
//             dateTime: combinedDateTime,
//             doorId: data.doorId,
//             occupants: [],
//           } : null,
//         };
//       }

//       console.log('🚀 Final payload:', JSON.stringify(apiData, null, 2));

//       if (currentItem) {
//         await updateVehicleAccessLog.mutateAsync({ id: currentItem.id, ...apiData });
//         toast.success(t_vehicleAccess('toastMessages.update'));
//       } else {
//         await createVehicleAccessLog.mutateAsync(apiData);
//         toast.success(t_vehicleAccess('toastMessages.create'));
//       }

//       onRefetch?.();
//       resetForm();
//     } catch (error) {
//       console.error('Submit error:', error);
//       toast.error(error.message || t_common('errors.unknownError'));
//     }
//   };

//   const resetForm = () => {
//     reset(defaultValues);
//     setSelectedVehicle(null);
//     setSearchTerm('');
//     setOriginalPlate('');
//     setOriginalOwnerId('');
//     setOriginalOwnerName('');
//     setEntryAccordionExpanded(false);
//     if (onClose) onClose();
//   };

//   const trafficMode = watch('trafficMode');
//   const doorId = watch('doorId');
//   const date = watch('date');
//   const isFormValid = trafficMode && doorId && date;
//   const isVehicleSelected = !!selectedVehicle || !!currentItem;

//   // ---------- JSX ----------
//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={handleSubmit(onSubmit)} noValidate>
//         <Card sx={{ mb: 3, p: 2 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
//               {currentItem
//                 ? t_vehicleAccess('title.updateVehicleAccess')
//                 : t_vehicleAccess('title.insertVehicleAccess')}
//             </Typography>
//             <Button variant="outlined" size="small" onClick={resetForm}>
//               {t_vehicleAccess('buttons.accessList')}
//             </Button>
//           </Box>
//           <Divider sx={{ mb: 3 }} />

//           {!isFormValid && (
//             <Alert severity="warning" sx={{ mb: 2 }}>
//               لطفاً حالت تردد، درب و تاریخ را وارد کنید.
//             </Alert>
//           )}

//           <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
//             {t_vehicleAccess('title.insertVehicleAccess')}
//           </Typography>

//           <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, minHeight: 64, mb: 3 }}>
//             <Field.Autocomplete
//               name="searchQuery"
//               freeSolo
//               options={vehiclesData}
//               isLoading={isVehicleLoading}
//               placeholder={t_vehicleAccess('formsInputs.searchQuery')}
//               onInputChange={(_, value) => !currentItem && setSearchTerm(value)}
//               disabled={!!currentItem}
//               getOptionLabel={(option) => {
//                 if (typeof option === 'string') return option;
//                 const plate = getPlateValue(option);
//                 const formattedPlate = convertEnToFa(plate);
//                 const model = option.model || '';
//                 return `${formattedPlate} - ${model}`;
//               }}
//               onChange={(_, value) => {
//                 if (value && typeof value !== 'string') {
//                   const plateValue = getPlateValue(value);
//                   const vehicleTypeValue = getVehicleTypeValue(value);
//                   const { ownerId, ownerName } = getOwnerInfo(value);

//                   setOriginalPlate(plateValue);
//                   setOriginalOwnerId(ownerId);
//                   setOriginalOwnerName(ownerName);

//                   setSelectedVehicle({
//                     id: value.id,
//                     plate: plateValue,
//                     vehicleType: vehicleTypeValue,
//                     driverName: '', // بعداً از پرسنل پر می‌شود
//                     ownerName,
//                   });

//                   setValue('selectedVehicleId', String(value.id));
//                   setValue('vehicleType', vehicleTypeValue);
//                   setValue('vehiclePlate', formatPlateForDisplay(plateValue));
//                 } else if (value === null) {
//                   setSelectedVehicle(null);
//                   setOriginalPlate('');
//                   setOriginalOwnerId('');
//                   setOriginalOwnerName('');
//                   setValue('selectedVehicleId', '');
//                   setValue('driverName', '');
//                   setValue('vehicleType', '');
//                   setValue('vehiclePlate', '');
//                 }
//               }}
//               size="small"
//               // استفاده از InputProps مستقیم (سازگار با نسخه شما)
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
//                   </InputAdornment>
//                 ),
//                 onKeyDown: (e) => {
//                   if (e.key === 'Enter') e.preventDefault();
//                 },
//               }}
//             />

//             <Field.Text
//               name="driverName"
//               label={t_vehicleAccess('formsInputs.driverName')}
//               size="small"
//               disabled
//             />
//             <Field.Text name="vehicleType" label={t_vehicleAccess('formsInputs.vehicleType')} size="small" disabled />
//             <Field.Text name="vehiclePlate" label={t_vehicleAccess('formsInputs.vehiclePlate')} size="small" disabled />
//           </Box>

//           <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
//             <Controller
//               name="trafficMode"
//               control={control}
//               render={({ field, fieldState }) => (
//                 <TextField
//                   {...field}
//                   select
//                   label={t_vehicleAccess('formsInputs.trafficMode')}
//                   size="small"
//                   error={!!fieldState.error}
//                   helperText={fieldState.error?.message}
//                 >
//                   {trafficModeOptions.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               )}
//             />

//             <Field.Select
//               name="doorId"
//               label={t_vehicleAccess('formsInputs.doorId')}
//               data={DoorsData}
//               isLoading={isDoorLoading}
//               displayExp="label"
//               valueExp="value"
//               size="small"
//             />

//             <Controller
//               name="date"
//               control={control}
//               render={({ field, fieldState }) => (
//                 <DatePicker
//                   label={t_vehicleAccess('formsInputs.date')}
//                   value={field.value ? moment(field.value) : null}
//                   onChange={(v) => field.onChange(v ? v.toISOString() : '')}
//                   slotProps={{
//                     textField: {
//                       size: 'small',
//                       fullWidth: true,
//                       error: !!fieldState.error,
//                       helperText: fieldState.error?.message,
//                     },
//                   }}
//                 />
//               )}
//             />
//           </Box>

//           <Accordion
//             disableGutters
//             disabled={!!currentItem}
//             expanded={entryAccordionExpanded}
//             onChange={(event, isExpanded) => setEntryAccordionExpanded(isExpanded)}
//             sx={{ px: 2, mb: 1 }}
//           >
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                 {t_vehicleAccess('formsInputs.passengers')}{' '}
//                 {occupantFields.length > 0 && `(${occupantFields.length})`}
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails sx={{ p: 0 }}>
//               <Box sx={{ py: 1, display: 'flex', justifyContent: 'flex-end' }}>
//                 <Button
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   onClick={() => appendOccupant({ id: null, fullName: '', nationalCode: '' })}
//                 >
//                   {t_vehicleAccess('buttons.addCompanion')}
//                 </Button>
//               </Box>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>{t_vehicleAccess('formsInputs.firstName')}</TableCell>
//                     <TableCell>{t_vehicleAccess('formsInputs.nationalCode')}</TableCell>
//                     <TableCell align="right">{t_vehicleAccess('buttons.cancel')}</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {occupantFields.map((item, index) => (
//                     <TableRow key={item.id || index}>
//                       <TableCell>
//                         <Controller
//                           name={`entryOccupants.${index}.fullName`}
//                           control={control}
//                           render={({ field }) => (
//                             <TextField
//                               {...field}
//                               size="small"
//                               fullWidth
//                               variant="standard"
//                               placeholder={t_vehicleAccess('formsInputs.firstName')}
//                             />
//                           )}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Controller
//                           name={`entryOccupants.${index}.nationalCode`}
//                           control={control}
//                           render={({ field }) => (
//                             <TextField
//                               {...field}
//                               size="small"
//                               fullWidth
//                               variant="standard"
//                               placeholder={t_vehicleAccess('formsInputs.nationalCode')}
//                             />
//                           )}
//                         />
//                       </TableCell>
//                       <TableCell align="right">
//                         <IconButton color="error" onClick={() => removeOccupant(index)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </AccordionDetails>
//           </Accordion>

//           <Divider sx={{ my: 2 }} />

//           <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               size="medium"
//               disabled={isSubmitting || !isVehicleSelected || !isFormValid}
//             >
//               {isSubmitting
//                 ? t_common('progress.submitting')
//                 : currentItem
//                   ? t_vehicleAccess('buttons.update')
//                   : t_vehicleAccess('buttons.submitAccess')}
//             </Button>
//             <Button variant="outlined" color="error" size="medium" onClick={resetForm}>
//               {t_vehicleAccess('buttons.cancel')}
//             </Button>
//           </Box>
//         </Card>
//       </form>
//     </FormProvider>
//   );
// }

// 'use client';

// import { z as zod } from 'zod';
// import { useEffect, useMemo, useState } from 'react';
// import { Controller, useForm, useFieldArray, FormProvider } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import moment from 'moment-jalaali';
// import {
//   Box,
//   Button,
//   Card,
//   Divider,
//   Grid,
//   InputAdornment,
//   Typography,
//   Alert,
//   IconButton,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TextField,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   MenuItem,
//   CircularProgress,
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import { Iconify } from 'src/components/iconify';
// import { useTranslate } from 'src/locales';
// import { toast } from 'src/components/snackbar';
// import { Field } from 'src/components/hook-form';
// import { useGetDoors } from 'src/services/doors/doors.service';
// import { useGetVehicles } from 'src/services/vehicle/vehicle.service';
// import {
//   useCreateVehicleAccessLog,
//   useUpdateVehicleAccessLog,
// } from 'src/services/vehicle-accessLogs/vehicle-accessLogs.service';
// import { convertEnToFa, formatPlateForDisplay } from '@repo/ui/utils';
// import { useGetActiveVehicleAssignmentsByVehicleId } from 'src/services/vehicle-assignment/vehicle-assignment.service';
// import { useQuery, skipToken } from '@tanstack/react-query';
// import { getPersonnelById } from 'src/services/personnels/personnels.http';

// // ----------------------------------------------------------------------
// export function VehicleAccessNewEditForm({ onRefetch, currentItem, onClose }) {
//   const { t: t_common } = useTranslate();
//   const { t: t_vehicleAccess } = useTranslate('vehicle-access');

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [originalPlate, setOriginalPlate] = useState('');
//   const [originalOwnerId, setOriginalOwnerId] = useState('');
//   const [originalOwnerName, setOriginalOwnerName] = useState('');
//   const [entryAccordionExpanded, setEntryAccordionExpanded] = useState(false);
//   const [exitAccordionExpanded, setExitAccordionExpanded] = useState(false);

//   const createVehicleAccessLog = useCreateVehicleAccessLog();
//   const updateVehicleAccessLog = useUpdateVehicleAccessLog();

//   const { data: vehicles, isLoading: isVehicleLoading } = useGetVehicles({ searchTerm });
//   const vehiclesData = vehicles?.items || [];

//   const { data: doors, isLoading: isDoorLoading } = useGetDoors({});
//   const DoorsData = doors?.items?.map((door) => ({
//     label: door.doorName,
//     value: door.id,
//   }));


//   const { data: assignmentData, isLoading: assignmentLoading } =
//     useGetActiveVehicleAssignmentsByVehicleId(selectedVehicle?.id ?? skipToken);

//   const driverId = assignmentData?.[0]?.driverId || currentItem?.deriverId || null;


//   const { data: personnelData, isLoading: personnelLoading } = useQuery({
//     queryKey: ['personnel', driverId],
//     queryFn: () => getPersonnelById(driverId),
//     enabled: !!driverId,
//   });

//   const driverNameFromApi = personnelData
//     ? `${personnelData.firstName || ''} ${personnelData.lastName || ''}`.trim()
//     : '';
//   const finalDriverName = currentItem ? currentItem.deriverName || '' : driverNameFromApi;


//   const VehicleAccessSchema = zod.object({
//     searchQuery: zod.string().optional(),
//     driverName: zod.string().optional(),
//     vehicleType: zod.string().optional(),
//     vehiclePlate: zod.string().optional(),
//     selectedVehicleId: zod.string().optional(),

//     entryDate: zod.string().optional(),
//     entryTime: zod.string().optional(),
//     entryDoorId: zod.string().optional(),
//     entryOccupants: zod.array(
//       zod.object({
//         id: zod.string().nullable().optional(),
//         fullName: zod.string().optional(),
//         nationalCode: zod.string().nullable().optional(),
//       })
//     ).optional().default([]),

//     exitDate: zod.string().optional(),
//     exitTime: zod.string().optional(),
//     exitDoorId: zod.string().optional(),
//     exitOccupants: zod.array(
//       zod.object({
//         id: zod.string().nullable().optional(),
//         fullName: zod.string().optional(),
//         nationalCode: zod.string().nullable().optional(),
//       })
//     ).optional().default([]),
//   });

//   const defaultValues = useMemo(
//     () => ({
//       searchQuery: '',
//       driverName: '',
//       vehicleType: '',
//       vehiclePlate: '',
//       selectedVehicleId: '',
//       entryDate: '',
//       entryTime: '',
//       entryDoorId: '',
//       entryOccupants: [],
//       exitDate: '',
//       exitTime: '',
//       exitDoorId: '',
//       exitOccupants: [],
//     }),
//     []
//   );

//   const methods = useForm({
//     resolver: zodResolver(VehicleAccessSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     control,
//     setValue,
//     watch,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const {
//     fields: entryOccupantFields,
//     append: appendEntryOccupant,
//     remove: removeEntryOccupant,
//   } = useFieldArray({ control, name: 'entryOccupants' });

//   const {
//     fields: exitOccupantFields,
//     append: appendExitOccupant,
//     remove: removeExitOccupant,
//   } = useFieldArray({ control, name: 'exitOccupants' });

//   const getPlateValue = (vehicle) =>
//     !vehicle?.plate ? '' : typeof vehicle.plate === 'object' ? vehicle.plate.value || '' : vehicle.plate;

//   const getVehicleTypeValue = (vehicle) =>
//     !vehicle?.vehicleType
//       ? ''
//       : typeof vehicle.vehicleType === 'object'
//         ? vehicle.vehicleType.name || ''
//         : vehicle.vehicleType;

//   const getOwnerInfo = (vehicle) => {
//     if (!vehicle) return { ownerId: '', ownerName: '' };
//     let ownerId = '',
//       ownerName = '';
//     if (vehicle.ownerships?.length) {
//       const first = vehicle.ownerships[0];
//       ownerId = first.ownerId || '';
//       ownerName = first.ownerName || first.owner?.name || first.owner?.fullName || '';
//     }
//     if (!ownerId) ownerId = vehicle.ownerId || '';
//     if (!ownerName) ownerName = vehicle.ownerName || vehicle.owner?.name || vehicle.owner?.fullName || '';
//     if (!ownerName && ownerId) ownerName = 'مالک';
//     return { ownerId, ownerName };
//   };


//   useEffect(() => {
//     if (!currentItem) return;

//     const plateValue = currentItem.plate || '';
//     setOriginalPlate(plateValue);

//     const { ownerId, ownerName } = getOwnerInfo(currentItem);
//     setOriginalOwnerId(ownerId);
//     setOriginalOwnerName(ownerName);

//     setSelectedVehicle({
//       id: currentItem.vehicleId,
//       plate: plateValue,
//       vehicleType: currentItem.vehicleType || '',
//       driverName: currentItem.deriverName || '',
//       ownerName,
//     });

//     setValue('selectedVehicleId', currentItem.vehicleId || '');
//     setValue('driverName', currentItem.deriverName || '');
//     setValue('vehicleType', currentItem.vehicleType || '');
//     setValue('vehiclePlate', formatPlateForDisplay(plateValue));
//     setValue('searchQuery', formatPlateForDisplay(plateValue));

//     // entry/exit از paired data
//     if (currentItem.entry) {
//       setValue('entryDate', currentItem.entry.dateTime || '');
//       setValue('entryTime', currentItem.entry.dateTime || '');
//       setValue('entryDoorId', currentItem.entry.doorId || '');
//       setValue('entryOccupants', currentItem.entry.occupants || []);
//       setEntryAccordionExpanded(true);
//     }
//     if (currentItem.exit) {
//       setValue('exitDate', currentItem.exit.dateTime || '');
//       setValue('exitTime', currentItem.exit.dateTime || '');
//       setValue('exitDoorId', currentItem.exit.doorId || '');
//       setValue('exitOccupants', currentItem.exit.occupants || []);
//       setExitAccordionExpanded(true);
//     }
//   }, [currentItem, setValue]);


//   useEffect(() => {
//     setValue('driverName', finalDriverName);
//   }, [finalDriverName, setValue]);

//   const combineDateTime = (date, time) => {
//     if (!date || !time) return '';
//     const dateObj = moment(date);
//     const timeObj = moment(time);
//     dateObj.hour(timeObj.hour());
//     dateObj.minute(timeObj.minute());
//     dateObj.second(0);
//     return dateObj.toISOString();
//   };

//   const onSubmit = async (data) => {
//     try {
//       if (!selectedVehicle && !currentItem) {
//         toast.error(t_vehicleAccess('formValidationErrors.searchQuery'));
//         return;
//       }

//       const entryDateTime = combineDateTime(data.entryDate, data.entryTime);
//       const exitDateTime = combineDateTime(data.exitDate, data.exitTime);

//       const plateToSend = originalPlate || '';
//       const ownerIdToSend = originalOwnerId || null;

//       const entryOccupantsData = (data.entryOccupants || []).map((o) => ({
//         id: o.id || null,
//         fullName: o.fullName || '',
//         nationalCode: o.nationalCode || null,
//       }));
//       const exitOccupantsData = (data.exitOccupants || []).map((o) => ({
//         id: o.id || null,
//         fullName: o.fullName || '',
//         nationalCode: o.nationalCode || null,
//       }));

//       const payload = {
//         entry: {
//           dateTime: entryDateTime,
//           doorId: data.entryDoorId || '',
//           occupants: entryOccupantsData,
//         },
//         exit: {
//           dateTime: exitDateTime,
//           doorId: data.exitDoorId || '',
//           occupants: exitOccupantsData,
//         },
//         vehicleId: selectedVehicle?.id || null,
//         vehicleType: data.vehicleType || '',
//         plate: plateToSend,
//         driverId: driverId,
//         driverName: finalDriverName,
//         ownerId: ownerIdToSend,
//         ownerName: selectedVehicle?.ownerName || originalOwnerName || '',
//         tagId: null,
//       };

//       console.log('🚀 Final payload:', JSON.stringify(payload, null, 2));

//       if (currentItem) {
//         await updateVehicleAccessLog.mutateAsync({ id: currentItem.id, ...payload });
//         toast.success(t_vehicleAccess('toastMessages.update'));
//       } else {
//         await createVehicleAccessLog.mutateAsync(payload);
//         toast.success(t_vehicleAccess('toastMessages.create'));
//       }

//       onRefetch?.();
//       resetForm();
//     } catch (error) {
//       console.error('Submit error:', error);
//       toast.error(error.message || t_common('errors.unknownError'));
//     }
//   };

//   const resetForm = () => {
//     reset(defaultValues);
//     setSelectedVehicle(null);
//     setSearchTerm('');
//     setOriginalPlate('');
//     setOriginalOwnerId('');
//     setOriginalOwnerName('');
//     setEntryAccordionExpanded(false);
//     setExitAccordionExpanded(false);
//     if (onClose) onClose();
//   };

//   const isVehicleSelected = !!selectedVehicle || !!currentItem;

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={handleSubmit(onSubmit)} noValidate>
//         <Card sx={{ mb: 3, p: 2 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
//               {currentItem
//                 ? t_vehicleAccess('title.updateVehicleAccess')
//                 : t_vehicleAccess('title.insertVehicleAccess')}
//             </Typography>
//           </Box>
//           <Divider sx={{ mb: 3 }} />

//           {/* Vehicle search fields */}
//           <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, minHeight: 64, mb: 3 }}>
//             <Field.Autocomplete
//               name="searchQuery"
//               freeSolo
//               options={vehiclesData}
//               isLoading={isVehicleLoading}
//               placeholder={t_vehicleAccess('formsInputs.searchQuery')}
//               onInputChange={(_, value) => !currentItem && setSearchTerm(value)}
//               disabled={!!currentItem}
//               getOptionLabel={(option) => {
//                 if (typeof option === 'string') return option;
//                 const plate = getPlateValue(option);
//                 const formattedPlate = convertEnToFa(plate);
//                 const model = option.model || '';
//                 return `${formattedPlate} - ${model}`;
//               }}
//               onChange={(_, value) => {
//                 if (value && typeof value !== 'string') {
//                   const plateValue = getPlateValue(value);
//                   const vehicleTypeValue = getVehicleTypeValue(value);
//                   const { ownerId, ownerName } = getOwnerInfo(value);

//                   setOriginalPlate(plateValue);
//                   setOriginalOwnerId(ownerId);
//                   setOriginalOwnerName(ownerName);

//                   setSelectedVehicle({
//                     id: value.id,
//                     plate: plateValue,
//                     vehicleType: vehicleTypeValue,
//                     driverName: '',
//                     ownerName,
//                   });

//                   setValue('selectedVehicleId', String(value.id));
//                   setValue('vehicleType', vehicleTypeValue);
//                   setValue('vehiclePlate', formatPlateForDisplay(plateValue));
//                 } else if (value === null) {
//                   setSelectedVehicle(null);
//                   setOriginalPlate('');
//                   setOriginalOwnerId('');
//                   setOriginalOwnerName('');
//                   setValue('selectedVehicleId', '');
//                   setValue('driverName', '');
//                   setValue('vehicleType', '');
//                   setValue('vehiclePlate', '');
//                 }
//               }}
//               size="small"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
//                   </InputAdornment>
//                 ),
//                 onKeyDown: (e) => {
//                   if (e.key === 'Enter') e.preventDefault();
//                 },
//               }}
//             />

//             <Field.Text
//               name="driverName"
//               label={t_vehicleAccess('formsInputs.driverName')}
//               size="small"
//               disabled
//               InputProps={{
//                 endAdornment: personnelLoading && (
//                   <InputAdornment position="end">
//                     <CircularProgress size={16} />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <Field.Text name="vehicleType" label={t_vehicleAccess('formsInputs.vehicleType')} size="small" disabled />
//             <Field.Text name="vehiclePlate" label={t_vehicleAccess('formsInputs.vehiclePlate')} size="small" disabled />
//           </Box>

//           {/* Entry Section */}
//           <Accordion expanded={entryAccordionExpanded} onChange={(_, expanded) => setEntryAccordionExpanded(expanded)} sx={{ mb: 1, bgcolor: 'primary.lighter', borderRadius: 1 }}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mx: 1 }}>
//                 {t_vehicleAccess('formsInputs.entry')}
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
//                 <Controller
//                   name="entryDate"
//                   control={control}
//                   render={({ field, fieldState }) => (
//                     <DatePicker
//                       label={t_vehicleAccess('formsInputs.visitDate')}
//                       value={field.value ? moment(field.value) : null}
//                       onChange={(v) => field.onChange(v ? v.toISOString() : '')}
//                       slotProps={{ textField: { size: 'small', error: !!fieldState.error, helperText: fieldState.error?.message } }}
//                     />
//                   )}
//                 />
//                 <Controller
//                   name="entryTime"
//                   control={control}
//                   render={({ field, fieldState }) => (
//                     <TimePicker
//                       label={t_vehicleAccess('formsInputs.visitStartTime')}
//                       value={field.value ? moment(field.value) : null}
//                       onChange={(v) => field.onChange(v ? v.toISOString() : '')}
//                       slotProps={{ textField: { size: 'small', error: !!fieldState.error, helperText: fieldState.error?.message } }}
//                     />
//                   )}
//                 />
//                 <Field.Select
//                   name="entryDoorId"
//                   label={t_vehicleAccess('formsInputs.accessGroupId')}
//                   data={DoorsData}
//                   isLoading={isDoorLoading}
//                   displayExp="label"
//                   valueExp="value"
//                   size="small"
//                 />
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
//                 <Button
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   onClick={() => appendEntryOccupant({ id: null, fullName: '', nationalCode: '' })}
//                 >
//                   {t_vehicleAccess('buttons.addCompanion')}
//                 </Button>
//               </Box>
//               {entryOccupantFields.length > 0 && (
//                 <Table size="small" sx={{ borderRadius: 1, overflow: 'hidden', mt: 2 }}>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>{t_vehicleAccess('formsInputs.firstName')}</TableCell>
//                       <TableCell>{t_vehicleAccess('formsInputs.nationalCode')}</TableCell>
//                       <TableCell align="right">{t_vehicleAccess('buttons.cancel')}</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {entryOccupantFields.map((item, index) => (
//                       <TableRow key={item.id || index}>
//                         <TableCell>
//                           <Controller
//                             name={`entryOccupants.${index}.fullName`}
//                             control={control}
//                             render={({ field }) => <TextField {...field} size="small" fullWidth variant="standard" />}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Controller
//                             name={`entryOccupants.${index}.nationalCode`}
//                             control={control}
//                             render={({ field }) => <TextField {...field} size="small" fullWidth variant="standard" />}
//                           />
//                         </TableCell>
//                         <TableCell align="right">
//                           <IconButton color="error" onClick={() => removeEntryOccupant(index)}>
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </AccordionDetails>
//           </Accordion>

//           {/* Exit Section */}
//           <Accordion expanded={exitAccordionExpanded} onChange={(_, expanded) => setExitAccordionExpanded(expanded)} sx={{ mb: 1, bgcolor: 'primary.lighter', borderRadius: 1 }}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mx: 1 }}>
//                 {t_vehicleAccess('formsInputs.exit')}
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
//                 <Controller
//                   name="exitDate"
//                   control={control}
//                   render={({ field, fieldState }) => (
//                     <DatePicker
//                       label={t_vehicleAccess('formsInputs.visitEndDate')}
//                       value={field.value ? moment(field.value) : null}
//                       onChange={(v) => field.onChange(v ? v.toISOString() : '')}
//                       slotProps={{ textField: { size: 'small', error: !!fieldState.error, helperText: fieldState.error?.message } }}
//                     />
//                   )}
//                 />
//                 <Controller
//                   name="exitTime"
//                   control={control}
//                   render={({ field, fieldState }) => (
//                     <TimePicker
//                       label={t_vehicleAccess('formsInputs.visitEndTime')}
//                       value={field.value ? moment(field.value) : null}
//                       onChange={(v) => field.onChange(v ? v.toISOString() : '')}
//                       slotProps={{ textField: { size: 'small', error: !!fieldState.error, helperText: fieldState.error?.message } }}
//                     />
//                   )}
//                 />
//                 <Field.Select
//                   name="exitDoorId"
//                   label={t_vehicleAccess('formsInputs.exitDoor')}
//                   data={DoorsData}
//                   isLoading={isDoorLoading}
//                   displayExp="label"
//                   valueExp="value"
//                   size="small"
//                 />
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
//                 <Button
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   onClick={() => appendExitOccupant({ id: null, fullName: '', nationalCode: '' })}
//                 >
//                   {t_vehicleAccess('buttons.addCompanion')}
//                 </Button>
//               </Box>
//               {exitOccupantFields.length > 0 && (
//                 <Table size="small" sx={{ borderRadius: 1, overflow: 'hidden', mt: 2 }}>
//                   <TableHead >
//                     <TableRow>
//                       <TableCell>{t_vehicleAccess('formsInputs.firstName')}</TableCell>
//                       <TableCell>{t_vehicleAccess('formsInputs.nationalCode')}</TableCell>
//                       <TableCell align="right">{t_vehicleAccess('buttons.cancel')}</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {exitOccupantFields.map((item, index) => (
//                       <TableRow key={item.id || index}>
//                         <TableCell>
//                           <Controller
//                             name={`exitOccupants.${index}.fullName`}
//                             control={control}
//                             render={({ field }) => <TextField {...field} size="small" fullWidth variant="standard" />}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Controller
//                             name={`exitOccupants.${index}.nationalCode`}
//                             control={control}
//                             render={({ field }) => <TextField {...field} size="small" fullWidth variant="standard" />}
//                           />
//                         </TableCell>
//                         <TableCell align="right">
//                           <IconButton color="error" onClick={() => removeExitOccupant(index)}>
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </AccordionDetails>
//           </Accordion>

//           <Divider sx={{ my: 2 }} />

//           <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               size="medium"
//               disabled={isSubmitting || !isVehicleSelected}
//             >
//               {isSubmitting
//                 ? t_common('progress.submitting')
//                 : currentItem
//                   ? t_vehicleAccess('buttons.update')
//                   : t_vehicleAccess('buttons.submitAccess')}
//             </Button>
//             <Button variant="outlined" color="error" size="medium" onClick={resetForm}>
//               {t_vehicleAccess('buttons.cancel')}
//             </Button>
//           </Box>
//         </Card>
//       </form>
//     </FormProvider>
//   );
// }

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Divider } from '@mui/material';
import { toast } from 'src/components/snackbar';
import { useGetDoors } from 'src/services/doors/doors.service';
import { useCreateVehicleAccessLog, useUpdateVehicleAccessLog } from 'src/services/vehicle-accessLogs/vehicle-accessLogs.service';
import { formatPlateForDisplay } from '@repo/ui/utils';
import { useVehicleSearch } from './component/use-vehicle-search';
import { VehicleSearchFields } from './component/vehicle-search-fields';
import { OccupantSection } from './component/occupant-section';
import { buildPayload } from './component/build-payload';
import { VehicleAccessSchema } from './component/vehicle-access.schema';
import { FormHeader } from './component/form-header';
import { FormActions } from './component/form-actions';
import { getOwnerInfo } from './component/vehicle-access.utils';

// ----------------------------------------------------------------------
export function VehicleAccessNewEditForm({ onRefetch, currentItem, onClose }) {
  const [entryAccordionExpanded, setEntryAccordionExpanded] = useState(false);
  const [exitAccordionExpanded, setExitAccordionExpanded] = useState(false);

  const createVehicleAccessLog = useCreateVehicleAccessLog();
  const updateVehicleAccessLog = useUpdateVehicleAccessLog();

  const { data: doors, isLoading: isDoorLoading } = useGetDoors({});
  const doorsData = doors?.items?.map((door) => ({
    label: door.doorName,
    value: door.id,
  }));

  const {
    searchTerm,
    setSearchTerm,
    selectedVehicle,
    setSelectedVehicle,
    driverData,
    originalPlate,
    setOriginalPlate,
    originalOwnerId,
    setOriginalOwnerId,
    originalOwnerName,
    setOriginalOwnerName,
    vehiclesData,
    isVehicleLoading,
  } = useVehicleSearch(currentItem);

  const defaultValues = useMemo(
    () => ({
      searchQuery: '',
      driverName: '',
      vehicleType: '',
      vehiclePlate: '',
      selectedVehicleId: '',
      entryDate: '',
      entryTime: '',
      entryDoorId: '',
      entryOccupants: [],
      exitDate: '',
      exitTime: '',
      exitDoorId: '',
      exitOccupants: [],
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(VehicleAccessSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Fill form with currentItem data
  useEffect(() => {
    if (!currentItem) return;

    const plateValue = currentItem.plate || '';
    setOriginalPlate(plateValue);

    const { ownerId, ownerName } = getOwnerInfo(currentItem);
    setOriginalOwnerId(ownerId);
    setOriginalOwnerName(ownerName);

    setSelectedVehicle({
      id: currentItem.vehicleId,
      plate: plateValue,
      vehicleType: currentItem.vehicleType || '',
      driverName: currentItem.deriverName || '',
      ownerName,
    });

    setValue('selectedVehicleId', currentItem.vehicleId || '');
    setValue('driverName', currentItem.deriverName || '');
    setValue('vehicleType', currentItem.vehicleType || '');
    setValue('vehiclePlate', formatPlateForDisplay(plateValue));
    setValue('searchQuery', formatPlateForDisplay(plateValue));

    if (currentItem.entry) {
      setValue('entryDate', currentItem.entry.dateTime || '');
      setValue('entryTime', currentItem.entry.dateTime || '');
      setValue('entryDoorId', currentItem.entry.doorId || '');
      setValue('entryOccupants', currentItem.entry.occupants || []);
      setEntryAccordionExpanded(true);
    }
    if (currentItem.exit) {
      setValue('exitDate', currentItem.exit.dateTime || '');
      setValue('exitTime', currentItem.exit.dateTime || '');
      setValue('exitDoorId', currentItem.exit.doorId || '');
      setValue('exitOccupants', currentItem.exit.occupants || []);
      setExitAccordionExpanded(true);
    }
  }, [currentItem, setValue, setSelectedVehicle, setOriginalPlate, setOriginalOwnerId, setOriginalOwnerName]);

  // Update driver name when data changes
  useEffect(() => {
    setValue('driverName', driverData.name);
  }, [driverData.name, setValue]);

  const onSubmit = async (data) => {
    try {
      if (!selectedVehicle && !currentItem) {
        toast.error('لطفاً یک خودرو انتخاب کنید');
        return;
      }

      const payload = buildPayload({
        formData: data,
        selectedVehicle,
        currentItem,
        driverData,
        originalPlate,
        originalOwnerId,
        originalOwnerName,
      });

      if (currentItem) {
        await updateVehicleAccessLog.mutateAsync({ id: currentItem.id, ...payload });
        toast.success('با موفقیت بروزرسانی شد');
      } else {
        await createVehicleAccessLog.mutateAsync(payload);
        toast.success('با موفقیت ثبت شد');
      }

      onRefetch?.();
      resetForm();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message || 'خطای ناشناخته');
    }
  };

  const resetForm = () => {
    reset(defaultValues);
    setSelectedVehicle(null);
    setSearchTerm('');
    setOriginalPlate('');
    setOriginalOwnerId('');
    setOriginalOwnerName('');
    setEntryAccordionExpanded(false);
    setExitAccordionExpanded(false);
    onClose?.();
  };

  const isVehicleSelected = !!selectedVehicle || !!currentItem;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card sx={{ mb: 3, p: 2 }}>
          <FormHeader
            title={currentItem ? 'ویرایش تردد خودرو' : 'ثبت تردد جدید'}
          />
          <Divider sx={{ mb: 3 }} />

          <VehicleSearchFields
            vehiclesData={vehiclesData}
            isVehicleLoading={isVehicleLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            currentItem={currentItem}
            driverData={driverData}
            setValue={setValue}
            setOriginalPlate={setOriginalPlate}
            setOriginalOwnerId={setOriginalOwnerId}
            setOriginalOwnerName={setOriginalOwnerName}
          />

          <OccupantSection
            type="entry"
            expanded={entryAccordionExpanded}
            onToggle={(_, expanded) => setEntryAccordionExpanded(expanded)}
            doorsData={doorsData}
            isDoorLoading={isDoorLoading}
            control={control}
            title="ورود"
            dateLabel="تاریخ ورود"
            timeLabel="ساعت ورود"
            doorLabel="درب ورود"
            occupantFieldsName="entryOccupants"
          />

          <OccupantSection
            type="exit"
            expanded={exitAccordionExpanded}
            onToggle={(_, expanded) => setExitAccordionExpanded(expanded)}
            doorsData={doorsData}
            isDoorLoading={isDoorLoading}
            control={control}
            title="خروج"
            dateLabel="تاریخ خروج"
            timeLabel="ساعت خروج"
            doorLabel="درب خروج"
            occupantFieldsName="exitOccupants"
          />

          <Divider sx={{ my: 2 }} />

          <FormActions
            isSubmitting={isSubmitting}
            isVehicleSelected={isVehicleSelected}
            isEditing={!!currentItem}
            onCancel={resetForm}
          />
        </Card>
      </form>
    </FormProvider>
  );
}