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
import { EmploymentTypeNewEditForm } from '../employment-type-new-edit-form';
import { useDeleteEmploymentType, useGetEmploymentTypeWithPagination } from 'src/services/employment-type/emp-type.service';

export function EmploymentTypeListView() {

  const { t: t_empType } = useTranslate('employment-type');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmpType, setCurrentEmpType] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: ''
  });

  const { data, isLoading, refetch } = useGetEmploymentTypeWithPagination({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder
  });


  const allEmploymentType = data?.items || [];
  const totalCount = data?.totalCount || 0;


  const handleRefetch = () => refetch();
  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateUnits = () => {
    setCurrentEmpType(null);
    setOpenDialog(true);
  };

  const deleteEmpType = useDeleteEmploymentType();

  const handleDeleteRow = (row) => {
    deleteEmpType.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_empType('toastMessages.deleteEmpType'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentEmpType(row);
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEmpType(null);
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
      header: t_empType('columns.empTypeName'),
      width: 180,
    },
    {
      accessorKey: 'createdAt',
      header: t_empType('columns.createAt'),
      width: 180,
      Cell: ({ cell }) => fDateTime(cell.getValue(), true),
    },
    {
      accessorKey: 'description',
      header: t_empType('columns.description'),
      width: 180,
    },
  ], [currentLang]);


  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_empType('breadcrumb.empType')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateUnits}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_empType('buttons.newEmpType')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allEmploymentType}
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

      <EmploymentTypeNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentEmpType={currentEmpType}
        onRefetch={handleRefetch}
      />
    </>
  );
}
