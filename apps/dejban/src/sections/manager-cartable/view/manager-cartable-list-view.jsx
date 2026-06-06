'use client'

import { toast } from 'sonner';
import React, { useMemo } from 'react';
import { IconifyLocal } from '@repo/ui/iconify-local';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { Card, Button, MenuItem } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTranslate } from 'src/locales';
import { useApproveRequest, useDenyRequest, useGetManagerRequests } from 'src/services/requests/requests.service';
import { useApproveSchedule, useDenySchedule, useGetManagerSchedules } from 'src/services/visitSchedules/visitSchedules.service';
import { MRTDataTable } from '@repo/ui/mrt-table';

// ----------------------------------------------------------------------

export default function ManagerInboxView() {
    const { t } = useTranslate();
    const queryClient = useQueryClient();


    const { data: requestsData, isLoading: isLoadingRequests } = useGetManagerRequests({
        page: 1,
        pageSize: 100,
    });

    const { data: schedulesData, isLoading: isLoadingSchedules } = useGetManagerSchedules({
        page: 1,
        pageSize: 100,
    });

   
    const approveRequestMutation = useApproveRequest();
    const denyRequestMutation = useDenyRequest();
    const approveScheduleMutation = useApproveSchedule();
    const denyScheduleMutation = useDenySchedule();

    // 4. ترکیب کردن داده‌ها (Merge Data)
    const combinedData = useMemo(() => {
        const items = [];

        // اضافه کردن داده‌های درخواست‌ها با یک تگ برای تشخیص نوع
        if (requestsData?.items) {
            requestsData.items.forEach((item) => {
                items.push({
                    ...item,
                    _sourceType: 'request', // فیلد کمکی برای تشخیص
                    _displayDate: item.createdAt, // استانداردسازی نام فیلدها برای نمایش در گرید
                    _title: `درخواست شماره ${item.id || ''}`,
                });
            });
        }

        // اضافه کردن داده‌های زمان‌بندی‌ها
        if (schedulesData?.items) {
            schedulesData.items.forEach((item) => {
                items.push({
                    ...item,
                    _sourceType: 'schedule', // فیلد کمکی برای تشخیص
                    _displayDate: item.visitDate || item.createdAt, // فرض بر نام فیلد
                    _title: `ویزیت ${item.patientName || ''}`,
                });
            });
        }

        return items;
    }, [requestsData, schedulesData]);

 

    const columns = useMemo(
        () => [
            {
                accessorKey: '_sourceType',
                header: 'نوع',
                size: 100,
                Cell: ({ renderedCellValue }) => (
                    <span style={{
                        color: renderedCellValue === 'request' ? 'blue' : 'green',
                        fontWeight: 'bold'
                    }}>
                        {renderedCellValue === 'request' ? 'درخواست' : 'زمان‌بندی'}
                    </span>
                ),
            },
            {
                accessorKey: '_title',
                header: 'عنوان / توضیحات',
                size: 250,
            },
            {
                accessorKey: '_displayDate',
                header: 'تاریخ',
                size: 150,
                Cell: ({ cell }) => cell.getValue(),
            },
        ],
        []
    );

    // handle approve and deny
    const handleApprove = (row) => {
        const id = row.original.id;
        const type = row.original._sourceType;

        if (type === 'request') {
            approveRequestMutation.mutate(id, {
                onSuccess: () => toast.success('درخواست با موفقیت تایید شد'),
                onError: (err) => toast.error(err.message),
            });
        } else if (type === 'schedule') {
            approveScheduleMutation.mutate(id, {
                onSuccess: () => toast.success('زمان‌بندی با موفقیت تایید شد'),
                onError: (err) => toast.error(err.message),
            });
        }
    };

    const handleDeny = (row) => {
        const id = row.original.id;
        const type = row.original._sourceType;

        if (type === 'request') {
            denyRequestMutation.mutate(id, {
                onSuccess: () => toast.success('درخواست رد شد'),
                onError: (err) => toast.error(err.message),
            });
        } else if (type === 'schedule') {
            denyScheduleMutation.mutate(id, {
                onSuccess: () => toast.success('زمان‌بندی رد شد'),
                onError: (err) => toast.error(err.message),
            });
        }
    };

    // custom action cell row
    const customRowActions = useMemo(
        () => [
            (row) => (
                <MenuItem onClick={() => handleApprove(row)}>
                    <IconifyLocal icon="solar:check-circle-bold" width={16} sx={{ mr: 1 }} />
                    تایید
                </MenuItem>
            ),
            (row) => (
                <MenuItem onClick={() => handleDeny(row)} sx={{ color: 'error.main' }}>
                    <IconifyLocal icon="solar:cancel-circle-bold" width={16} sx={{ mr: 1 }} />
                    رد
                </MenuItem>
            ),
        ],
        []
    );

    return (
        <>
            <DashboardContent maxWidth="xl">
                <CustomBreadcrumbs
                    heading="کارتابل مدیریتی"
                    action={
                        <Button variant="contained" onClick={() => queryClient.invalidateQueries()}>
                            بروزرسانی
                        </Button>
                    }
                    sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
                />

                <Card>
                    <MRTDataTable
                        data={combinedData}
                        columns={columns}
                        rowCount={combinedData.length} // یا مجموع totalCount ها اگر پیجینیشن سمت سرور دارید
                        isLoading={isLoadingRequests || isLoadingSchedules}
                        // سایر پراپ‌های گرید مثل state، onSortingChange و غیره را طبق نیاز اضافه کنید
                        customRowActions={customRowActions}
                        // enablePagination={true} // اگر پیجینیشن سمت کلاینت می‌خواهید
                    />
                </Card>
            </DashboardContent>
        </>
    );
}
