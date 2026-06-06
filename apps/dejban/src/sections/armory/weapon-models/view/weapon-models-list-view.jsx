'use client';

import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { fDateTime } from '@repo/ui/utils';
import { WeaponModelNewEditForm } from '../weapon-models-new-edit-form';

// ========== ماک دیتا ==========
const MOCK_WEAPON_MODELS = [
  {
    id: '1',
    manufacturer: 'گلک',
    modelName: 'G17',
    category: 'تپانچه',
    caliber: '9x19mm',
    action: 'نیمه اتوماتیک',
    magazineModel: 'Glock',
    weightEmptyGrams: 625,
    overallLengthMm: 186,
    barrelLengthMm: 114,
    rifling: 'چندضلعی',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    manufacturer: 'سیگ Sauer',
    modelName: 'P320',
    category: 'تپانچه',
    caliber: '9x19mm',
    action: 'نیمه اتوماتیک',
    magazineModel: 'سایر',
    weightEmptyGrams: 737,
    overallLengthMm: 203,
    barrelLengthMm: 120,
    rifling: 'معمولی',
    createdAt: '2024-02-20T00:00:00.000Z',
  },
  {
    id: '3',
    manufacturer: 'کلاشنیکف',
    modelName: 'AK-47',
    category: 'تفنگ',
    caliber: '7.62x39mm',
    action: 'تمام اتوماتیک',
    magazineModel: 'AK',
    weightEmptyGrams: 4300,
    overallLengthMm: 880,
    barrelLengthMm: 415,
    rifling: 'معمولی',
    createdAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: '4',
    manufacturer: 'ارمالایت',
    modelName: 'AR-15',
    category: 'تفنگ',
    caliber: '5.56x45mm',
    action: 'نیمه اتوماتیک',
    magazineModel: 'STANAG',
    weightEmptyGrams: 2950,
    overallLengthMm: 838,
    barrelLengthMm: 406,
    rifling: 'دکمه‌ای',
    createdAt: '2024-03-05T00:00:00.000Z',
  },
  {
    id: '5',
    manufacturer: 'برتا',
    modelName: '92FS',
    category: 'تپانچه',
    caliber: '9x19mm',
    action: 'نیمه اتوماتیک',
    magazineModel: 'Beretta',
    weightEmptyGrams: 950,
    overallLengthMm: 217,
    barrelLengthMm: 125,
    rifling: 'معمولی',
    createdAt: '2024-01-25T00:00:00.000Z',
  },
  {
    id: '6',
    manufacturer: 'ریمینگتون',
    modelName: '870',
    category: 'شاتگان',
    caliber: '12 gauge',
    action: 'پمپی',
    magazineModel: '-',
    weightEmptyGrams: 3060,
    overallLengthMm: 960,
    barrelLengthMm: 470,
    rifling: '-',
    createdAt: '2024-02-28T00:00:00.000Z',
  },
];

export function WeaponModelListView() {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentWeapon, setCurrentWeapon] = useState(null);
  // const [weaponModels, setWeaponModels] = useState(MOCK_WEAPON_MODELS);
  const [isLoading, setIsLoading] = useState(false);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  // ساده و مستقیم - فقط دیتا رو نشون بده
  const weaponModels = MOCK_WEAPON_MODELS;
  // const totalCount = allData.length;
  // const paginatedData = allData.slice(
  //   (queryParams.page - 1) * queryParams.pageSize,
  //   queryParams.page * queryParams.pageSize
  // );

  const handleRefetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleCreateWeapon = () => {
    setCurrentWeapon(null);
    setOpenDialog(true);
  };

  // const handleDeleteRow = (row) => {
  //   setWeaponModels((prev) => prev.filter((w) => w.id !== row.id));
  // };

  const handleEditRow = (row) => {
    setCurrentWeapon(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentWeapon(null);
  };

  const handleSort = (column, direction) => {
    setQueryParams((prev) => ({
      ...prev,
      sortColumn: column,
      sortOrder: direction,
    }));
  };

  const handleSearch = (searchValue) => {
    setQueryParams((prev) => ({
      ...prev,
      searchTerm: searchValue,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setQueryParams((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  // ستون‌های جدول
  const columns = useMemo(
    () => [
      {
        accessorKey: 'manufacturer',
        header: 'سازنده',
        width: 150,
      },
      {
        accessorKey: 'modelName',
        header: 'نام مدل',
        width: 150,
      },
      {
        accessorKey: 'category',
        header: 'دسته‌بندی',
        width: 120,
      },
      {
        accessorKey: 'caliber',
        header: 'کالیبر',
        width: 120,
      },
      {
        accessorKey: 'action',
        header: 'نظام عملیاتی',
        width: 130,
      },
      {
        accessorKey: 'magazineModel',
        header: 'مدل خشاب',
        width: 120,
      },
      {
        accessorKey: 'weightEmptyGrams',
        header: 'وزن خالی (گرم)',
        width: 140,
        Cell: ({ cell }) => (cell.getValue() ? `${cell.getValue().toLocaleString()} g` : '-'),
      },
      {
        accessorKey: 'overallLengthMm',
        header: 'طول کلی (میلی‌متر)',
        width: 150,
        Cell: ({ cell }) => (cell.getValue() ? `${cell.getValue()} mm` : '-'),
      },
      {
        accessorKey: 'barrelLengthMm',
        header: 'طول لوله (میلی‌متر)',
        width: 150,
        Cell: ({ cell }) => (cell.getValue() ? `${cell.getValue()} mm` : '-'),
      },
      {
        accessorKey: 'rifling',
        header: 'نوع خان',
        width: 120,
      },
      {
        accessorKey: 'createdAt',
        header: 'تاریخ ایجاد',
        width: 170,
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
    ],
    []
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading="مدل‌های سلاح"
          action={
            <Button
              color="inherit"
              onClick={handleCreateWeapon}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              مدل سلاح جدید
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={weaponModels}
              columns={columns}
              isLoading={isLoading}
              // rowCount={totalCount}
              setQueryParams={setQueryParams}
              refetchMethod={handleRefetch}
              page={queryParams.page}
              pageSize={queryParams.pageSize}
              onSort={handleSort}
              onSearch={handleSearch}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              // onDelete={handleDeleteRow}
              onEdit={handleEditRow}
            />
          </Card>
        </Paper>
      </DashboardContent>

      <WeaponModelNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentWeapon={currentWeapon}
        // setWeaponModels={setWeaponModels}
        weaponModels={weaponModels}
      />
    </>
  );
}
