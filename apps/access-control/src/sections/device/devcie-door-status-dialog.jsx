import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Stack, TextField, Autocomplete } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetDevice, useGetDevices } from 'src/actions/device';
import { useDeviceActions } from 'src/stores/device-actions-store';

import { Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function DeviceDoorStatus({ open, onClose, device }) {
    const setDoorStatus = useDeviceActions((state) => state.setDeviceDoorStatus);
    const getDoorStatus = useDeviceActions((state) => state.getVirdiDoorStatus);
    const { t: t_device } = useTranslate('device');
    const { t: t_common, currentLang } = useTranslate();

    const DeviceDoorStatusSchema = zod.object({
        status: zod.string().min(1, { message: t_device('formValidationErrors.doorStatus.required') }),
    });
    const [virdiDoorStatus, setVirdiDoorStatus] = useState([]);
    const [doorStatusLoading, setDoorStatusLoading] = useState(false);

    useEffect(() => {

        setDoorStatusLoading(true);
        const fetchDoorStatus = async () => {
            const result = await getDoorStatus();
            setVirdiDoorStatus(result);
        };
        setDoorStatusLoading(false);
        fetchDoorStatus();
    }, []);
    const { mutate: devicesMutate } = useGetDevices();
    const { mutate: deviceMutate } = useGetDevice();

    const defaultValues = useMemo(
        () => ({
            status: ''
        }),
        [device]
    );


    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(DeviceDoorStatusSchema),
        defaultValues,
    });
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await setDoorStatus({ deviceId: device.id, ...data });
            await deviceMutate();
            await devicesMutate();
            toast.success(t_device('toastMessages.setDeviceDoorStatus'));
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error);
        }
    });

    const renderProperties = (
        <Controller
            name="status"
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    fullWidth
                    options={virdiDoorStatus || []}
                    getOptionLabel={(option) => option.displayValues[currentLang.value]}
                    onChange={(event, newValue) => {
                        field.onChange(newValue.value || null);
                    }}
                    value={virdiDoorStatus?.find((item) => item.value === field.value) || null}
                    disableClearable
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    loading={doorStatusLoading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={t_device('formsInputs.doorStatus')}
                            error={!!error}
                            helperText={error?.message}
                        />
                    )}
                />
            )}
        />
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {t_device('button.setDeviceDoorStatus')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle textAlign='center'>{t_device('button.setDeviceDoorStatus')}</DialogTitle>
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
