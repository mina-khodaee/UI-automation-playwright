'use client';

import { useMemo, useState } from 'react';
import { IconifyLocal } from '@repo/ui/iconify-local';

import Card from '@mui/material/Card';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { fDateTime } from '@repo/ui/utils';
import { useGetVisitorAndVisitSchedule } from 'src/services/visitor-and-visitSchedule/visitorAndVisitSchedule.service';
import { GuestReserveNewCreateForm } from 'src/sections/guest-reserve/guest-reserve-new-create-form';
import { MenuItem } from '@mui/material';
import { RiListSettingsLine } from 'react-icons/ri';

// ----------------------------------------------------------------------

export function GuestReserveList({ onGuestSelect }) {
  // -----------------------------
  // State
  // -----------------------------
  const [currentGuestAndAppointment, setCurrentGuestAndAppointment] = useState(null);
  //for edit

  // -----------------------------
  // Data & Query Params
  // -----------------------------
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetVisitorAndVisitSchedule({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const visitorsAndAppointment = data?.items || [];
  const totalCount = data?.totalCount || 0;

  // -----------------------------
  // Handlers
  // -----------------------------

  const handleEdit = (row) => {
    setCurrentGuestAndAppointment(row.id);
    document.getElementById('visitor-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setCurrentGuestAndAppointment(null);
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
  // Columns Definition
  // -----------------------------
  const columns = useMemo(
    () => [
      {
        accessorKey: 'visitor.fullName',
        header: 'نام و نام خانوادگی',
        size: 200,
      },
      {
        accessorKey: 'visitorCard.cardType',
        header: 'نوع کارت',
        size: 120,
      },
      {
        accessorKey: 'visitorCard.cardNumber',
        header: 'شماره کارت',
        size: 150,
      },
      {
        accessorKey: 'host.fullName',
        header: 'میزبان',
        size: 200,
      },
      {
        accessorKey: 'visitReason.name',
        header: 'دلیل ملاقات',
        size: 180,
      },
      {
        accessorKey: 'visitDate',
        header: 'تاریخ شروع ملاقات',
        type: 'dateTime',
        filterVariant: 'datetime',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'],
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
      {
        accessorKey: 'visitEndDate',
        header: 'تاریخ پایان ملاقات',
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
      {
        accessorKey: 'createdAt',
        header: 'تاریخ ثبت',
        type: 'dateTime',
        filterVariant: 'datetime',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'],
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
    ],
    []
  );
  // ----------------------------------------------------------------------
  return (
    <>
      <DashboardContent maxWidth="xxl">
        {/*<CustomBreadcrumbs heading="لیست مهمان‌ها" sx={{ mb: { xs: 3, md: 5 } }} />*/}

        <Card
          id="visitor-form-section"
          sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider' }}
        >
          <GuestReserveNewCreateForm
            currentGuestAndAppointment={currentGuestAndAppointment}
            onRefetch={refetch}
            onCancel={handleCancelEdit}
            isEditing={!!currentGuestAndAppointment}
          />
        </Card>

        <Card sx={{ height: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column' }}>
          <MRTDataTable
            data={visitorsAndAppointment}
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
            onEdit={handleEdit}
            customRowActions={customRowActions}
            enableRowSelection={false}
            enableExportCSV
            enableExportPDF
          />
        </Card>
      </DashboardContent>
    </>
  );
}
