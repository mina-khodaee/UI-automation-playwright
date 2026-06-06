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
  useGetPersonnelBlackList,
  useDeletePersonnelBlackList,
} from 'src/services/personnel-black-list/personnel-black-list.service';
import { PersonnelBlackListNewEditForm } from '../personnel-black-list-new-edit-form';

export function PersonnelBlackListView() {
  const { t: t_personnelBlackList } = useTranslate('personnel-black-list');
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

  const { data, isLoading, refetch } = useGetPersonnelBlackList({
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

  const deleteBlockUsers = useDeletePersonnelBlackList();

  const handleDeleteRow = async (user) => {
    deleteBlockUsers.mutate(user?.id, {
      onSuccess: () => {
        toast.success(t_personnelBlackList('toastMessages.deleteBlockUsers'));
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
    setQueryParams((prev) => ({ ...prev, sortColumn: column, sortOrder: direction }));
  };

  const handleSearch = (searchValue) => {
    setQueryParams((prev) => ({ ...prev, searchTerm: searchValue }));
  };

  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setQueryParams((prev) => ({ ...prev, pageSize: newPageSize }));
  };

  // ========================
  // Columns
  // ========================
  const columns = useMemo(
    () => [
      {
        accessorKey: 'personnel.fullName',
        header: t_personnelBlackList('columns.personnelId') || 'Personnel ID',
        size: 200,
      },
      {
        accessorKey: 'reason.name',
        header: t_personnelBlackList('columns.reasonId') || 'Reason ID',
        size: 150,
      },
      {
        accessorKey: 'startDate',
        header: t_personnelBlackList('columns.startDate'),
        size: 150,
      },
      {
        accessorKey: 'endDate',
        header: t_personnelBlackList('columns.endDate'),
        size: 150,
      },
      {
        accessorKey: 'description',
        header: t_personnelBlackList('columns.description'),
        size: 250,
      },
    ],
    [currentLang, t_personnelBlackList]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_personnelBlackList('breadcrumb.blockUsers')}
          links={[
            { name: t_personnelBlackList('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_personnelBlackList('breadcrumb.blockUsers') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreateBlockUsers}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_personnelBlackList('buttons.newBlockUsers')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />
        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allBlockUsers}
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
      <PersonnelBlackListNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentBlockUsers={currentBlockUsers}
        onRefetch={handleRefetch}
      />
    </>
  );
}
