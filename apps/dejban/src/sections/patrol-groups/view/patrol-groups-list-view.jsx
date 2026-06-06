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
import { PatrolGroupsNewEditForm } from 'src/sections/patrol-groups/patrol-groups-new-edit-form';
import {
  useGetPatrolGroups,
  useDeletePatrolGroups,
} from 'src/services/patrol-groups/patrol-groups.service';

export function PatrolGroupsListView() {
  const { t: t_patrolGroups } = useTranslate('patrol-groups');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentPatrolGroups, setCurrentPatrolGroups] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetPatrolGroups(queryParams);

  const patrolGroups = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const deletePatrolGroups = useDeletePatrolGroups();

  // ========================
  // CRUD Handlers
  // ========================

  const handleCreatePatrolGroups = () => {
    setCurrentPatrolGroups(null);
    setOpenDialog(true);
  };

  const handleEditRow = (row) => {
    setCurrentPatrolGroups(row);
    setOpenDialog(true);
  };

  const handleDeleteRow = (row) => {
    deletePatrolGroups.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_patrolGroups('toastMessages.delete'));
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPatrolGroups(null);
  };

  // ========================
  // Columns
  // ========================

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t_patrolGroups('columns.name'),
        size: 150,
      },
      {
        accessorKey: 'site.name',
        header: t_patrolGroups('columns.siteId'),
        size: 180,
      },

      {
        accessorKey: 'description',
        header: t_patrolGroups('columns.description'),
        size: 200,
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_patrolGroups('breadcrumb.patrolGroups')}
          links={[
            { name: t_patrolGroups('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_patrolGroups('breadcrumb.patrolGroups') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreatePatrolGroups}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_patrolGroups('buttons.newPatrolGroups')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={patrolGroups}
              columns={columns}
              isLoading={isLoading}
              rowCount={totalCount}
              setQueryParams={setQueryParams}
              refetchMethod={refetch}
              page={queryParams.page}
              pageSize={queryParams.pageSize}
              onDelete={handleDeleteRow}
              onEdit={handleEditRow}
            />
          </Card>
        </Paper>
      </DashboardContent>

      <PatrolGroupsNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentItem={currentPatrolGroups}
        onRefetch={refetch}
      />
    </>
  );
}
