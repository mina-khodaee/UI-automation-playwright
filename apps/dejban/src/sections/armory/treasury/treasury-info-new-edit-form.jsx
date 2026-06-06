'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useCreateMajor, useUpdateMajor } from 'src/services/majors/majors.service';
import { useGetSelectPersonnels } from 'src/services/staff/staff.service';
import { useGetContractors } from 'src/services/contractor/contractor.service';

// ----------------------------------------------------------------------

export function TreasuryInfoNewEditForm({ currentTreasury, open, onClose, onRefetch }) {

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
            description: currentTreasury?.description || '',
            name: currentTreasury?.name || '',
            code: currentTreasury?.code || '',
        }),
        [currentTreasury]
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


    const selectedPersonnelCode = watch('personnelCode');

    const selectedPersonnel = useMemo(() =>
        personnels.find(p => p.personnelCode === selectedPersonnelCode) || null,
        [personnels, selectedPersonnelCode]
    );


    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentTreasury) {
                await updateMajors.mutateAsync({ id: currentTreasury.id, ...data });
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
                description: currentTreasury?.description || '',
                name: currentTreasury?.name || '',
                code: currentTreasury?.code || '',
            });
        }
    }, [currentTreasury, open, reset]);

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
                {currentTreasury ? 'ویرایش خزانه' : 'ایجاد خزانه'}
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
                                    label='نام خزانه'
                                    inputProps={{ type: 'text' }}
                                    size="small"
                                />

                                <Field.Text
                                    name="code"
                                    label='شماره خزانه'
                                    inputProps={{ type: 'text' }}
                                    size="small"
                                />

                                <Controller
                                    name="personnelCode"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <Autocomplete
                                            {...field}
                                            options={personnels}
                                            loading={personnelsLoading}
                                            getOptionLabel={(option) => {
                                                if (!option) return '';
                                                return `${option.personnelCode} - ${option.firstName || ''} ${option.lastName || ''}`.trim();
                                            }}
                                            isOptionEqualToValue={(option, value) =>
                                                option.personnelCode === value?.personnelCode || option.personnelCode === value
                                            }
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue?.personnelCode || '');
                                            }}
                                            value={selectedPersonnel}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="انتخاب پرسنل"
                                                    size="small"
                                                    required
                                                    error={!!error}
                                                    helperText={error?.message || 'جستجو با کد پرسنلی، نام یا نام خانوادگی'}
                                                    placeholder="کد پرسنلی یا نام را وارد کنید..."
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props}>
                                                    <Stack>
                                                        <Typography variant="body2">
                                                            {option.personnelCode} - {option.firstName} {option.lastName}
                                                        </Typography>
                                                        {option.position && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {option.position}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </li>
                                            )}
                                        />
                                    )}
                                />

                                <Field.Select
                                    name="contractorId"
                                    label="مرکز"
                                    required
                                    data={contractorOptions}
                                    displayExp="label"
                                    valueExp="value"
                                    size='small'
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
                            {currentTreasury ? t_common('button.update') : t_common('button.create')}
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