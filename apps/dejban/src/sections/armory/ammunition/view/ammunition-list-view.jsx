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
import { AmmunitionNewEditForm } from '../ammunition-new-edit-form';
import { useTranslation } from 'react-i18next';

// ========== ماک دیتا (برای تست) ==========
const MOCK_AMMUNITION = [
  {
    id: '1',
    name: 'فشنگ 9x19mm پارابلوم',
    type: 'pistol',
    quantity: 5000,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'فشنگ 5.56x45mm ناتو',
    type: 'rifle',
    quantity: 3500,
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: '3',
    name: 'فشنگ 7.62x39mm',
    type: 'rifle',
    quantity: 4200,
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '4',
    name: 'فشنگ .308 وینچستر',
    type: 'sniper',
    quantity: 800,
    createdAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: '5',
    name: 'ساچمه 12 gauge',
    type: 'shotgun',
    quantity: 1200,
    createdAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: '6',
    name: 'فشنگ .45 ACP',
    type: 'pistol',
    quantity: 2800,
    createdAt: new Date('2024-02-28').toISOString(),
  },
  {
    id: '7',
    name: 'فشنگ .22 LR',
    type: 'rifle',
    quantity: 10000,
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: '8',
    name: 'فشنگ 7.62x54R',
    type: 'sniper',
    quantity: 450,
    createdAt: new Date('2024-01-30').toISOString(),
  },
];

export function AmmunitionListView() {
  const { t } = useTranslation('ammunition');

  const [openDialog, setOpenDialog] = useState(false);
  const [currentAmmunition, setCurrentAmmunition] = useState(null);
  const [ammunition, setAmmunition] = useState(MOCK_AMMUNITION);
  const [isLoading, setIsLoading] = useState(false);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const paginatedAmmunition = MOCK_AMMUNITION;

  // فیلتر و جستجو
  // const filteredAmmunition = useMemo(() => {
  //   let result = [...ammunition];
  //
  //   if (queryParams.searchTerm) {
  //     const searchLower = queryParams.searchTerm.toLowerCase();
  //     result = result.filter(
  //       (item) =>
  //         item.name.toLowerCase().includes(searchLower) ||
  //         t(`typeOptions.${item.type}`).toLowerCase().includes(searchLower)
  //     );
  //   }
  //
  //   if (queryParams.sortColumn && queryParams.sortOrder) {
  //     result.sort((a, b) => {
  //       let aVal = a[queryParams.sortColumn];
  //       let bVal = b[queryParams.sortColumn];
  //
  //       if (queryParams.sortColumn === 'type') {
  //         aVal = t(`typeOptions.${a.type}`);
  //         bVal = t(`typeOptions.${b.type}`);
  //       }
  //
  //       if (queryParams.sortOrder === 'asc') {
  //         return aVal > bVal ? 1 : -1;
  //       }
  //       return aVal < bVal ? 1 : -1;
  //     });
  //   }
  //
  //   return result;
  // }, [ammunition, queryParams, t]);

  // const totalCount = filteredAmmunition.length;
  // const paginatedAmmunition = filteredAmmunition.slice(
  //   (queryParams.page - 1) * queryParams.pageSize,
  //   queryParams.page * queryParams.pageSize
  // );

  const handleRefetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleCreateAmmunition = () => {
    setCurrentAmmunition(null);
    setOpenDialog(true);
  };

  const handleDeleteRow = (row) => {
    setAmmunition((prev) => prev.filter((a) => a.id !== row.id));
    toast.success(t('toastMessages.delete'));
  };

  const handleEditRow = (row) => {
    setCurrentAmmunition(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAmmunition(null);
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

  const getTypeColor = (type) => {
    const map = {
      pistol: '#2196f3',
      rifle: '#4caf50',
      shotgun: '#ff9800',
      sniper: '#9c27b0',
      machinegun: '#f44336',
      grenade: '#795548',
    };
    return map[type] || '#757575';
  };

  const getQuantityColor = (quantity) => {
    if (quantity === 0) return '#f44336';
    if (quantity < 500) return '#ff9800';
    return '#4caf50';
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return t('stockStatus.outOfStock');
    if (quantity < 500) return t('stockStatus.lowStock');
    return t('stockStatus.inStock');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('columns.name'),
        width: 250,
      },
      {
        accessorKey: 'type',
        header: t('columns.type'),
        width: 130,
        Cell: ({ cell }) => (
          <span style={{ color: getTypeColor(cell.getValue()), fontWeight: 500 }}>
            {t(`typeOptions.${cell.getValue()}`)}
          </span>
        ),
      },
      {
        accessorKey: 'quantity',
        header: t('columns.quantity'),
        width: 180,
        Cell: ({ cell }) => {
          const quantity = cell.getValue();
          return (
            <div>
              <span
                style={{
                  color: getQuantityColor(quantity),
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {quantity.toLocaleString()} عدد
              </span>
              {quantity < 500 && quantity > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    marginLeft: '8px',
                    color: '#ff9800',
                    display: 'block',
                  }}
                >
                  ⚠️ {t('stockStatus.lowStockWarning')}
                </span>
              )}
              {quantity === 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    marginLeft: '8px',
                    color: '#f44336',
                    display: 'block',
                  }}
                >
                  ❌ {t('stockStatus.outOfStock')}
                </span>
              )}
            </div>
          );
        },
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
          heading={t('breadcrumb.ammunition')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateAmmunition}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t('buttons.newAmmunition')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={paginatedAmmunition}
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
              onDelete={handleDeleteRow}
              onEdit={handleEditRow}
            />
          </Card>
        </Paper>
      </DashboardContent>

      <AmmunitionNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentAmmunition={currentAmmunition}
        setAmmunition={setAmmunition}
        ammunition={ammunition}
      />
    </>
  );
}
