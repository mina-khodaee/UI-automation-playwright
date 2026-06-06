'use client';

import { z as zod } from 'zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslate } from 'src/locales';

import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment-jalaali';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useCreateAssignEquipments } from 'src/services/assign-equipments/assign-equipments.service';
import { useGetPersonnels } from 'src/services/personnels/personnels.servise';
import { useGetSecurityEquipments } from 'src/services/security-equipments/security-equipments.service';

export function AssignEquipmentsForm({ open, onClose, onRefetch }) {
  const { t: t_assign } = useTranslate('assign-equipments');
  const { t: t_common } = useTranslate();

  const createMutation = useCreateAssignEquipments();

  const AssignSchema = zod.object({
    personnelIds: zod
      .array(zod.string())
      .min(1, t_assign('formValidationErrors.personnel.required')),
    equipmentIds: zod
      .array(zod.string())
      .min(1, t_assign('formValidationErrors.equipment.required')),
    startDate: zod.string().min(1, t_assign('formValidationErrors.startDate.required')),
    endDate: zod.string().min(1, t_assign('formValidationErrors.endDate.required')),
    description: zod.string().optional().nullable(),
  });

  const { data: personnelData } = useGetPersonnels();
  const { data: equipmentData } = useGetSecurityEquipments();

  const personnelList = personnelData?.items || [];
  const equipmentList = equipmentData?.items || [];

  const personnelOptions =
    personnelList?.map((p) => ({
      label: p.firstName,
      value: p.id,
    })) || [];

  const equipmentOptions =
    equipmentList?.map((e) => ({
      label: e.name,
      value: e.id,
    })) || [];

  const methods = useForm({
    resolver: zodResolver(AssignSchema),
    defaultValues: {
      personnelIds: [],
      equipmentIds: [],
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  const { handleSubmit, control, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success(t_assign('toastMessages.create'));
      onClose();
      onRefetch?.();
      reset();
    } catch (error) {
      toast.error(error.message || t_common('errors.unknownError'));
    }
  });

  useEffect(() => {
    if (open) reset();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">{t_assign('title.assign')}</DialogTitle>

      <DialogContent sx={{ p: 2 }}>
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
                <Field.MultiSelect
                  name="personnelIds"
                  label={t_assign('formsInputs.personnel')}
                  options={personnelOptions}
                  size="small"
                />

                <Field.MultiSelect
                  name="equipmentIds"
                  label={t_assign('formsInputs.equipment')}
                  options={equipmentOptions}
                  size="small"
                />
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
                      label={t_assign('formsInputs.startDate')}
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
                      label={t_assign('formsInputs.endDate')}
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
                label={t_assign('formsInputs.description')}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" gap={1} sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="success">
              {t_assign('buttons.save')}
            </Button>
            <Button onClick={onClose} variant="contained" color="error">
              {t_assign('buttons.cancel')}
            </Button>
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
