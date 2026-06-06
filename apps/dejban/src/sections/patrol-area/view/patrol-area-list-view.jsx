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
import { PatrolAreaNewEditForm } from '../patrol-area-new-edit-form';
import {
  useGetPatrolArea,
  useDeletePatrolArea,
} from 'src/services/patrol-area/patrol-area.service';

export function PatrolAreaListView() {
  const { t: t_patrolArea } = useTranslate('patrol-area');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentPatrolArea, setCurrentPatrolArea] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetPatrolArea(queryParams);

  const patrolAreas = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const deletePatrolArea = useDeletePatrolArea();

  // ========================
  // CRUD Handlers
  // ========================

  const handleCreatePatrolArea = () => {
    setCurrentPatrolArea(null);
    setOpenDialog(true);
  };

  const handleEditRow = (row) => {
    setCurrentPatrolArea(row);
    setOpenDialog(true);
  };

  const handleDeleteRow = (row) => {
    deletePatrolArea.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_patrolArea('toastMessages.delete'));
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPatrolArea(null);
  };

  // ========================
  // Columns
  // ========================

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t_patrolArea('columns.name'),
        size: 150,
      },
      {
        accessorKey: 'site.name',
        header: t_patrolArea('columns.siteId'),
        size: 180,
      },

      {
        accessorKey: 'description',
        header: t_patrolArea('columns.description'),
        size: 200,
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_patrolArea('breadcrumb.patrolArea')}
          links={[
            { name: t_patrolArea('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_patrolArea('breadcrumb.patrolArea') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreatePatrolArea}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_patrolArea('buttons.newPatrolArea')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={patrolAreas}
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

      <PatrolAreaNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentItem={currentPatrolArea}
        onRefetch={refetch}
      />
    </>
  );
}
