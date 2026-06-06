import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Card, Stack, TextField, Autocomplete } from '@mui/material';

import { useTranslate } from 'src/locales';
import { saveSecurityOptions, useGetDevices, useGetDeviceTypeAuthenticationModes, useGetVirdiAccessLevels, useGetVirdiAntipassbackValues, useGetVirdiApplicationModes, useGetVirdiInputIDTypes, useGetVirdiSecurityLevels } from 'src/actions/device';

import { Field, Form } from 'src/components/hook-form';

export function DeviceSecuritySettings({ open, onClose, device }) {

    const { t: t_device } = useTranslate('device');

    const { t: t_common, currentLang } = useTranslate();

    const SettingsSchema = zod.object({
        authentication: zod.string().min(1, {
            message: t_device('formValidationErrors.authenticationMode.required')
        }),
        accessLevel: zod.string().transform(value => value === "" ? null : value).nullable(),
        application: zod.string().nullable().transform(value => value === "" ? null : value),
        antipassback: zod.string().nullable().transform(value => value === "" ? null : value),
        securityLevel_1To1: zod.string().nullable().transform(value => value === "" ? null : value),
        securityLevel_1ToN: zod.string().nullable().transform(value => value === "" ? null : value),
        inputIDType: zod.string().nullable().transform(value => value === "" ? null : value),
        inputIDLength: zod.coerce.number().nullable().transform(value => value === 0 ? null : value),
    });

    const { authenticationModes, authenticationModesLoading } = useGetDeviceTypeAuthenticationModes(device.deviceType?.id);
    const { accessLevels, accessLevelsLoading } = useGetVirdiAccessLevels();
    const { applicationModes, applicationModesLoading } = useGetVirdiApplicationModes();
    const { antipassbackValues, antipassbackValuesLoading } = useGetVirdiAntipassbackValues();
    const { securityLevels, securityLevelsLoading } = useGetVirdiSecurityLevels();
    const { inputIDTypes, inputIDTypesLoading } = useGetVirdiInputIDTypes();

    const defaultValues = useMemo(
        () => ({
            authentication: device.securityOptions?.authentication || '',
            accessLevel: device.securityOptions?.accessLevel || '',
            application: device.securityOptions?.application || '',
            antipassback: device.securityOptions?.antipassback || '',
            securityLevel_1To1: device.securityOptions?.securityLevel_1To1 || '',
            securityLevel_1ToN: device.securityOptions?.securityLevel_1ToN || '',
            inputIDType: device.securityOptions?.inputIDType || '',
            inputIDLength: device.securityOptions?.inputIDLength || '',
        }),
        [device]
    );

    const { mutate } = useGetDevices();

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(SettingsSchema),
        defaultValues,
    });
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await saveSecurityOptions({ deviceId: device.id, ...data });
            await mutate();
            onClose();
            toast.success(t_device('toastMessages.saveSetting'));
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
                md: 'repeat(2, 1fr)',
            }}
        >
            <Controller
                name="authentication"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={authenticationModes || []}
                        getOptionLabel={(option) => option.displayValues[currentLang.value]}
                        onChange={(event, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                        }}
                        disableClearable
                        value={authenticationModes?.find((item) => item.value === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        loading={authenticationModesLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_device('formsInputs.authenticationMode')}
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                )}
            />
            <Controller
                name="accessLevel"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={accessLevels || []}
                        getOptionLabel={(option) => option.displayValues[currentLang.value]}
                        onChange={(event, newValue) => {
                            field.onChange(newValue.value || '');

                        }}
                        value={accessLevels?.find((item) => item.value === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        loading={accessLevelsLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_device('formsInputs.accessLevel')}
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                )}
            />
            <Controller
                name="application"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={applicationModes || []}
                        getOptionLabel={(option) => option.displayValues[currentLang.value]}
                        onChange={(event, newValue) => {
                            field.onChange(newValue.value || '');

                        }}
                        value={applicationModes?.find((item) => item.value === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        loading={applicationModesLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_device('formsInputs.applicationMode')}
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                )}
            />
            <Controller
                name="antipassback"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={antipassbackValues || []}
                        getOptionLabel={(option) => option.displayValues[currentLang.value]}
                        onChange={(event, newValue) => {
                            field.onChange(newValue.value || '');

                        }}
                        value={antipassbackValues?.find((item) => item.value === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        loading={antipassbackValuesLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_device('formsInputs.antipassback')}
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                )}
            />
            <Controller
                name="securityLevel_1To1"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={securityLevels || []}
                        getOptionLabel={(option) => option.displayValues[currentLang.value]}
                        onChange={(event, newValue) => {
                            field.onChange(newValue.value || '');

                        }}
                        value={securityLevels?.find((item) => item.value === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        loading={securityLevelsLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_device('formsInputs.securityLevel_1To1')}
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                )}
            />
            <Controller
                name="securityLevel_1ToN"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={securityLevels || []}
                        getOptionLabel={(option) => option.displayValues[currentLang.value]}
                        onChange={(event, newValue) => {
                            field.onChange(newValue.value || '');

                        }}
                        value={securityLevels?.find((item) => item.value === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        loading={securityLevelsLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_device('formsInputs.securityLevel_1ToN')}
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                )}
            />
            <Controller
                name="inputIDType"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={inputIDTypes || []}
                        getOptionLabel={(option) => option.displayValues[currentLang.value]}
                        onChange={(event, newValue) => {
                            field.onChange(newValue.value || '');

                        }}
                        value={inputIDTypes?.find((item) => item.value === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        loading={inputIDTypesLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_device('formsInputs.inputIDType')}
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                )}
            />
            <Field.Text name="inputIDLength" type="number" label={t_device('formsInputs.inputIDLength')} control={control} />
        </Box>
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle textAlign='center'>{t_device('button.securitySettings')}</DialogTitle>
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
