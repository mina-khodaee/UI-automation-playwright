// src/sections/armory-equipments/armory-equipments-new-edit-form.jsx

'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack, MenuItem, TextField } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, RHFTextField } from 'src/components/hook-form';
import { useCreateEquipment, useUpdateEquipment } from 'src/services/armory-equipments/armory-equipments.service';
import { useGetCategories } from 'src/services/armory-categories/armory-categories.service';

const getEquipmentSchema = (t) => zod.object({
    categoryId: zod.string().min(1, t('formValidation.categoryRequired')),
    name: zod.string().min(1, t('formValidation.nameRequired')),
    description: zod.string().nullable().optional(),
});

export function ArmoryEquipmentsNewEditForm({ currentEquipment, open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();
    const { t: t_equipment } = useTranslate('armory-equipments');

    const createEquipment = useCreateEquipment();
    const updateEquipment = useUpdateEquipment();

    // گرفتن لیست دسته‌بندی‌ها برای dropdown
    const { data: categoriesData } = useGetCategories({ page: 1, pageSize: 100 });
    const categoryOptions = categoriesData?.items || [];

    const defaultValues = useMemo(
        () => ({
            categoryId: currentEquipment?.categoryId || '',
            name: currentEquipment?.name || '',
            description: currentEquipment?.description || '',
        }),
        [currentEquipment]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(getEquipmentSchema(t_equipment)),
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
                categoryId: data.categoryId,
                name: data.name,
                description: data.description || null,
            };

            if (currentEquipment) {
                await updateEquipment.mutateAsync({ id: currentEquipment.id, ...payload });
                toast.success(t_equipment('toastMessages.updateSuccess'));
            } else {
                await createEquipment.mutateAsync(payload);
                toast.success(t_equipment('toastMessages.createSuccess'));
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
                categoryId: currentEquipment?.categoryId || '',
                name: currentEquipment?.name || '',
                description: currentEquipment?.description || '',
            });
        }
    }, [currentEquipment, open, reset]);

    useEffect(() => {
        if (!open) {
            reset({
                categoryId: '',
                name: '',
                description: '',
            });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle textAlign="center">
                {currentEquipment ? t_equipment('editTitle') : t_equipment('createTitle')}
            </DialogTitle>

            <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', p: 2 }}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={3}>
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
                                {/* انتخاب دسته‌بندی */}
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label={t_equipment('fields.category')}
                                            size="small"
                                            error={!!error}
                                            helperText={error?.message}
                                            fullWidth
                                            required
                                        >
                                            <MenuItem value="">{t_equipment('placeholders.selectCategory')}</MenuItem>
                                            {categoryOptions.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />

                                {/* نام تجهیز */}
                                <RHFTextField
                                    name="name"
                                    label={t_equipment('fields.name')}
                                    size="small"
                                    required
                                />

                                {/* توضیحات - دو ستونه */}
                                <RHFTextField
                                    name="description"
                                    label={t_equipment('fields.description')}
                                    size="small"
                                    multiline
                                    rows={2}
                                    sx={{ gridColumn: 'span 2' }}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
                        <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            disabled={isSubmitting}
                            size="small"
                        >
                            {isSubmitting
                                ? (currentEquipment ? t_common('button.updating') : t_common('button.creating'))
                                : (currentEquipment ? t_common('button.update') : t_common('button.create'))}
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