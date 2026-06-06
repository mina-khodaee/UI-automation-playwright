// src/app/claim-types/claim-type-list-view.jsx

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
  useDeleteClaimType,
  useGetClaimType,
} from 'src/services/claim-management/claim-management.service';
import { ClaimTypeNewEditForm } from 'src/sections/claim-tyeps/claim-types-new-edit-form';

// ----------------------------------------------------------------------

export function ClaimTypeListView() {
  const { t: t_claimType } = useTranslate('claim-type');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentClaimType, setCurrentClaimType] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetClaimType({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allClaimTypes = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateClaimType = () => {
    setCurrentClaimType(null);
    setOpenDialog(true);
  };

  const deleteClaimType = useDeleteClaimType();

  const handleDeleteRow = async (row) => {
    deleteClaimType.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_claimType('toastMessages.delete'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentClaimType(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentClaimType(null);
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
        accessorKey: 'name',
        header: t_claimType('columns.name'),
        width: 200,
      },
      {
        accessorKey: 'description',
        header: t_claimType('columns.description'),
        width: 300,
      },
    ],
    [currentLang, t_claimType]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_claimType('breadcrumb.claimTypes')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateClaimType}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_claimType('buttons.newClaimType')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />
        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allClaimTypes}
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

      <ClaimTypeNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentClaimType={currentClaimType}
        onRefetch={handleRefetch}
      />
    </>
  );
}
