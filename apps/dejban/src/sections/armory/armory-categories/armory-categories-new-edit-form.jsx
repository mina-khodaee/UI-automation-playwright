// src/sections/armory-categories/armory-categories-new-edit-form.jsx

'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack, MenuItem, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useCreateCategory, useUpdateCategory } from 'src/services/armory-categories/armory-categories.service';

const getCategorySchema = (t) => zod.object({
    name: zod.string().min(1, t('formValidation.nameRequired')),
    code: zod.string().optional(),
    hasSerialNumber: zod.boolean(),
    description: zod.string().nullable().optional(),
    status: zod.string(),
});

export function ArmoryCategoriesNewEditForm({ currentCategory, open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();
    const { t: t_categories } = useTranslate('armory-categories');

    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();

    const statusOptions = useMemo(() => [
        { value: 'true', label: t_common('status.active') },
        { value: 'false', label: t_common('status.inactive') },
    ], [t_common]);

    const defaultValues = useMemo(
        () => ({
            name: currentCategory?.name || '',
            code: currentCategory?.code || '',
            hasSerialNumber: currentCategory?.hasSerialNumber || false,
            description: currentCategory?.description || '',
            status: currentCategory?.status !== undefined ? String(currentCategory.status) : 'true',
        }),
        [currentCategory]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(getCategorySchema(t_categories)),
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
                name: data.name,
                code: data.code || null,
                hasSerialNumber: data.hasSerialNumber,
                description: data.description || null,
                status: data.status === 'true',
            };

            if (currentCategory) {
                await updateCategory.mutateAsync({ id: currentCategory.id, ...payload });
                toast.success(t_categories('toastMessages.updateSuccess'));
            } else {
                await createCategory.mutateAsync(payload);
                toast.success(t_categories('toastMessages.createSuccess'));
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
                name: currentCategory?.name || '',
                code: currentCategory?.code || '',
                hasSerialNumber: currentCategory?.hasSerialNumber || false,
                description: currentCategory?.description || '',
                status: currentCategory?.status !== undefined ? String(currentCategory.status) : 'true',
            });
        }
    }, [currentCategory, open, reset]);

    useEffect(() => {
        if (!open) {
            reset({
                name: '',
                code: '',
                hasSerialNumber: false,
                description: '',
                status: 'true',
            });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle textAlign="center">
                {currentCategory ? t_categories('editTitle') : t_categories('createTitle')}
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
                                <RHFTextField
                                    name="name"
                                    label={t_categories('fields.name')}
                                    size="small"
                                    required
                                />

                                <RHFTextField
                                    name="code"
                                    label={t_categories('fields.code')}
                                    size="small"
                                />

                                <Controller
                                    name="hasSerialNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label={t_categories('fields.hasSerialNumber')}
                                        />
                                    )}
                                />

                                <RHFSelect
                                    name="status"
                                    label={t_categories('fields.status')}
                                    size="small"
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>

                                <RHFTextField
                                    name="description"
                                    label={t_categories('fields.description')}
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
                                ? (currentCategory ? t_common('button.updating') : t_common('button.creating'))
                                : (currentCategory ? t_common('button.update') : t_common('button.create'))}
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