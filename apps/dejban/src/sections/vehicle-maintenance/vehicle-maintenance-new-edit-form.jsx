'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useCreateEmploymentType, useUpdateEmploymentType } from 'src/services/employment-type/emp-type.service';
import { DatePicker } from '@mui/x-date-pickers';
import { useGetVehicles, useGetVehicleWithOutPagination } from 'src/services/vehicle/vehicle.service';
import { useCreateMaintenance, useUpdateMaintenance } from 'src/services/maintenance/maintenance.service';
import moment from 'moment-jalaali';

// ----------------------------------------------------------------------

export function VehicleMaintenanceNewEditForm({ currentData, open, onClose, onRefetch }) {
     const { t: t_common } = useTranslate();

    const createMaintenance = useCreateMaintenance();
    const updateMaintenance = useUpdateMaintenance();
    
    // دریافت لیست خودروها
    const { data: vehiclesData, isLoading: vehiclesLoading } = useGetVehicleWithOutPagination();
    
    // استخراج خودروها از داده‌های API
    const vehicles = vehiclesData?.items || [];

    // گزینه‌های وضعیت بعد از سرویس مطابق با Enum VehicleStatus
    const statusAfterOptions = [
        { value: 0, label: 'فعال' },
        { value: 1, label: 'غیرفعال' },
        { value: 2, label: 'در حال تعمیر' },
        { value: 3, label: 'در حال استفاده' },
        { value: 4, label: 'خراب' },
        { value: 5, label: 'فروخته شده' },
    ];

    // Schema اعتبارسنجی مطابق با payload
    const MaintenanceSchema = zod.object({
        vehicleId: zod.union([
            zod.string().min(1, 'انتخاب خودرو الزامی است'),
            zod.number().min(1, 'انتخاب خودرو الزامی است')
        ]).nullable(),
        maintenanceType: zod.string().nullable().optional(),
        mileage: zod.number().or(zod.string())
            .transform((val) => val ? Number(val) : null)
            .nullable()
            .optional(),
        description: zod.string().nullable().optional(),
        cost: zod.number().or(zod.string())
            .transform((val) => val ? Number(val) : null)
            .nullable()
            .optional(),
        provider: zod.string().nullable().optional(),
        statusAfter: zod.number().default(0), // Active به عنوان پیش‌فرض
        maintenanceDate: zod.string().nullable().optional(),
    });

    const defaultValues = useMemo(
        () => ({
            maintenanceId: currentData?.id || '',
            vehicleId: currentData?.vehicleId || null,
            maintenanceType: currentData?.maintenanceType || '',
            mileage: currentData?.mileage || '',
            description: currentData?.description || '',
            cost: currentData?.cost || '',
            provider: currentData?.provider || '',
            statusAfter: currentData?.statusAfter ?? 0, // Active به عنوان پیش‌فرض
            maintenanceDate: currentData?.maintenanceDate || '',
        }),
        [currentData]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(MaintenanceSchema),
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
            // آماده سازی payload مطابق با ساختار مورد نیاز
            const payload = {
                maintenanceId: currentData?.id || '',
                vehicleId: data.vehicleId,
                maintenanceType: data.maintenanceType || null,
                mileage: data.mileage ? Number(data.mileage) : null,
                description: data.description || null,
                cost: data.cost ? Number(data.cost) : null,
                provider: data.provider || null,
                statusAfter: data.statusAfter,
                maintenanceDate: data.maintenanceDate || null,
            };

            if (currentData) {
                await updateMaintenance.mutateAsync({ id: currentData.id, ...payload });
                toast.success('تعمیرات با موفقیت ویرایش شد');
            } else {
                await createMaintenance.mutateAsync(payload);
                toast.success('تعمیرات با موفقیت ایجاد شد');
            }

            onClose();
            onRefetch();
            reset();
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'خطا در انجام عملیات');
        }
    });

    useEffect(() => {
        if (open) {
            reset({
                maintenanceId: currentData?.id || '',
                vehicleId: currentData?.vehicleId || null,
                maintenanceType: currentData?.maintenanceType || '',
                mileage: currentData?.mileage || '',
                description: currentData?.description || '',
                cost: currentData?.cost || '',
                provider: currentData?.provider || '',
                statusAfter: currentData?.statusAfter ?? 0,
                maintenanceDate: currentData?.maintenanceDate || '',
            });
        }
    }, [currentData, open, reset]);

    useEffect(() => {
        if (!open) {
            reset({
                maintenanceId: '',
                vehicleId: null,
                maintenanceType: '',
                mileage: '',
                description: '',
                cost: '',
                provider: '',
                statusAfter: 0, // Active به عنوان پیش‌فرض
                maintenanceDate: '',
            });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle textAlign="center">
                {currentData ? 'ویرایش تعمیرات' : 'ایجاد تعمیرات'}
            </DialogTitle>

            <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', p: 2 }}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={3} justifyContent="center" alignItems="center">
                        <Grid size={12}>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                                sx={{ mt: 1 }}
                            >
                                {/* انتخاب خودرو با Autocomplete */}
                                <Controller
                                    name="vehicleId"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <Autocomplete
                                            {...field}
                                            options={vehicles}
                                            loading={vehiclesLoading}
                                            getOptionLabel={(option) => {
                                                if (!option) return '';
                                                const plate = option.vehiclePlate?.plateNumber || '';
                                                const model = option.model || '';
                                                return `${plate} ${model ? `- ${model}` : ''}`;
                                            }}
                                            isOptionEqualToValue={(option, value) =>
                                                option.id === value?.id || option.id === value
                                            }
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue?.id || null);
                                            }}
                                            value={vehicles.find(v => v.id === field.value) || null}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="انتخاب خودرو"
                                                    size="small"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props}>
                                                    <Stack>
                                                        <span>{option.vehiclePlate?.plateNumber || 'بدون پلاک'}</span>
                                                        {option.model && (
                                                            <span style={{ fontSize: '0.75rem', color: '#666' }}>
                                                                {option.model} - {option.color || ''}
                                                            </span>
                                                        )}
                                                    </Stack>
                                                </li>
                                            )}
                                        />
                                    )}
                                />

                                {/* نوع تعمیرات */}
                                <Field.Text
                                    name="maintenanceType"
                                    label="نوع تعمیرات"
                                    size="small"
                                />

                                {/* تاریخ سرویس */}
                                <Controller
                                    name="maintenanceDate"
                                    control={methods.control}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label="تاریخ سرویس"
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

                                {/* کیلومتر */}
                                <Field.Text
                                    name="mileage"
                                    label="کیلومتر"
                                    size="small"
                                    type="number"
                                />

                                {/* ارائه‌دهنده سرویس - PROVIDER */}
                                <Field.Text
                                    name="provider"
                                    label="ارائه‌دهنده سرویس"
                                    size="small"
                                />

                                {/* هزینه */}
                                <Field.Text
                                    name="cost"
                                    label="هزینه (ریال)"
                                    size="small"
                                    type="number"
                                />

                                {/* وضعیت بعد از سرویس - با استفاده از Field.Select و data */}
                                <Field.Select
                                    name="statusAfter"
                                    label="وضعیت بعد از سرویس"
                                    data={statusAfterOptions}
                                    displayExp="label"
                                    valueExp="value"
                                    size="small"
                                />
                            </Box>

                            {/* توضیحات - DESCRIPTION */}
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(1, 1fr)',
                                }}
                                sx={{ mt: 2 }}
                            >
                                <Field.Text
                                    name="description"
                                    label="توضیحات"
                                    multiline
                                    rows={3}
                                    size="small"
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
                        <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            loading={isSubmitting || createMaintenance.isPending || updateMaintenance.isPending}
                            size="small"
                        >
                            {currentData ? t_common('button.update') : t_common('button.create')}
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