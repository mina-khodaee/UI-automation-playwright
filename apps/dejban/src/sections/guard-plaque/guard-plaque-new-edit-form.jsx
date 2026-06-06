'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslate } from 'src/locales';
import { toast } from 'sonner';

import {
  useCreatePatrolBoard,
  useGetPatrolBoardPersonnels,
  useUpdatePatrolBoard,
} from 'src/services/patrol-boards/patrol-boards.service';

import { useGetEquipment } from 'src/services/equipment/equipment.service';
import { useGetPatrolShift } from 'src/services/patrol-shift/patrol-shift.service';
import { useGetPatrolArea } from 'src/services/patrol-area/patrol-area.service';
import { useGetPatrolShiftWorkPeriod } from 'src/services/patrol-shift-work-period/patrol-shift-work-period.service';

const GuardPlaqueNewEditForm = ({ onBoardCreated, onFiltersChange }) => {
  const { t: t_plaque } = useTranslate('guardPlaque');
  const { t: t_common } = useTranslate();

  const [rows, setRows] = useState([]);
  console.log('rows111', rows);
  const [hasSearched, setHasSearched] = useState(false);
  const [submittingRowId, setSubmittingRowId] = useState(null);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  const [filterDate, setFilterDate] = useState(dayjs());
  const [filterShift, setFilterShift] = useState('');
  const [filterTurn, setFilterTurn] = useState('');

  const { data: shiftsData } = useGetPatrolShift();
  const { data: turnsData } = useGetPatrolShiftWorkPeriod();
  const { data: locationsData } = useGetPatrolArea();
  const { data: equipmentsData } = useGetEquipment();

  const createPatrolBoard = useCreatePatrolBoard();
  const updatePatrolBoard = useUpdatePatrolBoard();

  const shiftOptions = shiftsData?.items?.map((i) => ({ value: i.id, label: i.name })) || [];
  const turnOptions = turnsData?.items?.map((i) => ({ value: i.id, label: i.name })) || [];
  const locationOptions = locationsData?.items?.map((i) => ({ value: i.id, label: i.name })) || [];
  const equipmentOptions =
    equipmentsData?.items?.map((i) => ({ value: i.id, label: i.name })) || [];

  const {
    data: patrolBoardsData,
    isLoading,
    refetch,
  } = useGetPatrolBoardPersonnels(
    hasSearched && filterShift && filterTurn && filterDate
      ? {
          ShiftId: filterShift,
          WorkPeriodId: filterTurn,
          BoardDate: filterDate.toISOString(),
          Page: 1,
          PageSize: 100,
        }
      : {}
  );

  console.log('patrolBoardsData', patrolBoardsData);

  useEffect(() => {
    if (patrolBoardsData?.items) {
      setRows(patrolBoardsData.items);
    }
  }, [patrolBoardsData]);

  const handleSearch = () => {
    if (!filterDate || !filterShift || !filterTurn) {
      toast.error('لطفاً تاریخ، شیفت و نوبت را انتخاب کنید');
      return;
    }
    setHasSearched(true);
    setTimeout(() => refetch(), 0);

    if (onFiltersChange) {
      onFiltersChange({
        ShiftId: filterShift,
        WorkPeriodId: filterTurn,
        BoardDate: filterDate.toISOString(),
      });
    }
  };

  const handleClearFilters = () => {
    setFilterDate(dayjs());
    setFilterShift('');
    setFilterTurn('');
    setRows([]);
    setHasSearched(false);

    if (onFiltersChange) {
      onFiltersChange(null);
    }
  };

  const handleNextDay = () => {
    setFilterDate((prev) => prev.add(1, 'day'));
    setTimeout(() => {
      if (hasSearched && onFiltersChange) {
        onFiltersChange({
          ShiftId: filterShift,
          WorkPeriodId: filterTurn,
          BoardDate: filterDate.add(1, 'day').toISOString(),
        });
      }
    }, 0);
  };

  const handlePrevDay = () => {
    setFilterDate((prev) => prev.subtract(1, 'day'));
    setTimeout(() => {
      if (hasSearched && onFiltersChange) {
        onFiltersChange({
          ShiftId: filterShift,
          WorkPeriodId: filterTurn,
          BoardDate: filterDate.subtract(1, 'day').toISOString(),
        });
      }
    }, 0);
  };

  const handleInlineEdit = async (rowId, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)));

    try {
      await updatePatrolBoard.mutateAsync({
        id: rowId,
        [field]: value,
      });
      toast.success('با موفقیت به‌روزرسانی شد');
      refetch();
    } catch (error) {
      toast.error('خطا در به‌روزرسانی');
      refetch();
    }
  };

  const handleSingleSubmit = async (row) => {
    setSubmittingRowId(row.id);

    const payload = {
      boardDate: filterDate.toISOString(),
      shiftId: filterShift,
      workPeriodId: filterTurn,
      patrolBoardMembers: [
        {
          personnelId: row.personnel?.id,
          isPresent: row.status === 'حاضر',
          entryTime: row.entryTime || '',
          exitTime: row.exitTime || '',
          equipmentIds: row.equipmentIds || [],
          patrolAreaIds: row.locationIds || [],
        },
      ],
    };

    try {
      await createPatrolBoard.mutateAsync(payload);
      toast.success(`رکورد ${row.personnel?.fullName} با موفقیت ثبت شد`);

      refetch();
      if (onBoardCreated) {
        onBoardCreated();
      }
    } catch (error) {
      toast.error('خطا در ثبت تکی');
    } finally {
      setSubmittingRowId(null);
    }
  };

  const handleBulkSubmit = async () => {
    if (!rows.length) {
      toast.error('هیچ داده‌ای برای ارسال وجود ندارد');
      return;
    }

    setIsBulkSubmitting(true);

    const payload = {
      boardDate: filterDate.toISOString(),
      shiftId: filterShift,
      workPeriodId: filterTurn,
      patrolBoardMembers: rows.map((row) => ({
        personnelId: row.personnel?.id,
        isPresent: row.status === 'حاضر',
        entryTime: row.entryTime || '',
        exitTime: row.exitTime || '',
        equipmentIds: row.equipmentIds || [],
        patrolAreaIds: row.locationIds || [],
      })),
    };

    try {
      await createPatrolBoard.mutateAsync(payload);
      toast.success('تمامی رکوردها با موفقیت ثبت شدند');

      refetch();
      if (onBoardCreated) {
        onBoardCreated();
      }
    } catch (error) {
      toast.error('خطا در ثبت دسته‌جمعی');
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3}>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
          {/* Filter Section */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h6" fontWeight={500}>
                فیلترلوح نگهبانی
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained">گزارش +</Button>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="flex-end" flexWrap="wrap" gap={2}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>شیفت</InputLabel>
                <Select
                  value={filterShift}
                  label="شیفت"
                  onChange={(e) => setFilterShift(e.target.value)}
                >
                  {shiftOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>نوبت</InputLabel>
                <Select
                  value={filterTurn}
                  label="نوبت"
                  onChange={(e) => setFilterTurn(e.target.value)}
                >
                  {turnOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <IconButton onClick={handlePrevDay}>
                  <ArrowBackIcon />
                </IconButton>
                <DatePicker
                  label="تاریخ"
                  value={filterDate}
                  onChange={(newValue) => setFilterDate(newValue)}
                  slotProps={{ textField: { size: 'small', sx: { width: 160 } } }}
                />
                <IconButton onClick={handleNextDay}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!filterDate || !filterShift || !filterTurn}
              >
                جستجو
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
              >
                پاک کردن
              </Button>
            </Stack>
          </Paper>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" width={60}>
                    ردیف
                  </TableCell>
                  <TableCell align="center" width={180}>
                    پرسنل
                  </TableCell>
                  <TableCell align="center" width={250}>
                    مکان
                  </TableCell>
                  <TableCell align="center" width={250}>
                    تجهیزات
                  </TableCell>
                  <TableCell align="center" width={120}>
                    ورود
                  </TableCell>
                  <TableCell align="center" width={120}>
                    خروج
                  </TableCell>
                  <TableCell align="center" width={120}>
                    وضعیت
                  </TableCell>
                  <TableCell align="center" width={100}>
                    عملیات
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      در حال بارگذاری...
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <TableRow key={row.id} hover>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{row.personnel?.fullName}</TableCell>

                      <TableCell align="center" sx={{ minWidth: 250 }}>
                        <Select
                          multiple
                          size="small"
                          fullWidth
                          value={row.locationIds || []}
                          onChange={(e) => handleInlineEdit(row.id, 'locationIds', e.target.value)}
                          renderValue={(selected) => (
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                              {selected.map((val) => {
                                const label =
                                  locationOptions.find((opt) => opt.value === val)?.label || val;
                                return <Chip key={val} label={label} size="small" />;
                              })}
                            </Stack>
                          )}
                        >
                          {locationOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>

                      <TableCell align="center" sx={{ minWidth: 250 }}>
                        <Select
                          multiple
                          size="small"
                          fullWidth
                          value={row.equipmentIds || []}
                          onChange={(e) => handleInlineEdit(row.id, 'equipmentIds', e.target.value)}
                          renderValue={(selected) => (
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                              {selected.map((val) => {
                                const label =
                                  equipmentOptions.find((opt) => opt.value === val)?.label || val;
                                return <Chip key={val} label={label} size="small" />;
                              })}
                            </Stack>
                          )}
                        >
                          {equipmentOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>

                      <TableCell align="center">
                        <TimePicker
                          value={row.entryTime ? dayjs(row.entryTime, 'HH:mm') : null}
                          onChange={(newValue) =>
                            handleInlineEdit(row.id, 'entryTime', newValue?.format('HH:mm') || '')
                          }
                          slotProps={{ textField: { size: 'small', sx: { width: 130 } } }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <TimePicker
                          value={row.exitTime ? dayjs(row.exitTime, 'HH:mm') : null}
                          onChange={(newValue) =>
                            handleInlineEdit(row.id, 'exitTime', newValue?.format('HH:mm') || '')
                          }
                          slotProps={{ textField: { size: 'small', sx: { width: 130 } } }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Select
                          size="small"
                          value={row.status || 'حاضر'}
                          onChange={(e) => handleInlineEdit(row.id, 'status', e.target.value)}
                          sx={{ width: 100 }}
                        >
                          <MenuItem value="حاضر">
                            <Chip label="حاضر" color="success" size="small" />
                          </MenuItem>
                          <MenuItem value="غایب">
                            <Chip label="غایب" color="error" size="small" />
                          </MenuItem>
                          <MenuItem value="ماموریت">
                            <Chip label="ماموریت" color="warning" size="small" />
                          </MenuItem>
                        </Select>
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSingleSubmit(row)}
                          disabled={submittingRowId === row.id || isBulkSubmitting}
                        >
                          {submittingRowId === row.id ? 'درحال ثبت...' : 'ثبت'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">
                        {hasSearched
                          ? 'داده‌ای یافت نشد.'
                          : 'لطفاً فیلترهای تاریخ، شیفت و نوبت را انتخاب کنید.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* دکمه ارسال دسته‌جمعی */}
          {rows.length > 0 && (
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleBulkSubmit}
                disabled={isBulkSubmitting}
              >
                {isBulkSubmitting ? 'در حال ارسال دسته‌جمعی...' : 'ارسال دسته‌جمعی'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default GuardPlaqueNewEditForm;
