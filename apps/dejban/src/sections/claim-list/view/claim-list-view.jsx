'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useDeleteClaim,
  useGetClaim,
} from 'src/services/claim-management/claim-management.service';
import { ClaimNewEditForm } from 'src/sections/claim-list/claim-new-edit-form';

// ----------------------------------------------------------------------

export function ClaimListView() {
  const { t: t_claim } = useTranslate('claim');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetClaim({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allClaims = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateClaim = () => {
    setCurrentClaim(null);
    setOpenDialog(true);
  };

  const deleteClaim = useDeleteClaim();

  const handleDeleteRow = async (row) => {
    deleteClaim.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_claim('toastMessages.delete'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentClaim(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentClaim(null);
  };

  // ========================
  // Grid Events
  // ========================
  const handleSort = (column, direction) => {
    setQueryParams((prev) => ({
      ...prev,
      sortColumn: column,
      sortOrder: direction,
    }));
  };

  const handleSearch = (searchValue) => {
    setQueryParams((prev) => ({
      ...prev,
      searchTerm: searchValue,
    }));
  };

  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setQueryParams((prev) => ({
      ...prev,
      pageSize: newPageSize,
    }));
  };

  // ========================
  // Columns
  // ========================
  const columns = useMemo(
    () => [
      {
        accessorKey: 'displayValue',
        header: t_claim('columns.displayValue'),
        width: 200,
      },
      {
        accessorKey: 'value',
        header: t_claim('columns.value'),
        width: 180,
      },
      {
        accessorKey: 'claimType.name',
        header: t_claim('columns.claimType'),
        width: 150,
        Cell: ({ row }) => row.original.claimType?.name || '-',
      },
      {
        accessorKey: 'description',
        header: t_claim('columns.description'),
        width: 200,
      },
    ],
    [currentLang, t_claim]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_claim('breadcrumb.claims')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateClaim}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_claim('buttons.newClaim')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />
        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allClaims}
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
              onEdit={handleEditRow}
            />
          </Card>
        </Paper>
      </DashboardContent>

      <ClaimNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentClaim={currentClaim}
        onRefetch={handleRefetch}
      />
    </>
  );
}
