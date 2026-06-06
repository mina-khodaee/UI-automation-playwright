// src/sections/armory-equipments/view/armory-equipments-list-view.jsx

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
import { ArmoryEquipmentsNewEditForm } from '../armory-equipments-new-edit-form';
import { useGetEquipments, useDeleteEquipment } from 'src/services/armory-equipments/armory-equipments.service';
import { useGetCategories } from 'src/services/armory-categories/armory-categories.service';

export function ArmoryEquipmentsListView() {
    const { t: t_equipment } = useTranslate('armory-equipments');
    const { t: t_common, currentLang } = useTranslate();

    const [openDialog, setOpenDialog] = useState(false);
    const [currentEquipment, setCurrentEquipment] = useState(null);

    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortOrder: ''
    });

    const { data, isLoading, refetch } = useGetEquipments({
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        searchTerm: queryParams.searchTerm,
        sortColumn: queryParams.sortColumn,
        sortOrder: queryParams.sortOrder,
    });

    // گرفتن لیست دسته‌بندی‌ها برای نمایش اسم دسته در Grid
    const { data: categoriesData } = useGetCategories({ page: 1, pageSize: 100 });
    const categoriesMap = useMemo(() => {
        const map = new Map();
        (categoriesData?.items || []).forEach((cat) => {
            map.set(cat.id, cat.name);
        });
        return map;
    }, [categoriesData]);

    const allEquipments = data?.items || [];
    const totalCount = data?.totalCount || 0;

    const handleRefetch = () => refetch();

    const handleCreate = () => {
        setCurrentEquipment(null);
        setOpenDialog(true);
    };

    const deleteEquipment = useDeleteEquipment();

    const handleDeleteRow = (row) => {
        deleteEquipment.mutate(row?.id, {
            onSuccess: () => {
                toast.success(t_equipment('toastMessages.deleteSuccess'));
            },
            onError: (error) => {
                toast.error(error.message || t_common('errors.unknownError'));
            },
        });
    };

    const handleEditRow = (row) => {
        setCurrentEquipment(row);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentEquipment(null);
    };

    const handleSort = (column, direction) => {
        setQueryParams(prev => ({ ...prev, sortColumn: column, sortOrder: direction }));
    };

    const handleSearch = (searchValue) => {
        setQueryParams(prev => ({ ...prev, searchTerm: searchValue, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setQueryParams(prev => ({ ...prev, page: newPage }));
    };

    const handlePageSizeChange = (newPageSize) => {
        setQueryParams(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: t_equipment('columns.name'),
            width: 250,
        },
        {
            accessorKey: 'categoryId',
            header: t_equipment('columns.category'),
            width: 150,
            Cell: ({ cell }) => categoriesMap.get(cell.getValue()) || '-',
        },
        {
            accessorKey: 'description',
            header: t_equipment('fields.description'),
            width: 350,
        },
    ], [currentLang, t_equipment, categoriesMap]);

    return (
        <>
            <DashboardContent maxWidth="xxl">
                <CustomBreadcrumbs
                    heading={t_equipment('breadcrumb.title')}
                    action={
                        <Button
                            color="inherit"
                            onClick={handleCreate}
                            variant="contained"
                            startIcon={<HiOutlinePlus />}
                        >
                            {t_equipment('buttons.newEquipment')}
                        </Button>
                    }
                    sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
                />

                <Paper elevation={12}>
                    <Card>
                        <MRTDataTable
                            data={allEquipments}
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

            <ArmoryEquipmentsNewEditForm
                open={openDialog}
                onClose={handleCloseDialog}
                currentEquipment={currentEquipment}
                onRefetch={handleRefetch}
            />
        </>
    );
}