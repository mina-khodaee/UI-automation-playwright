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
import { PatrolShiftWorkPeriodNewEditForm } from 'src/sections/patrol-shift-work-period/patrol-shift-work-period-edit-form';

import {
  useGetPatrolShiftWorkPeriod,
  useDeletePatrolShiftWorkPeriod,
} from 'src/services/patrol-shift-work-period/patrol-shift-work-period.service';

export function PatrolShiftWorkPeriodListView() {
  const { t: t_workPeriod } = useTranslate('patrol-shift-work-period');
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

  const { data, isLoading, refetch } = useGetPatrolShiftWorkPeriod(queryParams);

  const workPeriods = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const workPeriodsData = useMemo(() => {
    return workPeriods.map((item) => ({
      ...item,
      hasBreak: item.hasBreak ? 'دارد' : 'ندارد',
      useCalendar: item.useCalendar ? 'دارد' : 'ندارد',
    }));
  }, [workPeriods]);

  const deleteMutation = useDeletePatrolShiftWorkPeriod();

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
        toast.success(t_workPeriod('toastMessages.delete'));
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
        accessorKey: 'name',
        header: t_workPeriod('columns.name'),
        size: 150,
      },
      {
        accessorKey: 'shift.name',
        header: t_workPeriod('columns.shiftId'),
        size: 150,
      },
      {
        accessorKey: 'startDate',
        header: t_workPeriod('columns.startDate'),
        size: 120,
      },
      {
        accessorKey: 'endDate',
        header: t_workPeriod('columns.endDate'),
        size: 120,
      },
      {
        accessorKey: 'hasBreak',
        header: t_workPeriod('columns.hasBreak'),
        size: 100,
      },
      {
        accessorKey: 'useCalendar',
        header: t_workPeriod('columns.useCalendar'),
        size: 100,
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_workPeriod('breadcrumb.workPeriods')}
          links={[
            { name: t_workPeriod('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_workPeriod('breadcrumb.workPeriods') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreate}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_workPeriod('buttons.newWorkPeriod')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={workPeriodsData}
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

      <PatrolShiftWorkPeriodNewEditForm
        open={openDialog}
        onClose={handleClose}
        currentItem={currentItem}
        onRefetch={refetch}
      />
    </>
  );
}
