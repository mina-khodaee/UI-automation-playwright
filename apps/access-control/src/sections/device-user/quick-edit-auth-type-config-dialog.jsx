import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Stack, Divider, Switch, FormControlLabel, Typography, Checkbox, Grid, Radio, RadioGroup } from '@mui/material';

import { useTranslate } from 'src/locales';
import { updateAuthTypeConfig } from 'src/actions/device-user';
import { useDeviceUserStore } from 'src/stores/device-user-store';

import { Field, Form } from 'src/components/hook-form';

import { CardSettings } from './device-user-card-dialog';

// ----------------------------------------------------------------------

export function QuicEditAuthTypeConfig({ open, onClose, currentUser, onMutate }) {
    const { cards } = useDeviceUserStore();
    const { t: t_user } = useTranslate('user');
    const { t: t_common } = useTranslate();
    const { t: t_device } = useTranslate('device');

    const [selectedAuthTypes, setSelectedAuthTypes] = useState({
        isFace: currentUser?.authTypeConfig?.isFace || false,
        isFingerprint: currentUser?.authTypeConfig?.isFingerprint || false,
        isPassword: currentUser?.authTypeConfig?.isPassword || false,
        isCard: currentUser?.authTypeConfig?.isCard || false,
    });
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const NewDeviceUserSchema = zod.object({
        syncWithDevicesInUserAccessGroups: zod.boolean().default(false),
        authTypeConfig: zod.object({
            isAndOperation: zod.boolean().default(false),
            isFace: zod.boolean().default(false),
            isFingerprint: zod.boolean().default(false),
            isPassword: zod.boolean().default(false),
            isCard: zod.boolean().default(false),
            isFPCard: zod.boolean().default(false),
            isCardID: zod.boolean().default(false),
        }).refine(
            (authTypes) => {
                const selectedTypes = ['isFace', 'isFingerprint', 'isPassword', 'isCard'].some((key) => authTypes[key]);
                return selectedTypes;
            },
            {
                message: t_user('formValidationErrors.authTypeConfig.required'),
            }
        ),
        password: zod.string().nullable().transform(value => value === "" ? null : value),
    }).refine(
        (data) => {
            if (data.authTypeConfig.isPassword) {
                return data.password;
            }
            return true;
        },
        {
            message: t_user("formValidationErrors.password.required"),
            path: ["password"],
        }
    ).refine((data) => !data.authTypeConfig.isCard || cards.length > 0, {
        message: t_user("formValidationErrors.cards.required"),

    });

    const defaultValues = {
        syncWithDevicesInUserAccessGroups: false,
        authTypeConfig: {
            isAndOperation: currentUser?.authTypeConfig.isAndOperation || false,
            isFace: currentUser?.authTypeConfig.isFace || false,
            isFingerprint: currentUser?.authTypeConfig.isFingerprint || false,
            isPassword: currentUser?.authTypeConfig.isPassword || false,
            isCard: currentUser?.authTypeConfig.isCard || false,
            isFPCard: currentUser?.authTypeConfig.isFPCard || false,
            isCardID: currentUser?.authTypeConfig.isCardID || false,
        },
        password: '',
    };

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewDeviceUserSchema),
        defaultValues,
    });
    const {
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const allowedAuthTypesFields = [
        { key: 'isFace', label: t_device('formsInputs.face'), icon: '/icons/face.png' },
        { key: 'isFingerprint', label: t_device('formsInputs.fingerprint'), icon: '/icons/fingerprint.png' },
        { key: 'isPassword', label: t_device('formsInputs.password'), icon: '/icons/password.png' },
        { key: 'isCard', label: t_device('formsInputs.card'), icon: '/icons/card.png' },
    ];
    const handleAuthTypeChange = (authType) => {
        const newSelectedAuthTypes = { ...selectedAuthTypes, [authType]: !selectedAuthTypes[authType] };

        setSelectedAuthTypes(newSelectedAuthTypes);
        setValue('authTypeConfig', { ...newSelectedAuthTypes, isAndOperation: values.authTypeConfig.isAndOperation });
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload = {
                ...data,
                userID: currentUser.userID,
                cards: data.authTypeConfig.isCard ? cards : [],
                password: data.authTypeConfig.isPassword ? data.password : null,
            };
            await updateAuthTypeConfig(payload);
            await onMutate();
            onClose();
            toast.success(t_user('toastMessages.updateAuthTypeConfig'));
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
        <>
            <Box
                rowGap={2}
                columnGap={2}
                sx={{ mt: 2 }}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)'
                }}
            >
                <Field.Text
                    inputProps={{ type: 'text' }}
                    name="password" label={t_user('formsInputs.password')} disabled={!selectedAuthTypes.isPassword} />
                <Controller
                    name="syncWithDevicesInUserAccessGroups"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                            }
                            label={t_user('formsInputs.syncWithDevicesInUserAccessGroups')}
                        />
                    )}
                />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 3 }}>
                <Typography variant="h7">{t_user('formsInputs.authTypeConfig')}:</Typography>
                <Box>
                    <Controller
                        name="authTypeConfig.isAndOperation"
                        control={control}
                        render={({ field }) => (
                            <Box sx={{ mt: 2 }}>
                                <RadioGroup
                                    value={field.value ?? false}
                                    onChange={(e) => {
                                        const isAndOperation = e.target.value === 'true';
                                        if (!isAndOperation) {
                                            const currentSelectedTypes = Object.keys(selectedAuthTypes).filter(
                                                (key) => selectedAuthTypes[key] && key !== "isAndOperation"
                                            );
                                            if (currentSelectedTypes.length > 2) {
                                                currentSelectedTypes.slice(2).forEach((key) => {
                                                    selectedAuthTypes[key] = false;
                                                });
                                            }
                                            setValue("authTypeConfig", selectedAuthTypes);
                                        }

                                        setSelectedAuthTypes({
                                            ...selectedAuthTypes,
                                            isAndOperation,
                                        });
                                        field.onChange(isAndOperation);
                                    }}
                                >
                                    <FormControlLabel
                                        value
                                        control={<Radio />}
                                        label={t_device('formsInputs.isAndOperation')}
                                    />
                                    <FormControlLabel
                                        value={false}
                                        control={<Radio />}
                                        label={t_device('formsInputs.isOrOperation')}
                                    />
                                </RadioGroup>
                            </Box>
                        )}
                    />
                </Box>
                <Box
                    rowGap={2}
                    columnGap={0.25}
                    sx={{ mt: 2 }}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        md: 'repeat(2, 1fr)'
                    }}
                >
                    {allowedAuthTypesFields.map(({ key, label, icon }) => (
                        <Controller
                            key={key}
                            name={`authTypeConfig.${key}`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <FormControlLabel

                                    control={
                                        <Checkbox
                                            {...field}
                                            checked={selectedAuthTypes[key] ?? false}
                                            onChange={() => handleAuthTypeChange(key)}
                                            disabled={
                                                !values.authTypeConfig.isAndOperation &&
                                                Object.values(selectedAuthTypes).filter(Boolean).length >= 2 &&
                                                !selectedAuthTypes[key]
                                            }
                                        />
                                    }
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {/* <img src={icon} alt={label} style={{ width: 24, height: 24 }} /> */}
                                            {label}
                                        </Box>
                                    }
                                />
                            )}
                        />
                    ))}
                </Box>
            </Box>


            <Box
                sx={{ my: 3 }}
                columnGap={3}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                }}
            >
                <Button
                    sx={{ width: '200px' }}
                    variant="contained"
                    disabled={!selectedAuthTypes.isCard}
                    onClick={() => setOpenCardDialog(true)}
                >
                    {t_user('buttons.cardSettings')}
                </Button>
            </Box>
            {openCardDialog && <CardSettings open={openCardDialog} onClose={() => setOpenCardDialog(false)} initializeState={values.authTypeConfig.initializeCard} />}
        </>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" color='primary' variant="contained" loading={isSubmitting}>
                    {t_common('button.update')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle textAlign='center'> {t_user('buttons.editConfigureType')}</DialogTitle>
            <DialogContent>
                <Grid size={{ xs: 12, md: 9 }}>
                    <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
                        <Stack spacing={5} sx={{ m: 2, maxWidth: { xs: 720, xl: 880 } }}>
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
};
