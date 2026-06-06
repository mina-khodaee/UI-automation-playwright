'use client';

import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import { Paper } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useGetPersonnelPairedAccessLogsWithPagination,
  useDeletePersonnelAccessLog,
} from 'src/services/personnel-accessLogs/personnel-accessLogs.service';
import { StaffAccessNewEditForm } from '../staff-access-new-edit-form';
import moment from 'moment-jalaali';

export function StaffAccessBlackListView() {
  const { t: t_common, currentLang } = useTranslate();
  const { t: t_staffAccess } = useTranslate('staff-access');

  const [currentStaffAccess, setCurrentStaffAccess] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetPersonnelPairedAccessLogsWithPagination({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allStaffAccess = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => {
    refetch();
  };

  const deleteStaffAccess = useDeletePersonnelAccessLog();

  const handleDeleteRow = async (row) => {
    console.log('row11', row);

    deleteStaffAccess.mutate(row?.tagId, {
      onSuccess: () => {
        toast.success(t_staffAccess('toastMessages.deleteStaffAccess'));
        handleRefetch();
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentStaffAccess(row);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNew = () => {
    setCurrentStaffAccess(null);
  };

  const handleCloseForm = () => {
    setCurrentStaffAccess(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'aclUser.userName',
        header: t_staffAccess('columns.fullName') || 'نام و نام خانوادگی',
        size: 200,
        Cell: ({ row }) => {
          const userName = row.original.aclUser?.userName;
          return userName || '-';
        },
      },
      {
        accessorKey: 'aclUser.userNationalCode',
        header: t_staffAccess('columns.nationalCode') || 'کد ملی',
        size: 150,
        Cell: ({ row }) => {
          const nationalCode = row.original.aclUser?.userNationalCode;
          return nationalCode || '-';
        },
      },
      {
        accessorKey: 'aclUser.unitName',
        header: t_staffAccess('columns.unitName') || 'واحد',
        size: 150,
        Cell: ({ row }) => {
          const unitName = row.original.aclUser?.unitName;
          return unitName || '-';
        },
      },
      {
        accessorKey: 'entry.doorName',
        header: t_staffAccess('columns.entryDoor') || 'درب ورود',
        size: 120,
        Cell: ({ row }) => {
          const doorName = row.original.entry?.doorName;
          return doorName || '-';
        },
      },
      {
        accessorKey: 'entry.dateTime',
        header: t_staffAccess('columns.entryDateTime') || 'تاریخ و ساعت ورود',
        size: 180,
        Cell: ({ row }) => {
          const dateTime = row.original.entry?.dateTime;
          if (!dateTime) return '-';
          return moment(dateTime).format('jYYYY/jMM/jDD HH:mm:ss');
        },
      },
      {
        accessorKey: 'exit.doorName',
        header: t_staffAccess('columns.exitDoor') || 'درب خروج',
        size: 120,
        Cell: ({ row }) => {
          const doorName = row.original.exit?.doorName;
          return doorName || '-';
        },
      },
      {
        accessorKey: 'exit.dateTime',
        header: t_staffAccess('columns.exitDateTime') || 'تاریخ و ساعت خروج',
        size: 180,
        Cell: ({ row }) => {
          const dateTime = row.original.exit?.dateTime;
          if (!dateTime) return '-';
          return moment(dateTime).format('jYYYY/jMM/jDD HH:mm:ss');
        },
      },
      {
        accessorKey: 'tagId',
        header: 'Tag ID',
        size: 200,
        Cell: ({ row }) => {
          const tagId = row.original.tagId;
          return tagId ? tagId.substring(0, 8) + '...' : '-';
        },
      },
    ],
    [currentLang, t_staffAccess]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_staffAccess('breadcrumb.StaffAccess')}
          links={[
            {
              name: t_staffAccess('breadcrumb.dashboard'),
              href: paths.dashboard.root,
            },
            { name: t_staffAccess('breadcrumb.StaffAccess') },
          ]}
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <StaffAccessNewEditForm
          currentItem={currentStaffAccess}
          onRefetch={handleRefetch}
          onClose={handleCloseForm}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allStaffAccess}
              columns={columns}
              isLoading={isLoading}
              rowCount={totalCount}
              setQueryParams={setQueryParams}
              refetchMethod={handleRefetch}
              page={queryParams.page}
              pageSize={queryParams.pageSize}
              onDelete={handleDeleteRow}
              onEdit={handleEditRow}
              onAdd={handleCreateNew}
            />
          </Card>
        </Paper>
      </DashboardContent>
    </>
  );
}
