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
import { TreasuryInfoNewEditForm } from '../treasury-info-new-edit-form';

const mockTreasuryData = [
  {
    id: '1',
    treasuryLocationName: 'خزانه مرکزی',
    treasuryLocationCode: 'TLC-001',
    centerName: 'مرکز اصلی تهران',
  },
  {
    id: '2',
    treasuryLocationName: 'خزانه شرق',
    treasuryLocationCode: 'TLC-002',
    centerName: 'مرکز منطقه شرق',
  },
  {
    id: '3',
    treasuryLocationName: 'خزانه غرب',
    treasuryLocationCode: 'TLC-003',
    centerName: 'مرکز منطقه غرب',
  },
  {
    id: '4',
    treasuryLocationName: 'خزانه شمال',
    treasuryLocationCode: 'TLC-004',
    centerName: 'مرکز منطقه شمال',
  },
  {
    id: '5',
    treasuryLocationName: 'خزانه جنوب',
    treasuryLocationCode: 'TLC-005',
    centerName: 'مرکز منطقه جنوب',
  },
  {
    id: '6',
    treasuryLocationName: 'خزانه مرکزی شیراز',
    treasuryLocationCode: 'TLC-006',
    centerName: 'مرکز استان فارس',
  },
  {
    id: '7',
    treasuryLocationName: 'خزانه مرکزی اصفهان',
    treasuryLocationCode: 'TLC-007',
    centerName: 'مرکز استان اصفهان',
  },
  {
    id: '8',
    treasuryLocationName: 'خزانه مرکزی مشهد',
    treasuryLocationCode: 'TLC-008',
    centerName: 'مرکز استان خراسان',
  },
  {
    id: '9',
    treasuryLocationName: 'خزانه مرکزی تبریز',
    treasuryLocationCode: 'TLC-009',
    centerName: 'مرکز استان آذربایجان شرقی',
  },
  {
    id: '10',
    treasuryLocationName: 'خزانه مرکزی اهواز',
    treasuryLocationCode: 'TLC-010',
    centerName: 'مرکز استان خوزستان',
  },
];

export function TreasuryInfoListView() {
  const { currentLang } = useTranslate();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [data, setData] = useState(mockTreasuryData);

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
          item.treasuryLocationName?.toLowerCase().includes(search) ||
          item.treasuryLocationCode?.toLowerCase().includes(search) ||
          item.centerName?.toLowerCase().includes(search)
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
    setCurrentStation(null);
    setOpenDialog(true);
  };

  const handleDeleteRow = (row) => {
    setData((prev) => prev.filter((item) => item.id !== row.id));
    toast.success('محل خزانه با موفقیت حذف شد');
  };

  const handleEditRow = (row) => {
    setCurrentStation(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStation(null);
  };

  const handleSaveNew = (newItem) => {
    if (currentStation) {
      // ویرایش
      setData((prev) =>
        prev.map((item) => (item.id === currentStation.id ? { ...item, ...newItem } : item))
      );
      toast.success('محل خزانه با موفقیت ویرایش شد');
    } else {
      // ایجاد جدید
      const newId = String(Date.now());
      setData((prev) => [...prev, { id: newId, ...newItem }]);
      toast.success('محل خزانه با موفقیت ایجاد شد');
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
        accessorKey: 'treasuryLocationName',
        header: 'نام محل خزانه',
        width: 200,
      },
      {
        accessorKey: 'treasuryLocationCode',
        header: 'کد محل خزانه',
        width: 180,
      },
      {
        accessorKey: 'centerName',
        header: 'نام مرکز',
        width: 200,
      },
    ],
    [currentLang]
  );

  return (
    <>
      <DashboardContent maxWidth="xxl">
        <CustomBreadcrumbs
          heading="اطلاعات پایه خزانه"
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
              data={mockTreasuryData}
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

      <TreasuryInfoNewEditForm
        open={openDialog}
        onClose={handleCloseDialog}
        currentStation={currentStation}
        onSave={handleSaveNew}
      />
    </>
  );
}
