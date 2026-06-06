import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Card, Stack, TextField, Autocomplete } from '@mui/material';

import { useTranslate } from 'src/locales';
import { saveNetworkOptions, useGetDevice, useGetDevices, useGetNetworkTypes } from 'src/actions/device';

import { Field, Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function DeviceNetworkSettings({ open, onClose, device }) {
    const { t: t_device } = useTranslate('device');

    const { t: t_common, currentLang } = useTranslate();

    const [isDHCP, setIsDHCP] = useState(false);

    const SettingsSchema = (isDHCPProp) =>
        zod.object({
            networkType: zod.string().min(1, {
                message: t_device('formValidationErrors.networkType.required')
            }),
            subnet: zod.string()
                .nullable()
                .transform(value => value === "" ? null : value)
                .refine(value => isDHCPProp || value !== null, {
                    message: t_device('formValidationErrors.subnet.required')
                }),
            gateway: zod.string()
                .nullable()
                .transform(value => value === "" ? null : value)
                .refine(value => isDHCPProp || value !== null, {
                    message: t_device('formValidationErrors.gateway.required')
                }),
            serverIP: zod.string().min(1, { message: t_device('formValidationErrors.serverIP.required') }),
            serverPort: zod.coerce.number().refine(val => val !== undefined && val !== null && val !== 0, {
                message: t_device('formValidationErrors.serverPort.required'),
            }),
        });


    const { networkTypes, networkTypesLoading } = useGetNetworkTypes();

    const [disabled, setDisabled] = useState(false);
    const { mutate: devicesMutate } = useGetDevices();
    const { mutate: deviceMutate } = useGetDevice();

    const defaultValues = useMemo(
        () => ({
            networkType: device.networkOptions?.networkType || '',
            subnet: device.networkOptions?.subnet || '',
            gateway: device.networkOptions?.gateway || '',
            serverIP: device.networkOptions?.serverIP || '',
            serverPort: device.networkOptions?.serverPort || '',
        }),
        [device]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(SettingsSchema(isDHCP)),
        defaultValues,
    });
    const {
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const handleNetworkTypeChange = (event, newValue) => {
        if (newValue === 'DHCP') {
            setDisabled(true);
            setIsDHCP(true);
            methods.setValue('gateway', '');
            methods.setValue('subnet', '');
        } else {
            setDisabled(false);
            setIsDHCP(false);
        }
    };


    const onSubmit = handleSubmit(async (data) => {
        try {
            await saveNetworkOptions({ deviceId: device.id, ...data });
            await deviceMutate();
            await devicesMutate();
            toast.success(t_device('toastMessages.saveSetting'));
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error);
        }
    });

    const renderProperties = (
        <>
            <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                }}
                sx={{
                    mb: 3,
                }}
            >
                <Controller
                    name="networkType"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                            {...field}
                            fullWidth
                            options={networkTypes || []}
                            getOptionLabel={(option) => option.displayValues[currentLang.value]}
                            onChange={(event, newValue) => {
                                field.onChange(newValue.value || '');
                                handleNetworkTypeChange(event, newValue.value);
                            }}
                            value={networkTypes?.find((item) => item.value === field.value) || null}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            disableClearable
                            loading={networkTypesLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t_device('formsInputs.networkType')}
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />
                    )}
                />
                <Field.Text name="serverIP" label={t_device('formsInputs.serverIP')} control={control} />
                <Field.Text
                    inputProps={{ type: 'number' }}
                    onChange={(e) => {
                        const value = e.target.value;
                        methods.setValue('serverPort', Number(value) ? Number(value) : '');
                    }}
                    name="serverPort" label={t_device('formsInputs.serverPort')} />
            </Box>
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
                <Field.Text name="subnet" label={t_device('formsInputs.subnet')} disabled={disabled} control={control} />
                <Field.Text name="gateway" label={t_device('formsInputs.gateway')} disabled={disabled} control={control} />

            </Box>
        </>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {t_device('button.saveSetting')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle textAlign='center'>{t_device('button.networkSettings')}</DialogTitle>
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
