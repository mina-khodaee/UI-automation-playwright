'use client';

import { z } from 'zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment-jalaali';
import { useCreateContractor, useUpdateContractor } from 'src/services/contractor/contractor.service';
import { useGetSites } from 'src/services/siteManagement/site.service';
import { useGetMajorsWithOutPagination } from 'src/services/majors/majors.service';

// ----------------------------------------------------------------------

export function ContractorNewEditForm({ currentContractor, open, onClose, onRefetch }) {

    // Translate Hook For Use In Different Languages
    const { t: t_common } = useTranslate();
    const { t: t_contractor } = useTranslate('contractor');

    // Create/Update Hook Api
    const createContractor = useCreateContractor();
    const updateContractor = useUpdateContractor();

    // Get Data For Use in Select Box Field
    const { data: getContractor } = useGetSites();
    const getAllContractor = getContractor?.items || []

    // const contractorOptions = getAllContractor?.filter((a) => a.isContractor == true)?.map((s) => ({
    //     label: s.name,
    //     value: s.id,
    // }));

    const contractorOptions = getAllContractor?.map((s) => ({
        label: s.name,
        value: s.id,
    }));

    const { data: getMajors } = useGetMajorsWithOutPagination();
    const getAllMajor = getMajors?.items || []

    const majorOptions = getAllMajor?.map((s) => ({
        label: s.name,
        value: s.name,
    }));

    // Validation For Required Fields
    const ContractorValidationSchema = z.object({
        name: z.string().min(1, t_contractor('formValidationErrors.name')),
        registrationNumber: z.string().min(1, t_contractor('formValidationErrors.registrationNumber')),
        parentSiteId: z.string({ invalid_type_error: t_contractor('formValidationErrors.parentSiteId') })
            .nullable().refine(val => val !== null, { message: t_contractor('formValidationErrors.parentSiteId') }),
        ceoFullName: z.string().min(1, t_contractor('formValidationErrors.ceoFullName')),
        ceoMobileNo: z.string().min(1, t_contractor('formValidationErrors.ceoMobileNo')),
        registrationDate: z.string().min(1, t_contractor('formValidationErrors.registrationDate')),
        superviserFullName: z.string().min(1, t_contractor('formValidationErrors.superviserFullName')),
        superviserMobileNo: z.string().min(1, t_contractor('formValidationErrors.superviserMobileNo')),
        superviserPersonnelCode: z.string().min(1, t_contractor('formValidationErrors.superviserPersonnelCode')),
        representativeFullName: z.string().min(1, t_contractor('formValidationErrors.representativeFullName')),
        representativeMobilNo: z.string().min(1, t_contractor('formValidationErrors.representativeMobilNo')),
        representativePersonnelCode: z.string().min(1, t_contractor('formValidationErrors.representativePersonnelCode')),
        ceoEducation: z.string().nullable().transform((val) => (val === '' ? null : val)),
        nationalCode: z.string().nullable().transform((val) => (val === '' ? null : val)),
        companyPhoneNumber: z.string().nullable().transform((val) => (val === '' ? null : val)),
        companyWebsite: z.string().nullable().transform((val) => (val === '' ? null : val)),
        companyEmail: z.string().nullable().transform((val) => (val === '' ? null : val)),
        companyAddress: z.string().nullable().transform((val) => (val === '' ? null : val)),
        companyBackground: z.string().nullable().transform((val) => (val === '' ? null : val)),
        description: z.string().nullable().transform((val) => (val === '' ? null : val)),
    });

    // Default Value For Form Fields
    const defaultValues = useMemo(
        () => ({
            parentSiteId: currentContractor?.parentSiteId ?? null,
            name: currentContractor?.name ?? '',
            registrationNumber: currentContractor?.registrationNumber ?? '',
            registrationDate: currentContractor?.registrationDate ?? '',
            ceoFullName: currentContractor?.ceo?.fullName ?? '',
            ceoMobileNo: currentContractor?.ceo?.mobileNo ?? '',
            nationalCode: currentContractor?.ceo?.nationalCode ?? null,
            ceoEducation: currentContractor?.ceo?.education ?? null,
            superviserFullName: currentContractor?.supervisor?.fullName ?? '',
            superviserMobileNo: currentContractor?.supervisor?.mobileNo ?? '',
            superviserPersonnelCode: currentContractor?.supervisor?.personnelCode ?? '',
            representativeFullName: currentContractor?.representative?.fullName ?? '',
            representativeMobilNo: currentContractor?.representative?.mobileNo ?? '',
            representativePersonnelCode: currentContractor?.representative?.personnelCode ?? '',
            companyPhoneNumber: currentContractor?.companyPhoneNumber ?? null,
            companyWebsite: currentContractor?.companyWebsite ?? null,
            companyEmail: currentContractor?.companyEmail ?? null,
            companyAddress: currentContractor?.companyAddress ?? null,
            companyBackground: currentContractor?.companyBackground ?? null,
            description: currentContractor?.description ?? null,
        }),
        [currentContractor]
    );


    const methods = useForm({
        mode: 'all',
        // resolver: zodResolver(ContractorValidationSchema),
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

    const values = watch();

    // Form Submit And Insert/Update Data
    const onSubmit = handleSubmit(async (data) => {
        try {

            const payload = {
                parentSiteId: values.parentSiteId,
                name: values.name,
                registrationNumber: values.registrationNumber,
                registrationDate: values.registrationDate,
                ceo: {
                    fullName: values.ceoFullName,
                    mobileNo: values.ceoMobileNo,
                    nationalCode: values.nationalCode,
                    education: values.ceoEducation,
                },
                supervisor: {
                    fullName: values.superviserFullName,
                    mobileNo: values.superviserMobileNo,
                    personnelCode: values.superviserPersonnelCode,
                },
                representative: {
                    fullName: values.representativeFullName,
                    mobileNo: values.representativeMobilNo,
                    personnelCode: values.representativePersonnelCode,
                },
                companyPhoneNumber: values.companyPhoneNumber,
                companyWebsite: values.companyWebsite,
                companyEmail: values.companyEmail,
                companyAddress: values.companyAddress,
                companyBackground: values.companyBackground,
                description: values.description,
            };

            if (currentContractor) {
                await updateContractor.mutateAsync({ id: currentContractor.id, ...payload });
                toast.success(t_contractor('toastMessages.update'));
            } else {
                await createContractor.mutateAsync(payload);
                toast.success(t_contractor('toastMessages.create'));
            }

            onClose();
            reset();
            onRefetch();
        } catch (error) {
            console.error(error);
            toast.error(error.message || t_common('errors.unknownError'));
        }
    });

    // Setting The Default Value For Each Field When In Edit Mode
    useEffect(() => {
        if (open && currentContractor) {
            reset({
                parentSiteId: currentContractor.parentSiteId ?? null,
                name: currentContractor.name ?? '',
                registrationNumber: currentContractor.registrationNumber ?? '',
                registrationDate: currentContractor.registrationDate ?? '',
                ceoFullName: currentContractor.ceo?.fullName ?? '',
                ceoMobileNo: currentContractor.ceo?.mobileNo ?? '',
                nationalCode: currentContractor.ceo?.nationalCode ?? null,
                ceoEducation: currentContractor.ceo?.education ?? null,
                superviserFullName: currentContractor.supervisor?.fullName ?? '',
                superviserMobileNo: currentContractor.supervisor?.mobileNo ?? '',
                superviserPersonnelCode: currentContractor.supervisor?.personnelCode ?? '',
                representativeFullName: currentContractor.representative?.fullName ?? '',
                representativeMobilNo: currentContractor.representative?.mobileNo ?? '',
                representativePersonnelCode: currentContractor.representative?.personnelCode ?? '',
                companyPhoneNumber: currentContractor.companyPhoneNumber ?? null,
                companyWebsite: currentContractor.companyWebsite ?? null,
                companyEmail: currentContractor.companyEmail ?? null,
                companyAddress: currentContractor.companyAddress ?? null,
                companyBackground: currentContractor.companyBackground ?? null,
                description: currentContractor.description ?? null,
            });
        }
    }, [currentContractor, open, reset]);


    // Reset The Default Value For Each Field When Dialog Closed
    useEffect(() => {
        if (!open) {
            reset({
                parentSiteId: null,
                name: '',
                registrationNumber: '',
                registrationDate: '',
                ceoFullName: '',
                ceoMobileNo: '',
                nationalCode: null,
                ceoEducation: null,
                superviserFullName: '',
                superviserMobileNo: '',
                superviserPersonnelCode: '',
                representativeFullName: '',
                representativeMobilNo: '',
                representativePersonnelCode: '',
                companyPhoneNumber: null,
                companyWebsite: null,
                companyEmail: null,
                companyAddress: null,
                companyBackground: null,
                description: null,
            });
        }
    }, [open, reset]);


    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle textAlign="center">
                {currentContractor ? t_contractor('title.updateContractor') : t_contractor('title.insertContractor')}
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
                                    sm: 'repeat(4, 1fr)',
                                    md: 'repeat(4, 1fr)',
                                }}
                                sx={{ mt: 1 }}
                            >
                                <Field.Text
                                    name="name"
                                    label={t_contractor('formsInputs.name')}
                                    size="small"
                                    required
                                />

                                <Field.Select
                                    name="parentSiteId"
                                    label={t_contractor('formsInputs.parentSiteId')}
                                    data={contractorOptions}
                                    displayExp="label"
                                    valueExp="value"
                                    size='small'
                                    required
                                />

                                <Controller
                                    name="registrationDate"
                                    control={methods.control}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label={t_contractor('formsInputs.registrationDate')}
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

                                {/* Representative Fields */}

                                <Field.Text
                                    name="representativeFullName"
                                    label={t_contractor('formsInputs.representativeFullName')}
                                    size="small"
                                    required
                                />

                                <Field.Text
                                    name="representativeMobilNo"
                                    label={t_contractor('formsInputs.representativeMobilNo')}
                                    size="small"
                                    required
                                />

                                <Field.Text
                                    name="representativePersonnelCode"
                                    label={t_contractor('formsInputs.representativePersonnelCode')}
                                    size="small"
                                    required
                                />

                                {/* Company Fields */}

                                <Field.Text
                                    name="registrationNumber"
                                    label={t_contractor('formsInputs.registrationNumber')}
                                    size="small"
                                    required
                                />

                                <Field.Text
                                    name="companyPhoneNumber"
                                    label={t_contractor('formsInputs.companyPhoneNumber')}
                                    size="small"
                                />

                                <Field.Text
                                    name="companyWebsite"
                                    label={t_contractor('formsInputs.companyWebsite')}
                                    size="small"
                                />

                                <Field.Text
                                    name="companyEmail"
                                    label={t_contractor('formsInputs.companyEmail')}
                                    size="small"
                                />

                                {/* Ceo Fields */}

                                <Field.Text
                                    name="ceoFullName"
                                    label={t_contractor('formsInputs.ceoFullName')}
                                    size="small"
                                    required
                                />

                                <Field.Text
                                    name="ceoMobileNo"
                                    label={t_contractor('formsInputs.ceoMobileNo')}
                                    size="small"
                                    required
                                />

                                <Field.Text
                                    name="nationalCode"
                                    label={t_contractor('formsInputs.nationalCode')}
                                    size="small"
                                />

                                <Field.Select
                                    name="ceoEducation"
                                    label={t_contractor('formsInputs.ceoEducation')}
                                    data={majorOptions}
                                    displayExp="label"
                                    valueExp="value"
                                    size='small'
                                />

                                {/* Superviser Fields */}

                                <Field.Text
                                    name="superviserFullName"
                                    label={t_contractor('formsInputs.superviserFullName')}
                                    size="small"
                                    required
                                />

                                <Field.Text
                                    name="superviserMobileNo"
                                    label={t_contractor('formsInputs.superviserMobileNo')}
                                    size="small"
                                    required
                                />

                                <Field.Text
                                    name="superviserPersonnelCode"
                                    label={t_contractor('formsInputs.superviserPersonnelCode')}
                                    size="small"
                                />

                                <Field.Text
                                    name="description"
                                    label={t_contractor('formsInputs.description')}
                                    size="small"
                                />

                                {/* <Field.Checkbox
                                    name="isActive"
                                    label="فعال"
                                /> */}

                                <Field.Text
                                    name="companyAddress"
                                    label={t_contractor('formsInputs.companyAddress')}
                                    size="small"
                                    sx={{ gridColumn: 'span 4' }}
                                />

                                <Field.Text
                                    name="companyBackground"
                                    label={t_contractor('formsInputs.companyBackground')}
                                    size="small"
                                    sx={{ gridColumn: 'span 4' }}
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
                            {currentContractor ? t_common('button.update') : t_common('button.create')}
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