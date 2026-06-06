import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Stack, useMediaQuery, TextField, Autocomplete, Switch, FormControlLabel } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetAccessGroups } from 'src/actions/access-group';
import { updateAccessGroupIds } from 'src/actions/device-user';

import { Form } from 'src/components/hook-form';

import AccessGroupTransferList from './device-user-transfer-list';

// ----------------------------------------------------------------------

export function QuicEditAccessGroup({ open, onClose, currentAccessGroups, userID, onMutate }) {

    const { t: t_user } = useTranslate('user');
    const { t: t_common } = useTranslate();
    const { accessGroups, accessGroupsLoading } = useGetAccessGroups();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const [selectedAccessGroupIds, setSelectedAccessGroupIds] = useState(currentAccessGroups || []);
    const transformedAccessGroups = accessGroups.map(({ id, name }) => ({ id, name }));
    const NewDeviceUserSchema = zod.object({
        accessGroupIds: zod.array(zod.coerce.number()).min(1, { message: t_user('formValidationErrors.accessGroupIds.required'), path: ['accessGroupIds'] }),
        syncWithDevicesInUserAccessGroups: zod.boolean().default(false),
    });

    const defaultValues = {
        accessGroupIds: '',
        syncWithDevicesInUserAccessGroups: false,
    };

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewDeviceUserSchema),
        defaultValues,
    });
    const {
        handleSubmit,
        setValue,
        control,
        watch,
        formState: { isSubmitting },
    } = methods;

    const values = watch();
    const onSubmit = handleSubmit(async (data) => {
        try {
            await updateAccessGroupIds({ ...data, userIDs: [userID] });
            await onMutate();
            onClose();
            toast.success(t_user('toastMessages.updateAccessGroups'));
        } catch (error) {
            toast.error(error);
        }
    });
    const onError = (errors) => {
        Object.values(errors).forEach((error) => {
            toast.error(error.message || error.root.message);
        });
    };

    const setAccessGroups = (selectedAccessGroups) => {
        const accessGroupsIds = selectedAccessGroups.map((accessGroup) => accessGroup.id);
        setValue('accessGroupIds', accessGroupsIds);
    }

    const renderProperties = () => {
        if (isMdUp) {
            return (
                accessGroupsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Button loading variant="outlined">
                            {t_common('loading')}
                        </Button>
                    </Box>
                ) : (
                    <AccessGroupTransferList
                        options={transformedAccessGroups}
                        onGet={setAccessGroups}
                        selectedAccessGroups={currentAccessGroups || []}
                    />
                )
            );
        }

        return (
            <Controller
                name="accessGroupIds"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                        {...field}
                        multiple
                        options={accessGroups || []}
                        getOptionLabel={(option) => option.name || ''}
                        onChange={(event, newValue) => {
                            const accessGroupsIds = newValue.map((group) => group.id);
                            setValue('accessGroupIds', accessGroupsIds);
                            setSelectedAccessGroupIds(newValue);
                        }}
                        limitTags={2}
                        value={selectedAccessGroupIds}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_user('formsInputs.accessGroupIds')}
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                )}
            />
        );
    };

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting} disabled={values.accessGroupIds.length === 0}>
                    {t_common('button.update')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle textAlign='center'> {t_user('buttons.editAccessGroups')}</DialogTitle>
            <DialogContent>
                <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
                    <Stack spacing={5} sx={{ m: 2 }}>
                        {renderProperties()}
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
                                    sx={{ mt: 3 }}
                                />
                            )}
                        />
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
