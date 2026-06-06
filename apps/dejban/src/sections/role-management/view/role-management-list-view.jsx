'use client';

import { useState, useMemo } from 'react';
import { IconifyLocal } from '@repo/ui/iconify-local';
import { Card, Button, MenuItem } from '@mui/material';
import { fDateTime } from '@repo/ui/utils';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTranslate } from 'src/locales';
import { toast } from 'sonner';
import { RoleManagementNewEditForm } from '../role-management-new-edit-form';
import { HiOutlinePlus } from 'react-icons/hi2';
import { AssignClaimToRolesNewEditForm } from '../assign-claim-to-roles-form';
import { RiListSettingsLine } from "react-icons/ri";
import { useGetRoles, useDeleteRole } from 'src/services/roleManagement/roleManagement.service';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

export function RoleManagementListView() {

  // Translate Hook For Different Languages
  const { t: t_roleManagement } = useTranslate('roleManagement');
  const { t: t_common } = useTranslate();
  const { currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [assignClaimOpenDialog, setAssignClaimOpenDialog] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState(null);

  // Set Query Params To State
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: ''
  })

  // Get Data Hook Api
  const { data, isLoading, refetch } = useGetRoles({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder
  });

  const allRoles = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = (params) => refetch(params);


  const initialFilters = useMemo(() => {
    const filters = [];
    return filters;
  }, []);



  const handleOpenCreateDialog = () => {
    setCurrentRole(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRole(null);
  };

  const handleAssignClaimToRoleCloseDialog = () => {
    setAssignClaimOpenDialog(false);
    setCurrentRoleId(null);
  };

  const handleOpenEditDialog = (role) => {
    setCurrentRole(role);
    setOpenDialog(true);
  };


  // Delete Hook Api
  const deleteRoleMutation = useDeleteRole();

  const handleDeleteRole = (row) => {
    deleteRoleMutation.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_roleManagement('toastMessages.deleteRoleManagementSuccess'));
      },
      onError: (error) => {
        toast.error(error?.message || t_common('errors.unknownError'));
      },
    });
  };

  // Grid Events
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

  // Grid Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t_roleManagement('columns.roleName'),
        enableColumnFilterModes: false,
        filterVariant: 'text',
        size: 120,
      },
      {
        accessorKey: 'description',
        header: t_roleManagement('columns.roleDescription'),
        enableColumnFilterModes: false,
        filterVariant: 'text',
        size: 200,
      },
      {
        accessorKey: 'createdAt',
        header: t_roleManagement('columns.createdAt'),
        filterFn: 'between',
        type: 'dateTime',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'],
        filterVariant: 'datetime',
        size: 180,
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
    ],
    [currentLang, t_roleManagement]
  );

  // More ActionCell
  const customRowActions = useMemo(
    () => [
      (row) => (
        <MenuItem
          onClick={() => {
            setAssignClaimOpenDialog(true),
              setCurrentRoleId(row?.id)
          }}
        >
          <IconifyLocal>
            <RiListSettingsLine size={18} />
          </IconifyLocal>
          ایجاد دسترسی
        </MenuItem>
      ),
    ],
    []
  );


  return (
    <>
      <DashboardContent maxWidth='xxl'>
        <CustomBreadcrumbs
          heading={t_roleManagement('breadcrumb.roles')}
          action={
            <Button
              variant="contained"
              onClick={handleOpenCreateDialog}
              size='small'
              startIcon={<HiOutlinePlus />}
            >
              {t_roleManagement('buttons.createRole')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />


        <Card>
          <MRTDataTable
            data={allRoles}
            columns={columns}
            rowCount={totalCount}
            setQueryParams={setQueryParams}
            initialFilters={initialFilters}
            onSort={handleSort}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            page={queryParams.page}
            pageSize={queryParams.pageSize}
            onEdit={handleOpenEditDialog}
            onDelete={handleDeleteRole}
            customRowActions={customRowActions}
          />
        </Card>

      </DashboardContent>

      <RoleManagementNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentRole={currentRole}
        onRefetch={handleRefetch}
      />

      <AssignClaimToRolesNewEditForm
        open={assignClaimOpenDialog}
        onClose={handleAssignClaimToRoleCloseDialog}
        currentRoleId={currentRoleId}
        onRefetch={handleRefetch}
      />

    </>
  );
}
