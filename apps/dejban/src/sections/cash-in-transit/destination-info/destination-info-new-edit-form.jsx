'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import { useTranslate } from 'src/locales';
import { Form, Field } from 'src/components/hook-form';

export function DestinationInfoNewEditForm({ currentDestination, open, onClose, onSave }) {
  const { t: t_common } = useTranslate();

  // شمای اعتبارسنجی فقط برای سه فیلد اصلی مقصد
  const NewDestinationSchema = zod.object({
    destinationName: zod.string().min(1, 'نام مقصد الزامی است'),
    destinationCode: zod.string().min(1, 'کد مقصد الزامی است'),
    address: zod.string().min(1, 'آدرس / موقعیت الزامی است'),
  });

  const defaultValues = useMemo(
    () => ({
      destinationName: currentDestination?.destinationName || '',
      destinationCode: currentDestination?.destinationCode || '',
      address: currentDestination?.address || '',
    }),
    [currentDestination]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewDestinationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      onSave(data);
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        destinationName: currentDestination?.destinationName || '',
        destinationCode: currentDestination?.destinationCode || '',
        address: currentDestination?.address || '',
      });
    }
  }, [currentDestination, open, reset]);

  useEffect(() => {
    if (!open) {
      reset({
        destinationName: '',
        destinationCode: '',
        address: '',
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        {currentDestination ? 'ویرایش مقصد' : 'ایجاد مقصد'}
      </DialogTitle>

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
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 1 }}
              >
                <Field.Text
                  name="destinationName"
                  label="نام مقصد"
                  inputProps={{ type: 'text' }}
                  size="small"
                  required
                />

                <Field.Text
                  name="destinationCode"
                  label="کد مقصد"
                  inputProps={{ type: 'text' }}
                  size="small"
                  required
                />

                <Field.Text
                  name="address"
                  label="آدرس / موقعیت"
                  inputProps={{ type: 'text' }}
                  size="small"
                  required
                />
              </Box>
            </Grid>
          </Grid>

          <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
            <Button
              type="submit"
              color="success"
              variant="contained"
              loading={isSubmitting}
              size="small"
            >
              {currentDestination ? t_common('button.update') : t_common('button.create')}
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
