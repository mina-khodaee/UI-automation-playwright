'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslate } from 'src/locales';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { fDateTime } from '@repo/ui/utils';
import { ContractorBoardNewEditForm } from '../contractor-board-of-directors-new-edit-form';
import { useGetContractorById } from 'src/services/contractor/contractor.service';

export function ContractorBoardOfDirectorsDialog({ open, onClose, contractorId, contractorName }) {

    const { currentLang } = useTranslate();

    const [openDialog, setOpenDialog] = useState(false);
    const [currentBoardOfDirectors, setCurrentBoardOfDirectors] = useState(null);

    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortOrder: ''
    });

    const { data: contractorData, isLoading, refetch } = useGetContractorById(
        open ? contractorId : null
    );

    const responseData = contractorData?.data || contractorData;
    const allBoardMembers = responseData?.boardMembers || [];
    const totalCount = allBoardMembers.length;

    const handleRefetch = () => refetch();

    // ========================
    // CRUD Handlers
    // ========================
    const handleCreateUnits = () => {
        setCurrentBoardOfDirectors(null);
        setOpenDialog(true);
    };

    const handleDeleteRow = (row) => {
        // TODO: Add delete API call
        toast.success('حذف با موفقیت انجام شد');
        refetch();
    };

    const handleEditRow = (row) => {
        setCurrentBoardOfDirectors(row);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentBoardOfDirectors(null);
    };

    // ========================
    // Grid Events
    // ========================
    const handleSort = (column, direction) => {
        setQueryParams(prev => ({
            ...prev,
            sortColumn: column,
            sortOrder: direction
        }));
    };

    const handleSearch = (searchValue) => {
        setQueryParams(prev => ({
            ...prev,
            searchTerm: searchValue,
            page: 1
        }));
    };

    const handlePageChange = (newPage) => {
        setQueryParams(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handlePageSizeChange = (newPageSize) => {
        setQueryParams(prev => ({
            ...prev,
            pageSize: newPageSize,
            page: 1
        }));
    };

    // ========================
    // Columns
    // ========================
    const columns = useMemo(() => [
        {
            accessorKey: 'firstName',
            header: 'نام',
            width: 150,
        },
        {
            accessorKey: 'lastName',
            header: 'نام خانوادگی',
            width: 150,
        },
        {
            accessorKey: 'fatherName',
            header: 'نام پدر',
            width: 150,
        },
        {
            accessorKey: 'nationalCode',
            header: 'کد ملی',
            width: 130,
        },
        {
            accessorKey: 'mobileNumber',
            header: 'شماره موبایل',
            width: 150,
        },
        {
            accessorKey: 'phoneNumber',
            header: 'شماره تلفن',
            width: 150,
        },
        {
            accessorKey: 'dateOfBirth',
            header: 'تاریخ تولد',
            width: 150,
            Cell: ({ cell }) => fDateTime(cell.getValue(), true),
        },
        {
            accessorKey: 'birthPlace',
            header: 'محل تولد',
            width: 150,
        },
        {
            accessorKey: 'birthCertificateCode',
            header: 'شماره شناسنامه',
            width: 150,
        },
        {
            accessorKey: 'birthCertificateIssuePlace',
            header: 'محل صدور',
            width: 150,
        },
        {
            accessorKey: 'position',
            header: 'سمت',
            width: 150,
        },
        {
            accessorKey: 'educationMajor',
            header: 'رشته تحصیلی',
            width: 150,
        },
        {
            accessorKey: 'educationDegree',
            header: 'مدرک تحصیلی',
            width: 150,
        },
        {
            accessorKey: 'joinDate',
            header: 'تاریخ عضویت',
            width: 150,
            Cell: ({ cell }) => fDateTime(cell.getValue(), true),
        },
        {
            accessorKey: 'leaveDate',
            header: 'تاریخ خروج',
            width: 150,
            Cell: ({ cell }) => fDateTime(cell.getValue(), true),
        },
        {
            accessorKey: 'sharePrecent',
            header: 'درصد سهام',
            width: 120,
            Cell: ({ cell }) => `${cell.getValue()}%`,
        },
        {
            accessorKey: 'address',
            header: 'آدرس',
            width: 200,
        },
        {
            accessorKey: 'background',
            header: 'سوابق',
            width: 200,
        },
        {
            accessorKey: 'createdAt',
            header: 'تاریخ ایجاد',
            width: 150,
            Cell: ({ cell }) => fDateTime(cell.getValue(), true),
        },
    ], [currentLang]);

    return (
        <>
            <Dialog 
                open={open} 
                onClose={onClose}
                maxWidth="xl"
                fullWidth
                PaperProps={{
                    sx: { minHeight: '50vh' }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                        هیئت مدیره {contractorName}
                    </span>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Button
                        color="inherit"
                        onClick={handleCreateUnits}
                        variant="contained"
                        startIcon={<HiOutlinePlus />}
                        sx={{ mb: 4, mt: 4 }}
                    >
                        ایجاد هیئت مدیره جدید
                    </Button>

                    <Paper elevation={12}>
                        <Card>
                            <MRTDataTable
                                data={allBoardMembers}
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
                </DialogContent>
            </Dialog>

            <ContractorBoardNewEditForm
                open={openDialog}
                onClose={handleCloseDialog}
                currentBoardOfDirectors={currentBoardOfDirectors}
                onRefetch={handleRefetch}
                contractorId={contractorId}
            />
        </>
    );
}