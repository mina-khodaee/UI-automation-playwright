'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment-jalaali';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useGetPersonnels } from 'src/services/personnels/personnels.servise';
import { useGetDoors } from 'src/services/doors/doors.service';
import {
  useCreatePersonnelAccessLog,
  useUpdatePersonnelAccessLog,
} from 'src/services/personnel-accessLogs/personnel-accessLogs.service';

// ----------------------------------------------------------------------
export function StaffAccessNewEditForm({ onRefetch, currentItem, onClose }) {
  const { t: t_common } = useTranslate();
  const { t: t_staffAccess } = useTranslate('staff-access');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);

  const createPersonnelAccessLog = useCreatePersonnelAccessLog();
  const updatePersonnelAccessLog = useUpdatePersonnelAccessLog();

  const { data: personnels, isLoading: isPersonnelLoading } = useGetPersonnels({ searchTerm });
  const perssonelsData = personnels?.items || [];

  const { data: doors, isLoading: isDoorLoading } = useGetDoors({});
  const DoorsData = doors?.items?.map((door) => ({
    label: door.doorName,
    value: door.id,
  }));

  const StaffAccessSchema = zod.object({
    searchQuery: zod.string(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    nationalCode: zod.string().optional(),
    unitId: zod.string().optional(),
    selectedPersonnelId: zod.string().optional(),

    entryDoorId: zod.string().min(1, 'انتخاب درب ورود الزامی است'),
    entryDate: zod.string().min(1, 'تاریخ ورود الزامی است'),
    entryTime: zod.string().min(1, 'ساعت ورود الزامی است'),

    exitDoorId: zod.string().min(1, 'انتخاب درب خروج الزامی است'),
    exitDate: zod.string().min(1, 'تاریخ خروج الزامی است'),
    exitTime: zod.string().min(1, 'ساعت خروج الزامی است'),
  });
  // .refine(
  //   (data) => {
  //     const hasEntry = data.entryDoorId && data.entryDate && data.entryTime;
  //     const hasExit = data.exitDoorId && data.exitDate && data.exitTime;
  //     return hasEntry || hasExit;
  //   },
  //   {
  //     message: 'حداقل باید یکی از ورود یا خروج به طور کامل (درب + تاریخ + ساعت) پر شود',
  //     path: ['entryDoorId'],
  //   }
  // );

  const defaultValues = useMemo(
    () => ({
      searchQuery: '',
      firstName: '',
      lastName: '',
      nationalCode: '',
      unitId: '',
      selectedPersonnelId: '',
      entryDoorId: '',
      entryDate: '',
      entryTime: '',
      exitDoorId: '',
      exitDate: '',
      exitTime: '',
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(StaffAccessSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentItem) {
      const aclUser = currentItem.aclUser;
      const entryData = currentItem.entry;
      const exitData = currentItem.exit;

      setSelectedPersonnel({
        aclUserId: aclUser?.aclUserId,
        userName: aclUser?.userName,
        userNationalCode: aclUser?.userNationalCode,
        unitName: aclUser?.unitName,
        entryId: entryData?.id,
        exitId: exitData?.id,
      });

      setValue('selectedPersonnelId', String(aclUser?.aclUserId));
      setValue('firstName', aclUser?.userName?.split(' ')[0] || '');
      setValue('lastName', aclUser?.userName?.split(' ')[1] || '');
      setValue('nationalCode', aclUser?.userNationalCode || '');
      setValue('unitId', aclUser?.unitName || '');
      setValue('searchQuery', aclUser?.userName || '');

      // ست کردن اطلاعات ورود
      if (entryData?.doorId) {
        setValue('entryDoorId', String(entryData.doorId));
      }
      if (entryData?.dateTime) {
        setValue('entryDate', entryData.dateTime);
        setValue('entryTime', entryData.dateTime);
      }

      // ست کردن اطلاعات خروج
      if (exitData?.doorId) {
        setValue('exitDoorId', String(exitData.doorId));
      }
      if (exitData?.dateTime) {
        setValue('exitDate', exitData.dateTime);
        setValue('exitTime', exitData.dateTime);
      }
    }
  }, [currentItem, setValue]);

  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const dateObj = moment(date);
    const timeObj = moment(time);

    dateObj.hour(timeObj.hour());
    dateObj.minute(timeObj.minute());
    dateObj.second(0);

    return dateObj.toISOString();
  };

  const prepareApiData = (formData) => {
    // برای ایجاد جدید
    if (!currentItem) {
      return {
        tagId: null,
        aclUserId: selectedPersonnel?.aclUserId,
        entry: {
          dateTime:
            formData.entryDoorId && formData.entryDate && formData.entryTime
              ? combineDateTime(formData.entryDate, formData.entryTime)
              : null,
          doorId: formData.entryDoorId || null,
        },
        exit: {
          dateTime:
            formData.exitDoorId && formData.exitDate && formData.exitTime
              ? combineDateTime(formData.exitDate, formData.exitTime)
              : null,
          doorId: formData.exitDoorId || null,
        },
      };
    }

    const apiData = {
      tagId: null,
      aclUserId: selectedPersonnel?.aclUserId,
      entry: {
        id: currentItem.entry?.id || null,
        dateTime: null,
        doorId: null,
      },
      exit: {
        id: currentItem.exit?.id || null,
        dateTime: null,
        doorId: null,
      },
    };

    if (formData.entryDoorId && formData.entryDate && formData.entryTime) {
      apiData.entry = {
        id: currentItem.entry?.id || null,
        dateTime: combineDateTime(formData.entryDate, formData.entryTime),
        doorId: formData.entryDoorId,
      };
    }

    if (formData.exitDoorId && formData.exitDate && formData.exitTime) {
      apiData.exit = {
        id: currentItem.exit?.id || null,
        dateTime: combineDateTime(formData.exitDate, formData.exitTime),
        doorId: formData.exitDoorId,
      };
    }

    return apiData;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!selectedPersonnel && !currentItem) {
        toast.error('لطفا ابتدا پرسنل مورد نظر را انتخاب کنید');
        return;
      }

      const apiData = prepareApiData(data);
      console.log('Submitting data:', apiData);

      if (currentItem) {
        await updatePersonnelAccessLog.mutateAsync({
          id: currentItem.id,
          ...apiData,
        });
        toast.success(t_staffAccess('toastMessages.update'));
      } else {
        await createPersonnelAccessLog.mutateAsync(apiData);
        toast.success(t_staffAccess('toastMessages.create'));
      }

      onRefetch?.();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.message || t_common('errors.unknownError'));
    }
  });

  const resetForm = () => {
    reset(defaultValues);
    setSelectedPersonnel(null);
    setSearchTerm('');
    if (onClose) onClose();
  };

  const entryDoorId = watch('entryDoorId');
  const entryDate = watch('entryDate');
  const entryTime = watch('entryTime');
  const exitDoorId = watch('exitDoorId');
  const exitDate = watch('exitDate');
  const exitTime = watch('exitTime');

  const hasEntry = entryDoorId && entryDate && entryTime;
  const hasExit = exitDoorId && exitDate && exitTime;
  const hasAtLeastOne = hasEntry || hasExit;
  const isPersonnelSelected = !!selectedPersonnel || !!currentItem;

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {currentItem
              ? t_staffAccess('title.updateStaffAccess')
              : t_staffAccess('title.insertStaffAccess')}
          </Typography>
          <Button variant="outlined" size="small" onClick={resetForm}>
            {t_staffAccess('buttons.accessList')}
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {!hasAtLeastOne && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            حداقل باید یکی از ورود یا خروج به طور کامل (درب + تاریخ + ساعت) پر شود
          </Alert>
        )}

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          اطلاعات پرسنل
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1.5,
            minHeight: 64,
            mb: 3,
          }}
        >
          <Field.Autocomplete
            name="searchQuery"
            freeSolo
            options={perssonelsData}
            isLoading={isPersonnelLoading}
            placeholder={t_staffAccess('formsInputs.searchQuery')}
            onInputChange={(_, value) => !currentItem && setSearchTerm(value)}
            disabled={!!currentItem}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return `${option.firstName} ${option.lastName} - ${option.nationalCode || ''}`;
            }}
            onChange={(_, value) => {
              if (value && typeof value !== 'string') {
                setSelectedPersonnel({
                  aclUserId: value.aclUserId,
                  userName: `${value.firstName} ${value.lastName}`,
                  userNationalCode: value.nationalCode,
                  unitName: value.unit?.name,
                });
                setValue('selectedPersonnelId', String(value.id));
                setValue('firstName', value.firstName || '');
                setValue('lastName', value.lastName || '');
                setValue('nationalCode', value.nationalCode || '');
                setValue('unitId', value.unit?.name || '');
              } else if (value === null) {
                setSelectedPersonnel(null);
                setValue('selectedPersonnelId', '');
                setValue('firstName', '');
                setValue('lastName', '');
                setValue('nationalCode', '');
                setValue('unitId', '');
              }
            }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Field.Text
            name="firstName"
            label={t_staffAccess('formsInputs.firstName')}
            size="small"
            disabled
          />
          <Field.Text
            name="lastName"
            label={t_staffAccess('formsInputs.lastName')}
            size="small"
            disabled
          />
          <Field.Text
            name="nationalCode"
            label={t_staffAccess('formsInputs.nationalCode')}
            size="small"
            disabled
          />
          <Field.Text
            name="unitId"
            label={t_staffAccess('formsInputs.unitId')}
            size="small"
            disabled
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" gap={1} alignItems="center">
          <Grid>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              اطلاعات ورود
            </Typography>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, minHeight: 64 }}
            >
              <Grid size={{ xs: 12, md: 4 }}>
                <Field.Select
                  name="entryDoorId"
                  label="درب ورود"
                  data={DoorsData}
                  isLoading={isDoorLoading}
                  displayExp="label"
                  valueExp="value"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="entryDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="تاریخ ورود"
                      value={field.value ? moment(field.value) : null}
                      onChange={(v) => field.onChange(v ? v.toISOString() : '')}
                      slotProps={{
                        textField: {
                          size: 'small',

                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="entryTime"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TimePicker
                      label="ساعت ورود"
                      value={field.value ? moment(field.value) : null}
                      onChange={(v) => field.onChange(v ? v.toISOString() : '')}
                      slotProps={{
                        textField: {
                          size: 'small',

                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Box>
          </Grid>

          <Grid>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              اطلاعات خروج
            </Typography>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, minHeight: 64 }}
            >
              <Grid size={{ xs: 12, md: 4 }}>
                <Field.Select
                  name="exitDoorId"
                  label="درب خروج"
                  data={DoorsData}
                  isLoading={isDoorLoading}
                  displayExp="label"
                  valueExp="value"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="exitDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="تاریخ خروج"
                      value={field.value ? moment(field.value) : null}
                      onChange={(v) => field.onChange(v ? v.toISOString() : '')}
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="exitTime"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TimePicker
                      label="ساعت خروج"
                      value={field.value ? moment(field.value) : null}
                      onChange={(v) => field.onChange(v ? v.toISOString() : '')}
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Box>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              maxHeight: 40,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              disabled={isSubmitting || !isPersonnelSelected || !hasAtLeastOne}
            >
              {isSubmitting
                ? 'در حال ثبت...'
                : currentItem
                  ? t_staffAccess('buttons.update') || 'ویرایش'
                  : t_staffAccess('buttons.submitAccess')}
            </Button>
            <Button variant="outlined" color="error" size="medium" onClick={resetForm}>
              {t_staffAccess('buttons.cancel')}
            </Button>
          </Box>
        </Box>
      </Card>
    </Form>
  );
}
