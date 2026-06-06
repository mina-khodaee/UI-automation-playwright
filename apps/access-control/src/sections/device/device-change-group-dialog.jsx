import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Stack, TextField, Autocomplete, Switch, FormControlLabel, Divider } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetDevice, useGetDevices } from 'src/actions/device';
import { useDeviceActions } from 'src/stores/device-actions-store';
import { useAccessGroupActions } from 'src/stores/access-group-actions';

import { Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function DeviceChangeGroup({ open, onClose, device }) {
    const { changeDeviceGroup } = useDeviceActions();
    const { getAccessGroups, accessGroups } = useAccessGroupActions();
    const { t: t_device } = useTranslate('device');
    const { t: t_common } = useTranslate();

    const DeviceGroupSchema = zod.object({
        accessGroupId: zod.coerce.number().min(1, { message: t_device('formValidationErrors.accessGroupId.required') }),
        syncUsersWithAccessGroup: zod.boolean().default(false),
        syncSettingsWithAccessGroup: zod.boolean().default(false),
    });

    const [accessGroupsLoading, setAccessGroupsLoading] = useState(false);

    const { mutate: devicesMutate } = useGetDevices();
    const { mutate: deviceMutate } = useGetDevice();

    const defaultValues = useMemo(
        () => ({
            accessGroupId: device?.accessGroup?.id || '',
            syncWithAccessGroup: false,
            syncSettingsWithAccessGroup: false,
        }),
        [device]
    );


    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(DeviceGroupSchema),
        defaultValues,
    });
    const {
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const values = watch();


    const onSubmit = handleSubmit(async (data) => {
        try {
            await changeDeviceGroup({ deviceId: device.id, ...data });
            await deviceMutate();
            await devicesMutate();
            toast.success(t_device('toastMessages.changeDeviceGroup'));
            onClose();
        } catch (error) {
            toast.error(error);
        }
    });

    const renderProperties = (
        <>
            <Controller
                name="accessGroupId"
                control={control}
                render={({ field, fieldState }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        disableClearable
                        options={accessGroups}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            field.onChange(newValue ? newValue.id : null);
                        }}
                        onFocus={async () => {
                            try {
                                setAccessGroupsLoading(true);
                                const pageSize = 100;
                                await getAccessGroups({ pageSize });
                            } catch (error) {
                                toast.error(error);
                            } finally {
                                setAccessGroupsLoading(false);
                            }
                        }}
                        value={accessGroups?.find((item) => item.id === field.value) || device?.accessGroup}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        loading={accessGroupsLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_device('formsInputs.accessGroup')}
                                error={!!fieldState?.error}
                                helperText={fieldState?.error ? fieldState.error.message : ''}
                            />
                        )}
                    />
                )}
            />
            <Controller
                name="syncUsersWithAccessGroup"
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        }
                        label={t_device('formsInputs.syncUsersWithAccessGroup')}
                    />
                )}
            />
            <Controller
                name="syncSettingsWithAccessGroup"
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        }
                        label={t_device('formsInputs.syncSettingsWithAccessGroup')}
                    />
                )}
            />
        </>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting} disabled={values.accessGroupId === ''}>
                    {t_device('button.changeDeviceGroup')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Divider>
            <DialogTitle textAlign='center'>{t_device('button.changeDeviceGroup')}</DialogTitle>
            </Divider>
            <DialogContent>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Stack spacing={5} sx={{ m: 2, maxWidth: { xs: 720, xl: 880 } }}>
                            {renderProperties}
                            {renderActions}
                    </Stack>
                </Form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    {t_common('button.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
