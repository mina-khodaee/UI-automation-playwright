'use client';

import { useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { fDateTime } from '@repo/ui/utils';
import * as visitSchedulesData from 'src/services/visitSchedules/visitSchedules.service';
import { AppointmentDetailsView } from 'src/sections/guest-visitor/form-components/appointment-details-view';

// ----------------------------------------------------------------------
export function AppointmentList({ selectedGuestId, onClose }) {
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  // Fetch data
  const { data, isLoading, refetch } = visitSchedulesData.useGetVisitSchedules({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  // Filter data locally
  const appointments = data?.items?.filter((item) => item.visitor.id === selectedGuestId) || [];
  const totalCount = appointments.length;

  // -----------------------------
  // Details Dialog State
  // -----------------------------
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleViewDetails = (row) => {
    setSelectedRow(row);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedRow(null);
  };

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

  // columns (MRT)
  // ---------------------------------------------------------------------
  const columns = useMemo(
    () => [
      {
        accessorKey: 'visitor.fullName',
        header: 'نام بازدیدکننده',
        size: 180,
      },
      {
        accessorKey: 'host.fullName',
        header: 'میزبان',
        size: 180,
      },
      {
        accessorKey: 'visitReason.name',
        header: 'دلیل بازدید',
        size: 160,
      },
      {
        accessorKey: 'status',
        header: 'وضعیت',
        size: 120,
      },
      {
        accessorKey: 'visitDate',
        header: 'تاریخ شروع',
        type: 'dateTime',
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
      {
        accessorKey: 'visitEndDate',
        header: 'تاریخ پایان',
        type: 'dateTime',
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
      {
        accessorKey: 'companionCount',
        header: 'تعداد همراهان',
        size: 100,
      },
    ],
    []
  );

  // ----------------------------------------------------------------------
  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading="لیست قرار ملاقات‌ها"
          action={
            <Button
              color="inherit"
              onClick={onClose}
              startIcon={<Iconify icon="mingcute:arrow-left-line" />}
            >
              بازگشت
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ height: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column' }}>
          <MRTDataTable
            data={appointments}
            columns={columns}
            rowCount={totalCount}
            isLoading={isLoading}
            refetchMethod={refetch}
            setQueryParams={setQueryParams}
            page={queryParams.page}
            pageSize={queryParams.pageSize}
            onSort={handleSort}
            onSearch={handleSearch}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={handlePageChange}
            onView={handleViewDetails}
            enableExportCSV
            enableExportPDF
          />
        </Card>
      </DashboardContent>

      <AppointmentDetailsView
        open={openDetails}
        onClose={handleCloseDetails}
        rowData={selectedRow}
      />
    </>
  );
}
