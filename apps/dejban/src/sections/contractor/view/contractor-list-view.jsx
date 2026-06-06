'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { IconifyLocal } from '@repo/ui/iconify-local';
import { useState, useMemo } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { MenuItem, Paper } from '@mui/material';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { fDateTime } from '@repo/ui/utils';
import { ContractorNewEditForm } from '../contractor-new-edit-form';
import { useDeleteContractor, useGetContractors } from 'src/services/contractor/contractor.service';
import { ContractorBoardOfDirectorsDialog } from 'src/sections/contractor-board-of-directors/view/contractor-board-of-directors-list-view';
import { BsPeopleFill } from 'react-icons/bs';

export function ContractorListView() {

    const { t: t_contractor } = useTranslate('contractor');
    const { t: t_common, currentLang } = useTranslate();

    const [openDialog, setOpenDialog] = useState(false);
    const [currentContractor, setCurrentContractor] = useState(null);

    const [openBoardDialog, setOpenBoardDialog] = useState(false);
    const [selectedContractorId, setSelectedContractorId] = useState(null);
    const [selectedContractorName, setSelectedContractorName] = useState('');

    // Set Query Params For Get Data Input
    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortOrder: ''
    });

    // Get Data Hook Api
    const { data, isLoading, refetch } = useGetContractors({
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        searchTerm: queryParams.searchTerm,
        sortColumn: queryParams.sortColumn,
        sortOrder: queryParams.sortOrder
    });

    const allContractor = data?.items || [];
    const totalCount = data?.totalCount || 0;


    const handleRefetch = (params) => refetch(params);

    // Open Dialog For Create Api Function
    const handleCreateUnits = () => {
        setCurrentContractor(null);
        setOpenDialog(true);
    };


    // Delete Hook Api
    const deleteContractor = useDeleteContractor();

    const handleDeleteRow = (row) => {
        deleteContractor.mutate(row?.id, {
            onSuccess: () => {
                toast.success(t_contractor('toastMessages.delete'));
            },
            onError: (error) => {
                toast.error(error.message || t_common('errors.unknownError'));
            },
        });
    };

    const handleEditRow = (row) => {
        setCurrentContractor(row);
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentContractor(null);
    };

    // Grid Events
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


    // Grid Columns
    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: t_contractor('columns.name'),
            width: 180,
        },
        {
            accessorKey: 'ceo.fullName',
            header: t_contractor('columns.ceoFullName'),
            width: 180,
        },
        {
            accessorKey: 'supervisor.fullName',
            header: t_contractor('columns.supervisorFullName'),
            width: 180,
        },
        {
            accessorKey: 'description',
            header: t_contractor('columns.description'),
            width: 180,
        },
        {
            accessorKey: 'createdAt',
            header: t_contractor('columns.createdAt'),
            width: 180,
            Cell: ({ cell }) => fDateTime(cell.getValue(), true),
        },
    ], [currentLang]);


    const customRowActions = useMemo(
        () => [
            (row) => (
                <MenuItem
                    key="view-board-members"
                    onClick={() => {
                        setSelectedContractorId(row?.id);
                        setSelectedContractorName(row?.name);
                        setOpenBoardDialog(true);
                    }}
                >
                    <IconifyLocal>
                        <BsPeopleFill size={18} style={{ color: '#876464' }} />
                    </IconifyLocal>
                    مشاهده هیئت مدیره
                </MenuItem>
            ),
        ],
        []
    );

    const handleCloseBoardDialog = () => {
        setOpenBoardDialog(false);
        setSelectedContractorId(null);
        setSelectedContractorName('');
    };


    return (
        <>
            <DashboardContent maxWidth="xxl">
                <CustomBreadcrumbs
                    heading={t_contractor('breadcrumb.contractors')}
                    action={
                        <Button
                            color="inherit"
                            onClick={handleCreateUnits}
                            variant="contained"
                            startIcon={<HiOutlinePlus />}
                        >
                            {t_contractor('breadcrumb.newContractor')}
                        </Button>
                    }
                    sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
                />

                <Paper elevation={12}>
                    <Card>
                        <MRTDataTable
                            data={allContractor}
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
                            customRowActions={customRowActions}
                        />
                    </Card>
                </Paper>
            </DashboardContent>

            <ContractorNewEditForm
                open={openDialog}
                onClose={handleCloseDialog}
                currentContractor={currentContractor}
                onRefetch={handleRefetch}
            />

            <ContractorBoardOfDirectorsDialog
                open={openBoardDialog}
                onClose={handleCloseBoardDialog}
                contractorId={selectedContractorId}
                contractorName={selectedContractorName}
            />
        </>
    );
}
