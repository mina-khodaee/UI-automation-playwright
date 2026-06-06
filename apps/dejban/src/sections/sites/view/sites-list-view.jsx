'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { fDateTime } from '@repo/ui/utils';
import { SiteNewEditForm } from '../sites-new-edit-form';
import { useTranslation } from 'react-i18next';
import { useGetSites, useDeleteSite } from 'src/services/siteManagement/site.service';

export function SitesListView() {
  const { t } = useTranslation('site');

  const [openDialog, setOpenDialog] = useState(false);
  const [currentSite, setCurrentSite] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  // دریافت دیتا از API
  const { data, isLoading, refetch } = useGetSites({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allSites = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  const handleCreateSite = () => {
    setCurrentSite(null);
    setOpenDialog(true);
  };

  const deleteSite = useDeleteSite();

  const handleDeleteRow = (row) => {
    deleteSite.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t('toastMessages.delete'));
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || 'خطا رخ داد');
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentSite(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSite(null);
  };

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
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setQueryParams((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  // پیدا کردن نام مرکز والد
  const getParentSiteName = (parentSiteId, sites) => {
    if (!parentSiteId) return '-';
    const parent = sites.find((s) => s.id === parentSiteId);
    return parent?.name || '-';
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('columns.name'),
        width: 250,
      },
      {
        accessorKey: 'parentSiteId',
        header: t('columns.parentSiteId'),
        width: 200,
        Cell: ({ cell }) => getParentSiteName(cell.getValue(), allSites),
      },
      {
        accessorKey: 'description',
        header: t('columns.description'),
        width: 250,
        Cell: ({ cell }) => cell.getValue() || '-',
      },
      {
        accessorKey: 'createdAt',
        header: t('columns.createdAt'),
        width: 180,
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
    ],
    [t, allSites]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t('breadcrumb.sites')}
          action={
            <Button
              color="inherit"
              onClick={handleCreateSite}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t('buttons.newSite')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allSites}
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

      <SiteNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentSite={currentSite}
        onRefetch={handleRefetch}
      />
    </>
  );
}
