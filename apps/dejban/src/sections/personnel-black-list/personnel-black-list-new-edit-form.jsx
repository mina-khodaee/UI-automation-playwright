'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment-jalaali';

import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useCreatePersonnelBlackList } from 'src/services/personnel-black-list/personnel-black-list.service';

import { useGetPersonnels } from 'src/services/personnels/personnels.servise';
import { useGetPersonnelBlackListReasons } from 'src/services/personnel-black-list-reason/personnel-black-list-reason.service';

// ----------------------------------------------------------------------
export function PersonnelBlackListNewEditForm({ open, onClose, onRefetch }) {
  const { t: t_common } = useTranslate();
  const { t: t_personnelBlackList } = useTranslate('personnel-black-list');
  const [searchTerm, setSearchTerm] = useState('');
  const createBlockUsers = useCreatePersonnelBlackList();

  const { data: personnelData } = useGetPersonnels();
  const { data: reasonsData } = useGetPersonnelBlackListReasons();

  const personnelOptions =
    personnelData?.items?.map((p) => ({
      label: p.firstName,
      value: p.id,
    })) || [];

  const reasonOptions = useMemo(
    () =>
      reasonsData?.items?.map((r) => ({
        label: r.title || r.name,
        value: r.id,
      })) || [],
    [reasonsData]
  );

  const NewPositionSchema = zod.object({
    personnelId: zod
      .string()
      .min(1, t_personnelBlackList('formValidationErrors.personnelId.required')),
    reasonId: zod.string().min(1, t_personnelBlackList('formValidationErrors.reasonId.required')),
    startDate: zod.string().min(1, t_personnelBlackList('formValidationErrors.startDate.required')),
    endDate: zod.string().min(1, t_personnelBlackList('formValidationErrors.endDate.required')),
    description: zod
      .string()
      .min(1, t_personnelBlackList('formValidationErrors.description.required')),
  });

  const defaultValues = useMemo(
    () => ({
      personnelId: '',
      reasonId: '',
      startDate: '',
      endDate: '',
      description: '',
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(NewPositionSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState, control } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createBlockUsers.mutateAsync(data);
      toast.success(t_personnelBlackList('toastMessages.create'));
      onClose();
      onRefetch();
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.message || t_common('errors.unknownError'));
    }
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">{t_personnelBlackList('title.insertBlockUsers')}</DialogTitle>
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
                  label={t_personnelBlackList('formsInputs.personnelId')}
                  data={personnelOptions}
                  displayExp="label"
                  valueExp="value"
                  size="small"
                >
                  {personnelOptions.label}
                </Field.Select>

                <Field.Select
                  name="reasonId"
                  label={t_personnelBlackList('formsInputs.reasonId')}
                  data={reasonOptions}
                  displayExp="label"
                  valueExp="value"
                  size="small"
                >
                  {reasonOptions.label}
                </Field.Select>
              </Box>
            </Grid>

            {/* ردیف دوم: تاریخ شروع و پایان */}
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
                      label={t_personnelBlackList('formsInputs.startDate')}
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
                      label={t_personnelBlackList('formsInputs.endDate')}
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

            {/* ردیف سوم: توضیحات */}
            <Grid size={12}>
              <Field.Text
                name="description"
                label={t_personnelBlackList('formsInputs.description')}
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
              {t_common('button.create')}
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
