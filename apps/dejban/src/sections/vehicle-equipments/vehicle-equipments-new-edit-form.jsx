'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, Grid, Stack, TextField } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useCreateEquipment, useUpdateEquipment } from 'src/services/equipment/equipment.service';
import { useGetVehicleWithOutPagination } from 'src/services/vehicle/vehicle.service';

// ----------------------------------------------------------------------

export function VehicleEquipmentsNewEditForm({ currentData, open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();

    const createEquipment = useCreateEquipment();
    const updateEquipment = useUpdateEquipment();

    // دریافت لیست خودروها
    const { data: vehiclesData, isLoading: vehiclesLoading } = useGetVehicleWithOutPagination();

    // استخراج خودروها از داده‌های API
    const vehicles = vehiclesData?.items || [];

    // Schema اعتبارسنجی
    const EquipmentSchema = zod.object({
        equipmentType: zod.string().min(1, 'نوع تجهیزات الزامی است'),
        equipmentName: zod.string().min(1, 'نام تجهیزات الزامی است'),
        serialNumber: zod.string().min(1, 'شماره سریال الزامی است'),
        // status: zod.number(),
        vehicleId: zod.union([
            zod.string().min(1, 'خودرو الزامی است'),
            zod.number().min(1, 'خودرو الزامی است')
        ]).nullable(),
    });

    const defaultValues = useMemo(
        () => ({
            equipmentType: currentData?.equipmentType || '',
            equipmentName: currentData?.equipmentName || '',
            serialNumber: currentData?.serialNumber || '',
            vehicleId: currentData?.vehicleId || null,
            // status: currentData?.status ?? 0,
        }),
        [currentData]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(EquipmentSchema),
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
            if (currentData) {
                await updateEquipment.mutateAsync({ id: currentData.id, ...data });
                toast.success('تجهیزات با موفقیت ویرایش شد');
            } else {
                await createEquipment.mutateAsync(data);
                toast.success('تجهیزات با موفقیت ایجاد شد');
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
                equipmentType: currentData?.equipmentType || '',
                equipmentName: currentData?.equipmentName || '',
                serialNumber: currentData?.serialNumber || '',
                vehicleId: currentData?.vehicleId || null,
            });
        }
    }, [currentData, open, reset]);

    useEffect(() => {
        if (!open) {
            reset({
                equipmentType: '',
                equipmentName: '',
                serialNumber: '',
                vehicleId: null,
            });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle textAlign="center">
                {currentData ? 'ویرایش تجهیزات' : 'ایجاد تجهیزات'}
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
                                <Field.Text
                                    name="equipmentType"
                                    label="نوع تجهیزات"
                                    size="small"
                                    required
                                />

                                <Field.Text
                                    name="equipmentName"
                                    label="نام تجهیزات"
                                    size="small"
                                    required
                                />

                                <Field.Text
                                    name="serialNumber"
                                    label="شماره سریال"
                                    size="small"
                                    required
                                />

                                {/* Selectbox برای انتخاب خودرو با نمایش پلاک */}
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
                                                    label="خودرو"
                                                    size="small"
                                                    required
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

                                {/* <Field.Select name="status" label="وضعیت" size="small">
                                    <MenuItem value={0}>انبار</MenuItem>
                                    <MenuItem value={1}>نصب شده</MenuItem>
                                </Field.Select> */}

                            </Box>
                        </Grid>
                    </Grid>

                    <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
                        <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            loading={isSubmitting || createEquipment.isPending || updateEquipment.isPending}
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