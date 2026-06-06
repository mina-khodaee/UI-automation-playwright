'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useDeleteMajor, useGetMajors } from 'src/services/majors/majors.service';
import { MoneySupplyNewEditForm } from '../money-supply-new-edit-form';

export function MoneySupplyListView() {

    const { t: t_majors } = useTranslate('major');
    const { t: t_common, currentLang } = useTranslate();

    const [openDialog, setOpenDialog] = useState(false);
    const [currentData, setCurrentData] = useState(null);


    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortOrder: ''
    })

    const { data, isLoading, refetch } = useGetMajors({
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        searchTerm: queryParams.searchTerm,
        sortColumn: queryParams.sortColumn,
        sortOrder: queryParams.sortOrder,
    });

    const mockData = [
    {
        id: 1,
        route: 'مسیر تهران - مشهد',
        vehicleType: 'ون تویوتا',
        escortOperation: 'مسلحانه',
        amount: '۵۰۰,۰۰۰,۰۰۰',
        currencyType: 'ریال',
        coinBagCount: 2,
        bagCount: 5,
        deliveryPersonnelName: 'علی محمدی',
        helperPersonnelName: 'رضا کریمی',
        requesterPersonnelName: 'حسن احمدی',
        contractorName: 'مرکز اصلی تهران',
        description: 'ارسال وجه به صورت اضطراری',
    },
    {
        id: 2,
        route: 'مسیر اصفهان - شیراز',
        vehicleType: 'نیسان',
        escortOperation: 'غیرمسلحانه',
        amount: '۱۲۰,۰۰۰,۰۰۰',
        currencyType: 'ریال',
        coinBagCount: 0,
        bagCount: 2,
        deliveryPersonnelName: 'محمد رضایی',
        helperPersonnelName: null,
        requesterPersonnelName: 'سارا نوری',
        contractorName: 'شعبه اصفهان',
        description: 'حواله عادی',
    },
    {
        id: 3,
        route: 'مسیر داخلی بانک',
        vehicleType: 'برقی',
        escortOperation: 'بدون اسکورت',
        amount: '۵۰,۰۰۰,۰۰۰',
        currencyType: 'دلار',
        coinBagCount: 1,
        bagCount: 1,
        deliveryPersonnelName: 'کیانوش رستمی',
        helperPersonnelName: 'امیر حسینی',
        requesterPersonnelName: 'مینا شریفی',
        contractorName: 'مرکز تبادل ارز',
        description: '',
    },
];

    const allData = data?.items || [];
    const totalCount = data?.totalCount || 0;

    const handleRefetch = () => refetch();

    // ========================
    // CRUD Handlers
    // ========================
    const handleCreateUnits = () => {
        setCurrentData(null);
        setOpenDialog(true);
    };


    const deleteMajor = useDeleteMajor();

    const handleDeleteRow = (async (row) => {
        deleteMajor.mutate(row?.id, {
            onSuccess: () => {
                toast.success(t_majors('toastMessages.deleteMajors'));
            },
            onError: (error) => {
                toast.error(error.message || t_common('errors.unknownError'));
            },
        });
    });


    const handleEditRow = (row) => {
        setCurrentData(row);
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentData(null);
    };

    // ========================
    // Grid Events
    // ========================
    const handleSort = (column, direction) => {
        setSortColumnQuery(column);
        setSortOrderQuery(direction);
    };

    const handleSearch = (searchValue) => {
        setSearchQuery(searchValue);
    };

    const handlePageChange = (newPage) => {
        setPageQuery(newPage);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSizeQuery(newPageSize);
    };


    // ========================
    // Columns
    // ========================
    const columns = useMemo(() => [
        {
            accessorKey: 'route',
            header: 'مسیر',
            width: 150,
        },
        {
            accessorKey: 'vehicleType',
            header: 'نوع خودرو',
            width: 120,
        },
        {
            accessorKey: 'escortOperation',
            header: 'عملیات اسکورت',
            width: 120,
        },
        {
            accessorKey: 'amount',
            header: 'مبلغ',
            width: 120,
        },
        {
            accessorKey: 'currencyType',
            header: 'نوع ارز',
            width: 100,
        },
        {
            accessorKey: 'coinBagCount',
            header: 'تعداد کیسه سکه',
            width: 120,
        },
        {
            accessorKey: 'bagCount',
            header: 'تعداد کیسه',
            width: 100,
        },
        {
            accessorKey: 'deliveryPersonnelName',
            header: 'تحویل دار',
            width: 120,
        },
        {
            accessorKey: 'helperPersonnelName',
            header: 'کمک تحویل دار',
            width: 120,
        },
        {
            accessorKey: 'requesterPersonnelName',
            header: 'درخواست دهنده',
            width: 120,
        },
        {
            accessorKey: 'contractorName',
            header: 'مرکز',
            width: 120,
        },
        {
            accessorKey: 'description',
            header: 'توضیحات',
            width: 200,
        },
    ], [currentLang]);


    return (
        <>
            <DashboardContent maxWidth="xxl">
                <CustomBreadcrumbs
                    heading='عملیات پولرسانی'
                    action={
                        <Button
                            color="inherit"
                            onClick={handleCreateUnits}
                            variant="contained"
                            startIcon={<HiOutlinePlus />}
                        >
                            جدید
                        </Button>
                    }
                    sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
                />

                <Paper elevation={12}>
                    <Card>
                        <MRTDataTable
                            data={mockData}
                            columns={columns}
                            isLoading={isLoading}
                            rowCount={totalCount}
                            setQueryParams={setQueryParams}
                            refetchMethod={handleRefetch}
                            page={queryParams.page}
                            pageSize={queryParams.pageSize}
                            onSort={handleSort}
                            onSearch={handleSearch}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            onDelete={handleDeleteRow}
                            onEdit={handleEditRow}
                        />
                    </Card>
                </Paper>
            </DashboardContent>

            <MoneySupplyNewEditForm
                open={openDialog}
                onClose={handleCloseDialog}
                currentData={currentData}
                onRefetch={handleRefetch}
            />
        </>
    );
}
