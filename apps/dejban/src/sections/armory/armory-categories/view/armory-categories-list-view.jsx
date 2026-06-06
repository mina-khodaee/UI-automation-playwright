// src/sections/armory-categories/view/armory-categories-list-view.jsx

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
import { ArmoryCategoriesNewEditForm } from '../armory-categories-new-edit-form';
import { useGetCategories, useDeleteCategory } from 'src/services/armory-categories/armory-categories.service';

export function ArmoryCategoriesListView() {
  const { t: t_categories } = useTranslate('armory-categories');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: ''
  });

  const { data, isLoading, refetch } = useGetCategories({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allCategories = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleRefetch = () => refetch();

  const handleCreate = () => {
    setCurrentCategory(null);
    setOpenDialog(true);
  };

  const deleteCategory = useDeleteCategory();

  const handleDeleteRow = (row) => {
    deleteCategory.mutate(row?.id, {
      onSuccess: () => {
        toast.success(t_categories('toastMessages.deleteSuccess'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleEditRow = (row) => {
    setCurrentCategory(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCategory(null);
  };

  const handleSort = (column, direction) => {
    setQueryParams(prev => ({ ...prev, sortColumn: column, sortOrder: direction }));
  };

  const handleSearch = (searchValue) => {
    setQueryParams(prev => ({ ...prev, searchTerm: searchValue, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setQueryParams(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setQueryParams(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: t_categories('columns.name'),
      width: 200,
    },
    {
      accessorKey: 'code',
      header: t_categories('columns.code'),
      width: 150,
    },
    {
      accessorKey: 'hasSerialNumber',
      header: t_categories('columns.hasSerialNumber'),
      width: 150,
      Cell: ({ cell }) => cell.getValue() ? t_categories('yes') : t_categories('no'),
    },
    {
      accessorKey: 'description',
      header: t_categories('fields.description'),
      width: 300,
    },
    {
      accessorKey: 'status',
      header: t_categories('fields.status'),
      width: 100,
      Cell: ({ cell }) => cell.getValue() ? t_categories('status.active') : t_categories('status.inactive'),
    },
  ], [currentLang, t_categories]);

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_categories('breadcrumb.title')}
          action={
            <Button
              color="inherit"
              onClick={handleCreate}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_categories('buttons.newCategory')}
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={allCategories}
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

      <ArmoryCategoriesNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentCategory={currentCategory}
        onRefetch={handleRefetch}
      />
    </>
  );
}