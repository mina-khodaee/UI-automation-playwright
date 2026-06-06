'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Chip, Paper } from '@mui/material';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { VehicleEquipmentsNewEditForm } from '../vehicle-equipments-new-edit-form';
import { useDeleteEquipment, useGetEquipment } from 'src/services/equipment/equipment.service';

export function VehicleEquipmentsListView() {

    const { t: t_empType } = useTranslate('employment-type');
    const { t: t_common, currentLang } = useTranslate();

    const [openDialog, setOpenDialog] = useState(false);
    const [currentData, setCurrentData] = useState(null);

    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortOrder: ''
    });

    const { data, isLoading, refetch } = useGetEquipment({
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        searchTerm: queryParams.searchTerm,
        sortColumn: queryParams.sortColumn,
        sortOrder: queryParams.sortOrder
    });

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

    const deleteEquipment = useDeleteEquipment();

    const handleDeleteRow = (row) => {
        deleteEquipment.mutate(row?.id, {
            onSuccess: () => {
                toast.success(t_empType('toastMessages.deleteEmpType'));
            },
            onError: (error) => {
                toast.error(error.message || t_common('errors.unknownError'));
            },
        });
    };

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
            accessorKey: 'equipmentName',
            header: 'نوع تجهیزات',
            size: 150,
        },
        {
            accessorKey: 'equipmentType',
            header: 'نام تجهیزات',
            size: 150,
        },
        {
            accessorKey: 'serialNumber',
            header: 'شماره سریال',
            size: 150,
        },

        // 👇 اطلاعات ماشین
        {
            accessorFn: (row) => row.vehicleInfo?.plateNumber,
            id: 'plateNumber',
            header: 'پلاک',
            size: 150,
        },
        {
            accessorFn: (row) => row.vehicleInfo?.model,
            id: 'model',
            header: 'مدل',
            size: 150,
        },
        {
            accessorFn: (row) => row.vehicleInfo?.color,
            id: 'color',
            header: 'رنگ',
            size: 120,
        },
        {
            accessorKey: 'status',
            header: 'وضعیت',
            size: 120,
            Cell: ({ cell }) => {
                const value = cell.getValue();

                return (
                    <Chip
                        label={value === 1 ? 'نصب شده' : 'انبار'}
                        variant="outlined"
                        size="small"
                    />
                );
            },
        }


    ], [currentLang]);


    return (
        <>
            <DashboardContent maxWidth="xxl">
                <CustomBreadcrumbs
                    heading='تجهیزات خودرو'
                    action={
                        <Button
                            color="inherit"
                            onClick={handleCreateUnits}
                            variant="contained"
                            startIcon={<HiOutlinePlus />}
                        >
                            تجهیزات جدید
                        </Button>
                    }
                    sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
                />

                <Paper elevation={12}>
                    <Card>
                        <MRTDataTable
                            data={allData}
                            columns={columns}
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

            <VehicleEquipmentsNewEditForm
                open={openDialog}
                onClose={handleCloseDialog}
                currentData={currentData}
                onRefetch={handleRefetch}
            />
        </>
    );
}
