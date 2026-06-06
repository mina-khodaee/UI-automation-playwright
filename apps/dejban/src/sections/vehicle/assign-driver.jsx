'use client'

import { useMemo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { Form } from 'src/components/hook-form';
import { z as zod } from 'zod';
import {
  Box, Dialog, DialogContent, DialogTitle, Autocomplete,
  TextField, Button, Typography, Alert, FormControl, InputLabel, MenuItem, FormHelperText, Select
} from '@mui/material';
import { FaTrash, FaStop } from "react-icons/fa";
import { toast } from 'sonner';
import { useCreateVehicleAssignment, useDeleteVehicleAssignment, useGetActiveVehicleAssignmentsByVehicleId, useUpdateVehicleAssignment, useEndVehicleAssignment } from 'src/services/vehicle-assignment/vehicle-assignment.service';
import { skipToken } from '@tanstack/react-query';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment-jalaali';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetPersonnels } from 'src/services/personnels/personnels.servise';

const ASSIGNMENT_TYPES = {
  PERMANENT: 0,        // Permanent
  TEMPORARY: 1,        // Temporary
  MAINTENANCE: 2,      // MaintenanceTransfer
};

const assignmentTypeOptions = [
  { value: ASSIGNMENT_TYPES.PERMANENT, label: 'دائم' },
  { value: ASSIGNMENT_TYPES.TEMPORARY, label: 'موقت' },
  { value: ASSIGNMENT_TYPES.MAINTENANCE, label: 'انتقال تعمیرات' },
];

const AssignmentSchema = zod.object({
  personnelCode: zod.string().min(1, 'انتخاب پرسنل الزامی است'),
  assignmentType: zod.number().min(0, 'نوع تخصیص الزامی است'),
  startDate: zod.string().min(1, 'تاریخ شروع الزامی است'),
  endDate: zod.string().optional(),
});

export function AssignDriverForm({ open, onClose, currentData, onRefetch }) {

  const createVehicleAssignment = useCreateVehicleAssignment();
  const updateVehicleAssignment = useUpdateVehicleAssignment();
  const deleteVehicleAssignment = useDeleteVehicleAssignment();
  const endVehicleAssignment = useEndVehicleAssignment();

  // Get data for use in selectbox
  const { data: personnelsData, isLoading: personnelsLoading } = useGetPersonnels();
  const personnels = personnelsData?.items || [];

  console.log('currentData', currentData)

  // Get default value or active assignment 
  const { data: assignmentData, isLoading: assignmentLoading, refetch: refetchAssignment } =
    useGetActiveVehicleAssignmentsByVehicleId(
      currentData?.id ? currentData?.id : skipToken
    );

  console.log('assignmentData', assignmentData)

  const activeAssignment = assignmentData?.[0] || null;

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(AssignmentSchema),
    defaultValues: {
      personnelCode: '',
      assignmentType: ASSIGNMENT_TYPES.PERMANENT,
      startDate: '',
      endDate: '',
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const selectedPersonnelCode = watch('personnelCode');

  const selectedPersonnel = useMemo(() =>
    personnels.find(p => p.personnelCode === selectedPersonnelCode) || null,
    [personnels, selectedPersonnelCode]
  );


  // ========================
  // Find Staff From Personnel With Driver Id
  // ========================
  const activeAssignmentPersonnel = useMemo(() => {
    if (!activeAssignment?.driverId || !personnels.length) return null;
    return personnels.find(p => p.id === activeAssignment.driverId) || null;
  }, [activeAssignment, personnels]);

  // ========================
  // Useefect for setvalue to fields when dialog is open
  // ========================
  useEffect(() => {
    if (open) {
      if (activeAssignment) {
        // Setvalue with default values if there was an active assignments
        if (activeAssignmentPersonnel) {
          setValue('personnelCode', activeAssignmentPersonnel.personnelCode);
        }
        setValue('assignmentType', activeAssignment.assignmentType ?? ASSIGNMENT_TYPES.PERMANENT);
        setValue('startDate', activeAssignment.startDate || moment().format('YYYY-MM-DD'));
        setValue('endDate', moment().format('YYYY-MM-DD'));
      } else {
        // Setvalue with default values if there was no active assignments
        setValue('personnelCode', '');
        setValue('assignmentType', ASSIGNMENT_TYPES.PERMANENT);
        setValue('startDate', moment().format('YYYY-MM-DD'));
        setValue('endDate', moment().format('YYYY-MM-DD'));
      }
    }
  }, [open, activeAssignment, setValue]);

  // ========================
  // Reset form when dialog closed
  // ========================
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  // ========================
  // Submit data
  // ========================
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!selectedPersonnel) {
        toast.error('لطفاً یک پرسنل را انتخاب کنید');
        return;
      }

      const assignmentData = {
        vehicleId: currentData?.id,
        driverId: selectedPersonnel.id,
        assignmentType: data.assignmentType,
        startDate: moment(data.startDate).toISOString(),
      };

      if (activeAssignment) {
        await updateVehicleAssignment.mutateAsync({
          id: activeAssignment.id,
          ...assignmentData
        });
        toast.success('تخصیص راننده با موفقیت ویرایش شد');
      } else {
        await createVehicleAssignment.mutateAsync(assignmentData);
        toast.success('راننده با موفقیت تخصیص یافت');
      }

      onRefetch?.();
      refetchAssignment();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'خطا در انجام عملیات');
    }
  });

  // ========================
  // Delete data
  // ========================
  const handleDelete = async () => {
    if (!activeAssignment) {
      toast.error('تخصیصی برای حذف وجود ندارد');
      return;
    }

    try {
      await deleteVehicleAssignment.mutateAsync(activeAssignment.id);
      toast.success('تخصیص راننده با موفقیت حذف شد');
      onRefetch?.();
      refetchAssignment();
      setValue('personnelCode', '');
      setValue('assignmentType', ASSIGNMENT_TYPES.PERMANENT);
      setValue('startDate', moment().format('YYYY-MM-DD'));
      setValue('endDate', moment().format('YYYY-MM-DD'));
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'خطا در حذف تخصیص');
    }
  };

  // ========================
  // End Assignment
  // ========================
  const handleEndAssignment = async () => {
    if (!activeAssignment) {
      toast.error('تخصیص فعالی برای پایان وجود ندارد');
      return;
    }

    try {
      await endVehicleAssignment.mutateAsync({
        assignmentId: activeAssignment.id,
        endDate: new Date(),
        // vehicleId: currentData?.id
      });
      toast.success('تخصیص راننده با موفقیت پایان یافت');
      onRefetch?.();
      refetchAssignment();
      setValue('personnelCode', '');
      setValue('assignmentType', ASSIGNMENT_TYPES.PERMANENT);
      setValue('startDate', moment().format('YYYY-MM-DD'));
      setValue('endDate', moment().format('YYYY-MM-DD'));
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'خطا در پایان تخصیص');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign='center'>
        {activeAssignment ? 'ویرایش تخصیص راننده' : 'تخصیص راننده به خودرو'}
      </DialogTitle>

      <DialogContent>
        {assignmentLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>در حال بارگذاری...</Typography>
          </Box>
        ) : (
          <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 12 }}>
                <Card sx={{ p: 2 }}>

                  {currentData?.vehicleInfo && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      خودرو: {currentData.vehicleInfo.plateNumber} - {currentData.vehicleInfo.model}
                    </Alert>
                  )}

                  {activeAssignment && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      راننده فعلی: {activeAssignment.driverId}
                    </Alert>
                  )}

                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                    }}
                    sx={{ mt: 1 }}
                  >
                    <Controller
                      name="personnelCode"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                          {...field}
                          options={personnels}
                          loading={personnelsLoading}
                          getOptionLabel={(option) => {
                            if (!option) return '';
                            return `${option.personnelCode} - ${option.firstName || ''} ${option.lastName || ''}`.trim();
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.personnelCode === value?.personnelCode || option.personnelCode === value
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.personnelCode || '');
                          }}
                          value={activeAssignment ? activeAssignmentPersonnel : selectedPersonnel}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="انتخاب پرسنل"
                              size="small"
                              required
                              error={!!error}
                              helperText={error?.message || 'جستجو با کد پرسنلی، نام یا نام خانوادگی'}
                              placeholder="کد پرسنلی یا نام را وارد کنید..."
                            />
                          )}
                        />
                      )}
                    />

                    <Controller
                      name="assignmentType"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth size="small" error={!!error}>
                          <InputLabel>نوع تخصیص</InputLabel>
                          <Select
                            {...field}
                            label="نوع تخصیص"
                            required
                          >
                            {assignmentTypeOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {error && <FormHelperText>{error.message}</FormHelperText>}
                        </FormControl>
                      )}
                    />

                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field, fieldState }) => (
                        <DatePicker
                          label="تاریخ شروع"
                          value={field.value ? moment(field.value) : null}
                          onChange={(newValue) => {
                            field.onChange(newValue ? moment(newValue).format('YYYY-MM-DD') : '');
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'small',
                              required: true,
                              error: !!fieldState.error,
                              helperText: fieldState.error?.message,
                            },
                          }}
                        />
                      )}
                    />

                    {/* فیلد تاریخ پایان - فقط زمانی که activeAssignment وجود داره */}
                    {activeAssignment && (
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field, fieldState }) => (
                          <DatePicker
                            label="تاریخ پایان"
                            value={field.value ? moment(field.value) : null}
                            onChange={(newValue) => {
                              field.onChange(newValue ? moment(newValue).format('YYYY-MM-DD') : '');
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: 'small',
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message || 'برای پایان تخصیص، تاریخ پایان را انتخاب کنید',
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  </Box>

                  <Stack direction='row' gap={1} sx={{ mt: 3 }} flexWrap="wrap">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting || createVehicleAssignment.isPending || updateVehicleAssignment.isPending}
                      size='small'
                      color="success"
                    >
                      {activeAssignment ? 'ویرایش' : 'ثبت'}
                    </LoadingButton>

                    {activeAssignment && (
                      <>
                        <LoadingButton
                          onClick={handleEndAssignment}
                          color="warning"
                          variant="contained"
                          size='small'
                          loading={endVehicleAssignment.isPending}
                          startIcon={<FaStop />}
                        >
                          پایان تخصیص
                        </LoadingButton>

                        <LoadingButton
                          onClick={handleDelete}
                          color="error"
                          variant="contained"
                          size='small'
                          loading={deleteVehicleAssignment.isPending}
                          startIcon={<FaTrash />}
                        >
                          حذف تخصیص
                        </LoadingButton>
                      </>
                    )}

                    <Button onClick={onClose} color="inherit" variant="outlined" size="small">
                      انصراف
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}