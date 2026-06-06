'use client';

import { useState, useMemo } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';
import { IconifyLocal } from '@repo/ui/iconify-local';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { MenuItem, Paper } from '@mui/material';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { fDateTime } from '@repo/ui/utils';
import { StaffNewEditForm } from '../staff-new-edit-form';
import { useGetStaffWithPagination } from 'src/services/staff/staff.service';
import { AssignRoleToUserNewEditForm } from '../assign-role-to-user';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { UserChangePasswordEditForm } from '../user-change-password-edit-form';
import { CgDetailsMore } from 'react-icons/cg';

export function StaffListView() {
  const { t: t_staff } = useTranslate('staff');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [currentUserId, setCurrentUserId] = useState();
  const [assignRoleOpenDialog, setAssignRoleOpenDialog] = useState();
  const [changePasswordOpenDialog, setChangePasswordOpenDialog] = useState();
  const [currentUserIdForUserDetail, setCurrentUserIdForUSerDetail] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetStaffWithPagination({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allEmploymentType = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  // Create Open Dialog Function
  const handleCreateUnits = () => {
    setCurrentStaff(null);
    setOpenDialog(true);
  };

  // Edit Open Dialog Function
  const handleEditRow = (row) => {
    setCurrentStaff(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStaff(null);
  };

  const handleChangePasswordCloseDialog = () => {
    setChangePasswordOpenDialog(false);
    setCurrentStaff(null);
  };

  const handleAssignRoleToUserCloseDialog = () => {
    setAssignRoleOpenDialog(false);
    setCurrentUserId(null);
    setCurrentStaff(null);
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
        accessorKey: 'firstName',
        header: t_staff('columns.firstName'),
        size: 150,
      },
      {
        accessorKey: 'lastName',
        header: t_staff('columns.lastName'),
        size: 150,
      },
      {
        accessorKey: 'personnelCode',
        header: t_staff('columns.personnelCode'),
        size: 150,
      },
      {
        accessorKey: 'contractStartDate',
        header: t_staff('columns.contractStartDate'),
        size: 150,
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
      {
        accessorKey: 'contractEndDate',
        header: t_staff('columns.contractEndDate'),
        size: 150,
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
      {
        accessorKey: 'site.name',
        header: t_staff('columns.siteName'),
        size: 150,
      },
      {
        accessorKey: 'unit.name',
        header: t_staff('columns.unitName'),
        size: 150,
      },
      {
        accessorKey: 'position.name',
        header: t_staff('columns.positionName'),
        size: 150,
      },
      {
        accessorKey: 'employmentType.name',
        header: t_staff('columns.employmentTypeName'),
        size: 150,
      },
      {
        accessorKey: 'employmentStatus.name',
        header: t_staff('columns.employmentStatusName'),
        size: 150,
      },
    ],
    [currentLang]
  );

  // More ActionCell
  const customRowActions = useMemo(
    () => [
      (row) => (
        <>
          <MenuItem
            key="assign-role"
            onClick={() => {
              (setAssignRoleOpenDialog(true), setCurrentUserId(row?.id), setCurrentStaff(row));
            }}
          >
            <IconifyLocal>
              <BsFillPersonLinesFill size={18} style={{ color: '#876464' }} />
            </IconifyLocal>
            ایجاد نقش
          </MenuItem>

          <MenuItem
            key="change-password"
            onClick={() => {
              (setChangePasswordOpenDialog(true), setCurrentUserIdForUSerDetail(row?.id));
            }}
          >
            <IconifyLocal>
              <CgDetailsMore size={18} style={{ color: '#79c2d0' }} />
            </IconifyLocal>
            تغییر نام کاربری / رمز عبور
          </MenuItem>
        </>
      ),
    ],
    []
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_staff('breadcrumb.staffs')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateUnits}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_staff('buttons.newStaffs')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allEmploymentType}
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
              onEdit={handleEditRow}
              customRowActions={customRowActions}
            />
          </Card>
        </Paper>
      </DashboardContent>

      <StaffNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentStaff={currentStaff}
        onRefetch={handleRefetch}
      />

      <AssignRoleToUserNewEditForm
        open={assignRoleOpenDialog}
        onClose={handleAssignRoleToUserCloseDialog}
        currentUserId={currentUserId}
        onRefetch={handleRefetch}
        currentStaff={currentStaff}
      />

      <UserChangePasswordEditForm
        open={changePasswordOpenDialog}
        onClose={handleChangePasswordCloseDialog}
        currentUserId={currentUserIdForUserDetail}
        onRefetch={handleRefetch}
      />
    </>
  );
}
