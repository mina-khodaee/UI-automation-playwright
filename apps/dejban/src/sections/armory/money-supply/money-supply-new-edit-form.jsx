// 'use client';

// import { z as zod } from 'zod';
// import { useEffect, useMemo } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import Box from '@mui/material/Box';
// import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
// import { useTranslate } from 'src/locales';
// import { toast } from 'src/components/snackbar';
// import { Form, Field } from 'src/components/hook-form';
// import { useCreateMajor, useUpdateMajor } from 'src/services/majors/majors.service';
// import { useGetSelectPersonnels } from 'src/services/staff/staff.service';
// import { useGetContractors } from 'src/services/contractor/contractor.service';

// export function MoneySupplyNewEditForm({ currentData, open, onClose, onRefetch }) {
//     const { t: t_common } = useTranslate();
//     const { t: t_majors } = useTranslate('major');
//     const { data: personnelsData, isLoading: personnelsLoading } = useGetSelectPersonnels();
//     const personnels = personnelsData?.items || [];

//     const { data: getContractors } = useGetContractors();
//     const contractorsList = getContractors?.items || [];
//     const contractorOptions = contractorsList?.map((c) => ({
//         label: c.name,
//         value: c.id,
//     }));

//     const createMajors = useCreateMajor();
//     const updateMajors = useUpdateMajor();

//     const MoneySupplySchema = zod.object({
//         route: zod.string().min(1, 'انتخاب مسیر الزامی است'),
//         deliveryPersonnelCode: zod.string().min(1, 'انتخاب تحویل دار الزامی است'),
//         helperPersonnelCode: zod.string().optional(),
//         vehicleType: zod.string().min(1, 'نوع خودرو الزامی است'),
//         escortOperation: zod.string().min(1, 'عملیات اسکورت الزامی است'),
//         amount: zod.string().min(1, 'مبلغ الزامی است'),
//         currencyType: zod.string().min(1, 'نوع ارز الزامی است'),
//         coinBagCount: zod.string().optional(),
//         bagCount: zod.string().optional(),
//         requesterPersonnelCode: zod.string().min(1, 'انتخاب درخواست دهنده الزامی است'),
//         contractorId: zod.string().min(1, 'انتخاب مرکز الزامی است'),
//         description: zod.string().optional().nullable().transform((value) => (value === '' ? null : value)),
//     });

//     const defaultValues = useMemo(
//         () => ({
//             route: currentData?.route || '',
//             deliveryPersonnelCode: currentData?.deliveryPersonnelCode || '',
//             helperPersonnelCode: currentData?.helperPersonnelCode || '',
//             vehicleType: currentData?.vehicleType || '',
//             escortOperation: currentData?.escortOperation || '',
//             amount: currentData?.amount || '',
//             currencyType: currentData?.currencyType || '',
//             coinBagCount: currentData?.coinBagCount || '',
//             bagCount: currentData?.bagCount || '',
//             requesterPersonnelCode: currentData?.requesterPersonnelCode || '',
//             contractorId: currentData?.contractorId || '',
//             description: currentData?.description || '',
//         }),
//         [currentData]
//     );

//     console.log('defaultvalues v-1',defaultValues)

//     const methods = useForm({
//         mode: 'all',
//         resolver: zodResolver(MoneySupplySchema),
//         defaultValues,
//     });

//     const {
//         reset,
//         control,
//         handleSubmit,
//         formState: { isSubmitting },
//         watch,
//     } = methods;

//     const findPersonnelByCode = (code) => personnels.find(p => p.personnelCode === code) || null;

//     const onSubmit = handleSubmit(async (data) => {
//         try {
//             if (currentData) {
//                 await updateMajors.mutateAsync({ id: currentData.id, ...data });
//                 toast.success(t_majors('toastMessages.update'));
//             } else {
//                 await createMajors.mutateAsync(data);
//                 toast.success(t_majors('toastMessages.create'));
//             }
//             onClose();
//             onRefetch();
//             reset();
//         } catch (error) {
//             console.error(error);
//             toast.error(error.message || t_common('errors.unknownError'));
//         }
//     });

//     useEffect(() => {
//         if (open) {
//             reset({
//                 route: currentData?.route || '',
//                 deliveryPersonnelCode: currentData?.deliveryPersonnelCode || '',
//                 helperPersonnelCode: currentData?.helperPersonnelCode || '',
//                 vehicleType: currentData?.vehicleType || '',
//                 escortOperation: currentData?.escortOperation || '',
//                 amount: currentData?.amount || '',
//                 currencyType: currentData?.currencyType || '',
//                 coinBagCount: currentData?.coinBagCount || '',
//                 bagCount: currentData?.bagCount || '',
//                 requesterPersonnelCode: currentData?.requesterPersonnelCode || '',
//                 contractorId: currentData?.contractorId || '',
//                 description: currentData?.description || '',
//             });
//         }
//     }, [currentData, open, reset]);

//     useEffect(() => {
//         if (!open) {
//             reset({
//                 route: '',
//                 deliveryPersonnelCode: '',
//                 helperPersonnelCode: '',
//                 vehicleType: '',
//                 escortOperation: '',
//                 amount: '',
//                 currencyType: '',
//                 coinBagCount: '',
//                 bagCount: '',
//                 requesterPersonnelCode: '',
//                 contractorId: '',
//                 description: '',
//             });
//         }
//     }, [open, reset]);

//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//             <DialogTitle textAlign="center">
//                 {currentData ? 'ویرایش عملیات پولرسانی' : 'ایجاد عملیات پولرسانی'}
//             </DialogTitle>
//             <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', p: 2 }}>
//                 <Form methods={methods} onSubmit={onSubmit}>
//                     <Grid container spacing={3} justifyContent="center" alignItems="center">
//                         <Grid size={12}>
//                             <Box
//                                 rowGap={3}
//                                 columnGap={2}
//                                 display="grid"
//                                 gridTemplateColumns={{
//                                     xs: 'repeat(1, 1fr)',
//                                     sm: 'repeat(3, 1fr)',
//                                     md: 'repeat(3, 1fr)',
//                                 }}
//                                 sx={{ mt: 1 }}
//                             >
//                                 <Field.Text
//                                     name="route"
//                                     label='انتخاب مسیر'
//                                     inputProps={{ type: 'text' }}
//                                     size="small"
//                                 />

//                                 <Controller
//                                     name="deliveryPersonnelCode"
//                                     control={control}
//                                     render={({ field, fieldState: { error } }) => (
//                                         <Autocomplete
//                                             {...field}
//                                             options={personnels}
//                                             loading={personnelsLoading}
//                                             getOptionLabel={(option) => {
//                                                 if (!option) return '';
//                                                 return `${option.personnelCode} - ${option.firstName || ''} ${option.lastName || ''}`.trim();
//                                             }}
//                                             isOptionEqualToValue={(option, value) =>
//                                                 option.personnelCode === value?.personnelCode || option.personnelCode === value
//                                             }
//                                             onChange={(_, newValue) => {
//                                                 field.onChange(newValue?.personnelCode || '');
//                                             }}
//                                             value={findPersonnelByCode(field.value)}
//                                             renderInput={(params) => (
//                                                 <TextField
//                                                     {...params}
//                                                     label="تحویل دار"
//                                                     size="small"
//                                                     required
//                                                     error={!!error}
//                                                     helperText={error ? error.message : ''}
//                                                     placeholder="کد پرسنلی یا نام را وارد کنید..."
//                                                 />
//                                             )}
//                                             renderOption={(props, option) => (
//                                                 <li {...props}>
//                                                     <Stack>
//                                                         <Typography variant="body2">
//                                                             {option.personnelCode} - {option.firstName} {option.lastName}
//                                                         </Typography>
//                                                         {option.position && (
//                                                             <Typography variant="caption" color="text.secondary">
//                                                                 {option.position}
//                                                             </Typography>
//                                                         )}
//                                                     </Stack>
//                                                 </li>
//                                             )}
//                                         />
//                                     )}
//                                 />

//                                 <Controller
//                                     name="helperPersonnelCode"
//                                     control={control}
//                                     render={({ field, fieldState: { error } }) => (
//                                         <Autocomplete
//                                             {...field}
//                                             options={personnels}
//                                             loading={personnelsLoading}
//                                             getOptionLabel={(option) => {
//                                                 if (!option) return '';
//                                                 return `${option.personnelCode} - ${option.firstName || ''} ${option.lastName || ''}`.trim();
//                                             }}
//                                             isOptionEqualToValue={(option, value) =>
//                                                 option.personnelCode === value?.personnelCode || option.personnelCode === value
//                                             }
//                                             onChange={(_, newValue) => {
//                                                 field.onChange(newValue?.personnelCode || '');
//                                             }}
//                                             value={findPersonnelByCode(field.value)}
//                                             renderInput={(params) => (
//                                                 <TextField
//                                                     {...params}
//                                                     label="کمک تحویل دار"
//                                                     size="small"
//                                                     error={!!error}
//                                                     helperText={error ? error.message : ''}
//                                                     placeholder="کد پرسنلی یا نام را وارد کنید..."
//                                                 />
//                                             )}
//                                             renderOption={(props, option) => (
//                                                 <li {...props}>
//                                                     <Stack>
//                                                         <Typography variant="body2">
//                                                             {option.personnelCode} - {option.firstName} {option.lastName}
//                                                         </Typography>
//                                                         {option.position && (
//                                                             <Typography variant="caption" color="text.secondary">
//                                                                 {option.position}
//                                                             </Typography>
//                                                         )}
//                                                     </Stack>
//                                                 </li>
//                                             )}
//                                         />
//                                     )}
//                                 />

//                                 <Field.Text
//                                     name="vehicleType"
//                                     label='نوع خودرو'
//                                     inputProps={{ type: 'text' }}
//                                     size="small"
//                                 />

//                                 <Field.Text
//                                     name="escortOperation"
//                                     label='عملیات اسکورت'
//                                     inputProps={{ type: 'text' }}
//                                     size="small"
//                                 />

//                                 <Field.Text
//                                     name="amount"
//                                     label='مبلغ'
//                                     inputProps={{ type: 'text' }}
//                                     size="small"
//                                 />

//                                 <Field.Text
//                                     name="currencyType"
//                                     label='نوع ارز'
//                                     inputProps={{ type: 'text' }}
//                                     size="small"
//                                 />

//                                 <Field.Text
//                                     name="coinBagCount"
//                                     label='تعداد کیسه سکه'
//                                     inputProps={{ type: 'text' }}
//                                     size="small"
//                                 />

//                                 <Field.Text
//                                     name="bagCount"
//                                     label='تعداد کیسه'
//                                     inputProps={{ type: 'text' }}
//                                     size="small"
//                                 />

//                                 <Controller
//                                     name="requesterPersonnelCode"
//                                     control={control}
//                                     render={({ field, fieldState: { error } }) => (
//                                         <Autocomplete
//                                             {...field}
//                                             options={personnels}
//                                             loading={personnelsLoading}
//                                             getOptionLabel={(option) => {
//                                                 if (!option) return '';
//                                                 return `${option.personnelCode} - ${option.firstName || ''} ${option.lastName || ''}`.trim();
//                                             }}
//                                             isOptionEqualToValue={(option, value) =>
//                                                 option.personnelCode === value?.personnelCode || option.personnelCode === value
//                                             }
//                                             onChange={(_, newValue) => {
//                                                 field.onChange(newValue?.personnelCode || '');
//                                             }}
//                                             value={findPersonnelByCode(field.value)}
//                                             renderInput={(params) => (
//                                                 <TextField
//                                                     {...params}
//                                                     label="درخواست دهنده"
//                                                     size="small"
//                                                     required
//                                                     error={!!error}
//                                                     helperText={error ? error.message : ''}
//                                                     placeholder="کد پرسنلی یا نام را وارد کنید..."
//                                                 />
//                                             )}
//                                             renderOption={(props, option) => (
//                                                 <li {...props}>
//                                                     <Stack>
//                                                         <Typography variant="body2">
//                                                             {option.personnelCode} - {option.firstName} {option.lastName}
//                                                         </Typography>
//                                                         {option.position && (
//                                                             <Typography variant="caption" color="text.secondary">
//                                                                 {option.position}
//                                                             </Typography>
//                                                         )}
//                                                     </Stack>
//                                                 </li>
//                                             )}
//                                         />
//                                     )}
//                                 />

//                                 <Field.Select
//                                     name="contractorId"
//                                     label="مرکز"
//                                     required
//                                     data={contractorOptions}
//                                     displayExp="label"
//                                     valueExp="value"
//                                     size='small'
//                                 />
//                             </Box>

//                             <Box
//                                 rowGap={3}
//                                 columnGap={2}
//                                 display="grid"
//                                 gridTemplateColumns={{
//                                     xs: 'repeat(1, 1fr)',
//                                     sm: 'repeat(1, 1fr)',
//                                     md: 'repeat(1, 1fr)',
//                                 }}
//                                 sx={{ mt: 1 }}
//                             >
//                                 <Field.Text
//                                     name="description"
//                                     label='توضیحات'
//                                     multiline
//                                     rows={3}
//                                     size="small"
//                                 />
//                             </Box>

//                         </Grid>
//                     </Grid>
//                     <Stack justifyContent="flex-end" direction='row' gap={1} sx={{ mt: 3 }}>
//                         <Button
//                             type="submit"
//                             color="success"
//                             variant="contained"
//                             loading={isSubmitting}
//                             size="small"
//                         >
//                             {currentData ? t_common('button.update') : t_common('button.create')}
//                         </Button>
//                         <Button onClick={onClose} color="error" variant="contained" size="small">
//                             {t_common('button.cancel')}
//                         </Button>
//                     </Stack>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     );
// }
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod'; import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Stack,
} from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'sonner';
import { MoneySupplyFormFields } from './component/money-supply-form-fields';
import { useGetSelectPersonnels } from 'src/services/staff/staff.service';
import { useGetContractors } from 'src/services/contractor/contractor.service';
import { useCreateMajor, useUpdateMajor } from 'src/services/majors/majors.service';

export function MoneySupplyNewEditForm({ currentData, open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();
    const { t: t_majors } = useTranslate('major');

    const { data: personnelsData, isLoading: personnelsLoading } = useGetSelectPersonnels();
    const personnels = personnelsData?.items || [];

    const { data: getContractors } = useGetContractors();
    const contractorsList = getContractors?.items || [];
    const contractorOptions = contractorsList?.map((c) => ({
        label: c.name,
        value: c.id,
    }));

    const createMajors = useCreateMajor();
    const updateMajors = useUpdateMajor();

    const MoneySupplySchema = zod.object({
        route: zod.string().min(1, 'انتخاب مسیر الزامی است'),
        deliveryPersonnelCode: zod.string().min(1, 'انتخاب تحویل دار الزامی است'),
        helperPersonnelCode: zod.string().optional(),
        vehicleType: zod.string().min(1, 'نوع خودرو الزامی است'),
        escortOperation: zod.string().min(1, 'عملیات اسکورت الزامی است'),
        amount: zod.string().min(1, 'مبلغ الزامی است'),
        currencyType: zod.string().min(1, 'نوع ارز الزامی است'),
        coinBagCount: zod.string().optional(),
        bagCount: zod.string().optional(),
        requesterPersonnelCode: zod.string().min(1, 'انتخاب درخواست دهنده الزامی است'),
        contractorId: zod.string().min(1, 'انتخاب مرکز الزامی است'),
        description: zod.string().optional().nullable().transform((value) => (value === '' ? null : value)),
    });

    const defaultValues = useMemo(
        () => ({
            route: currentData?.route || '',
            deliveryPersonnelCode: currentData?.deliveryPersonnelCode || '',
            helperPersonnelCode: currentData?.helperPersonnelCode || '',
            vehicleType: currentData?.vehicleType || '',
            escortOperation: currentData?.escortOperation || '',
            amount: currentData?.amount || '',
            currencyType: currentData?.currencyType || '',
            coinBagCount: currentData?.coinBagCount || '',
            bagCount: currentData?.bagCount || '',
            requesterPersonnelCode: currentData?.requesterPersonnelCode || '',
            contractorId: currentData?.contractorId || '',
            description: currentData?.description || '',
        }),
        [currentData]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(MoneySupplySchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentData) {
                await updateMajors.mutateAsync({ id: currentData.id, ...data });
                toast.success(t_majors('toastMessages.update'));
            } else {
                await createMajors.mutateAsync(data);
                toast.success(t_majors('toastMessages.create'));
            }
            onClose();
            onRefetch();
            reset();
        } catch (error) {
            console.error(error);
            toast.error(error.message || t_common('errors.unknownError'));
        }
    });

    useEffect(() => {
        if (open) {
            reset({
                route: currentData?.route || '',
                deliveryPersonnelCode: currentData?.deliveryPersonnelCode || '',
                helperPersonnelCode: currentData?.helperPersonnelCode || '',
                vehicleType: currentData?.vehicleType || '',
                escortOperation: currentData?.escortOperation || '',
                amount: currentData?.amount || '',
                currencyType: currentData?.currencyType || '',
                coinBagCount: currentData?.coinBagCount || '',
                bagCount: currentData?.bagCount || '',
                requesterPersonnelCode: currentData?.requesterPersonnelCode || '',
                contractorId: currentData?.contractorId || '',
                description: currentData?.description || '',
            });
        }
    }, [currentData, open, reset]);

    useEffect(() => {
        if (!open) {
            reset({
                route: '',
                deliveryPersonnelCode: '',
                helperPersonnelCode: '',
                vehicleType: '',
                escortOperation: '',
                amount: '',
                currencyType: '',
                coinBagCount: '',
                bagCount: '',
                requesterPersonnelCode: '',
                contractorId: '',
                description: '',
            });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle textAlign="center">
                {currentData ? 'ویرایش عملیات پولرسانی' : 'ایجاد عملیات پولرسانی'}
            </DialogTitle>
            <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', p: 2 }}>
               
                <MoneySupplyFormFields
                    methods={methods}
                    personnels={personnels}
                    personnelsLoading={personnelsLoading}
                    contractorOptions={contractorOptions}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    isSubmitting={isSubmitting}
                    currentData={currentData}
                    t_common={t_common}
                />

                {/* <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
                    <Button
                        type="submit"
                        onClick={onSubmit}
                        color="success"
                        variant="contained"
                        loading={isSubmitting}
                        size="small"
                    >
                        {currentData ? t_common('button.update') : t_common('button.create')}
                    </Button>
                    <Button onClick={onClose} color="error" variant="contained" size="small">
                        {t_common('button.cancel')}
                    </Button>
                </Stack> */}
            </DialogContent>
        </Dialog>
    );
}