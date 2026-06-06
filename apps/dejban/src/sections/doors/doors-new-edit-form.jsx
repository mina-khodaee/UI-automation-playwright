'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack, MenuItem, TextField } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, RHFTextField } from 'src/components/hook-form';
import { useCreateDoor, useUpdateDoor } from 'src/services/doors/doors.service';
import { useGetSites } from 'src/services/siteManagement/site.service';
import { useGetUnits } from 'src/services/units/units.service';

import { DropdownTreeSelect } from 'src/components/tree-select/dropdown-tree-select';
import { buildSiteUnitTree } from '@repo/ui/utils';

const getDoorSchema = (t) => zod.object({
    doorName: zod.string().min(1, t('formValidation.doorNameRequired')),
    siteId: zod.string().min(1, t('formValidation.siteRequired')),
    unitId: zod.string().nullable().optional(),
    locationId: zod.string().nullable().optional(),
    isActive: zod.string(),
});

export function DoorsNewEditForm({ currentItem, open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();
    const { t: t_doors } = useTranslate('doors');

    const createItem = useCreateDoor();
    const updateItem = useUpdateDoor();

    const { data: sitesData, isLoading: sitesLoading } = useGetSites({ pageSize: 1000 });
    const { data: unitsData } = useGetUnits({ page: 1, pageSize: 1000 });

    const siteOptions = sitesData?.items || [];
    const unitOptions = unitsData?.items || [];

    const [siteUnitTree, setSiteUnitTree] = useState([]);

    useEffect(() => {
        if (siteOptions?.length) {
            const tree = buildSiteUnitTree(siteOptions, unitOptions);
            setSiteUnitTree(tree);
        }
    }, [siteOptions, unitOptions]);

    const statusOptions = useMemo(() => [
        { value: 'true', label: t_common('status.active') },
        { value: 'false', label: t_common('status.inactive') },
    ], [t_common]);

    const defaultValues = useMemo(
        () => ({
            doorName: currentItem?.doorName || '',
            siteId: currentItem?.site?.id || '',
            unitId: currentItem?.unit?.id || null,
            locationId: currentItem?.unit?.id || currentItem?.site?.id || null,
            isActive: currentItem?.isActive !== undefined ? String(currentItem.isActive) : 'true',
        }),
        [currentItem]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(getDoorSchema(t_doors)),
        defaultValues,
    });

    const {
        reset,
        control,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload = {
                DoorName: data.doorName,
                SiteId: data.siteId,
                UnitId: data.unitId || null,
                IsActive: data.isActive === 'true',
            };

            if (currentItem) {
                await updateItem.mutateAsync({ id: currentItem.id, ...payload });
                toast.success(t_doors('toastMessages.updateSuccess'));
            } else {
                await createItem.mutateAsync(payload);
                toast.success(t_doors('toastMessages.createSuccess'));
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
                doorName: currentItem?.doorName || '',
                siteId: currentItem?.site?.id || '',
                unitId: currentItem?.unit?.id || null,
                locationId: currentItem?.unit?.id || currentItem?.site?.id || null,
                isActive: currentItem?.isActive !== undefined ? String(currentItem.isActive) : 'true',
            });
        }
    }, [currentItem, open, reset]);

    useEffect(() => {
        if (!open) {
            reset({
                doorName: '',
                siteId: '',
                unitId: null,
                locationId: null,
                isActive: 'true',
            });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle textAlign="center">
                {currentItem ? t_doors('editTitle') : t_doors('createTitle')}
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
                                {/* نام درب */}
                                <RHFTextField
                                    name="doorName"
                                    label={t_doors('fields.doorName')}
                                    size="small"
                                    required
                                />

                                <Controller
                                    name="locationId"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <DropdownTreeSelect
                                            data={siteUnitTree}
                                            value={field.value}
                                            onChange={(id, selectedNode) => {
                                                field.onChange(id);
                                                if (selectedNode?.type === 'site') {
                                                    setValue('siteId', id);
                                                    setValue('unitId', null);
                                                } else if (selectedNode?.type === 'unit') {
                                                    setValue('unitId', id);
                                                    setValue('siteId', selectedNode?.parentSiteId);
                                                }
                                            }}
                                            placeholder="انتخاب مرکز یا واحد"
                                            searchPlaceholder="جستجو..."
                                            searchMode="filter"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label={t_common('formsInputs.status')}
                                            size="small"
                                            error={!!error}
                                            helperText={error?.message}
                                            fullWidth
                                        >
                                            {statusOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
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
                                ? (currentItem ? t_common('button.updating') : t_common('button.creating'))
                                : (currentItem ? t_common('button.update') : t_common('button.create'))}
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