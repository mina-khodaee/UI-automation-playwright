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
import { ShiftSupervisorAndDeputyNewEditForm } from '../shift-supervisor-and-deputy-form';

import {
  useGetShiftSupervisorAndDeputy,
  useDeleteShiftSupervisorAndDeputy,
} from 'src/services/shift-supervisor-and-deputy/shift-supervisor-and-deputy.service';

export function ShiftSupervisorAndDeputyListView() {
  const { t: t_shiftSupervisorAndDeputy } = useTranslate('shift-supervisor-and-deputy');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetShiftSupervisorAndDeputy(queryParams);

  const shiftSupervisorAndDeputies = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const deleteMutation = useDeleteShiftSupervisorAndDeputy();

  const handleCreate = () => {
    setCurrentItem(null);
    setOpenDialog(true);
  };

  const handleEdit = (row) => {
    setCurrentItem(row);
    setOpenDialog(true);
  };

  const handleDelete = (row) => {
    deleteMutation.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_shiftSupervisorAndDeputy('toastMessages.delete'));
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleClose = () => {
    setOpenDialog(false);
    setCurrentItem(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'personnel.firstName',
        header: t_shiftSupervisorAndDeputy('columns.personnelId'),
        size: 150,
      },
      {
        accessorKey: 'shift.name',
        header: t_shiftSupervisorAndDeputy('columns.shiftId'),
        size: 150,
      },
      {
        accessorKey: 'startDate',
        header: t_shiftSupervisorAndDeputy('columns.startDate'),
        size: 150,
      },
      {
        accessorKey: 'endDate',
        header: t_shiftSupervisorAndDeputy('columns.endDate'),
        size: 150,
      },
      {
        accessorKey: 'description',
        header: t_shiftSupervisorAndDeputy('columns.description'),
        size: 200,
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_shiftSupervisorAndDeputy('breadcrumb.shiftSupervisorAndDeputy')}
          links={[
            {
              name: t_shiftSupervisorAndDeputy('breadcrumb.dashboard'),
              href: paths.dashboard.root,
            },
            { name: t_shiftSupervisorAndDeputy('breadcrumb.shiftSupervisorAndDeputy') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreate}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_shiftSupervisorAndDeputy('buttons.newShiftSupervisorAndDeputy')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={shiftSupervisorAndDeputies}
              columns={columns}
              isLoading={isLoading}
              rowCount={totalCount}
              setQueryParams={setQueryParams}
              refetchMethod={refetch}
              page={queryParams.page}
              pageSize={queryParams.pageSize}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </Card>
        </Paper>
      </DashboardContent>

      <ShiftSupervisorAndDeputyNewEditForm
        open={openDialog}
        onClose={handleClose}
        currentItem={currentItem}
        onRefetch={refetch}
      />
    </>
  );
}
