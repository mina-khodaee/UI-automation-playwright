'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function TrafficModal({
  open,
  onClose,
  onSave,
  initialData,
  isEmergency = false,
  doorsOptions = [],
}) {
  const { t: t_common } = useTranslate();
  const { t: t_traffic } = useTranslate('traffic');

  const TrafficSchema = zod.object({
    doorId: zod.string().min(1, t_traffic('formValidationErrors.doorId.required')),
    ...(isEmergency
      ? {}
      : {
          entryDateTime: zod
            .string()
            .min(1, t_traffic('formValidationErrors.entryDateTime.required')),
          exitDateTime: zod
            .string()
            .min(1, t_traffic('formValidationErrors.exitDateTime.required')),
          note: zod.string().optional().nullable(),
        }),
  });

  // ✅ default values
  const defaultValues = useMemo(
    () => ({
      doorId: initialData?.doorId || '',
      entryDateTime: initialData?.entryDateTime || null,
      exitDateTime: initialData?.exitDateTime || null,
      note: initialData?.note || '',
    }),
    [initialData]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(TrafficSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // ✅ Submit
  const onSubmit = handleSubmit(async (data) => {
    try {
      const door = doorsOptions.find((d) => d.id === data.doorId);

      const trafficData = {
        id: initialData?.id,
        doorId: data.doorId,
        doorName: door?.label,
        isEmergency: isEmergency,
        note: data.note || null,
        ...(isEmergency
          ? {}
          : {
              entryDateTime: data.entryDateTime,
              exitDateTime: data.exitDateTime,
            }),
      };

      onSave(trafficData);
      onClose();
      reset();
      toast.success(isEmergency ? 'تردد اضطراری با موفقیت ثبت شد' : 'تردد با موفقیت ثبت شد');
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

  const getTitle = () => {
    if (isEmergency) return 'ثبت تردد اضطراری';
    if (initialData?.id) return 'ویرایش تردد';
    return 'ثبت تردد جدید';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">{getTitle()}</DialogTitle>

      <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', p: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid size={12}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: isEmergency ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)',
                }}
                sx={{ mt: 1 }}
              >
                <Field.Select
                  name="doorId"
                  data={doorsOptions}
                  displayExp="label"
                  valueExp="id"
                  label="درب تردد"
                  size="small"
                />

                {!isEmergency && (
                  <>
                    <Field.DatePicker name="entryDateTime" label="تاریخ و ساعت ورود" size="small" />
                    <Field.DatePicker name="exitDateTime" label="تاریخ و ساعت خروج" size="small" />
                  </>
                )}
              </Box>

              <Box sx={{ mt: 2 }}>
                <Field.Text name="note" label="توضیحات (اختیاری)" multiline rows={2} size="small" />
              </Box>
            </Grid>
          </Grid>

          <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
            <Button
              type="submit"
              color="success"
              variant="contained"
              disabled={isSubmitting}
              size="small"
            >
              {initialData?.id ? 'ذخیره تغییرات' : isEmergency ? 'ثبت تردد اضطراری' : 'ثبت تردد'}
            </Button>

            <Button onClick={onClose} color="error" variant="contained" size="small">
              {t_common('button.cancel')}
            </Button>
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
