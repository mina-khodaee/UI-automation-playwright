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
import { fDateTime, convertEnToFa } from '@repo/ui/utils';
import { VehicleMaintenanceNewEditForm } from '../vehicle-maintenance-new-edit-form';
import { useDeleteMaintenance, useGetMaintenance } from 'src/services/maintenance/maintenance.service';

export function VehicleMaintenanceListView() {

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

    const { data, isLoading, refetch } = useGetMaintenance({
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

    const deleteMaintenance = useDeleteMaintenance();

    const handleDeleteRow = (row) => {
        deleteMaintenance.mutate(row?.id, {
            onSuccess: () => {
                toast.success(t_empType('toastMessages.deleteMaintenance'));
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
    const vehicleStatusMap = {
        0: 'فعال',
        1: 'غیرفعال',
        2: 'در تعمیر',
        3: 'در حال استفاده',
        4: 'خراب',
        5: 'فروخته شده',
    };

    const columns = useMemo(() => [
        {
            accessorFn: (row) => row.vehicleInfo?.model,
            id: 'vehicleType',
            header: 'نوع خودرو',
            size: 150,
        },
        {
            accessorFn: (row) => row.vehicleInfo?.plateNumber,
            id: 'plateNumber',
            header: 'پلاک خودرو',
            size: 150,
            Cell: ({ cell }) => {
                const plateValue = cell.getValue();
                if (!plateValue) return '-';

                const faPlate = convertEnToFa(plateValue);
                const hasLetter = /[آ-ی]/g.test(faPlate);

                if (faPlate.length === 8 && hasLetter) {
                    const part1 = faPlate.substring(0, 2);
                    const letter = faPlate.substring(2, 3);
                    const part2 = faPlate.substring(3, 6);
                    const part3 = faPlate.substring(6, 8);

                    return (
                        <span style={{
                            direction: 'ltr',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>
                            <span>{part1}</span>
                            <span>({letter})</span>
                            <span>{part2}</span>
                            <span>{part3}</span>
                        </span>
                    );
                }
                return (
                    <span style={{ direction: 'ltr', display: 'inline-block' }}>
                        {faPlate}
                    </span>
                );
            },
        },
        {
            accessorKey: 'maintenanceType',
            header: 'نوع سرویس',
            size: 150,
        },
        {
            accessorKey: 'mileage',
            header: 'کیلومتر سرویس',
            size: 150,
        },
        {
            accessorKey: 'cost',
            header: 'هزینه',
            size: 150,
            Cell: ({ cell }) =>
                cell.getValue()?.toLocaleString('fa-IR') + ' ریال',
        },
        {
            accessorKey: 'provider',
            header: 'ارائه‌دهنده',
            size: 150,
        },
        {
            accessorKey: 'statusAfter',
            header: 'وضعیت بعد از سرویس',
            size: 180,
            Cell: ({ cell }) => {
                const value = cell.getValue();

                return (
                    <Chip
                        label={vehicleStatusMap[value] || '-'}
                        variant="outlined"
                        size="small"
                    />
                );
            },
        },
        {
            accessorKey: 'maintenanceDate',
            header: 'تاریخ سرویس',
            size: 180,
            Cell: ({ cell }) => fDateTime(cell.getValue(), true),
        },
    ], [currentLang]);

    return (
        <>
            <DashboardContent maxWidth="xxl">
                <CustomBreadcrumbs
                    heading='تعمیرات و نگهداری خودرو‌ها'
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

            <VehicleMaintenanceNewEditForm
                open={openDialog}
                onClose={handleCloseDialog}
                currentData={currentData}
                onRefetch={handleRefetch}
            />
        </>
    );
}
