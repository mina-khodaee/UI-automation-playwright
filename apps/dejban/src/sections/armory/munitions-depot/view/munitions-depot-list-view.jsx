'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { fDateTime } from '@repo/ui/utils';
import {
  useGetArmoryLocations,
  useDeleteArmoryLocation,
} from 'src/services/armory-locations/armory-locations.service';
import { MunitionsDepotNewEditForm } from '../munitions-depot-new-edit-form';

// ========== ماک دیتا (برای تست) ==========
const MOCK_MUNITIONS_DEPOTS = [
  {
    id: '1',
    name: 'انبار مرکزی مهمات',
    siteId: 'سایت تهران',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'انبار جنوب',
    siteId: 'سایت اهواز',
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: '3',
    name: 'انبار شمال',
    siteId: 'سایت رشت',
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '4',
    name: 'انبار شرق',
    siteId: 'سایت مشهد',
    createdAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: '5',
    name: 'انبار غرب',
    siteId: 'سایت کرمانشاه',
    createdAt: new Date('2024-01-25').toISOString(),
  },
];

export function MunitionsDepotListView() {
  const { t } = useTranslation('munitions-depot');

  const [openDialog, setOpenDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  // const [locations, setLocations] = useState(MOCK_MUNITIONS_DEPOTS);
  const [isLoading, setIsLoading] = useState(false);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const paginatedLocations = MOCK_MUNITIONS_DEPOTS;

  // // فیلتر و جستجو
  // const filteredLocations = useMemo(() => {
  //   let result = [...locations];
  //
  //   if (queryParams.searchTerm) {
  //     const searchLower = queryParams.searchTerm.toLowerCase();
  //     result = result.filter(
  //       (item) =>
  //         item.name.toLowerCase().includes(searchLower) ||
  //         item.siteId?.toLowerCase().includes(searchLower)
  //     );
  //   }

  //   if (queryParams.sortColumn && queryParams.sortOrder) {
  //     result.sort((a, b) => {
  //       const aVal = a[queryParams.sortColumn];
  //       const bVal = b[queryParams.sortColumn];
  //       if (queryParams.sortOrder === 'asc') {
  //         return aVal > bVal ? 1 : -1;
  //       }
  //       return aVal < bVal ? 1 : -1;
  //     });
  //   }
  //
  //   return result;
  // }, [locations, queryParams]);

  // const totalCount = filteredLocations.length;
  // const paginatedLocations = filteredLocations.slice(
  //   (queryParams.page - 1) * queryParams.pageSize,
  //   queryParams.page * queryParams.pageSize
  // );

  const handleRefetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleCreateLocation = () => {
    setCurrentLocation(null);
    setOpenDialog(true);
  };

  // const handleDeleteRow = (row) => {
  //   setLocations((prev) => prev.filter((l) => l.id !== row.id));
  //   toast.success(t('toastMessages.delete'));
  // };

  const handleEditRow = (row) => {
    setCurrentLocation(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentLocation(null);
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
        accessorKey: 'name',
        header: t('columns.name'),
        width: 250,
      },
      {
        accessorKey: 'siteId',
        header: t('columns.siteId'),
        width: 200,
        Cell: ({ cell }) => cell.getValue() || '-',
      },
      {
        accessorKey: 'createdAt',
        header: t('columns.createdAt'),
        width: 180,
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
    ],
    [t]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t('breadcrumb.munitionsDepots')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateLocation}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t('buttons.newMunitionsDepot')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={paginatedLocations}
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

      <MunitionsDepotNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentLocation={currentLocation}
        // setLocations={setLocations}
        // locations={locations}
      />
    </>
  );
}
