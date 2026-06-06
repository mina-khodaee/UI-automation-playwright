import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { Field, Form } from 'src/components/hook-form';
import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useChangeUserNameAndPasswordByAdmin, useGetUserById } from 'src/services/staff/staff.service';
import { useEffect } from 'react';
import { skipToken } from '@tanstack/react-query';
import { SlClose } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";
// ----------------------------------------------------------------------

export function UserChangePasswordEditForm({ open, onClose, currentUserId, onRefetch }) {

    const changePasswordAndUserName = useChangeUserNameAndPasswordByAdmin();
    

    const queryEnabled = open && !!currentUserId;
    const { data: getUserData, isLoading, isError } = useGetUserById(
        queryEnabled ? currentUserId : skipToken,
        {
            enabled: queryEnabled
        }
    );

    const defaultValues = useMemo(
        () => ({
            userName: getUserData?.userName || '',
            password: '',
        }),
        [getUserData]
    );

    const methods = useForm({
        mode: 'onSubmit',
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;


    const onSubmit = handleSubmit(async (data) => {
        try {

            const obj = {
                id: currentUserId,
                userName: data?.userName,
                password: data?.password,
            }

            await changePasswordAndUserName.mutateAsync(obj);
            reset();
            onClose();

        } catch (error) {

        }
    });


    useEffect(() => {
        if (open && getUserData) {
            reset({
                userName: getUserData?.userName || '',
                password: '',
            });
        }
    }, [open, getUserData, reset]);



    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle textAlign='center'>
                تغییر نام کاربری / رمز عبور
            </DialogTitle>

            <DialogContent>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 12 }}>

                            <Card sx={{ p: 2 }}>
                                <Stack spacing={1} sx={{ mb: 3 }}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            نام و نام خانوادگی:
                                        </Typography>
                                        <Typography variant="body2">
                                            {getUserData?.fullName || '-'}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            نام کاربری:
                                        </Typography>
                                        <Typography variant="body2">
                                            {getUserData?.userName || '-'}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            کد ملی:
                                        </Typography>
                                        <Typography variant="body2">
                                            {getUserData?.nationalCode || '-'}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            فعال:
                                        </Typography>
                                        <Typography variant="body2">
                                            {getUserData?.isActive ? <FaRegCheckCircle size={20} /> : <SlClose size={20} /> || '-'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Card>

                            <Card sx={{ p: 2 }}>

                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(1, 1fr)',
                                        md: 'repeat(1, 1fr)',
                                    }}
                                    sx={{ mt: 1 }}
                                >
                                    <Field.Text name="userName" label='نام کاربری' type="text" size='small' />

                                    <Field.Text name="password" label='رمز عبور' size='small' />
                                </Box>

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