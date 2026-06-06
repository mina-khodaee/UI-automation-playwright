import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Autocomplete, Dialog, DialogContent, DialogTitle, Grid, TextField, Button } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useRegionActions } from 'src/stores/region-actions-store';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function RegionNewForm({ open, onClose, onRefetch }) {
    const { getRegions, createRegion, regions } = useRegionActions();

    const { t: t_device } = useTranslate('device');

    const [regionsLoading, setRegionsLoading] = useState(false);

    const NewRegionSchema = zod.object({
        description: zod.string().nullable(),
        name: zod.string().min(1, { message: t_device('formValidationErrors.regionName.required') }),
        parentId: zod.coerce.number().min(1, { message: t_device('formValidationErrors.parentId.required') })
    });

    const defaultValues = useMemo(
        () => ({
            description: '',
            name: '',
            parentId: '',
        }),
        []
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

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createRegion(data);
            onRefetch();
            onClose();
            getRegions();
            reset(defaultValues);
            toast.success(t_device('toastMessages.createRegion'));
        } catch (error) {
            console.error(error);
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
                        options={regions || []}
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
                            if (regions.length <= 1) {
                                try {
                                    setRegionsLoading(true);
                                    await getRegions();
                                } catch (error) {
                                    console.error("Error fetching regions:", error);
                                } finally {
                                    setRegionsLoading(false);
                                }
                            }
                        }}
                        value={regions?.find((item) => item?.id === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        disableClearable
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
                    {t_device('button.createRegion')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle textAlign='center'>{t_device('button.newRegion')}</DialogTitle>
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
        </Dialog>
    );
}
