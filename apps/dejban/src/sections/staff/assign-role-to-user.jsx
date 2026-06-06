import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { Form, Field } from 'src/components/hook-form';
import { Autocomplete, Chip, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useAssignRoleToUser, useGetUserRoleById } from 'src/services/staff/staff.service';
import { useTranslate } from 'src/locales';
import { useEffect } from 'react';
import { useGetRolesWithOutPagination } from 'src/services/roleManagement/roleManagement.service';
import { skipToken } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export function AssignRoleToUserNewEditForm({ open, onClose, currentUserId, onRefetch, currentStaff }) {

    const assignRoleToUser = useAssignRoleToUser();

    const { data: getRoles } = useGetRolesWithOutPagination();
    const allRole = getRoles?.items || [];

    const roleOptions = allRole?.map((r) => ({
        label: r.name,
        value: r.id,
    }));

    const defaultValues = useMemo(
        () => ({
            roleIds: currentUserId?.personnelCode || [],
        }),
        []
    );

    const userId = currentUserId
        ? currentUserId
        : skipToken;

    const { data: getUserRole } = useGetUserRoleById(userId)


    const methods = useForm({
        mode: 'onSubmit',
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;


    const onSubmit = handleSubmit(async (data) => {
        try {

            const obj = {
                roleIds: data?.roleIds,
                userId: currentUserId
            }

            await assignRoleToUser.mutateAsync(obj);
            reset();
            onClose();

        } catch (error) {

        }
    });

    useEffect(() => {
        if (open && getUserRole) {
            const roleIds = Array.isArray(getUserRole.items)
                ? getUserRole.items.map(r => r.id)
                : [];

            reset({
                roleIds,
            });
        }
    }, [open, getUserRole, reset]);



    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle textAlign='center'>
                اعطای نقش به {currentStaff?.firstName + ' ' + currentStaff?.lastName}
            </DialogTitle>

            <DialogContent>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 12 }}>
                            <Card sx={{ p: 2 }}>

                                <Controller
                                    name="roleIds"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => {
                                        const selectedRoles = roleOptions.filter(r =>
                                            field.value?.includes(r.value)
                                        );

                                        return (
                                            <Autocomplete
                                                multiple
                                                options={roleOptions}
                                                value={selectedRoles}
                                                getOptionLabel={(option) => option.label}
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                                onChange={(event, newValue) => {
                                                    const ids = newValue.map(r => r.value);
                                                    field.onChange(ids);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="نقش‌ها"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        size="small"
                                                    />
                                                )}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            {...getTagProps({ index })}
                                                            key={option.value}
                                                            label={option.label}
                                                            size="small"
                                                        />
                                                    ))
                                                }
                                            />
                                        );
                                    }}
                                />


                                <Stack alignItems="flex-start" direction='row' gap={1} sx={{ mt: 3 }}>
                                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} size='small'>
                                        ثبت
                                    </LoadingButton>
                                    <LoadingButton onClick={onClose} color="error" variant="contained" size="small">
                                        انصراف
                                    </LoadingButton>
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
