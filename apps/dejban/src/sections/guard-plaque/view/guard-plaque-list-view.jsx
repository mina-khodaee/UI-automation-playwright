'use client';

import { toast } from 'sonner';
import { useState, useMemo, useEffect } from 'react';
import Card from '@mui/material/Card';
import { Chip, Paper, Stack } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import GuardPlaqueNewEditForm from '../guard-plaque-new-edit-form';
import {
  useGetPatrolBoards,
  useDeletePatrolBoard,
} from 'src/services/patrol-boards/patrol-boards.service';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

export function GuardPlaqueListView() {
  const { t: t_GuardPlaque } = useTranslate('patrol-area');
  const { t: t_common, currentLang } = useTranslate();

  const [currentGuardPlaque, setCurrentGuardPlaque] = useState(null);
  const [boardFilters, setBoardFilters] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
    ShiftId: undefined,
    WorkPeriodId: undefined,
    BoardDate: undefined,
  });

  useEffect(() => {
    if (
      boardFilters &&
      boardFilters.ShiftId &&
      boardFilters.WorkPeriodId &&
      boardFilters.BoardDate
    ) {
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
        ShiftId: boardFilters.ShiftId,
        WorkPeriodId: boardFilters.WorkPeriodId,
        BoardDate: boardFilters.BoardDate,
      }));
    } else if (boardFilters === null) {
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
        ShiftId: undefined,
        WorkPeriodId: undefined,
        BoardDate: undefined,
      }));
    }
  }, [boardFilters]);

  const handleFiltersChange = (filters) => {
    setBoardFilters(filters);
  };

  const { data, isLoading, refetch } = useGetPatrolBoards(queryParams);

  const refetchBoardsList = () => {
    refetch();
  };

  const GuardPlaques = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const deleteGuardPlaque = useDeletePatrolBoard();

  const handleCreateGuardPlaque = () => {
    setCurrentGuardPlaque(null);
  };

  const handleEditRow = (row) => {
    setCurrentGuardPlaque(row);
  };

  const handleDeleteRow = (row) => {
    deleteGuardPlaque.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_GuardPlaque('toastMessages.delete'));
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'personnel.fullName',
        header: 'نام پرسنل',
        size: 150,
        Cell: ({ row }) => row.original.personnel?.fullName || '-',
      },
      {
        accessorKey: 'shift.name',
        header: 'شیفت',
        size: 120,
        Cell: ({ row }) => row.original.shift?.name || '-',
      },
      {
        accessorKey: 'workPeriod.name',
        header: 'نوبت',
        size: 120,
        Cell: ({ row }) => row.original.workPeriod?.name || '-',
      },
      {
        accessorKey: 'entryTime',
        header: 'زمان ورود',
        size: 100,
        Cell: ({ row }) => row.original.entryTime || '-',
      },
      {
        accessorKey: 'exitTime',
        header: 'زمان خروج',
        size: 100,
        Cell: ({ row }) => row.original.exitTime || '-',
      },
      {
        accessorKey: 'isPresent',
        header: 'وضعیت',
        size: 100,
        Cell: ({ row }) => (
          <Chip
            label={row.original.isPresent ? 'حاضر' : 'غایب'}
            color={row.original.isPresent ? 'success' : 'error'}
            size="small"
          />
        ),
      },
      {
        accessorKey: 'patrolArea',
        header: 'مکان‌ها',
        size: 200,
        Cell: ({ row }) => {
          const areas = row.original.patrolArea || [];
          return (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
              {areas.length > 0 ? (
                areas.map((area) => (
                  <Chip key={area.id} label={area.name} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="caption" color="text.secondary">
                  -
                </Typography>
              )}
            </Stack>
          );
        },
      },
      {
        accessorKey: 'equipments',
        header: 'تجهیزات',
        size: 200,
        Cell: ({ row }) => {
          const equipments = row.original.equipments || [];
          return (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
              {equipments.length > 0 ? (
                equipments.map((eq) => (
                  <Chip key={eq.id} label={eq.name} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="caption" color="text.secondary">
                  -
                </Typography>
              )}
            </Stack>
          );
        },
      },
      {
        accessorKey: 'boardDate',
        header: 'تاریخ لوح',
        size: 120,
        Cell: ({ row }) => dayjs(row.original.boardDate).format('YYYY/MM/DD'),
      },
      {
        accessorKey: 'description',
        header: 'توضیحات',
        size: 150,
        Cell: ({ row }) => row.original.description || '-',
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading="لوح نگهبانی"
          links={[{ name: 'لوح نگهبانی', href: paths.dashboard.root }, { name: 'لوح نگهبانی' }]}
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <GuardPlaqueNewEditForm
          currentItem={currentGuardPlaque}
          onRefetch={refetch}
          onBoardCreated={refetchBoardsList}
          onFiltersChange={handleFiltersChange}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={GuardPlaques}
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
    </>
  );
}
