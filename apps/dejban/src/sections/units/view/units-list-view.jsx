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
import { UnitsNewEditForm } from '../units-new-edit-form';
import { fDateTime } from '@repo/ui/utils';
import { useDeleteUnit, useGetUnits } from 'src/services/units/units.service';

export function UnitsListView() {

  // Translate Hook For Different Languages
  const { t: t_units } = useTranslate('units');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentUnits, setCurrentUnits] = useState(null);

  // Set Query Params For Get APi Input
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: ''
  });

  // Get Data Hook Api
  const { data, isLoading, refetch } = useGetUnits({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allUnits = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  // Create Dialog Open Function
  const handleCreateUnits = () => {
    setCurrentUnits(null);
    setOpenDialog(true);
  };


  // Delete Hook Api
  const deleteUnit = useDeleteUnit();

  const handleDeleteRow = (async (row) => {
    deleteUnit.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_units('toastMessages.deleteUnits'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  });


  // Edit Dialog Open Function
  const handleEditRow = (row) => {
    setCurrentUnits(row);
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUnits(null);
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
      header: 'نام واحد',
      width: 180,
    },
    {
      accessorKey: 'callExtension',
      header: 'شماره تماس داخلی',
      width: 180,
    },
    {
      accessorKey: 'floorNumber',
      header: 'طبقه',
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
          heading={t_units('breadcrumb.units')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateUnits}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_units('buttons.newUnits')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allUnits}
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

      <UnitsNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentUnits={currentUnits}
        onRefetch={handleRefetch}
      />
    </>
  );
}
