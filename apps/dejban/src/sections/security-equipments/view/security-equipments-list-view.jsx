'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useGetSecurityEquipments,
  useDeleteSecurityEquipments,
} from 'src/services/security-equipments/security-equipments.service';
import { SecurityEquipmentsNewEditForm } from '../security-equipments-new-edit-form';

export function SecurityEquipmentsListView() {
  const { t: t_securityEquipments } = useTranslate('security-equipments');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentSecurityEquipments, setCurrentSecurityEquipments] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetSecurityEquipments({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allSecurityEquipment = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateSecurityEquipment = () => {
    setCurrentSecurityEquipments(null);
    setOpenDialog(true);
  };

  const deleteSecurityEquipment = useDeleteSecurityEquipments();

  const handleDeleteRow = async (user) => {
    deleteSecurityEquipment.mutate(user?.id, {
      onSuccess: () => {
        toast.success(t_securityEquipments('toastMessages.deleteSecurityEquipments'));
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentSecurityEquipments(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSecurityEquipments(null);
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
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t_securityEquipments('columns.name'),
        width: 120,
      },

      {
        accessorKey: 'equipmentType.name',
        header: t_securityEquipments('columns.equipmentTypeId'),
        width: 120,
      },

      {
        accessorKey: 'serialNumber',
        header: t_securityEquipments('columns.serialNumber'),
      },
      {
        accessorKey: 'count',
        header: t_securityEquipments('columns.count'),
      },
      {
        accessorKey: 'description',
        header: t_securityEquipments('columns.description'),
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_securityEquipments('breadcrumb.SecurityEquipments')}
          links={[
            { name: t_securityEquipments('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_securityEquipments('breadcrumb.SecurityEquipments') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreateSecurityEquipment}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_securityEquipments('buttons.newSecurityEquipments')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allSecurityEquipment}
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

      <SecurityEquipmentsNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentSecurityEquipments={currentSecurityEquipments}
        onRefetch={handleRefetch}
      />
    </>
  );
}
