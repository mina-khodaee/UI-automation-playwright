import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Stack, TextField, Autocomplete, Switch, FormControlLabel } from '@mui/material';

import { useTranslate } from 'src/locales';
import { getUserTypes, quickCreateDeviceUser } from 'src/actions/device-user';
import { useApplicationUserActions } from 'src/stores/application-user-actions-store';

import { Field, Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function QuickCreateDeviceUser({ open, onClose, onMutate }) {

    const getApplicationUsers = useApplicationUserActions((state) => state.getApplicationUsers);
    const { t: t_user } = useTranslate('user');
    const { t: t_common, currentLang } = useTranslate();

    const [applicationUsers, setApplicationUsers] = useState([]);
    const [applicationUsersLoading, setApplicationUsersLoading] = useState(false);
    const [userTypes, setUserTypes] = useState([]);
    const [userTypesLoading, setUserTypesLoading] = useState(false);

    const NewDeviceUserSchema = zod.object({
        userID: zod.coerce.number({ message: t_user('formValidationErrors.userId.number') }).int().min(1, { message: t_user('formValidationErrors.userId.required') }),
        uniqueID: zod.string().nullable().transform(value => value === "" ? null : value),
        syncWithDevicesInUserAccessGroups: zod.boolean().default(false),
        userName: zod.string().min(1, { message: t_user('formValidationErrors.userName.required') }),
        password: zod.string().min(1, { message: t_user('formValidationErrors.password.required') }),
        userType: zod.string().min(1, { message: t_user('formValidationErrors.userType.required') }),
        isAdmin: zod.boolean().default(false),
        applicationUserId: zod.string().nullable().transform(value => value === "" ? null : value),
    });

    const defaultValues = {
        userName: '',
        userID: '',
        password: '',
        userType: '',
        isAmin: false,
        applicationUserId: '',
        syncWithDevicesInUserAccessGroups: false,
        uniqueID: ''
    };

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewDeviceUserSchema),
        defaultValues,
    });
    const {
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            console.log(data);
            await quickCreateDeviceUser(data);
            await onMutate();
            onClose();
            toast.success(t_user('toastMessages.createDeviceUser'));
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
                    md: 'repeat(2, 1fr)'
                }}
            >
                <Field.Text
                    inputProps={{ type: 'number' }}
                    name="userID" label={t_user('formsInputs.userId')} />

                <Field.Text
                    inputProps={{ type: 'text' }}
                    name="userName" label={t_user('formsInputs.userName')} />
                <Controller
                    name="userType"
                    control={control}
                    rules={{ required: t_user('formValidationErrors.userType.required') }}
                    render={({ field, fieldState }) => (
                        <Autocomplete
                            {...field}
                            fullWidth
                            options={userTypes}
                            getOptionLabel={(option) => option.displayValues[currentLang.value]}
                            onChange={(event, newValue) => {
                                field.onChange(newValue ? newValue.value : null);
                            }}
                            onBlur={() => {
                                field.onBlur();
                                if (!field.value) {
                                    setValue("userType", "", { shouldValidate: true });
                                }
                            }}
                            onFocus={async () => {
                                if (userTypes.length <= 1) {
                                    try {
                                        setUserTypesLoading(true);
                                        const result = await getUserTypes();
                                        setUserTypes(result || []);
                                    } catch (error) {
                                        console.error("Error fetching user types:", error);
                                    } finally {
                                        setUserTypesLoading(false);
                                    }
                                }
                            }}
                            value={userTypes?.find((item) => item.value === field.value) || null}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            disableClearable
                            loading={userTypesLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t_user('formsInputs.userType')}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error ? fieldState.error.message : ''}
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    name="applicationUserId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Autocomplete
                            {...field}
                            fullWidth
                            options={applicationUsers}
                            getOptionLabel={(option) => option.fullName || option.userName}
                            onChange={(event, newValue) => {
                                field.onChange(newValue ? newValue.id : null);
                            }}
                            onFocus={async () => {
                                if (applicationUsers.length <= 1) {
                                    try {
                                        setApplicationUsersLoading(true);
                                        const pageSize = 100;
                                        const result = await getApplicationUsers(pageSize);
                                        setApplicationUsers(result || []);
                                    } catch (error) {
                                        console.error("Error fetching application Users:", error);
                                    } finally {
                                        setApplicationUsersLoading(false);
                                    }
                                }

                            }}
                            value={applicationUsers?.find((item) => item.id === field.value) || null}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            loading={applicationUsersLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t_user('formsInputs.applicationUserId')}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error ? fieldState.error.message : ''}
                                />
                            )}
                        />
                    )}
                />
                <Field.Text
                    inputProps={{ type: 'number' }}
                    name="uniqueID" label={t_user('formsInputs.uniqueId')} />
                <Field.Text
                    inputProps={{ type: 'text' }}
                    name="password" label={t_user('formsInputs.password')} />
                <Controller
                    name="isAdmin"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={Boolean(field.value)}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            }
                            label={t_user('formsInputs.isAdmin')}
                        />
                    )}
                />
            </Box>
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
        </>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {t_user('buttons.createDeviceUser')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle textAlign='center'> {t_user('buttons.quickAddNewDeviceUser')}</DialogTitle>
            <DialogContent>
                <Form methods={methods} onSubmit={(e) => {
                    e.stopPropagation();
                    onSubmit(e);
                }}>
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
