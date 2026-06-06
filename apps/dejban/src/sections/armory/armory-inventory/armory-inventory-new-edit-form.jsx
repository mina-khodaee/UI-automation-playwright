// src/sections/armory-inventory/armory-inventory-new-edit-form.jsx

'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack, MenuItem, TextField } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, RHFTextField, RHFNumberInput } from 'src/components/hook-form';
import { useCreateInventory, useUpdateInventory } from 'src/services/armory-inventory/armory-inventory.service';
import { useGetEquipments } from 'src/services/armory-equipments/armory-equipments.service';
import { useGetCategories } from 'src/services/armory-categories/armory-categories.service';
import { useGetSites } from 'src/services/siteManagement/site.service';
import { useGetArmoryLocations } from 'src/services/armory-locations/armory-locations.service';

// ----------------------------------------------------------------------

const getInventorySchema = (t, hasSerialRequired) => {
    let schema = {
        equipmentId: zod.string().min(1, t('formValidation.equipmentRequired')),
        status: zod.string().min(1, t('formValidation.statusRequired')),
        manufactureYear: zod.string().nullable().optional(),
        siteId: zod.string().nullable().optional(),
        locationId: zod.string().nullable().optional(),
        notes: zod.string().nullable().optional(),
    };

    if (hasSerialRequired) {
        schema.serialNumber = zod.string().min(1, t('formValidation.serialRequired'));
    } else {
        schema.quantity = zod.number().min(1, t('formValidation.quantityRequired'));
    }

    return zod.object(schema);
};

export function ArmoryInventoryNewEditForm({ currentItem, open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();
    const { t: t_inventory } = useTranslate('armory-inventory');

    const createItem = useCreateInventory();
    const updateItem = useUpdateInventory();

    const [hasSerialRequired, setHasSerialRequired] = useState(false);

    // گرفتن لیست‌ها
    const { data: equipmentsData } = useGetEquipments({ page: 1, pageSize: 100 });
    const { data: categoriesData } = useGetCategories({ page: 1, pageSize: 100 });
    const { data: sitesData, isLoading: sitesLoading } = useGetSites({ pageSize: 1000 });
    const { data: locationsData } = useGetArmoryLocations({ page: 1, pageSize: 100 });

    const equipmentOptions = equipmentsData?.items || [];
    const siteOptions = sitesData?.items || [];
    const locationOptions = locationsData?.items || [];

    const showSerialField = hasSerialRequired;
    const showQuantityField = !hasSerialRequired;

    const categoriesMap = useMemo(() => {
        const map = new Map();
        (categoriesData?.items || []).forEach((cat) => {
            map.set(cat.id, cat);
        });
        return map;
    }, [categoriesData]);

    const equipmentCategoryMap = useMemo(() => {
        const map = new Map();
        equipmentOptions.forEach((eq) => {
            map.set(eq.id, eq.categoryId);
        });
        return map;
    }, [equipmentOptions]);

    const statusOptions = [
        { value: 'نو', label: t_inventory('status.new') },
        { value: 'کارکرده', label: t_inventory('status.used') },
        { value: 'تعمیری', label: t_inventory('status.repair') },
        { value: 'از رده خارج', label: t_inventory('status.outOfService') },
    ];

    const defaultValues = useMemo(
        () => ({
            equipmentId: currentItem?.equipmentId || '',
            serialNumber: currentItem?.serialNumber || '',
            quantity: currentItem?.quantity || '',
            status: currentItem?.status || '',
            manufactureYear: currentItem?.manufactureYear?.toString() || '',
            siteId: currentItem?.siteId || '',
            locationId: currentItem?.locationId || '',
            notes: currentItem?.notes || '',
        }),
        [currentItem]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(getInventorySchema(t_inventory, hasSerialRequired)),
        defaultValues,
    });

    const {
        reset,
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const watchEquipmentId = watch('equipmentId');

    useEffect(() => {
        if (watchEquipmentId) {
            const categoryId = equipmentCategoryMap.get(watchEquipmentId);
            const category = categoriesMap.get(categoryId);
            setHasSerialRequired(category?.hasSerialNumber || false);
        } else {
            setHasSerialRequired(false);
        }
    }, [watchEquipmentId, equipmentCategoryMap, categoriesMap]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload = {
                equipmentId: data.equipmentId,
                status: data.status,
                manufactureYear: data.manufactureYear ? parseInt(data.manufactureYear) : null,
                siteId: data.siteId || null,
                locationId: data.locationId || null,
                notes: data.notes || null,
            };

            if (hasSerialRequired) {
                payload.serialNumber = data.serialNumber;
            } else {
                payload.quantity = data.quantity;
            }

            if (currentItem) {
                await updateItem.mutateAsync({ id: currentItem.id, ...payload });
                toast.success(t_inventory('toastMessages.updateSuccess'));
            } else {
                await createItem.mutateAsync(payload);
                toast.success(t_inventory('toastMessages.createSuccess'));
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
                equipmentId: currentItem?.equipmentId || '',
                serialNumber: currentItem?.serialNumber || '',
                quantity: currentItem?.quantity || '',
                status: currentItem?.status || '',
                manufactureYear: currentItem?.manufactureYear?.toString() || '',
                siteId: currentItem?.siteId || '',
                locationId: currentItem?.locationId || '',
                notes: currentItem?.notes || '',
            });
            if (currentItem?.equipmentId) {
                const categoryId = equipmentCategoryMap.get(currentItem.equipmentId);
                const category = categoriesMap.get(categoryId);
                setHasSerialRequired(category?.hasSerialNumber || false);
            }
        }
    }, [currentItem, open, reset, equipmentCategoryMap, categoriesMap]);

    useEffect(() => {
        if (!open) {
            reset({
                equipmentId: '',
                serialNumber: '',
                quantity: '',
                status: '',
                manufactureYear: '',
                siteId: '',
                locationId: '',
                notes: '',
            });
            setHasSerialRequired(false);
        }
    }, [open, reset]);

    const filteredLocations = locationOptions.filter(
        (loc) => !watch('siteId') || loc.siteId === watch('siteId')
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle textAlign="center">
                {currentItem ? t_inventory('editTitle') : t_inventory('createTitle')}
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
                                <Controller
                                    name="equipmentId"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label={t_inventory('fields.equipment')}
                                            size="small"
                                            error={!!error}
                                            helperText={error?.message}
                                            fullWidth
                                            required
                                        >
                                            <MenuItem value="">{t_inventory('placeholders.selectEquipment')}</MenuItem>
                                            {equipmentOptions.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />

                                {showSerialField && (
                                    <RHFTextField
                                        name="serialNumber"
                                        label={t_inventory('fields.serialNumber')}
                                        size="small"
                                        required
                                    />
                                )}

                                {showQuantityField && (
                                    <RHFTextField
                                        name="quantity"
                                        label={t_inventory('columns.quantity')}
                                        size="small"
                                        type="number"
                                        required
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                )}

                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label={t_inventory('fields.status')}
                                            size="small"
                                            error={!!error}
                                            helperText={error?.message}
                                            fullWidth
                                            required
                                        >
                                            <MenuItem value="">{t_inventory('placeholders.selectStatus')}</MenuItem>
                                            {statusOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />

                                <RHFTextField
                                    name="manufactureYear"
                                    label={t_inventory('fields.manufactureYear')}
                                    size="small"
                                    type="number"
                                    InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
                                />

                                <Controller
                                    name="siteId"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label={t_inventory('fields.site')}
                                            size="small"
                                            fullWidth
                                            disabled={sitesLoading}
                                        >
                                            <MenuItem value="">{t_inventory('placeholders.selectSite')}</MenuItem>
                                            {siteOptions.map((site) => (
                                                <MenuItem key={site.id} value={site.id}>
                                                    {site.name || site.title}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="locationId"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label={t_inventory('fields.location')}
                                            size="small"
                                            fullWidth
                                            disabled={!watch('siteId')}
                                        >
                                            <MenuItem value="">{t_inventory('placeholders.selectLocation')}</MenuItem>
                                            {filteredLocations.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />

                                <RHFTextField
                                    name="notes"
                                    label={t_inventory('fields.description')}
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