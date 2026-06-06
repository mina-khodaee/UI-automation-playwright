import { z as zod } from 'zod';
import { useMemo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useRegionActions } from 'src/stores/region-actions-store';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function RegionEditForm({ open, onClose, currentRegion, onRefetch }) {
    const { getRegions, updateRegion, regions } = useRegionActions();

    const { t: t_device } = useTranslate('device');
    const { t: t_common } = useTranslate();

    const [regionsLoading, setRegionsLoading] = useState(false);
    const [filteredRegions, setFilteredRegions] = useState([]);

    const NewRegionSchema = zod.object({
        description: zod.string().nullable(),
        name: zod.string().min(1, { message: t_device('formValidationErrors.regionName.required') }),
        parentId: zod.coerce.number().nullable().transform((value) => value === 0 ? null : value).refine(
            (parentId) => {
                if (currentRegion?.parent !== null && parentId === null) {
                    return false;
                }
                return true;
            }, {
            message: t_device('formValidationErrors.parentId.required'),
            path: ['parentId'],
        }
        ),
    });

    const defaultValues = useMemo(
        () => ({
            description: currentRegion?.description || '',
            name: currentRegion?.name || '',
            parentId: currentRegion?.parent?.id || '',
        }),
        [currentRegion]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewRegionSchema),
        defaultValues,
    });
    const {
        reset,
        setValue,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentRegion) {
            reset(defaultValues);
            setFilteredRegions(currentRegion?.parent === null ? [] : [currentRegion?.parent])
        }
    }, [currentRegion, defaultValues, reset]);


    const onSubmit = handleSubmit(async (data) => {
        try {
            await updateRegion({ id: currentRegion.id, ...data });
            onRefetch();
            onClose();
            getRegions();
            reset(defaultValues);
            toast.success(t_device('toastMessages.updateRegion'));
        } catch (error) {
            toast.error(error);
        }
    });


    const renderProperties = (
        <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
            }}
        >
            <Field.Text
                inputProps={{ type: 'text' }}
                name="name" label={t_device('formsInputs.regionName')} />
            <Controller
                name="parentId"
                control={control}
                rules={{ required: t_device('formValidationErrors.parentId.required') }}
                render={({ field, fieldState }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={filteredRegions || []}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            field.onChange(newValue ? Number(newValue.id) : null);
                        }}
                        onBlur={() => {
                            field.onBlur();
                            if (!field.value) {
                                setValue("parentId", "", { shouldValidate: true });
                            }
                        }}
                        onFocus={async () => {
                            try {
                                setRegionsLoading(true);
                                await getRegions();
                                setFilteredRegions(regions.filter((region) => region.id !== currentRegion?.id && region.parentId !== currentRegion?.id) || []);
                            } catch (error) {
                                toast.error(error);
                            } finally {
                                setRegionsLoading(false);
                            }
                        }}
                        value={regions?.find((item) => item?.id === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        disableClearable
                        disabled={currentRegion && currentRegion.parent === null}
                        loading={regionsLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_device('formsInputs.parentId')}
                                error={!!fieldState?.error}
                                helperText={fieldState?.error ? fieldState.error.message : ''}
                            />
                        )}
                    />
                )}
            />
            <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        multiline
                        rows={4}
                        fullWidth
                        label={t_device('formsInputs.description')}
                        variant="outlined"
                        error={!!error}
                        helperText={error?.message}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                alignItems: 'flex-start',
                            },
                        }}
                    />
                )}
            />

        </Box>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {t_common('button.update')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle textAlign='center'>{t_device('breadCrumb.updateRegion')}</DialogTitle>
            <DialogContent>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Form methods={methods} onSubmit={onSubmit}>
                        <Stack spacing={5} sx={{ m: 2, maxWidth: { xs: 700, xl: 850 }, py: 3 }}>
                            {renderProperties}
                            {renderActions}
                        </Stack>
                    </Form>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    {t_common('button.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
