// src/sections/doors/view/doors-list-view.jsx

'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { TbDoor } from 'react-icons/tb';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Paper, Chip } from '@mui/material';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DoorsNewEditForm } from '../doors-new-edit-form';
import { useGetDoors, useDeleteDoor } from 'src/services/doors/doors.service';

export function DoorsListView() {
    const { t: t_doors } = useTranslate('doors');
    const { t: t_common, currentLang } = useTranslate();

    const [openDialog, setOpenDialog] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortOrder: ''
    });

    const { data, isLoading, refetch } = useGetDoors({
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        searchTerm: queryParams.searchTerm,
        sortColumn: queryParams.sortColumn,
        sortOrder: queryParams.sortOrder,
    });

    const allItems = data?.items || [];
    const totalCount = data?.totalCount || 0;

    const handleRefetch = () => refetch();

    const handleCreate = () => {
        setCurrentItem(null);
        setOpenDialog(true);
    };

    const deleteItem = useDeleteDoor();

    const handleDeleteRow = (row) => {
        deleteItem.mutate(row?.id, {
            onSuccess: () => {
                toast.success(t_doors('toastMessages.deleteSuccess'));
            },
            onError: (error) => {
                toast.error(error.message || t_common('errors.unknownError'));
            },
        });
    };

    const handleEditRow = (row) => {
        setCurrentItem(row);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentItem(null);
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
            accessorKey: 'doorName',
            header: t_doors('columns.doorName'),
            width: 200,
        },
        {
            accessorKey: 'site',
            header: t_doors('columns.site'),
            width: 200,
            Cell: ({ cell }) => cell.getValue()?.name || '-',
        },
        {
            accessorKey: 'unit',
            header: t_doors('columns.unit'),
            width: 200,
            Cell: ({ cell }) => cell.getValue()?.name || '-',
        },
        {
            accessorKey: 'isActive',
            header: t_common('formsInputs.status'),
            width: 100,
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue() ? t_common('status.active') : t_common('status.inactive')}
                    color={cell.getValue() ? 'success' : 'error'}
                    size="small"
                />
            ),
        },
    ], [currentLang, t_doors, t_common]);

    return (
        <>
            <DashboardContent maxWidth="xxl">
                <CustomBreadcrumbs
                    heading={t_doors('breadcrumb.title')}
                    icon={<TbDoor size={22} />}
                    action={
                        <Button
                            color="inherit"
                            onClick={handleCreate}
                            variant="contained"
                            startIcon={<HiOutlinePlus />}
                        >
                            {t_doors('buttons.newDoor')}
                        </Button>
                    }
                    sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
                />

                <Paper elevation={12}>
                    <Card>
                        <MRTDataTable
                            data={allItems}
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

            <DoorsNewEditForm
                open={openDialog}
                onClose={handleCloseDialog}
                currentItem={currentItem}
                onRefetch={handleRefetch}
            />
        </>
    );
}