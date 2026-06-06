'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { fDateTime } from '@repo/ui/utils';
import { FirearmNewEditForm } from '../firearm-new-edit-form';
import { useTranslation } from 'react-i18next';

// ========== ماک دیتای ساده برای تیبل ==========
const MOCK_FIREARMS = [
  {
    id: '1',
    weaponModelId: 'گلک 17',
    serialNumber: 'GLK-17-001',
    manufactureYear: 2022,
    status: 'عملیاتی',
    munitionsDepotId: 'انبار مرکزی',
    assignedPersonnelId: 'سروان رضایی',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    weaponModelId: 'کلاشنیکوف AK-47',
    serialNumber: 'AK-47-002',
    manufactureYear: 1985,
    status: 'در تعمیر',
    munitionsDepotId: 'انبار جنوب',
    assignedPersonnelId: 'ستوان احمدی',
    createdAt: '2024-02-20T00:00:00.000Z',
  },
  {
    id: '3',
    weaponModelId: 'AR-15',
    serialNumber: 'AR-15-003',
    manufactureYear: 2020,
    status: 'عملیاتی',
    munitionsDepotId: 'انبار مرکزی',
    assignedPersonnelId: '-',
    createdAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: '4',
    weaponModelId: 'SIG Sauer P320',
    serialNumber: 'SIG-320-004',
    manufactureYear: 2023,
    status: 'آسیب دیده',
    munitionsDepotId: 'انبار شمال',
    assignedPersonnelId: 'سرگرد کریمی',
    createdAt: '2024-03-05T00:00:00.000Z',
  },
  {
    id: '5',
    weaponModelId: 'برتا 92FS',
    serialNumber: 'BER-92-005',
    manufactureYear: 2019,
    status: 'عملیاتی',
    munitionsDepotId: 'انبار شرق',
    assignedPersonnelId: 'گروهبان محمدی',
    createdAt: '2024-01-25T00:00:00.000Z',
  },
  {
    id: '6',
    weaponModelId: 'گلک 17',
    serialNumber: 'GLK-17-006',
    manufactureYear: 2021,
    status: 'انبار شده',
    munitionsDepotId: 'انبار غرب',
    assignedPersonnelId: '-',
    createdAt: '2024-02-28T00:00:00.000Z',
  },
];

export function FirearmListView() {
  const { t } = useTranslation('firearm');

  const [openDialog, setOpenDialog] = useState(false);
  const [currentFirearm, setCurrentFirearm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const paginatedFirearms = MOCK_FIREARMS;

  const handleRefetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleCreateFirearm = () => {
    setCurrentFirearm(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentFirearm(null);
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

  const getStatusColor = (status) => {
    const map = {
      عملیاتی: '#4caf50',
      'در تعمیر': '#ff9800',
      'آسیب دیده': '#f44336',
      'انبار شده': '#2196f3',
      'گم شده': '#9e9e9e',
    };
    return map[status] || '#757575';
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'weaponModelId',
        header: t('columns.weaponModel'),
        width: 200,
      },
      {
        accessorKey: 'serialNumber',
        header: t('columns.serialNumber'),
        width: 150,
      },
      {
        accessorKey: 'manufactureYear',
        header: t('columns.manufactureYear'),
        width: 120,
      },
      {
        accessorKey: 'status',
        header: t('columns.status'),
        width: 120,
        Cell: ({ cell }) => (
          <span style={{ color: getStatusColor(cell.getValue()), fontWeight: 500 }}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'munitionsDepotId',
        header: t('columns.munitionsDepot'),
        width: 150,
      },
      {
        accessorKey: 'assignedPersonnelId',
        header: t('columns.assignedPersonnel'),
        width: 150,
      },
      {
        accessorKey: 'createdAt',
        header: t('columns.createdAt'),
        width: 170,
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
    ],
    [t]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t('breadcrumb.firearms')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateFirearm}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t('buttons.newFirearm')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={paginatedFirearms}
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
              // onEdit={handleEditRow}
            />
          </Card>
        </Paper>
      </DashboardContent>

      <FirearmNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentFirearm={currentFirearm}
        // setFirearms={setFirearms}
        // firearms={firearms}
        weaponModels={[]}
        munitionsDepots={[]}
        personnel={[]}
      />
    </>
  );
}
