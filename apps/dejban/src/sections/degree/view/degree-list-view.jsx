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
import { useDeleteDegree, useGetDegrees } from 'src/services/degrees/degrees.service';
import { DegreeNewEditForm } from '../degree-new-edit-form';

export function DegreeListView() {
  const { t: t_degree } = useTranslate('degree');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentDegree, setCurrentDegree] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetDegrees({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allDegree = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateUnits = () => {
    setCurrentDegree(null);
    setOpenDialog(true);
  };

  const deleteDegree = useDeleteDegree();

  const handleDeleteRow = async (row) => {
    deleteDegree.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_degree('toastMessages.deleteDegrees'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentDegree(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentDegree(null);
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
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t_degree('columns.degreesName'),
        width: 180,
      },
      {
        accessorKey: 'description',
        header: t_degree('columns.description'),
        width: 180,
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_degree('breadcrumb.degrees')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateUnits}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_degree('buttons.newDegrees')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allDegree}
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

      <DegreeNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentDegree={currentDegree}
        onRefetch={handleRefetch}
      />
    </>
  );
}
