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
import { useCreateDegree, useUpdateDegree } from 'src/services/degrees/degrees.service';

// ----------------------------------------------------------------------

export function DegreeNewEditForm({ currentDegree, open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();
    const { t: t_degree } = useTranslate('degree');

    const createDegree = useCreateDegree();
    const updateDegree = useUpdateDegree();


    const NewPositionSchema = zod.object({
        description: zod
            .string()
            .nullable()
            .transform((value) => (value === '' ? null : value)),
        name: zod.string().min(1, t_degree('formValidationErrors.name.required')),
    });

    const defaultValues = useMemo(
        () => ({
            description: currentDegree?.description || '',
            name: currentDegree?.name || '',
        }),
        [currentDegree]
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


    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentDegree) {
                await updateDegree.mutateAsync({ id: currentDegree.id, ...data });
                toast.success(t_degree('toastMessages.update'));
            } else {
                await createDegree.mutateAsync(data);
                toast.success(t_degree('toastMessages.create'));
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
                description: currentDegree?.description || '',
                name: currentDegree?.name || '',
            });
        }
    }, [currentDegree, open, reset]);

    useEffect(() => {
        if (!open) {
            reset({
                description: '',
                name: '',
            });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle textAlign="center">
                {currentDegree ? t_degree('title.updateDegrees') : t_degree('title.insertDegrees')}
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
                                    sm: 'repeat(1, 1fr)',
                                    md: 'repeat(1, 1fr)',
                                }}
                                sx={{ mt: 1 }}
                            >
                                <Field.Text
                                    name="name"
                                    label={t_degree('formsInputs.name')}
                                    inputProps={{ type: 'text' }}
                                    size="small"
                                />

                                <Field.Text
                                    name="description"
                                    label={t_degree('formsInputs.description')}
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
                            {currentDegree ? t_common('button.update') : t_common('button.create')}
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
