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
import { PositionNewEditForm } from '../position-new-edit-form';
import { useDeletePosition, useGetPositionsWithPagination } from 'src/services/position/position.service';

export function PositionsListView() {

  const { t: t_positions } = useTranslate('positions');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: ''
  });

  const { data, isLoading, refetch } = useGetPositionsWithPagination({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allPosition = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();
  // ========================
  // CRUD Handlers
  // ========================
  const handleCreatePosition = () => {
    setCurrentPosition(null);
    setOpenDialog(true);
  };


  const deletePosition = useDeletePosition();

  const handleDeleteRow = (row) => {
    deletePosition.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_positions('toastMessages.deletePosition'));
      },
      onError: (error) => {
        toast.error(error?.message || t_common('errors.unknownError'));
      },
    });
  }

  const handleEditRow = (row) => {
    setCurrentPosition(row);
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPosition(null);
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
      header: t_positions('columns.positionName'),
      width: 180,
    },
    {
      accessorKey: 'description',
      header: t_positions('columns.description'),
      width: 180,
    },
  ], [currentLang]);


  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_positions('breadcrumb.positions')}
          action={
            <Button
              color="inherit"
              onClick={handleCreatePosition}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_positions('buttons.newPosition')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allPosition}
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

      <PositionNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentPosition={currentPosition}
        onRefetch={handleRefetch}
      />
    </>
  );
}
