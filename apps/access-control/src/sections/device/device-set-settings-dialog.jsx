import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Stack } from '@mui/material';

import { useTranslate } from 'src/locales';
import { setInterfaceOptions, setNetworkOptions, setSecurityOptions } from 'src/actions/device';

import { Field, Form } from 'src/components/hook-form';

export function DeviceSetSettings({ open, onClose, id }) {

    const { t: t_device } = useTranslate('device');

    const { t: t_common } = useTranslate();

    const SETTINGS_TYPES = [
        {
            label: t_device('button.networkSettings'),
            value: 'network'
        },
        {
            label: t_device('button.interfaceSettings'),
            value: 'interface'
        },
        {
            label: t_device('button.securitySettings'),
            value: 'security'
        }
    ];

    const SettingsSchema = zod.object({
        settingsType: zod.string().array().nonempty({ message: t_device('formValidationErrors.settingsType.required') })
    });

    const defaultValues = useMemo(
        () => ({
            settingsType: []
        }),
        []
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(SettingsSchema),
        defaultValues,
    });
    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;


    const onSubmit = handleSubmit(async (data) => {

        data.settingsType.map(async (item) => {
            switch (item) {
                case 'network':
                    try {
                        await setNetworkOptions(id);
                        toast.success(t_device('toastMessages.setNetworkSettings'));
                    } catch (error) {
                        console.error(error);
                        toast.error(error);
                    }
                    break;
                case 'interface':
                    try {
                        await setInterfaceOptions(id);
                        toast.success(t_device('toastMessages.setInterfaceSettings'));
                    } catch (error) {
                        console.error(error);
                        toast.error(error);
                    }
                    break;
                case 'security':
                    try {
                        await setSecurityOptions(id);
                        toast.success(t_device('toastMessages.setSecuritySettings'));
                    } catch (error) {
                        console.error(error);
                        toast.error(error);
                    }
                    break;
                default:
                    break;
            }
        });
        reset(defaultValues);
        onClose();

    });

    const renderProperties = (
        <Stack spacing={1}>
            <Field.MultiCheckbox row name="settingsType" options={SETTINGS_TYPES} sx={{ gap: 3 }} />
        </Stack>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {t_device('button.setSettings')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle textAlign='center'>{t_device('button.setSettings')}</DialogTitle>
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
