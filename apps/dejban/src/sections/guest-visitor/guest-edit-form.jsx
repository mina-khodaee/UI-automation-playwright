'use client';

import * as z from 'zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Box,
  Card,
  Grid,
  Stack,
  Button,
  IconButton,
  Typography,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment-jalaali';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useCreateVisitor, useUpdateVisitor } from 'src/services/visitor/visitor.service';
import * as visitorTypesData from 'src/services/visitorTypes/visitorTypes.service';
import { fData } from '@repo/ui/utils';
import { useTranslate } from 'src/locales/use-locales';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function GuestEditForm({ open, onClose, onRefetch, currentGuest }) {
  const { t: t_visitor } = useTranslate('guest-visitor');

  const GUEST_TYPE = {
    NORMAL: 'Normal',
    FOREIGN: 'Foreigner',
    SPECIAL: 'VIP',
    CONTRACTOR: 'Contractor',
  };

  const GuestVisitorSchema = z
    .object({
      visitorTypeId: z.string().min(1, t_visitor('formValidationErrors.visitorTypeId')),
      firstName: z.string().min(1, t_visitor('formValidationErrors.firstName')),
      lastName: z.string().min(1, t_visitor('formValidationErrors.lastName')),
      gender: z.string().min(1, t_visitor('formValidationErrors.gender')),
      dateOfBirth: z.string().min(1, t_visitor('formValidationErrors.dateOfBirth')),
      mobileNumber: z.string().min(1, t_visitor('formValidationErrors.mobileNumber')),
      nationalCode: z.string().nullable().optional(),
      passportNumber: z.string().nullable().optional(),
      inclusiveNumber: z.string().nullable().optional(),
    })
    .superRefine((data, ctx) => {
      const isForeign = data.passportNumber || data.inclusiveNumber;
      if (isForeign) {
        if (!data.passportNumber) {
          ctx.addIssue({
            path: ['passportNumber'],
            message: t_visitor('formValidationErrors.passportNumber'),
          });
        }

        if (!data.inclusiveNumber) {
          ctx.addIssue({
            path: ['inclusiveNumber'],
            message: t_visitor('formValidationErrors.inclusiveNumber'),
          });
        }
      } else {
        if (!data.nationalCode) {
          ctx.addIssue({
            path: ['nationalCode'],
            message: t_visitor('formValidationErrors.nationalCode'),
          });
        }
      }
    });
  // const currentGuestId = currentGuest?.id;
  const { mutate: updateVisitor } = useUpdateVisitor();

  const { currentLang } = useTranslate();
  const langKey = currentLang?.value;

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(GuestVisitorSchema),
    defaultValues: useMemo(
      () => ({
        visitorTypeId: currentGuest?.visitorType.id || '',
        firstName: currentGuest?.firstName || '',
        lastName: currentGuest?.lastName || '',
        gender:
          currentGuest?.gender === 'مرد' ? 'Male' : currentGuest?.gender === 'زن' ? 'Female' : '',
        dateOfBirth: currentGuest?.dateOfBirth
          ? moment(currentGuest.dateOfBirth).toISOString()
          : null,
        nationalCode: currentGuest?.nationalCode || '',
        mobileNumber: currentGuest?.mobileNumber || '',
        passportNumber: currentGuest?.passportNumber || '',
        inclusiveNumber: currentGuest?.inclusiveNumber || '',
        photoURL: currentGuest?.photoURL || null,
        isPublic: currentGuest?.isPublic || false,
      }),

      [currentGuest]
    ),
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const {
    data: visitorType,
    refetch,
    isFetching,
  } = visitorTypesData.useGetSelectVisitorTypesList();

  useEffect(() => {
    if (open) {
      reset({
        visitorTypeId: currentGuest?.visitorType?.id || '',
        firstName: currentGuest?.firstName || '',
        lastName: currentGuest?.lastName || '',
        gender: currentGuest?.gender || '',
        dateOfBirth: currentGuest?.dateOfBirth
          ? moment(currentGuest.dateOfBirth).toISOString()
          : null,
        nationalCode: currentGuest?.nationalCode || '',
        mobileNumber: currentGuest?.mobileNumber || '',
        passportNumber: currentGuest?.passportNumber || '',
        inclusiveNumber: currentGuest?.inclusiveNumber || '',
        photoURL: currentGuest?.photoURL || null,
        isPublic: currentGuest?.isPublic || false,
      });
    }
  }, [open, currentGuest, reset]);

  useEffect(() => {
    if (!open) {
      reset({
        visitorTypeId: '',
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: null,
        nationalCode: '',
        mobileNumber: '',
        passportNumber: '',
        inclusiveNumber: '',
      });
      onRefetch();
    }
  }, [open, reset, onRefetch]);

  const guestTypeId = watch('visitorTypeId');

  const guestTypeName = visitorType?.find((v) => v.id === guestTypeId)?.name?.value;

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      visitorTypeName: visitorType?.find((v) => v.id === data.visitorTypeId)?.name?.value || '',
    };
    try {
      (updateVisitor({
        id: currentGuest.id,
        ...payload,
      }),
        toast.success(t_visitor('toastMessages.update')));

      onClose();
      reset();
    } catch (error) {
      toast.error(error || t_visitor('toastMessages.default'));
    }
  };

  // ---------------------------------------------------------------------------------------------------------------------------------------------------

  // use api fetch

  // const { data: personnels, isLoading: personnelsLoading } = personnelsData.useGetPersonnels(
  //   visitUnitId ? { Filters: `unitid|eq|${visitUnitId}` } : {}
  // );
  ``;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>{t_visitor('buttons.editVisitor')}</DialogTitle>
      <DialogContent sx={{ maxHeight: '80vh', overflowY: 'auto', mt: 2 }}>
        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} p={2}>
            <Grid size={{ xs: 12, md: 9 }}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    rowGap: 3,
                    columnGap: 2,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <Controller
                    name="visitorTypeId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        select
                        label="نوع مهمان"
                        size="small"
                        onFocus={() => refetch()}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      >
                        {isFetching ? (
                          <MenuItem disabled>در حال بارگذاری...</MenuItem>
                        ) : (
                          visitorType?.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name.displayValues[langKey] || type.name.value}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    )}
                  />

                  {guestTypeName === GUEST_TYPE.FOREIGN ? (
                    <>
                      <Controller
                        name="passportNumber"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="پاسپورت"
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />

                      <Controller
                        name="inclusiveNumber"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="شماره فراگیر"
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <Controller
                        name="nationalCode"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="کد ملی"
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </>
                  )}
                  <Controller
                    name="mobileNumber"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="تلفن همراه"
                        size="small"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Field.Text name="firstName" label="نام مهمان" size="small" />
                  <Field.Text name="lastName" label="نام خانوادگی" size="small" />
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        select
                        label="جنسیت"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      >
                        <MenuItem value="">انتخاب کنید</MenuItem>
                        <MenuItem value="Male">مرد</MenuItem>
                        <MenuItem value="Female">زن</MenuItem>
                      </TextField>
                    )}
                  />

                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        label="تاریخ تولد"
                        size="small"
                        value={field.value ? moment(field.value) : null}
                        onChange={(newValue) => {
                          field.onChange(newValue ? newValue.toISOString() : null);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!fieldState.error,
                            helperText: fieldState.error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Box>
                <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    color="success"
                    variant="contained"
                    loading={isSubmitting}
                    size="small"
                  >
                    {t_visitor('buttons.editVisitor')}
                  </Button>
                  <Button onClick={onClose} color="error" variant="contained" size="small">
                    {t_visitor('buttons.cancel')}
                  </Button>
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Card
                sx={{
                  pt: 10,
                  pb: 5,
                  px: 3,
                  textAlign: 'center',
                }}
              >
                <Field.UploadAvatar
                  name="photoURL"
                  maxSize={3145728}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />

                <Field.Switch
                  name="isPublic"
                  labelPlacement="start"
                  label="Public profile"
                  sx={{ mt: 5 }}
                />

                <Button variant="soft" color="error" sx={{ mt: 3 }}>
                  Delete user
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
