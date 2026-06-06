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
import { RecipientInfoNewEditForm } from '../recipient-info-new-edit-form';

const mockRecipientData = [
  {
    id: '1',
    recipientName: 'علی محمدی',
    recipientCode: 'RCP-001',
    position: 'مسئول تحویل خزانه مرکزی',
  },
  { id: '2', recipientName: 'رضا کریمی', recipientCode: 'RCP-002', position: 'تحویل‌دار شعبه شرق' },
  { id: '3', recipientName: 'سارا احمدی', recipientCode: 'RCP-003', position: 'مسئول تحویل اسناد' },
  {
    id: '4',
    recipientName: 'مهدی حسینی',
    recipientCode: 'RCP-004',
    position: 'تحویل‌دار شعبه غرب',
  },
  { id: '5', recipientName: 'زهرا رضایی', recipientCode: 'RCP-005', position: 'مسئول تحویل وجوه' },
  {
    id: '6',
    recipientName: 'حسین اکبری',
    recipientCode: 'RCP-006',
    position: 'تحویل‌دار شعبه شمال',
  },
  {
    id: '7',
    recipientName: 'مریم قالیباف',
    recipientCode: 'RCP-007',
    position: 'مسئول تحویل اوراق بهادار',
  },
  {
    id: '8',
    recipientName: 'امیر قاسمی',
    recipientCode: 'RCP-008',
    position: 'تحویل‌دار شعبه جنوب',
  },
  { id: '9', recipientName: 'نرگس موسوی', recipientCode: 'RCP-009', position: 'مسئول تحویل مرکزی' },
  {
    id: '10',
    recipientName: 'محمد صادقی',
    recipientCode: 'RCP-010',
    position: 'تحویل‌دار شعبه مرکزی',
  },
];

export function RecipientInfoListView() {
  const { currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState(null);
  const [data, setData] = useState(mockRecipientData);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const isLoading = false;

  // فیلتر کردن دیتا بر اساس جستجو
  const filteredData = useMemo(() => {
    let result = [...data];

    if (queryParams.searchTerm) {
      const search = queryParams.searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.recipientName?.toLowerCase().includes(search) ||
          item.recipientCode?.toLowerCase().includes(search) ||
          item.position?.toLowerCase().includes(search)
      );
    }

    // مرتب‌سازی
    if (queryParams.sortColumn && queryParams.sortOrder) {
      result.sort((a, b) => {
        const aVal = a[queryParams.sortColumn];
        const bVal = b[queryParams.sortColumn];
        const comparison = String(aVal).localeCompare(String(bVal));
        return queryParams.sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, queryParams.searchTerm, queryParams.sortColumn, queryParams.sortOrder]);

  // const paginatedData = useMemo(() => {
  //   const start = (queryParams.page - 1) * queryParams.pageSize;
  //   const end = start + queryParams.pageSize;
  //   return filteredData.slice(start, end);
  // }, [filteredData, queryParams.page, queryParams.pageSize]);

  const totalCount = filteredData.length;

  const handleRefetch = () => {};

  const handleCreate = () => {
    setCurrentRecipient(null);
    setOpenDialog(true);
  };

  const handleDeleteRow = (row) => {
    setData((prev) => prev.filter((item) => item.id !== row.id));
    toast.success('تحویل‌دار با موفقیت حذف شد');
  };

  const handleEditRow = (row) => {
    setCurrentRecipient(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRecipient(null);
  };

  const handleSaveNew = (newItem) => {
    if (currentRecipient) {
      // ویرایش
      setData((prev) =>
        prev.map((item) => (item.id === currentRecipient.id ? { ...item, ...newItem } : item))
      );
      toast.success('اطلاعات تحویل‌دار با موفقیت ویرایش شد');
    } else {
      // ایجاد جدید
      const newId = String(Date.now());
      setData((prev) => [...prev, { id: newId, ...newItem }]);
      toast.success('تحویل‌دار با موفقیت ایجاد شد');
    }
  };

  const handleSort = (column, direction) => {
    setQueryParams((prev) => ({ ...prev, sortColumn: column, sortOrder: direction }));
  };

  const handleSearch = (searchValue) => {
    setQueryParams((prev) => ({ ...prev, searchTerm: searchValue, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setQueryParams((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  // ستون‌های جدول فقط سه فیلد اصلی
  const columns = useMemo(
    () => [
      {
        accessorKey: 'recipientName',
        header: 'نام تحویل‌دار',
        width: 200,
      },
      {
        accessorKey: 'recipientCode',
        header: 'کد تحویل‌دار',
        width: 180,
      },
      {
        accessorKey: 'position',
        header: 'سمت / مسئولیت',
        width: 220,
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading="اطلاعات تحویل‌دار"
          action={
            <Button
              color="inherit"
              onClick={handleCreate}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              جدید
            </Button>
          }
          sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
        />

        <Paper elevation={12}>
          <Card>
            <MRTDataTable
              data={mockRecipientData}
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

      <RecipientInfoNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentRecipient={currentRecipient}
        onSave={handleSaveNew}
      />
    </>
  );
}
