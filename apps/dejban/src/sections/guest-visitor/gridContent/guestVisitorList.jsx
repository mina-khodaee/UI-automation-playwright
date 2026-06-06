'use client';

import { useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { Iconify, IconifyLocal } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { fDateTime } from '@repo/ui/utils';
import * as visitorsData from 'src/services/visitor/visitor.service';
import { GuestEditForm } from 'src/sections/guest-visitor/guest-edit-form';
import { VisitorAppointmentCreateForm } from 'src/sections/guest-visitor/visitor-appointment-create-form';
import { FormProvider, useForm } from 'react-hook-form';
import { MenuItem } from '@mui/material';
import { RiListSettingsLine } from 'react-icons/ri';

// ----------------------------------------------------------------------
export function GuestVisitorList({ onGuestSelect }) {
  // -----------------------------
  // dialogs (Degree Style)
  // -----------------------------
  const [openDialog, setOpenDialog] = useState(false);
  const [currentGuest, setCurrentGuest] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const formMethods = useForm();

  // -----------------------------
  // data
  // -----------------------------
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = visitorsData.useGetVisitors({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const deleteVisitor = visitorsData.useDeleteVisitors();
  const visitors = data?.items || [];
  const totalCount = data?.totalCount || 0;

  // -----------------------------
  // CRUD Handlers
  // -----------------------------
  const handleRefetch = () => refetch();

  // const handleCreateGuest = () => {
  //   setCurrentGuest(null);
  //   setOpenDialog(true);
  // };

  const handleEditGuest = (row) => {
    setCurrentGuest(row);
    setOpenDialog(true);
  };

  const customRowActions = useMemo(
    () => [
      (row) => (
        <MenuItem
          onClick={() => {
            onGuestSelect(row);
          }}
        >
          <IconifyLocal>
            <RiListSettingsLine size={18} />
          </IconifyLocal>
          مشاهده لیست قرار ملاقات
        </MenuItem>
      ),
    ],
    [onGuestSelect]
  );

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentGuest(null);
    refetch();
  };

  const handleDeleteVisitor = (row) => {
    if (window.confirm('آیا از حذف این بازدیدکننده مطمئن هستید؟')) {
      deleteVisitor.mutate(row.id, {
        onSuccess: () => {
          toast.success('بازدیدکننده با موفقیت حذف شد');
          refetch();
        },
        onError: (err) => {
          toast.error(err?.message || 'خطا در حذف');
        },
      });
    }
  };

  const handleSort = (column, direction) => {
    setQueryParams((prev) => ({ ...prev, sortColumn: column, sortOrder: direction }));
  };

  const handleSearch = (searchValue) => {
    setQueryParams((prev) => ({ ...prev, searchTerm: searchValue }));
  };

  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setQueryParams((prev) => ({ ...prev, pageSize: newPageSize }));
  };

  // -----------------------------
  // columns
  // -----------------------------
  const columns = useMemo(
    () => [
      {
        accessorKey: 'fullName',
        header: 'نام و نام خانوادگی',
        Cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        accessorKey: 'nationalCode',
        header: 'کد ملی',
        size: 150,
      },
      {
        accessorKey: 'mobileNumber',
        header: 'شماره موبایل',
        size: 150,
      },
      {
        accessorKey: 'gender',
        header: 'جنسیت',
        size: 100,
      },
      {
        accessorKey: 'visitorType.name',
        header: 'نوع بازدیدکننده',
        size: 160,
      },
      {
        accessorKey: 'createdAt',
        header: 'تاریخ ثبت',
        type: 'dateTime',
        filterVariant: 'datetime',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'],
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
      {
        accessorKey: 'status',
        header: 'وضعیت',
        size: 120,
      },
    ],
    []
  );

  // ----------------------------------------------------------------------
  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading="لیست مهمان‌ها"
          action={
            <Button
              variant="contained"
              onClick={() => setIsAppointmentModalOpen(true)}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              افزودن مهمان و قرار ملاقات جدید
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ height: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column' }}>
          <MRTDataTable
            data={visitors}
            columns={columns}
            rowCount={totalCount}
            isLoading={isLoading}
            setQueryParams={setQueryParams}
            page={queryParams.page}
            pageSize={queryParams.pageSize}
            onSort={handleSort}
            onSearch={handleSearch}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={handlePageChange}
            onDelete={handleDeleteVisitor}
            onEdit={handleEditGuest}
            customRowActions={customRowActions}
            enableRowSelection={false}
            enableExportCSV
            enableExportPDF
            // extraToolbarActions={() => (
            //   <Button
            //     variant="contained"
            //     startIcon={<Iconify icon="mingcute:add-line" />}
            //     onClick={() => setIsAppointmentModalOpen(true)}
            //   >
            //     قرار ملاقات جدید
            //   </Button>
            // )}
          />
        </Card>
      </DashboardContent>

      {/* create new visitor & set appointment (Degree Pattern) */}

      {isAppointmentModalOpen && (
        <FormProvider {...formMethods}>
          <VisitorAppointmentCreateForm
            open={isAppointmentModalOpen}
            onClose={() => setIsAppointmentModalOpen(false)}
          />
        </FormProvider>
      )}

      {/* Edit (Degree Pattern) */}
      <GuestEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentGuest={currentGuest}
        onRefetch={handleRefetch}
      />
    </>
  );
}
