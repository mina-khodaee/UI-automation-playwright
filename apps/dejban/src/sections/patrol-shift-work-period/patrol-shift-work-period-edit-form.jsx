'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslate } from 'src/locales';

import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import {
  useCreatePatrolShiftWorkPeriod,
  useUpdatePatrolShiftWorkPeriod,
} from 'src/services/patrol-shift-work-period/patrol-shift-work-period.service';

import { useGetPatrolShift } from 'src/services/patrol-shift/patrol-shift.service';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment-jalaali';

export function PatrolShiftWorkPeriodNewEditForm({ open, onClose, onRefetch, currentItem }) {
  const { t: t_workPeriod } = useTranslate('patrol-shift-work-period');
  const { t: t_common } = useTranslate();

  const createMutation = useCreatePatrolShiftWorkPeriod();
  const updateMutation = useUpdatePatrolShiftWorkPeriod();

  const WorkPeriodSchema = zod.object({
    name: zod.string().min(1, t_workPeriod('formValidationErrors.name.required')),
    shiftId: zod.string().min(1, t_workPeriod('formValidationErrors.shiftId.required')),
    startDate: zod.string().min(1, t_workPeriod('formValidationErrors.startDate.required')),
    endDate: zod.string().min(1, t_workPeriod('formValidationErrors.endDate.required')),
    hasBreak: zod.boolean(),
    useCalendar: zod.boolean(),
    breakStart: zod.string().nullable().optional(),
    breakEnd: zod.string().nullable().optional(),
    description: zod.string().nullable().optional(),
  });

  const { data: shiftsData } = useGetPatrolShift();
  const shiftOptions =
    shiftsData?.items?.map((s) => ({
      label: s.name,
      value: s.id,
    })) || [];

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || '',
      shiftId: currentItem?.shift?.id || '',
      startDate: currentItem?.startDate || '',
      endDate: currentItem?.endDate || '',
      hasBreak: currentItem?.hasBreak ?? true,
      useCalendar: currentItem?.useCalendar ?? true,
      breakStart: currentItem?.breakStart || null,
      breakEnd: currentItem?.breakEnd || null,
      description: currentItem?.description || '',
    }),
    [currentItem]
  );

  const methods = useForm({
    resolver: zodResolver(WorkPeriodSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState, control } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem) {
        await updateMutation.mutateAsync({
          patrolShiftWorkPeriodId: currentItem?.id,
          ...data,
        });
        toast.success(t_workPeriod('toastMessages.update'));
      } else {
        await createMutation.mutateAsync(data);
        toast.success(t_workPeriod('toastMessages.create'));
      }

      onClose();
      onRefetch?.();
      reset();
    } catch (error) {
      toast.error(error.message || t_common('errors.unknownError'));
    }
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle textAlign="center">
        {currentItem
          ? t_workPeriod('title.updateWorkPeriod')
          : t_workPeriod('title.insertWorkPeriod')}
      </DialogTitle>

      <DialogContent sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', p: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid size={12}>
              <Box
                rowGap={1}
                columnGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 1, width: '100%' }}
              >
                <Field.Text name="name" label={t_workPeriod('formsInputs.name')} size="small" />

                <Field.Select
                  name="shiftId"
                  label={t_workPeriod('formsInputs.shiftId')}
                  data={shiftOptions}
                  displayExp="label"
                  valueExp="value"
                  size="small"
                >
                  {shiftOptions.label}
                </Field.Select>

                <Field.Switch name="hasBreak" label={t_workPeriod('formsInputs.hasBreak')} />
                <Field.Switch name="useCalendar" label={t_workPeriod('formsInputs.useCalendar')} />
              </Box>
            </Grid>

            <Grid size={12}>
              <Box
                rowGap={1}
                columnGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 1, width: '100%' }}
              >
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label={t_workPeriod('formsInputs.startDate')}
                      value={field.value ? moment(field.value) : null}
                      onChange={(v) => field.onChange(v?.toISOString() ?? '')}
                      slotProps={{
                        textField: {
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="endDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label={t_workPeriod('formsInputs.endDate')}
                      value={field.value ? moment(field.value) : null}
                      onChange={(v) => field.onChange(v?.toISOString() ?? '')}
                      slotProps={{
                        textField: {
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Field.Text
                name="description"
                label={t_workPeriod('formsInputs.description')}
                multiline
                rows={3}
                size="small"
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" gap={1} sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="success">
              {currentItem ? t_common('button.update') : t_common('button.create')}
            </Button>

            <Button onClick={onClose} variant="contained" color="error">
              {t_common('button.cancel')}
            </Button>
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
