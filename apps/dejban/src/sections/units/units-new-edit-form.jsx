'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Autocomplete, Button, Chip, Dialog, DialogContent, DialogTitle, Grid, Stack, TextField } from '@mui/material';
import { useTranslate } from 'src/locales';
import { useSiteAPI } from 'src/stores/site-api';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useCreateUnit, useUpdateUnit } from 'src/services/units/units.service';

// ----------------------------------------------------------------------

export function UnitsNewEditForm({ currentUnits, open, onClose, onRefetch }) {

    // Translate Hook For Different Languages
    const { t: t_common } = useTranslate();
    const { t: t_units } = useTranslate('units');

    // Create/Update Hook Api
    const createUnits = useCreateUnit();
    const updateUnits = useUpdateUnit();

    // Get Select Box Data
    const { allSite, getSites } = useSiteAPI();
    useEffect(() => {
        getSites();
    }, [getSites]);

    // Required Validation For Form Fields
    const NewUnitSchema = zod.object({
        description: zod.string().nullable().transform((value) => (value === '' ? null : value)),
        name: zod.string().min(1, t_units('formValidationErrors.name.required')),
        siteId: zod.string({ required_error: t_units('formValidationErrors.sites.required') }).min(1, t_units('formValidationErrors.sites.required')),
        floorNumber: zod
            .preprocess(
                (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
                zod.number({
                    required_error: t_units('formValidationErrors.floorNumber.required'),
                    invalid_type_error: t_units('formValidationErrors.floorNumber.number'),
                }).min(1, t_units('formValidationErrors.floorNumber.min'))),
        callExtension: zod.string().nullable().transform((val) => (val === '' ? null : val)).optional(),
    });

    // Default Values For Form Fields
    const defaultValues = useMemo(
        () => ({
            description: currentUnits?.description || '',
            name: currentUnits?.name || '',
            siteId: currentUnits?.site?.id || '',
            floorNumber: currentUnits?.floorNumber || '',
            callExtension: String(currentUnits?.callExtension) || '',
        }),
        [currentUnits]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewUnitSchema),
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

    //Form Submit For Insert/Update Data
    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentUnits) {
                await updateUnits.mutateAsync({ id: currentUnits.id, ...data });
                toast.success(t_units('toastMessages.update'));
            } else {
                await createUnits.mutateAsync(data);
                toast.success(t_units('toastMessages.create'));
            }

            onClose();
            onRefetch();
            reset();
        } catch (error) {
            console.error(error);
            toast.error(error.message || t_common('errors.unknownError'));
        }
    });


    // Set The  Default Values In Form Fields In Edit Mode
    useEffect(() => {
        if (open) {
            reset({
                description: currentUnits?.description || '',
                name: currentUnits?.name || '',
                siteId: currentUnits?.site?.id || '',
                floorNumber: currentUnits?.floorNumber || '',
                callExtension: currentUnits?.callExtension || '',
            });
        }
    }, [currentUnits, open, reset]);


    // Reset The Form Fields When Dialog Closed
    useEffect(() => {
        if (!open) {
            reset({
                description: '',
                name: '',
                siteId: '',
                floorNumber: '',
                callExtension: '',
            });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle textAlign="center">
                {currentUnits ? t_units('title.updateUnits') : t_units('title.insertUnits')}
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
                                    label={t_units('formsInputs.name')}
                                    inputProps={{ type: 'text' }}
                                    size="small"
                                />


                                <Field.Text
                                    name="floorNumber"
                                    label={t_units('formsInputs.floorNumber')}
                                    size="small"
                                />

                                <Field.Text
                                    name="callExtension"
                                    label={t_units('formsInputs.callExtension')}
                                    size="small"
                                />

                                <Controller
                                    name="siteId"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <Autocomplete
                                            options={allSite}
                                            getOptionLabel={(option) =>
                                                option.name || option.title || `Site ${option.id}`
                                            }
                                            value={
                                                allSite.find((s) => s.id === field.value) || null
                                            }
                                            onChange={(_, newValue) => {
                                                setValue('siteId', newValue?.id ?? null, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            isOptionEqualToValue={(option, value) =>
                                                option.id === value.id
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t_units('formsInputs.sites')}
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    placeholder={t_units('formsInputs.selectSites')}
                                                    size="small"
                                                />
                                            )}
                                        />
                                    )}
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
                                sx={{ mt: 2 }}
                            >
                                <Field.Text
                                    name="description"
                                    label={t_units('formsInputs.description')}
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
                            {currentUnits ? t_common('button.update') : t_common('button.create')}
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