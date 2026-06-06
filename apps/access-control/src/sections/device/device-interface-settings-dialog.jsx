import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaVolumeLow, FaVolumeHigh } from 'react-icons/fa6';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Stack, Slider, Grid, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';
import { saveInterfaceOptions, useGetDevices } from 'src/actions/device';

import { Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function DeviceInterfacekSettings({ open, onClose, device }) {

    const { t: t_device } = useTranslate('device');

    const { t: t_common } = useTranslate();

    const soundLimit = useMemo(
        () => device.deviceType.model === "AC2000" || device.deviceType.model === "AC2100_PLUS",
        [device.deviceType.model]
    );

    const [soundValue, setSoundValue] = useState((soundLimit) ? (device.interfaceOptions?.sound) * 20 : (device.interfaceOptions?.sound) * 5);

    const { mutate } = useGetDevices();

    const SettingsSchema = zod.object({
        sound: zod.number().min(0).max(20)
    });

    const defaultValues = useMemo(
        () => ({
            sound: soundValue,
        }),
        [device, soundValue]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(SettingsSchema),
        defaultValues,
    });
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const handleSliderChange = (event, newValue) => {
        setSoundValue(newValue);
        soundLimit ? methods.setValue('sound', Math.ceil(newValue / 20)) : methods.setValue('sound', Math.ceil(newValue / 5));
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            await saveInterfaceOptions({ deviceId: device.id, ...data });
            await mutate();
            onClose();
            toast.success(t_device('toastMessages.saveSetting'));
        } catch (error) {
            toast.error(t_common('commonTexts.requestError'));
            throw error;
        }
    });

    const renderProperties = (
        <Box
            minWidth={{ md: 300 }}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
            }}
            sx={{
                mb: 3,
            }}
        >
            <Typography id="input-slider" gutterBottom>
                {t_device('formsInputs.sound')}
            </Typography>
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 1 }}>
                    <FaVolumeLow />
                </Grid>
                <Grid size={{ xs: 10 }}>
                    <Slider
                        value={soundValue}
                        step={5}
                        min={0}
                        max={100}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        valueLabelDisplay="auto"
                    />
                </Grid>
                <Grid size={{ xs: 1 }}>
                    <FaVolumeHigh />

                </Grid>
            </Grid>
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
        <Dialog open={open} onClose={onClose}>
            <DialogTitle textAlign='center'>{t_device('button.interfaceSettings')}</DialogTitle>
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
