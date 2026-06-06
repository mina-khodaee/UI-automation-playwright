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
import {
  useGetVisitorCards,
  useDeleteVisitorCards,
} from 'src/services/visitor-cards/visitor-cards.service';
import { VisitorCardsNewCreateForm } from '../visitor-cards-create-form';

export function VisitorCardsListView() {
  const { t: t_visitorCards } = useTranslate('visitor-cards');
  const { t: t_common, currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentVisitorCards, setCurrentVisitorCards] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const { data, isLoading, refetch } = useGetVisitorCards({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
  });

  const allVisitorCards = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const tableData = allVisitorCards.map((item) => ({
    ...item,
    cardsStatus: item?.isAssigned ? 'فعال' : 'غیر فعال',
    visitorName: item?.visitor?.fullName || 'ندارد',
  }));

  const handleRefetch = () => refetch();

  // ========================
  // CRUD Handlers
  // ========================
  const handleCreateVisitorCards = () => {
    setCurrentVisitorCards(null);
    setOpenDialog(true);
  };

  const deleteVisitorCards = useDeleteVisitorCards();

  const handleDeleteRow = async (card) => {
    deleteVisitorCards.mutate(card?.id, {
      onSuccess: () => {
        toast.success(t_visitorCards('toastMessages.deleteVisitorCards'));
      },
      onError: (error) => {
        toast.error(error.message || t_common('errors.unknownError'));
      },
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentVisitorCards(null);
  };

  // ========================
  // Grid Events
  // ========================
  const handleSort = (column, direction) => {
    setSortColumnQuery(column);
    setSortOrderQuery(direction);
  };

  const handleSearch = (searchValue) => {
    setSearchQuery(searchValue);
  };

  const handlePageChange = (newPage) => {
    setPageQuery(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSizeQuery(newPageSize);
  };

  // ========================
  // Columns
  // ========================
  const columns = useMemo(
    () => [
      {
        accessorKey: 'cardNumber',
        header: t_visitorCards('columns.cardNumber'),
      },

      {
        accessorKey: 'cardsStatus',
        header: t_visitorCards('columns.isAssigned'),
        size: 150,
      },
      {
        accessorKey: 'visitorName',
        header: t_visitorCards('columns.visitor'),
        size: 150,
      },
      {
        accessorKey: 'description',
        header: t_visitorCards('columns.description'),
        width: 180,
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading={t_visitorCards('breadcrumb.blockUsers')}
          links={[
            { name: t_visitorCards('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_visitorCards('breadcrumb.blockUsers') },
          ]}
          action={
            <Button
              color="inherit"
              onClick={handleCreateVisitorCards}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_visitorCards('buttons.newVisitorCards')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 4 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={tableData}
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
            />
          </Card>
        </Paper>
      </DashboardContent>

      <VisitorCardsNewCreateForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentVisitorCards={currentVisitorCards}
        onRefetch={handleRefetch}
      />
    </>
  );
}
