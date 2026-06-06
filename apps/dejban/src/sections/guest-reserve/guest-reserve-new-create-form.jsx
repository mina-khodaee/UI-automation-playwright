'use client';

import {
  Box,
  Button,
  Typography,
  Stack,
  Divider,
  Card,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { GuestSection } from './form-components/guest-section/GuestSection';
import { AppointmentSection } from './form-components/appointment-section/AppointmentSection';
import { CommoditySection } from './form-components/commodity-section/CommoditySection';
import { VehicleSection } from './form-components/vehicle-section/VehicleSection';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateVisitorAndVisitSchedule,
  useGetVisitorAndVisitScheduleById,
} from 'src/services/visitor-and-visitSchedule/visitorAndVisitSchedule.service';
import { createVisitScheduleSchema } from './validation/visitSchedule.schema';
import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment-jalaali';
import { useEffect, useMemo, useState } from 'react';

export function GuestReserveNewCreateForm({
  groups,
  items,
  currentGuestAndAppointment,
  onRefetch,
  isEditing,
  onCancel,
}) {
  const { t: tGuest } = useTranslate('guest-visitor');
  const { t: tAppointment } = useTranslate('appointment');

  const editId = currentGuestAndAppointment;

  const defaultValues = useMemo(
    () => ({
      visitorTypeId: '',
      firstName: '',
      lastName: '',
      gender: 'Male',
      dateOfBirth: null,
      nationalCode: '',
      mobileNumber: '',
      passportNumber: '',
      inclusiveNumber: '',
      photoURL: null,
      isPublic: false,
      cardType: '',
      visitorCardId: '',
      hostId: '',
      visitReasonId: '',
      accessGroupId: '',
      visitDate: '',
      visitEndDate: '',
      note: '',
      companions: [],
      visitorItemIds: [],
      vehicle: {},
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(createVisitScheduleSchema({ guest: tGuest, appointment: tAppointment })),
    mode: 'all',
    defaultValues,
  });

  const { control, watch, setValue, handleSubmit, reset, getValues } = methods;

  const { mutate: CreateVisitorAndVisitSchedule } = useCreateVisitorAndVisitSchedule();
  const { data: visitorAndVisitScheduleData } = useGetVisitorAndVisitScheduleById(editId, true);

  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    if (visitorAndVisitScheduleData && isEditing) {
      const visitor = visitorAndVisitScheduleData;
      if (!visitor) return;
      reset({
        visitorTypeId: visitor?.visitors?.[0]?.visitorType?.id || '',
        firstName: visitor?.visitors?.[0]?.firstName || '',
        lastName: visitor?.visitors?.[0]?.lastName || '',
        gender:
          visitor?.visitors?.[0]?.gender === 'مرد'
            ? 'Male'
            : visitor?.visitors?.[0]?.gender === 'زن'
              ? 'Female'
              : visitor?.visitors?.[0]?.gender || '',
        dateOfBirth: visitor?.visitors?.[0]?.dateOfBirth
          ? moment(visitor.dateOfBirth).toISOString()
          : null,
        nationalCode: visitor?.visitors?.[0]?.nationalCode || '',
        mobileNumber: visitor?.visitors?.[0]?.mobileNumber || '',
        passportNumber: visitor?.visitors?.[0]?.passportNumber || '',
        inclusiveNumber: visitor?.visitors?.[0]?.inclusiveNumber || '',
        photoURL: visitor?.visitors?.[0]?.photoURL || null,
        isPublic: visitor?.visitors?.[0]?.isPublic || false,
        cardType: visitor?.visitors?.[0]?.visitorCard?.cardType,
        visitorCardId: visitor?.visitors?.[0]?.visitorCard?.id || '',
        hostId: visitor?.host?.id || '',
        visitReasonId: visitor?.visitReason?.name || '',
        accessGroupId: visitor?.accessGroupId || '',
        visitDate: visitor?.visitDate || '',
        visitEndDate: visitor?.visitEndDate || '',
        note: visitor?.note || '',
        companions: visitor?.companions || [],
        visitorItemIds: visitor?.visitors?.[0]?.visitorItems?.map((item) => item.id) || [],
        vehicle: visitor?.vehicle || {},
      });
    }
  }, [visitorAndVisitScheduleData, isEditing, reset]);

  // ---------- افزودن مهمان به جدول ----------
  const handleAddGuestToTable = () => {
    const values = getValues();

    if (!values.firstName || !values.lastName) {
      toast.error('نام و نام خانوادگی مهمان الزامی است');
      return;
    }

    // گرفتن آیتم های انتخاب شده با اسم و id
    const selectedItems = items?.filter((i) => values.visitorItemIds.includes(i.id));
    const itemNames = selectedItems?.map((i) => i.name) || [];

    setSummaryData((prev) => [
      ...prev,
      {
        guest: {
          ...values,
        },
        visitorItemIds: values.visitorItemIds,
        visitorItemNames: itemNames,
        vehicle: values.vehicle,
      },
    ]);

    reset({
      ...defaultValues,
      visitDate: values.visitDate,
      visitEndDate: values.visitEndDate,
      hostId: values.hostId,
      visitReasonId: values.visitReasonId,
    });
  };

  // ---------- ارسال نهایی ----------
  const onSubmit = async () => {
    if (summaryData.length === 0) {
      toast.error('حداقل یک مهمان اضافه کنید');
      return;
    }

    const formValues = getValues();

    const payload = {
      visitSchedule: {
        accessGroupId: formValues.accessGroupId,
        visitorCardId: formValues.visitorCardId,
        cardType: formValues.cardType,
        hostId: formValues.hostId,
        visitReasonId: formValues.visitReasonId,
        visitDate: formValues.visitDate,
        visitEndDate: formValues.visitEndDate,
        note: formValues.note,
      },
      visitors: summaryData.map((g) => ({
        visitor: g.guest,
        visitorItemIds: g.visitorItemIds,
        vehicle: g.vehicle,
      })),
    };

    await CreateVisitorAndVisitSchedule(payload);

    toast.success('ثبت رزرو گروهی با موفقیت انجام شد');
    reset(defaultValues);
    setSummaryData([]);
  };

  const onCancelHandler = () => {
    reset(defaultValues);
    onCancel?.();
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ height: '100%' }}>
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {isEditing ? 'ویرایش اطلاعات مهمان / ملاقات' : 'ثبت ملاقات جدید'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Appointment Card */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            اطلاعات ملاقات
          </Typography>
          <AppointmentSection control={control} watch={watch} setValue={setValue} />
        </Card>

        {/* مهمان / کالا / خودرو */}
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            اطلاعات مهمان / کالا / خودرو
          </Typography>

          <Grid container spacing={3} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                اطلاعات مهمان
              </Typography>
              <GuestSection
                control={control}
                watch={watch}
                setValue={setValue}
                clearErrors={methods.clearErrors}
                setError={methods.setError}
              />
            </Grid>

            <Box display="flex" flexDirection="row" gap={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  کالا و اقلام
                </Typography>
                <CommoditySection control={control} watch={watch} groups={groups} items={items} />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  اطلاعات خودرو
                </Typography>
                <VehicleSection control={control} />
              </Grid>
            </Box>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={handleAddGuestToTable}>
              افزودن مهمان
            </Button>
          </Stack>
        </Card>

        {summaryData.length > 0 && (
          <Card sx={{ mt: 4, p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              جدول مهمان / کالا / خودرو
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>نام</TableCell>
                  <TableCell>نام خانوادگی</TableCell>
                  <TableCell>کد ملی</TableCell>
                  <TableCell>شماره موبایل</TableCell>
                  <TableCell>گروه کالا</TableCell>
                  <TableCell>آیتم‌ها</TableCell>
                  <TableCell>پلاک خودرو</TableCell>
                  <TableCell>مدل خودرو</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summaryData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.guest.firstName}</TableCell>
                    <TableCell>{row.guest.lastName}</TableCell>
                    <TableCell>{row.guest.nationalCode}</TableCell>
                    <TableCell>{row.guest.mobileNumber}</TableCell>
                    <TableCell>
                      {groups
                        ?.filter((g) => row.guest.visitorItemIds.includes(g.id))
                        ?.map((g) => g.name)
                        ?.join(' - ') || '-'}
                    </TableCell>
                    <TableCell>{row.visitorItemNames?.join(' - ') || '-'}</TableCell>
                    <TableCell>{row.vehicle?.plateNumber || '-'}</TableCell>
                    <TableCell>{row.vehicle?.model || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* دکمه‌های ثبت نهایی */}
        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" size="large" color="primary">
            {isEditing ? 'ذخیره تغییرات' : 'ثبت نهایی'}
          </Button>
          <Button variant="outlined" color="error" size="large" onClick={onCancelHandler}>
            انصراف
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
}
