'use client';

import { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  CircularProgress,
  Card,
  Grid,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'sonner';

import {
  useGetPatrolShiftWorkPeriod,
  useDeletePatrolShiftWorkPeriod,
} from 'src/services/patrol-shift-work-period/patrol-shift-work-period.service';

import { PatrolShiftWorkPeriodNewEditForm } from 'src/sections/patrol-shift-work-period/patrol-shift-work-period-edit-form';

export function SimpleWorkPeriodTable({ shiftId }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // فقط بر اساس shiftId دیتا بگیر
  const { data, isLoading, refetch } = useGetPatrolShiftWorkPeriod({ shiftId });

  const deleteMutation = useDeletePatrolShiftWorkPeriod();

  const workPeriods = data?.items || [];

  const handleEdit = (row) => {
    setCurrentItem(row);
    setOpenDialog(true);
  };

  const handleDelete = (row) => {
    deleteMutation.mutate(row.id, {
      onSuccess: () => {
        toast.success('نوبت کاری حذف شد');
        refetch();
      },
    });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Card sx={{ width: '100%' }}>
          <Table size="small" sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>نام</TableCell>
                <TableCell>از تاریخ</TableCell>
                <TableCell>تا تاریخ</TableCell>
                <TableCell>وقفه</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>

            <TableBody sx={{ width: '100%' }}>
              {workPeriods.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>{row.hasBreak ? 'دارد' : 'ندارد'}</TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleEdit(row)}>
                      <Edit fontSize="small" />
                    </IconButton>

                    <IconButton color="error" onClick={() => handleDelete(row)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Paper>

      <PatrolShiftWorkPeriodNewEditForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        currentItem={currentItem}
        onRefetch={refetch}
      />
    </>
  );
}
