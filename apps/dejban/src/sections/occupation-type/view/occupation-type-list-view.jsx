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
import { fDateTime } from '@repo/ui/utils';
import { OccupationTypeNewEditForm } from '../occupation-type-new-edit-form';
import { useDeleteOccupationType, useGetOccupationTypeWithPagination } from 'src/services/occupation-type/occupation-type.service';

export function OccupationTypeListView() {

  const { t: t_occupation } = useTranslate('occupation-type');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentOccuType, setCurrentOccuType] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: ''
  });

  const { data, isLoading, refetch } = useGetOccupationTypeWithPagination({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder
  });


  const allOccupationType = data?.items || [];
  const totalCount = data?.totalCount || 0;


  const handleRefetch = () => refetch();

  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateUnits = () => {
    setCurrentOccuType(null);
    setOpenDialog(true);
  };


  const deleteOccupationType = useDeleteOccupationType();

  const handleDeleteRow = (row) => {
    deleteOccupationType.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_occupation('toastMessages.deleteOccupation'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  }

  const handleEditRow = (row) => {
    setCurrentOccuType(row);
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentOccuType(null);
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
      accessorKey: 'name',
      header: 'نام واحد',
      width: 180,
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ ایجاد',
      width: 180,
      Cell: ({ cell }) => fDateTime(cell.getValue(), true),
    },
    {
      accessorKey: 'description',
      header: 'توضیحات',
      width: 180,
    },
  ], [currentLang]);


  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_occupation('breadcrumb.occuType')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateUnits}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_occupation('buttons.newOccuType')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allOccupationType}
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

      <OccupationTypeNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentOccuType={currentOccuType}
        onRefetch={handleRefetch}
      />
    </>
  );
}
