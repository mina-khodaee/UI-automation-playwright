'use client';

import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';
import { IconifyLocal } from '@repo/ui/iconify-local';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Chip, MenuItem, Paper } from '@mui/material';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AssignDriverForm } from '../assign-driver';
import { CgDetailsMore } from "react-icons/cg";
import VehicleNewEditForm from '../vehicle-new-edit-form';
import { useDeleteVehicle, useGetVehicles } from 'src/services/vehicle/vehicle.service';
import { STATUS_NAMES, VEHICLE_TYPE_NAMES } from '../component/constants';
import { convertEnToFa } from '@repo/ui/utils';

export function VehicleListView() {

  const { t: t_empType } = useTranslate('employment-type');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: ''
  });

  const { data, isLoading, refetch } = useGetVehicles({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder
  });

  const allVehicle = data?.items || [];
  const totalCount = data?.totalCount || 0;


  // const handleRefetch = () => refetch();
  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateUnits = () => {
    setCurrentVehicle(null);
    setOpenDialog(true);
  };

  const deleteVehicle = useDeleteVehicle();

  const handleDeleteRow = (row) => {
    deleteVehicle.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_empType('toastMessages.deleteEmpType'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentVehicle(row);
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentVehicle(null);
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
      accessorKey: 'plate.value',
      header: 'شماره پلاک',
      size: 150,
      Cell: ({ cell }) => {
        const plateValue = cell.getValue();
        if (!plateValue) return '-';

        const faPlate = convertEnToFa(plateValue);
        const hasLetter = /[آ-ی]/g.test(faPlate);

        if (faPlate.length === 8 && hasLetter) {
          const part1 = faPlate.substring(0, 2);
          const letter = faPlate.substring(2, 3);
          const part2 = faPlate.substring(3, 6);
          const part3 = faPlate.substring(6, 8);

          return (
            <span style={{
              direction: 'ltr',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span>{part1}</span>
              <span>({letter})</span>
              <span>{part2}</span>
              <span>{part3}</span>
            </span>
          );
        }
        return (
          <span style={{ direction: 'ltr', display: 'inline-block' }}>
            {faPlate}
          </span>
        );
      },
    },
    {
      accessorKey: 'plate.type',
      header: 'نوع پلاک',
      size: 120,
      Cell: ({ cell }) => {
        const type = cell.getValue();
        const typeNames = { 1: 'استاندارد', 2: 'موتور', 3: 'داخلی' };
        return typeNames[type] || type;
      },
    },
    {
      accessorKey: 'vehicleType.name',
      header: 'نوع خودرو',
      size: 150,
      Cell: ({ cell }) => {
        const name = cell.getValue();
        return VEHICLE_TYPE_NAMES[name] || name;
      },
    },
    {
      accessorKey: 'vehicleCategory.name',
      header: 'دسته‌بندی',
      size: 120,
      Cell: ({ cell }) => {
        const category = cell.getValue();
        const categoryNames = {
          'Standard': 'استاندارد',
          'Cargo': 'باربری',
          'Logestic': 'صنعتی',
          'Motorcycle': 'موتور',
          'Other': 'سایر'
        };
        return categoryNames[category] || category;
      },
    },
    {
      accessorKey: 'model',
      header: 'مدل',
      size: 120,
    },
    {
      accessorKey: 'color',
      header: 'رنگ',
      size: 100,
    },
    {
      accessorKey: 'status.name',
      header: 'وضعیت',
      size: 120,
      Cell: ({ cell }) => {
        const status = cell.getValue();
        const statusColors = {
          'Active': 'success',
          'Inactive': 'default',
          'Maintenance': 'warning',
          'OutOfService': 'error'
        };
        return (
          <Chip
            label={STATUS_NAMES[status] || status}
            color={statusColors[status] || 'default'}
            size="small"
          />
        );
      },
    },
    {
      accessorKey: 'cargoDetails.maxPayloadKg',
      header: 'ظرفیت (کیلوگرم)',
      size: 160,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value ? value.toLocaleString() : '-';
      },
    },
    {
      accessorKey: 'cargoDetails.axleCount',
      header: 'تعداد محور',
      size: 150,
      Cell: ({ cell }) => cell.getValue() || '-',
    },
    {
      accessorKey: 'cargoDetails.cargoType.name',
      header: 'نوع بار',
      size: 120,
      Cell: ({ cell }) => {
        const type = cell.getValue();
        const cargoNames = {
          'General': 'عمومی',
          'Heavy': 'سنگین',
          'Liquid': 'مایع',
          'Refrigerated': 'یخچالی',
          'Hazardous': 'خطرناک'
        };
        return cargoNames[type] || type || '-';
      },
    },
    {
      accessorKey: 'vin',
      header: 'شماره Vin  ',
      size: 150,
    },
    {
      accessorKey: 'engineNumber',
      header: 'شماره موتور',
      size: 150,
    },
  ], [currentLang]);


  const [assignDriverOpenDialog, setAssignDriverOpenDialog] = useState();
  const [currentDate, setCurrentData] = useState();

  const customRowActions = useMemo(
    () => [
      (row) => (
        <>
          <MenuItem
            key="assign-driver"
            onClick={() => {
              setAssignDriverOpenDialog(true),
                setCurrentData(row);

                console.log('rowrowrow',row)
            }}
          >
            <IconifyLocal>
              <CgDetailsMore size={18} style={{ color: '#79c2d0' }} />
            </IconifyLocal>
            ثبت راننده
          </MenuItem>
        </>
      ),
    ],
    []
  );

  const handleAssignDriverCloseDialog = () => {
    setAssignDriverOpenDialog(false);
    setCurrentData(null);
  };

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading='لیست خودرو ها'
          action={
            <Button
              color="inherit"
              onClick={handleCreateUnits}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              ثبت خودرو جدید
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allVehicle}
              columns={columns}
              rowCount={totalCount}
              setQueryParams={setQueryParams}
              // refetchMethod={handleRefetch}
              page={queryParams.page}
              pageSize={queryParams.pageSize}
              isLoading={isLoading}
              onSort={handleSort}
              onSearch={handleSearch}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onDelete={handleDeleteRow}
              onEdit={handleEditRow}
              customRowActions={customRowActions}
            />
          </Card>
        </Paper>
      </DashboardContent>

      <VehicleNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentVehicle={currentVehicle}
      // onRefetch={handleRefetch}
      />

      <AssignDriverForm
        open={assignDriverOpenDialog}
        onClose={handleAssignDriverCloseDialog}
        currentData={currentDate}
      // onRefetch={handleRefetch}
      />

    </>
  );
}
