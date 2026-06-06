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
import { useCreateBlockUsers } from 'src/services/visitor-black-list/visitor-black-list.service';

import { useGetVisitorBlackListReasons } from 'src/services/visitor-black-list-reason/visitor-black-list-reason.service';

// ----------------------------------------------------------------------
export function VisitorBlackListNewEditForm({ open, onClose, onRefetch }) {
  const { t: t_common } = useTranslate();
  const { t: t_visitorBlackList } = useTranslate('visitor-black-list');

  const [searchTerm, setSearchTerm] = useState('');
  const createBlockUsers = useCreateBlockUsers();

  const { data: reasonsData } = useGetVisitorBlackListReasons({ searchTerm });
  const reasonOptions = useMemo(
    () =>
      reasonsData?.items?.map((r) => ({
        label: r.title || r.name,
        value: r.id,
      })) || [],
    [reasonsData]
  );

  const NewPositionSchema = zod.object({
    reasonId: zod.string().min(1, t_visitorBlackList('formValidationErrors.reason.required')),
    firstName: zod.string().min(1, t_visitorBlackList('formValidationErrors.firstName.required')),
    lastName: zod.string().min(1, t_visitorBlackList('formValidationErrors.lastName.required')),
    nationalCode: zod.string().nullable().optional(),
    passportNumber: zod.string().nullable().optional(),
    mobileNumber: zod.string().nullable().optional(),
    startDate: zod.string().min(1, t_visitorBlackList('formValidationErrors.startDate.required')),
    endDate: zod.string().min(1, t_visitorBlackList('formValidationErrors.endDate.required')),
    description: zod.string().nullable().optional(),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      nationalCode: '',
      passportNumber: '',
      mobileNumber: '',
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
      toast.success(t_visitorBlackList('toastMessages.create'));
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle textAlign="center">{t_visitorBlackList('title.insertBlockUsers')}</DialogTitle>
      <DialogContent sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', p: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            {/* ردیف اول: اطلاعات هویتی */}
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
                <Field.Text
                  name="firstName"
                  label={t_visitorBlackList('formsInputs.firstName')}
                  size="small"
                />
                <Field.Text
                  name="lastName"
                  label={t_visitorBlackList('formsInputs.lastName')}
                  size="small"
                />
                <Field.Text
                  name="nationalCode"
                  label={t_visitorBlackList('formsInputs.nationalCode')}
                  size="small"
                />
                <Field.Text
                  name="passportNumber"
                  label={t_visitorBlackList('formsInputs.passportNumber')}
                  size="small"
                />
                <Field.Text
                  name="mobileNumber"
                  label={t_visitorBlackList('formsInputs.phoneNumber')}
                  size="small"
                />
              </Box>
            </Grid>

            {/* ردیف دوم: علت و تاریخ‌ها */}
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
                {/*<Field.Select*/}
                {/*  name="reasonId"*/}
                {/*  label={t_visitorBlackList('formsInputs.reason')}*/}
                {/*  data={reasonOptions}*/}
                {/*  displayExp="label"*/}
                {/*  valueExp="value"*/}
                {/*  size="small"*/}
                {/*>*/}
                {/*  {reasonOptions.label}*/}
                {/*</Field.Select>*/}

                <Field.Autocomplete
                  name="reasonId"
                  label={t_visitorBlackList('formsInputs.reason')}
                  placeholder="ngdg vh sv] "
                  options={reasonOptions}
                  freeSolo
                  // onInputChange={(_, value) => setSearchTerm(value)}
                  slotProps={{
                    textField: { size: 'small' },
                  }}
                >
                  {reasonOptions.label}
                </Field.Autocomplete>

                <Controller
                  name="startDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label={t_visitorBlackList('formsInputs.startDate')}
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
                      label={t_visitorBlackList('formsInputs.endDate')}
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
                label={t_visitorBlackList('formsInputs.description')}
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
