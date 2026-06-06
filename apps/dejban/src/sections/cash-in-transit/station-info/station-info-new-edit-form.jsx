'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useCreateMajor, useUpdateMajor } from 'src/services/majors/majors.service';

// ----------------------------------------------------------------------

export function StationInfoNewEditForm({ currentStation, open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();
    const { t: t_majors } = useTranslate('major');


    const createMajors = useCreateMajor();
    const updateMajors = useUpdateMajor();

    const NewPositionSchema = zod.object({
        description: zod
            .string()
            .optional()
            .nullable()
            .transform((value) => (value === '' ? null : value)),

        name: zod
            .string()
            .min(1, t_majors('formValidationErrors.name.required')),

        code: zod
            .string()
            .min(1, t_majors('formValidationErrors.code.required')),

    });

    const defaultValues = useMemo(
        () => ({
            description: currentStation?.description || '',
            name: currentStation?.name || '',
            code: currentStation?.code || '',
        }),
        [currentStation]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewPositionSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
        watch,
        setValue,
    } = methods;

    const siteId = watch('siteId');


    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentStation) {
                await updateMajors.mutateAsync({ id: currentStation.id, ...data });
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
                description: currentStation?.description || '',
                name: currentStation?.name || '',
                code: currentStation?.code || '',
            });
        }
    }, [currentStation, open, reset]);

    useEffect(() => {
        if (!open) {
            reset({
                description: '',
                name: '',
                code: '',
            });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle textAlign="center">
                {currentStation ? 'ویرایش ایستگاه' : 'ایجاد ایستگاه'}
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
                                    md: 'repeat(2, 1fr)',
                                }}
                                sx={{ mt: 1 }}
                            >
                                <Field.Text
                                    name="name"
                                    label='نام ایستگاه'
                                    inputProps={{ type: 'text' }}
                                    size="small"
                                />

                                <Field.Text
                                    name="code"
                                    label='شماره ایستگاه'
                                    inputProps={{ type: 'text' }}
                                    size="small"
                                />
                            </Box>

                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(1, 1fr)',
                                    md: 'repeat(1, 1fr)',
                                }}
                                sx={{ mt: 1 }}
                            >

                                <Field.Text
                                    name="description"
                                    label='توضیحات'
                                    multiline
                                    rows={3}
                                    size="small"
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
                            {currentStation ? t_common('button.update') : t_common('button.create')}
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