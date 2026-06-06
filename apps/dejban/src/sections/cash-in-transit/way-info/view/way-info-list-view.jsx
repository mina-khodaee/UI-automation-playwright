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
import { WayInfoNewEditForm } from '../way-info-new-edit-form';

export function WayInfoListView() {

  const { t: t_majors } = useTranslate('major');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentWay, setCurrentWay] = useState(null);


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

  const mockWayInfoData = [
    {
        id: 1,
        name: 'ایستگاه مرکزی',
        treasuryName: 'خزانه اصلی',
        routeName: 'مسیر شمال به جنوب',
        description: 'مسیر اصلی انتقال وجه از مرکز به شعبه‌های شمالی',
    },
    {
        id: 2,
        name: 'ایستگاه غرب',
        treasuryName: 'خزانه فرعی غرب',
        routeName: 'مسیر حلقه داخلی',
        description: 'پوشش مناطق غربی شهر',
    },
    {
        id: 3,
        name: 'ایستگاه فرودگاه',
        treasuryName: 'خزانه بین‌المللی',
        routeName: 'مسیر ویژه',
        description: 'مسیر اختصاصی برای انتقال ارزهای خارجی',
    },
];

  const allData = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();


  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateUnits = () => {
    setCurrentWay(null);
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
    setCurrentWay(row);
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentWay(null);
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
        header: 'نام ایستگاه',
        width: 180,
    },
    {
        accessorKey: 'treasuryName',
        header: 'نام خزانه',
        width: 180,
    },
    {
        accessorKey: 'routeName',
        header: 'نام مسیر',
        width: 180,
    },
    {
        accessorKey: 'description',
        header: 'توضیحات',
        width: 250,
    },
], [currentLang]);

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading='اطلاعات مسیر ها'
          action={
            <Button
              color="inherit"
              onClick={handleCreateUnits}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              جدید
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={mockWayInfoData}
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

      <WayInfoNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentWay={currentWay}
        onRefetch={handleRefetch}
      />
    </>
  );
}
