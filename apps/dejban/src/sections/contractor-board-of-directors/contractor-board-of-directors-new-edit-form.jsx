'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useCreateBoard, useGetContractors } from 'src/services/contractor/contractor.service';
import BoardMemberFields from './component/board-member';

// ----------------------------------------------------------------------

export function ContractorBoardNewEditForm({ open, onClose, onRefetch }) {
    const { t: t_common } = useTranslate();

    const createBoard = useCreateBoard();
    const { data: getContractors } = useGetContractors();
    const allContractors = getContractors?.items || [];

    const contractorOptions = allContractors?.map((s) => ({
        label: s.name,
        value: s.id,
    }));

    const BoardSchema = zod.object({
        contractorId: zod.string().min(1, 'انتخاب پیمانکار الزامی است'),
        boardMembers: zod.array(zod.any()).min(1, 'حداقل یک عضو باید وارد شود'),
    });

    const defaultValues = useMemo(
        () => ({
            contractorId: '',
            boardMembers: [
                {
                    firstName: '',
                    lastName: '',
                    fatherName: null,
                    dateOfBirth: null,
                    birthPlace: null,
                    birthCertificateCode: null,
                    birthCertificateIssuePlace: null,
                    nationalCode: '',
                    mobileNumber: '',
                    phoneNumber: null,
                    position: null,
                    educationMajor: null,
                    educationDegree: null,
                    joinDate: null,
                    sharePrecent: null,
                    leaveDate: null,
                    background: null,
                    address: null,
                },
            ],
        }),
        []
    );

    const methods = useForm({
        mode: 'all',
        // resolver: zodResolver(BoardSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createBoard.mutateAsync(data);
            toast.success('هیئت مدیره با موفقیت ایجاد شد');
            onClose();
            if (onRefetch) onRefetch();
            reset();
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'خطا در ایجاد هیئت مدیره');
        }
    });

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle textAlign="center">
                ایجاد هیئت مدیره جدید
            </DialogTitle>

            <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', p: 2 }}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ mt: 1, mb: 3 }}>
                                <Field.Select
                                    name="contractorId"
                                    label="پیمانکار"
                                    data={contractorOptions}
                                    displayExp="label"
                                    valueExp="value"
                                    size='small'
                                    sx={{ width: '50%' }}
                                />
                            </Box>

                            {/* Board Members Section */}
                            <BoardMemberFields />
                        </Grid>
                    </Grid>

                    <Stack justifyContent="flex-end" direction='row' gap={1} sx={{ mt: 3 }}>
                        <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            loading={isSubmitting}
                            size="small"
                        >
                            ایجاد
                        </Button>
                        <Button onClick={onClose} color="error" variant="contained" size="small">
                            انصراف
                        </Button>
                    </Stack>
                </Form>
            </DialogContent>
        </Dialog>
    );
}