import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { Box, Stack, Grid, TextField, Autocomplete, Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useDeviceUserStore } from 'src/stores/device-user-store';
import { useDeviceActions } from 'src/stores/device-actions-store';

import { Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function GetDeviceUserBiometricData({ open, onClose, userID, currentAccessGroups }) {
    const { items, getDevices, deviceActionsLoading } = useDeviceActions();
    const { getUserBiometricDataById } = useDeviceUserStore();
    const { t: t_user } = useTranslate('user');
    const { t: t_common } = useTranslate();
    const [filters, setFilters] = useState('');
    const GetUserBiometricDataSchema = zod.object({
        deviceId: zod.coerce.number().min(1, { message: t_user('formValidationErrors.deviceId.required') }),
    });

    const defaultValues = {
        deviceId: ''
    };

    useEffect(() => {
        const filterString = currentAccessGroups
            .map((ag) => `accessgroupid|eq|${ag.id}`)
            .join(' OR ');

        setFilters(filterString);
    }, [currentAccessGroups]);


    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(GetUserBiometricDataSchema),
        defaultValues,
    });
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = (async (data) => {
        try {
            await getUserBiometricDataById({ ...data, userIDs: [userID] });
            toast.success(t_user('toastMessages.getUserBiometricDataFromDevice'));
            onClose();
        } catch (error) {
            toast.error(error);
        }
    });
    const onError = (errors) => {
        Object.values(errors).forEach((error) => {
            toast.error(error.message || error.root.message);
        });
    };

    const renderProperties = (
        <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
            }}
        >
            <Controller
                name="deviceId"
                control={control}
                render={({ field, fieldState }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={items}
                        disableClearable
                        getOptionLabel={(option) => `${option.deviceType.brand}_${option.deviceType.model}`}
                        onChange={(event, newValue) => {
                            field.onChange(newValue ? newValue.id : null);
                        }}
                        onFocus={async () => {
                            await getDevices({ pageSize: 1000, filters });
                        }}
                        value={items?.find((item) => item.id === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        loading={deviceActionsLoading.getDevices}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_user('formsInputs.device')}
                                error={!!fieldState?.error}
                                helperText={fieldState?.error ? fieldState.error.message : ''}
                            />
                        )}
                    />
                )}
            />
        </Box>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button
                    type="submit" variant="contained" loading={isSubmitting}>
                    {t_user('buttons.getUserBiometricDataFromDevice')}
                </Button>

            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle textAlign='center'>{t_user('buttons.getUserBiometricDataFromDevice')}</DialogTitle>
            <DialogContent>
                <Grid size={{ xs: 12, md: 9 }}>
                    <LocalizationProvider>
                        <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
                            <Stack spacing={4} sx={{ m: 2, maxWidth: { xs: 700, xl: 860 } }}>
                                {renderProperties}
                                {renderActions}
                            </Stack>
                        </Form>
                    </LocalizationProvider>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    {t_common('button.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};