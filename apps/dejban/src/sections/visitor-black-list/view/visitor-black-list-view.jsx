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
  useGetBlockUsers,
  useDeleteBlockUsers,
} from 'src/services/visitor-black-list/visitor-black-list.service';
import { VisitorBlackListNewEditForm } from '../visitor-black-list-new-edit-form';

export function VisitorBlackListView() {
  const { t: t_visitorBlackList } = useTranslate('visitor-black-list');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentBlockUsers, setCurrentBlockUsers] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetBlockUsers({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allBlockUsers = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateBlockUsers = () => {
    setCurrentBlockUsers(null);
    setOpenDialog(true);
  };

  const deleteBlockUsers = useDeleteBlockUsers();

  const handleDeleteRow = async (user) => {
    deleteBlockUsers.mutate(user?.id, {
      onSuccess: () => {
        toast.success(t_visitorBlackList('toastMessages.deleteBlockUsers'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBlockUsers(null);
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
        accessorKey: 'fullName',
        header: t_visitorBlackList('columns.blockUserName'),
        Cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        accessorKey: 'nationalCode',
        header: t_visitorBlackList('columns.nationalCode'),
        size: 150,
      },
      {
        accessorKey: 'mobileNumber',
        header: t_visitorBlackList('columns.phoneNumber'),
        size: 150,
      },
      {
        accessorKey: 'reason',
        header: t_visitorBlackList('columns.reason'),
        width: 180,
      },
    ],
    [currentLang]
  );
  const allBlockUsersTest = [{}];

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_visitorBlackList('breadcrumb.blockUsers')}
          links={[
            { name: t_visitorBlackList('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_visitorBlackList('breadcrumb.blockUsers') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreateBlockUsers}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_visitorBlackList('buttons.newBlockUsers')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allBlockUsersTest}
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
            />
          </Card>
        </Paper>
      </DashboardContent>

      <VisitorBlackListNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentBlockUsers={currentBlockUsers}
        onRefetch={handleRefetch}
      />
    </>
  );
}
