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
  useGetSecurityEquipmentTypes,
  useDeleteSecurityEquipmentTypes,
} from 'src/services/security-equipment-types/security-equipment-types.service';
import { SecurityEquipmentTypesNewEditForm } from '../security-equipment-types-new-edit-form';

export function SecurityEquipmentTypesListView() {
  const { t: t_securityEquipmentTypes } = useTranslate('security-equipment-types');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentSecurityEquipmentTypes, setCurrentSecurityEquipmentTypes] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetSecurityEquipmentTypes({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allSecurityEquipmentTypes = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateSecurityEquipmentTypes = () => {
    setCurrentSecurityEquipmentTypes(null);
    setOpenDialog(true);
  };

  const deleteSecurityEquipmentTypes = useDeleteSecurityEquipmentTypes();

  const handleDeleteRow = async (user) => {
    deleteSecurityEquipmentTypes.mutate(user?.id, {
      onSuccess: () => {
        toast.success(t_securityEquipmentTypes('toastMessages.deleteSecurityEquipmentTypes'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentSecurityEquipmentTypes(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSecurityEquipmentTypes(null);
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
        header: t_securityEquipmentTypes('columns.name'),
        width: 120,
      },

      {
        accessorKey: 'description',
        header: t_securityEquipmentTypes('columns.description'),
      },
      {
        accessorKey: 'isUniqe',
        header: t_securityEquipmentTypes('columns.serialNumber'),
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_securityEquipmentTypes('breadcrumb.securityEquipmentTypes')}
          links={[
            { name: t_securityEquipmentTypes('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_securityEquipmentTypes('breadcrumb.securityEquipmentTypes') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreateSecurityEquipmentTypes}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_securityEquipmentTypes('buttons.newSecurityEquipmentTypes')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allSecurityEquipmentTypes}
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

      <SecurityEquipmentTypesNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentSecurityEquipmentTypes={currentSecurityEquipmentTypes}
        onRefetch={handleRefetch}
      />
    </>
  );
}
