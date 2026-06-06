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
import { useCreateOccupationType, useUpdateOccupationType } from 'src/services/occupation-type/occupation-type.service';

// ----------------------------------------------------------------------

export function OccupationTypeNewEditForm({ currentOccuType, open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();
    const { t: t_occupation } = useTranslate('occupation-type');

    const createOccupationType = useCreateOccupationType();
    const updateOccupationType = useUpdateOccupationType();

    const NewPositionSchema = zod.object({
        description: zod
            .string()
            .nullable()
            .transform((value) => (value === '' ? null : value)),
        name: zod.string().min(1, t_occupation('formValidationErrors.name.required')),
    });

    const defaultValues = useMemo(
        () => ({
            description: currentOccuType?.description || '',
            name: currentOccuType?.name || '',
        }),
        [currentOccuType]
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
            if (currentOccuType) {
                await updateOccupationType.mutateAsync({ id: currentOccuType.id, ...data });
                toast.success(t_occupation('toastMessages.update'));
            } else {
                await createOccupationType.mutateAsync(data);
                toast.success(t_occupation('toastMessages.create'));
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
                description: currentOccuType?.description || '',
                name: currentOccuType?.name || '',
            });
        }
    }, [currentOccuType, open, reset]);

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
                {currentOccuType ? t_occupation('title.updateOccuType') : t_occupation('title.insertOccuType')}
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
                                    label={t_occupation('formsInputs.name')}
                                    inputProps={{ type: 'text' }}
                                    size="small"
                                />


                               <Field.Text
                                    name="description"
                                    label={t_occupation('formsInputs.description')}
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
                            {currentOccuType ? t_common('button.update') : t_common('button.create')}
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