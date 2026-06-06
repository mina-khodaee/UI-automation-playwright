'use client';

import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';
import { IconifyLocal } from '@repo/ui/iconify-local';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { MenuItem, Paper } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PatrolShiftsNewEditForm } from '../patrol-shifts-new-edit-form';

import {
  useGetPatrolShift,
  useDeletePatrolShift,
} from 'src/services/patrol-shift/patrol-shift.service';
import { CgDetailsMore } from 'react-icons/cg';
import { PatrolShiftWorkPeriodNewEditForm } from 'src/sections/patrol-shift-work-period/patrol-shift-work-period-edit-form';
import { SimpleWorkPeriodTable } from './PatrolShiftWorkPeriodSubTable';

export function PatrolShiftsListView() {
  const { t: t_patrolShift } = useTranslate('patrol-shift');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [openPatrolShiftWorkPeriodDialog, setOpenPatrolShiftWorkPeriodDialog] = useState(false);
  const [currentPatrolShiftWorkPeriodItem, setCurrentPatrolShiftWorkPeriodItem] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetPatrolShift(queryParams);

  const patrolShifts = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const deleteMutation = useDeletePatrolShift();

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
        toast.success(t_patrolShift('toastMessages.delete'));
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
        header: t_patrolShift('columns.name'),
        size: 150,
      },
      {
        accessorKey: 'site.name',
        header: t_patrolShift('columns.siteId'),
        size: 150,
      },
      {
        accessorKey: 'calendar.name',
        header: t_patrolShift('columns.calendarId'),
        size: 150,
      },
      {
        accessorKey: 'validFromDate',
        header: t_patrolShift('columns.validFromDate'),
        size: 120,
      },
      {
        accessorKey: 'validToDate',
        header: t_patrolShift('columns.validToDate'),
        size: 120,
      },
      {
        accessorKey: 'isCycleShift',
        header: t_patrolShift('columns.isCycleShift'),
        size: 100,
      },
    ],
    [currentLang]
  );

  const customRowActions = useMemo(
    () => [
      (row) => (
        <>
          <MenuItem
            key="patrol-shift-work-period"
            onClick={() => {
              (setOpenPatrolShiftWorkPeriodDialog(true), setCurrentPatrolShiftWorkPeriodItem(row));
            }}
          >
            <IconifyLocal>
              <CgDetailsMore size={18} style={{ color: '#79c2d0' }} />
            </IconifyLocal>
            بازه‌های کاری شیفت{' '}
          </MenuItem>
        </>
      ),
    ],
    []
  );

  const handleClosePatrolShiftWorkPeriodDialog = () => {
    setOpenPatrolShiftWorkPeriodDialog(false);
    setCurrentPatrolShiftWorkPeriodItem(null);
  };

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_patrolShift('breadcrumb.patrolShifts')}
          links={[
            { name: t_patrolShift('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_patrolShift('breadcrumb.patrolShifts') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreate}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_patrolShift('buttons.newPatrolShift')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={patrolShifts}
              columns={columns}
              isLoading={isLoading}
              rowCount={totalCount}
              setQueryParams={setQueryParams}
              refetchMethod={refetch}
              page={queryParams.page}
              pageSize={queryParams.pageSize}
              onDelete={handleDelete}
              onEdit={handleEdit}
              customRowActions={customRowActions}
              enableExpanding
              enableRowSelection={false}
              renderDetailPanel={({ row }) => (
                <div style={{ width: '100%', padding: 0 }}>
                  <SimpleWorkPeriodTable shiftId={row.id} />
                </div>
              )}
            />
          </Card>
        </Paper>
      </DashboardContent>

      <PatrolShiftsNewEditForm
        open={openDialog}
        onClose={handleClose}
        currentItem={currentItem}
        onRefetch={refetch}
      />
    </>
  );
}
