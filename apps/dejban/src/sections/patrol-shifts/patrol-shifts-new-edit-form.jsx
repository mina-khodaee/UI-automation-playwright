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
  useCreatePatrolShift,
  useUpdatePatrolShift,
} from 'src/services/patrol-shift/patrol-shift.service';

import { useGetSites } from 'src/services/siteManagement/site.service';
import { useGetCalendar } from 'src/services/calendar/calendar.service';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment-jalaali';

export function PatrolShiftsNewEditForm({ open, onClose, onRefetch, currentItem }) {
  const { t: t_patrolShift } = useTranslate('patrol-shift');
  const { t: t_common } = useTranslate();

  const createMutation = useCreatePatrolShift();
  const updateMutation = useUpdatePatrolShift();

  const PatrolShiftSchema = zod.object({
    name: zod.string().min(1, t_patrolShift('formValidationErrors.name.required')),
    siteId: zod.string().min(1, t_patrolShift('formValidationErrors.siteId.required')),
    calendarId: zod.string().min(1, t_patrolShift('formValidationErrors.calendarId.required')),
    validFromDate: zod
      .string()
      .min(1, t_patrolShift('formValidationErrors.validFromDate.required')),
    validToDate: zod.string().min(1, t_patrolShift('formValidationErrors.validToDate.required')),
    isCycleShift: zod.boolean(),
    description: zod
      .string()
      .optional()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
  });

  const { data: sitesData } = useGetSites();
  const { data: calendarsData } = useGetCalendar();
  const getAllSites = sitesData?.items || [];
  const getAllCalenders = calendarsData?.items || [];

  const siteOptions =
    getAllSites?.map((s) => ({
      label: s.name,
      value: s.id,
    })) || [];

  const calendarOptions =
    getAllCalenders?.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || '',
      siteId: currentItem?.site?.id || '',
      calendarId: currentItem?.calendar?.id || '',
      validFromDate: currentItem?.validFromDate || '',
      validToDate: currentItem?.validToDate || '',
      isCycleShift: currentItem?.isCycleShift ?? true,
      description: currentItem?.description || '',
    }),
    [currentItem]
  );

  const methods = useForm({
    resolver: zodResolver(PatrolShiftSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState, control } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem) {
        await updateMutation.mutateAsync({
          patrolShiftId: currentItem?.id,
          ...data,
        });
        toast.success(t_patrolShift('toastMessages.update'));
      } else {
        await createMutation.mutateAsync(data);
        toast.success(t_patrolShift('toastMessages.create'));
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
          ? t_patrolShift('title.updatePatrolShift')
          : t_patrolShift('title.insertPatrolShift')}
      </DialogTitle>

      <DialogContent sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', p: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid size={12}>
              <Box
                rowGap={1}
                columnGap={3}
                display="grid"
                flexDirection="column"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
                sx={{ mt: 1, width: '100%' }}
              >
                <Field.Text name="name" label={t_patrolShift('formsInputs.name')} size="small" />

                <Field.Select
                  name="siteId"
                  label={t_patrolShift('formsInputs.siteId')}
                  data={siteOptions}
                  displayExp="label"
                  valueExp="value"
                  size="small"
                >
                  {siteOptions.label}
                </Field.Select>

                <Field.Select
                  name="calendarId"
                  label={t_patrolShift('formsInputs.calendarId')}
                  data={calendarOptions}
                  displayExp="label"
                  valueExp="value"
                  size="small"
                >
                  {calendarOptions.label}
                </Field.Select>
              </Box>
            </Grid>

            <Grid size={12}>
              <Box
                rowGap={1}
                columnGap={3}
                display="grid"
                flexDirection="column"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
                sx={{ mt: 1, width: '100%' }}
              >
                <Controller
                  name="validFromDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label={t_patrolShift('formsInputs.validFromDate')}
                      size="small"
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
                  name="validToDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label={t_patrolShift('formsInputs.validToDate')}
                      size="small"
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

                <Field.Switch
                  name="isCycleShift"
                  label={t_patrolShift('formsInputs.isCycleShift')}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Field.Text
                name="description"
                label={t_patrolShift('formsInputs.description')}
                multiline
                rows={3}
                size="small"
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" gap={1} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={formState.isSubmitting}
            >
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
