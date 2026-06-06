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
  useCreateShiftSupervisorAndDeputy,
  useUpdateShiftSupervisorAndDeputy,
} from 'src/services/shift-supervisor-and-deputy/shift-supervisor-and-deputy.service';

import { useGetPersonnels } from 'src/services/personnels/personnels.servise';
import { useGetPatrolShift } from 'src/services/patrol-shift/patrol-shift.service';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment-jalaali';

export function ShiftSupervisorAndDeputyNewEditForm({ open, onClose, onRefetch, currentItem }) {
  const { t: t_shiftSupervisorAndDeputy } = useTranslate('shift-supervisor-and-deputy');
  const { t: t_common } = useTranslate();

  const createMutation = useCreateShiftSupervisorAndDeputy();
  const updateMutation = useUpdateShiftSupervisorAndDeputy();

  const { data: personnelData } = useGetPersonnels();
  const { data: shiftsData } = useGetPatrolShift();

  const personnelOptions =
    personnelData?.items?.map((p) => ({
      label: p.firstName,
      value: p.id,
    })) || [];

  const shiftOptions =
    shiftsData?.items?.map((s) => ({
      label: s.name,
      value: s.id,
    })) || [];

  const ShiftSupervisorAndDeputySchema = zod.object({
    personnelId: zod
      .string()
      .min(1, t_shiftSupervisorAndDeputy('formValidationErrors.personnelId.required')),
    shiftId: zod
      .string()
      .min(1, t_shiftSupervisorAndDeputy('formValidationErrors.shiftId.required')),
    startDate: zod
      .string()
      .min(1, t_shiftSupervisorAndDeputy('formValidationErrors.startDate.required')),
    endDate: zod
      .string()
      .min(1, t_shiftSupervisorAndDeputy('formValidationErrors.endDate.required')),
    description: zod
      .string()
      .optional()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
  });

  const defaultValues = useMemo(
    () => ({
      personnelId: currentItem?.personnelId || '',
      shiftId: currentItem?.shiftId || '',
      startDate: currentItem?.startDate || '',
      endDate: currentItem?.endDate || '',
      description: currentItem?.description || '',
    }),
    [currentItem]
  );

  const methods = useForm({
    resolver: zodResolver(ShiftSupervisorAndDeputySchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState, control } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem) {
        await updateMutation.mutateAsync({
          shiftSupervisorAndDeputyId: currentItem?.id,
          ...data,
        });
        toast.success(t_shiftSupervisorAndDeputy('toastMessages.update'));
      } else {
        await createMutation.mutateAsync(data);
        toast.success(t_shiftSupervisorAndDeputy('toastMessages.create'));
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
          ? t_shiftSupervisorAndDeputy('title.updateShiftSupervisorAndDeputy')
          : t_shiftSupervisorAndDeputy('title.insertShiftSupervisorAndDeputy')}
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
                }}
                sx={{ mt: 1, width: '100%' }}
              >
                <Field.Select
                  name="personnelId"
                  label={t_shiftSupervisorAndDeputy('formsInputs.personnelId')}
                  data={personnelOptions}
                  displayExp="label"
                  valueExp="value"
                  size="small"
                >
                  {personnelOptions.label}
                </Field.Select>

                <Field.Select
                  name="shiftId"
                  label={t_shiftSupervisorAndDeputy('formsInputs.shiftId')}
                  data={shiftOptions}
                  displayExp="label"
                  valueExp="value"
                  size="small"
                >
                  {shiftOptions.label}
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
                }}
                sx={{ mt: 1, width: '100%' }}
              >
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label={t_shiftSupervisorAndDeputy('formsInputs.startDate')}
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
                  name="endDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label={t_shiftSupervisorAndDeputy('formsInputs.endDate')}
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
              </Box>
            </Grid>

            <Grid size={12}>
              <Field.Text
                name="description"
                label={t_shiftSupervisorAndDeputy('formsInputs.description')}
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
