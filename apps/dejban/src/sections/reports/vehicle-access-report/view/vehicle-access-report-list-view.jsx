'use client';

import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import { Checkbox, Paper } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useDeleteVehicleAccessLog,
  useGetVehicleAccessLogsWithPagination,
} from 'src/services/vehicle-accessLogs/vehicle-accessLogs.service';
// import { VehicleAccessNewEditForm } from '../vehicle-access-new-edit-form';
import moment from 'moment-jalaali';

export function VehicleAccessReportListView() {
  const { t: t_common, currentLang } = useTranslate();
  const { t: t_vehicleAccess } = useTranslate('vehicle-access');

  const [currentVehicleAccess, setCurrentVehicleAccess] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetVehicleAccessLogsWithPagination({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allVehicleAccess = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  const deleteVehicleAccess = useDeleteVehicleAccessLog();

  const handleDeleteRow = async (row) => {
    deleteVehicleAccess.mutate(row?.tagId, {
      onSuccess: () => {
        toast.success(t_vehicleAccess('toastMessages.deleteVehicleAccess'));
        handleRefetch();
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentVehicleAccess(row);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNew = () => {
    setCurrentVehicleAccess(null);
  };

  const handleCloseForm = () => {
    setCurrentVehicleAccess(null);
  };

  const getDisplayValue = (obj, fallback = '-') => {
    if (!obj) return fallback;
    if (typeof obj === 'object' && obj !== null) {
      if (obj.displayValues && currentLang) {
        const langKey = currentLang === 'fa' ? 'fa-IR' : 'en-US';
        return obj.displayValues[langKey] || obj.value || fallback;
      }
      return obj.value || fallback;
    }
    return obj;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'vehicle.plate',
        header: t_vehicleAccess('columns.vehiclePlate') || 'پلاک',
        size: 140,
        Cell: ({ row }) => row.original.vehicle?.plate || '-',
      },
      {
        accessorKey: 'vehicle.vehicleType',
        header: t_vehicleAccess('columns.vehicleType') || 'نوع خودرو',
        size: 120,
        Cell: ({ row }) => getDisplayValue(row.original.vehicle?.vehicleType),
      },
      {
        accessorKey: 'vehicle.driverName',
        header: t_vehicleAccess('columns.driverName') || 'نام راننده',
        size: 150,
        Cell: ({ row }) => row.original.vehicle?.driverName || '-',
      },
      {
        accessorKey: 'vehicle.ownerName',
        header: t_vehicleAccess('columns.ownerName') || 'نام مالک',
        size: 150,
        Cell: ({ row }) => row.original.vehicle?.ownerName || '-',
      },
      {
        accessorKey: 'entry.doorName',
        header: t_vehicleAccess('columns.entryDoor') || 'درب ورود',
        size: 120,
        Cell: ({ row }) => row.original.entry?.doorName || '-',
      },
      {
        accessorKey: 'entry.dateTime',
        header: t_vehicleAccess('columns.entryDateTime') || 'تاریخ و ساعت ورود',
        size: 160,
        Cell: ({ row }) => {
          const dt = row.original.entry?.dateTime;
          return dt ? moment(dt).format('jYYYY/jMM/jDD HH:mm:ss') : '-';
        },
      },
      {
        accessorKey: 'exit.doorName',
        header: t_vehicleAccess('columns.exitDoor') || 'درب خروج',
        size: 120,
        Cell: ({ row }) => row.original.exit?.doorName || '-',
      },
      {
        accessorKey: 'exit.dateTime',
        header: t_vehicleAccess('columns.exitDateTime') || 'تاریخ و ساعت خروج',
        size: 160,
        Cell: ({ row }) => {
          const dt = row.original.exit?.dateTime;
          return dt ? moment(dt).format('jYYYY/jMM/jDD HH:mm:ss') : '-';
        },
      },
      {
        accessorKey: 'hasOccupant',
        header: t_vehicleAccess('columns.occupantsCount') || 'سرنشین',
        size: 80,
        Cell: ({ row }) => {
          const hasOccupant = row.original.entry?.hasOccupant || row.original.exit?.hasOccupant;
          return (
            <Checkbox checked={!!hasOccupant} disabled size="small" color="primary" sx={{ p: 0 }} />
          );
        },
      },
    ],
    [currentLang, t_vehicleAccess]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading="گزارش تردد خودرو"
          links={[
            {
              name: 'گزارش تردد خودرو',
              href: paths.dashboard.root,
            },
            { name: 'گزارش تردد خودرو' },
          ]}
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        {/*<VehicleAccessNewEditForm*/}
        {/*  currentItem={currentVehicleAccess}*/}
        {/*  onRefetch={handleRefetch}*/}
        {/*  onClose={handleCloseForm}*/}
        {/*/>*/}

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allVehicleAccess}
              columns={columns}
              isLoading={isLoading}
              rowCount={totalCount}
              setQueryParams={setQueryParams}
              refetchMethod={handleRefetch}
              page={queryParams.page}
              pageSize={queryParams.pageSize}
              onDelete={handleDeleteRow}
              onEdit={handleEditRow}
              onAdd={handleCreateNew}
            />
          </Card>
        </Paper>
      </DashboardContent>
    </>
  );
}
