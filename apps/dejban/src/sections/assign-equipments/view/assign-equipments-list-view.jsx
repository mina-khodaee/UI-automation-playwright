'use client';

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

import { AssignEquipmentsForm } from '../assign-equipments-form';
import { useGetAssignEquipments } from 'src/services/assign-equipments/assign-equipments.service';

export function AssignEquipmentsListView() {
  const { t: t_assign } = useTranslate('assign-equipments');
  const { currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetAssignEquipments({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allAssignments = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  // ========================
  // Handlers
  // ========================
  const handleCreateAssignment = () => {
    setCurrentAssignment(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAssignment(null);
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
      { accessorKey: 'personnel.fullName', header: t_assign('columns.personnels') },
      { accessorKey: 'equipment.name', header: t_assign('columns.equipments') },
      { accessorKey: 'startDate', header: t_assign('columns.startDate') },
      { accessorKey: 'endDate', header: t_assign('columns.endDate') },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_assign('breadcrumb.assignEquipment')}
          links={[
            { name: t_assign('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_assign('breadcrumb.newAssignEquipment') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreateAssignment}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_assign('buttons.newAssignEquipment')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allAssignments}
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
            />
          </Card>
        </Paper>
      </DashboardContent>

      <AssignEquipmentsForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentAssignment={currentAssignment}
        onRefetch={handleRefetch}
      />
    </>
  );
}
