'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment-jalaali';
import { useGetContractors } from 'src/services/contractor/contractor.service';
import { useCreateContract, useUpdateContract } from 'src/services/contractors-contracts/contracts.service';

const ContractSchema = zod.object({
    subject: zod.string().min(1, 'موضوع قرارداد الزامی است'),
    contractNumber: zod.string().min(1, 'شماره قرارداد الزامی است'),
    startDate: zod.string().nullable(),
    endDate: zod.string().nullable(),
    contractorId: zod.string().min(1, 'پیمانکار الزامی است'),
    tenderNumber: zod.string().nullable().optional(),
    settlementDate: zod.string().nullable().optional(),
    extraCreditDuration: zod.number().nullable().optional(),
    extraCreditDescription: zod.string().nullable().optional(),
    executionLocation: zod.string().nullable().optional(),
    supervisingUnit: zod.string().nullable().optional(),
    description: zod.string().nullable().optional(),
});

export function ContractAgreementNewEditForm({ currentContract, open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();

    const createContract = useCreateContract();
    const updateContract = useUpdateContract();

    const { data: getContractors } = useGetContractors();
    const contractorsList = getContractors?.items || [];
    
    const contractorOptions = contractorsList?.map((c) => ({
        label: c.name,
        value: c.id,
    }));

    const defaultValues = useMemo(
        () => ({
            subject: currentContract?.subject || '',
            contractNumber: currentContract?.contractNumber || '',
            startDate: currentContract?.startDate || null,
            endDate: currentContract?.endDate || null,
            contractorId: currentContract?.contractorId || '',
            tenderNumber: currentContract?.tenderNumber || null,
            settlementDate: currentContract?.settlementDate || null,
            extraCreditDuration: currentContract?.extraCreditDuration || null,
            extraCreditDescription: currentContract?.extraCreditDescription || null,
            executionLocation: currentContract?.executionLocation || null,
            supervisingUnit: currentContract?.supervisingUnit || null,
            description: currentContract?.description || null,
        }),
        [currentContract]
    );

    const methods = useForm({
        mode: 'all',
        // resolver: zodResolver(ContractSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {

            const payload = {
                subject: data.subject,
                contractNumber: data.contractNumber,
                startDate: data.startDate,
                endDate: data.endDate,
                contractorId: data.contractorId,
                tenderNumber: data.tenderNumber || null,
                settlementDate: data.settlementDate || null,
                extraCreditDuration: data.extraCreditDuration !== '' && data.extraCreditDuration != null
                    ? Number(data.extraCreditDuration)
                    : null,
                extraCreditDescription: data.extraCreditDescription || null,
                executionLocation: data.executionLocation || null,
                supervisingUnit: data.supervisingUnit || null,
                description: data.description || null,
            };

            console.log('Payload to send:', payload);

            if (currentContract) {
                await updateContract.mutateAsync({
                    id: currentContract.id,
                    ...payload
                });
                toast.success('قرارداد با موفقیت به‌روزرسانی شد');
            } else {
                await createContract.mutateAsync(payload);
                toast.success('قرارداد با موفقیت ایجاد شد');
            }

            onClose();
            onRefetch();
            reset();
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'خطا در عملیات');
        }
    });

    useEffect(() => {
        if (open) {
            reset(defaultValues);
        }
    }, [currentContract, open, reset, defaultValues]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle textAlign="center">
                {currentContract ? 'ویرایش قرارداد' : 'ایجاد قرارداد جدید'}
            </DialogTitle>

            <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', p: 2 }}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid item size={12}>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(2, 1fr)',
                                }}
                                sx={{ mt: 1 }}
                            >

                                <Field.Text
                                    name="contractNumber"
                                    label="شماره قرارداد"
                                    required
                                    size="small"
                                />

                                <Field.Text
                                    name="subject"
                                    label="موضوع قرارداد"
                                    required
                                    size="small"
                                />

                                <Field.Select
                                    name="contractorId"
                                    label="پیمانکار"
                                    required
                                    data={contractorOptions}
                                    displayExp="label"
                                    valueExp="value"
                                    size='small'
                                />

                                <Controller
                                    name="startDate"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label="تاریخ شروع"
                                            value={field.value ? moment(field.value) : null}
                                            onChange={(newValue) => {
                                                field.onChange(newValue ? newValue.toISOString() : null);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: 'small',
                                                    error: !!fieldState.error,
                                                    helperText: fieldState.error?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="endDate"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label="تاریخ پایان"
                                            value={field.value ? moment(field.value) : null}
                                            onChange={(newValue) => {
                                                field.onChange(newValue ? newValue.toISOString() : null);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: 'small',
                                                    error: !!fieldState.error,
                                                    helperText: fieldState.error?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="settlementDate"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label="تاریخ تسویه حساب"
                                            value={field.value ? moment(field.value) : null}
                                            onChange={(newValue) => {
                                                field.onChange(newValue ? newValue.toISOString() : null);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: 'small',
                                                    error: !!fieldState.error,
                                                    helperText: fieldState.error?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />


                                <Field.Text
                                    name="tenderNumber"
                                    label="شماره مناقصه"
                                    size="small"
                                />

                                <Field.Text
                                    name="executionLocation"
                                    label="محل اجرا"
                                    size="small"
                                />

                                <Field.Text
                                    name="supervisingUnit"
                                    label="واحد ناظر"
                                    size="small"
                                />


                                <Field.Text
                                    name="extraCreditDuration"
                                    label="مدت اعتبار مازاد (روز)"
                                    inputProps={{ type: 'number' }}
                                    size="small"
                                />

                                <Field.Text
                                    name="extraCreditDescription"
                                    label="توضیحات اعتبار مازاد"
                                    size="small"
                                    multiline
                                    rows={2}
                                />

                                <Field.Text
                                    name="description"
                                    label="توضیحات"
                                    size="small"
                                    multiline
                                    rows={3}
                                    sx={{ gridColumn: 'span 2' }}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Stack justifyContent="flex-end" direction='row' gap={1} sx={{ mt: 3 }}>
                        <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            loading={isSubmitting}
                            size="small"
                        >
                            {currentContract ? t_common('button.update') : t_common('button.create')}
                        </Button>
                        <Button onClick={onClose} color="error" variant="contained" size="small">
                            {t_common('button.cancel')}
                        </Button>
                    </Stack>
                </Form>
            </DialogContent>
        </Dialog>
    );
}