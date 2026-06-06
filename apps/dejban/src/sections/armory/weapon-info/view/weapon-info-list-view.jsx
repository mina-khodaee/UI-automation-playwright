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
import { useDeleteMajor, useGetMajors } from 'src/services/majors/majors.service';
import { WeaponInfoNewEditForm } from '../weapon-info-new-edit-form';

export function WeaponInfoListView() {

  const { t: t_majors } = useTranslate('major');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentWeapon, setCurrentMajor] = useState(null);


  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: ''
  })

  const { data, isLoading, refetch } = useGetMajors({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  // const allWeapon = data?.items || [];
  const allWeapon = [
    { name: 'کلاش', code: 1, description: 'تست' }
  ]

  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();


  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateUnits = () => {
    setCurrentMajor(null);
    setOpenDialog(true);
  };


  const deleteMajor = useDeleteMajor();

  const handleDeleteRow = (async (row) => {
    deleteMajor.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_majors('toastMessages.deleteMajors'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  });


  const handleEditRow = (row) => {
    setCurrentMajor(row);
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentMajor(null);
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
      header: 'نام اسلحه',
      width: 180,
    },
    {
      accessorKey: 'code',
      header: 'شماره سریال اسلحه',
      width: 180,
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
          heading='اطلاعات اسلحه'
          action={
            <Button
              color="inherit"
              onClick={handleCreateUnits}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              اسلحه جدید
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allWeapon}
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

      <WeaponInfoNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentWeapon={currentWeapon}
        onRefetch={handleRefetch}
      />
    </>
  );
}
