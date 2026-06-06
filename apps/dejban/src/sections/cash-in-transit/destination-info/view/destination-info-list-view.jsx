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
import { DestinationInfoNewEditForm } from '../destination-info-new-edit-form';

// Mock data برای اطلاعات مقصد
const mockDestinationData = [
  {
    id: '1',
    destinationName: 'بانک مرکزی',
    destinationCode: 'DST-001',
    address: 'تهران، خیابان فردوسی، پلاک ۱۲۳',
  },
  {
    id: '2',
    destinationName: 'خزانه اصلی',
    destinationCode: 'DST-002',
    address: 'تهران، خیابان انقلاب، نبش خیابان وصال',
  },
  {
    id: '3',
    destinationName: 'اداره کل امور مالی',
    destinationCode: 'DST-003',
    address: 'شیراز، بلوار کریم خان زند، چهارراه پلیس',
  },
  {
    id: '4',
    destinationName: 'شعبه مرکزی بانک ملی',
    destinationCode: 'DST-004',
    address: 'اصفهان، میدان امام حسین، ساختمان بانک ملی',
  },
  {
    id: '5',
    destinationName: 'خزانه استان خراسان',
    destinationCode: 'DST-005',
    address: 'مشهد، بلوار احمدآباد، تقاطع فلسطین',
  },
  {
    id: '6',
    destinationName: 'اداره خزانه استان فارس',
    destinationCode: 'DST-006',
    address: 'شیراز، بلوار مدرس، سه راه گویم',
  },
  {
    id: '7',
    destinationName: 'بانک سپه - شعبه مرکزی',
    destinationCode: 'DST-007',
    address: 'تهران، خیابان سپهبد قرنی، پلاک ۴۵',
  },
  {
    id: '8',
    destinationName: 'خزانه استان اصفهان',
    destinationCode: 'DST-008',
    address: 'اصفهان، خیابان چهارباغ عباسی، کوچه ۱۲',
  },
  {
    id: '9',
    destinationName: 'اداره کل خزانه',
    destinationCode: 'DST-009',
    address: 'تهران، خیابان بهشت، نبش خیابان طالقانی',
  },
  {
    id: '10',
    destinationName: 'خزانه استان خوزستان',
    destinationCode: 'DST-010',
    address: 'اهواز، خیابان سلمان فارسی، مجتمع اداری خوزستان',
  },
];

export function DestinationInfoListView() {
  const { currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentDestination, setCurrentDestination] = useState(null);
  const [data, setData] = useState(mockDestinationData);

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
          item.destinationName?.toLowerCase().includes(search) ||
          item.destinationCode?.toLowerCase().includes(search) ||
          item.address?.toLowerCase().includes(search)
      );
    }

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
    setCurrentDestination(null);
    setOpenDialog(true);
  };

  const handleDeleteRow = (row) => {
    setData((prev) => prev.filter((item) => item.id !== row.id));
    toast.success('مقصد با موفقیت حذف شد');
  };

  const handleEditRow = (row) => {
    setCurrentDestination(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentDestination(null);
  };

  const handleSaveNew = (newItem) => {
    if (currentDestination) {
      // ویرایش
      setData((prev) =>
        prev.map((item) => (item.id === currentDestination.id ? { ...item, ...newItem } : item))
      );
      toast.success('اطلاعات مقصد با موفقیت ویرایش شد');
    } else {
      // ایجاد جدید
      const newId = String(Date.now());
      setData((prev) => [...prev, { id: newId, ...newItem }]);
      toast.success('مقصد با موفقیت ایجاد شد');
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
        accessorKey: 'destinationName',
        header: 'نام مقصد',
        width: 200,
      },
      {
        accessorKey: 'destinationCode',
        header: 'کد مقصد',
        width: 180,
      },
      {
        accessorKey: 'address',
        header: 'آدرس / موقعیت',
        width: 300,
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading="اطلاعات مقصد"
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
              data={mockDestinationData}
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

      <DestinationInfoNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentDestination={currentDestination}
        onSave={handleSaveNew}
      />
    </>
  );
}
