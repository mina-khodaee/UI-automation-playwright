'use client';

import { Box, Button, Accordion, Typography, Stack } from '@mui/material';
import { GuestSection } from './form-components/guest-section/GuestSection';
import { AppointmentSection } from './form-components/appointment-section/AppointmentSection';
import { CompanionSection } from './form-components/companion-section/CompanionSection';
import { CommoditySection } from './form-components/commodity-section/CommoditySection';
import { VehicleSection } from './form-components/vehicle-section/VehicleSection';
import { AvatarUploadSection } from './form-components/avatar-section/AvatarSection';
import { useGetSelectVisitorTypesList } from 'src/services/visitorTypes/visitorTypes.service';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateVisitorAndVisitSchedule,
  useGetVisitorAndVisitScheduleById,
  useUpdateVisitorAndVisitSchedule,
} from 'src/services/visitor-and-visitSchedule/visitorAndVisitSchedule.service';
import { createVisitScheduleSchema } from './validation/visitSchedule.schema';
import { toast } from 'src/components/snackbar';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useTranslate } from 'src/locales';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment-jalaali';
import { useState, useEffect } from 'react';

export function VisitorAppointmentEditForm({
  groups,
  items,
  currentGuestAndAppointment,
  onRefetch,
  isEditing,
  onCancel,
}) {
  const { t: tGuest } = useTranslate('guest-visitor');
  const { t: tAppointment } = useTranslate('appointment');
  const [resetCount, setResetCount] = useState(0);

  const { data: visitorTypes } = useGetSelectVisitorTypesList();
  const getVisitorTypeName = (visitorTypeId) => {
    const visitorType = visitorTypes?.find((v) => v.id === visitorTypeId);
    return visitorType?.name?.value;
  };

  const defaultValues = {
    scheduleType: '',
    visitorId: '',
    visitScheduleId: '',
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
    visitDate: '',
    visitEndDate: '',
    visitStartTime: '',
    visitEndTime: '',
    visitAccessDate: '',
    visitAccessEndDate: '',
    visitAccessStartTime: '',
    visitAccessEndTime: '',
    note: '',
    companions: [],
    visitorItemIds: [],

    // FIXED: These should be objects, not separate strings
    entryDoor: '',
    entryDeviceIds: [],
    exitDoor: '',
    exitDeviceIds: [],
  };

  // const { data: visitorTypes, refetch, isFetching } = useGetSelectVisitorTypesList();
  // const schema = useMemo(() => {
  //   if (!visitorTypes) return null;
  //   return createVisitScheduleSchema(
  //     {
  //       guest: tGuest,
  //       appointment: tAppointment,
  //     },
  //     visitorTypes
  //   );
  // }, [visitorTypes, tGuest, tAppointment]);

  const methods = useForm({
    resolver: zodResolver(
      createVisitScheduleSchema({ guest: tGuest, appointment: tAppointment, getVisitorTypeName })
    ),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });
  const { control, watch, trigger, setValue, handleSubmit, clearErrors, reset } = methods;
  const scheduleTypeData = watch('scheduleType');

  // const visitorTypeId = methods.watch('visitorTypeId');
  //
  // useEffect(() => {
  //   if (visitorTypeId) {
  //     // Trigger validation for fields that depend on visitorTypeId
  //     trigger(['nationalCode', 'passportNumber']);
  //   }
  // }, [visitorTypeId, trigger]);

  // React Query mutation
  const { mutate: CreateVisitorAndVisitSchedule } = useCreateVisitorAndVisitSchedule();
  const { mutate: UpdateVisitorAndVisitSchedule } = useUpdateVisitorAndVisitSchedule();
  const { data: visitorAndVisitScheduleData } = useGetVisitorAndVisitScheduleById(true);

  const handelCancel = () => {
    setResetCount((prev) => prev + 1);
    reset(defaultValues);
  };
  const isEdit = currentGuestAndAppointment;

  // Submit handler
  const onSubmit = handleSubmit(async (data) => {
    const combineDateTime = (date, time) => {
      if (!date || !time) return null;
      const dateStr = moment(date).format('YYYY-MM-DD');
      const timeStr = moment(time).format('HH:mm:ss');
      return `${dateStr}T${timeStr}Z`;
    };

    const payload = {
      scheduleType: data.scheduleType || '',
      entryDateTime: combineDateTime(data.visitDate, data.visitStartTime),
      exitDateTime: combineDateTime(data.visitEndDate, data.visitEndTime),
      visitor: {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        nationalCode: data.nationalCode || null,
        mobileNumber: data.mobileNumber || '',
        visitorTypeId: data.visitorTypeId || '',
        gender: data.gender || '',
        dateOfBirth: data.dateOfBirth
          ? moment(data.dateOfBirth).format('YYYY-MM-DD[T]HH:mm:ss[Z]')
          : null,
        passportNumber: data.passportNumber || null,
        inclusiveNumber: data.inclusiveNumber || null,
      },
      visitSchedule: {
        visitAccessDate: data.visitAccessDate,
        visitAccessEndDate: data.visitAccessEndDate,
        visitAccessStartTime: data.visitAccessStartTime,
        visitAccessEndTime: data.visitAccessEndTime,
        entryDoor: {
          doorId: data.entryDoor,
          deviceIds: Array.isArray(data.entryDeviceIds)
            ? data.entryDeviceIds
            : [data.entryDeviceIds],
        },
        exitDoor: {
          doorId: data.exitDoor,
          deviceIds: Array.isArray(data.exitDeviceIds) ? data.exitDeviceIds : [data.exitDeviceIds],
        },
        visitorCardId: data.visitorCardId || null,
        cardType: data.cardType || '',
        // FIX THIS - Remove empty string from array
        visitorItemIds: data.visitorItemIds?.filter((item) => item && item.trim() !== '') || [],
        hostId: data.hostId || '',
        visitReasonId: data.visitReasonId || '',
        visitDate: data.visitDate ? moment(data.visitDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]') : '',
        visitEndDate: data.visitEndDate
          ? moment(data.visitEndDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]')
          : '',
        note: data.note || null,
        companions: data.companions?.length
          ? data.companions.map((companion) => ({
              firstName: companion.firstName || '',
              lastName: companion.lastName || '',
              gender: companion.gender || '',
              nationalCode: companion.nationalCode || null,
              phoneNumber: companion.phoneNumber || null,
            }))
          : [],
      },
    };

    // For edit mode, you might need to include IDs
    // if (isEdit) {
    //   return {
    //    payload,
    //     // // Add IDs for update operations if needed
    //     // visitorId: data.visitorId,
    //     // visitScheduleId: data.visitScheduleId,
    //   };
    // }

    try {
      // const payload = transformToBackendFormat(data, isEditing);

      if (isEdit) {
        await UpdateVisitorAndVisitSchedule(payload);
        toast.success('ویرایش با موفقیت انجام شد!');
      } else {
        await CreateVisitorAndVisitSchedule(payload);
        toast.success('ثبت ملاقات با موفقیت انجام شد!');
      }

      reset();
      clearErrors();
      onRefetch();
    } catch (error) {
      console.error(error);
      toast.error('خطا در عملیات');
    }
  });

  const onEditCancelHandler = () => {
    if (visitorAndVisitScheduleData && isEditing) {
      reset(defaultValues);
      onCancel();
    }
  };

  useEffect(() => {
    if (visitorAndVisitScheduleData && isEditing) {
      const visitor = visitorAndVisitScheduleData;
      if (!visitor) return;

      reset({
        scheduleType: visitor?.scheduleType || '',
        visitorId: visitor?.visitors?.[0]?.id || '',
        visitScheduleId: visitor?.id || '',
        visitorTypeId: visitor?.visitorType?.id || '',
        firstName: visitor?.visitors?.[0].firstName || '',
        lastName: visitor?.visitors?.[0].lastName || '',
        gender:
          visitor?.visitors?.[0].gender === 'مرد'
            ? 'Male'
            : visitor?.visitors?.[0].gender === 'زن'
              ? 'Female'
              : visitor?.visitors?.[0].gender || '',
        dateOfBirth: visitor?.visitors?.[0].dateOfBirth
          ? moment(visitor.visitors?.[0].dateOfBirth).toISOString()
          : null,
        nationalCode: visitor?.visitors?.[0].nationalCode || '',
        mobileNumber: visitor?.visitors?.[0].mobileNumber || '',
        passportNumber: visitor?.visitors?.[0].passportNumber || '',
        inclusiveNumber: visitor?.visitors?.[0].inclusiveNumber || '',
        photoURL: visitor?.visitors?.[0].photoURL || null,
        isPublic: visitor?.visitors?.[0].isPublic || false,
        cardType: visitor?.visitors?.[0].visitorCard?.cardType || '',
        visitorCardId: visitor?.visitors?.[0].visitorCard?.id || null,
        hostUnitId: visitor?.hostUnit?.id || '',
        hostId: visitor?.host?.id || null,
        visitReasonId: visitor?.visitReason?.id || '',
        accessGroupId: visitor?.accessGroupId || '',
        visitDate: visitor?.visitDate || '',
        visitEndDate: visitor?.visitEndDate || '',
        note: visitor?.note || null,
        companions: visitor?.companions || [],
        visitorItemIds: visitor?.visitors?.[0].visitorItems?.map((item) => item.id) || [],
        entryDoor: visitor?.visitSchedule?.entryDoor?.doorId || '',
        entryDeviceIds: visitor?.visitSchedule?.entryDoor?.deviceIds || [],
        exitDoor: visitor?.visitSchedule?.exitDoor?.doorId || '',
        exitDeviceIds: visitor?.visitSchedule?.exitDoor?.deviceIds || [],
      });
    }
  }, [visitorAndVisitScheduleData, isEditing, reset]);

  // Updated ACCORDIONS data
  const ACCORDIONS = [
    {
      id: 'panel-3',
      value: 'panel3',
      title: <Typography sx={{ fontSize: '1.5' }}>کالا و اقلام</Typography>,
      disabled: false,
    },
    {
      id: 'panel-4',
      value: 'panel4',
      title: <Typography sx={{ fontSize: '1.5' }}>همراهان</Typography>,
      disabled: false,
    },
    {
      id: 'panel-5',
      value: 'panel5',
      title: <Typography sx={{ fontSize: '1.5' }}>خودرو</Typography>,
      disabled: false,
    },
  ];

  const renderTitle = (title, disabled) => (
    <Typography component="span" variant="subtitle1">
      {title} {!!disabled && '(disabled)'}
    </Typography>
  );

  const renderAccordionContent = (index) => {
    switch (index) {
      case 0:
        return <CommoditySection control={control} watch={watch} groups={groups} items={items} />;
      case 1:
        return <CompanionSection control={control} />;
      case 2:
        return <VehicleSection control={control} />;
      default:
        return null;
    }
  };

  const getA11yProps = (prefix, id) => ({
    id: `${prefix}-panel${id}-header`,
    'aria-controls': `${prefix}-panel${id}-content`,
  });

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        id="appointment-form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ height: '100%' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {isEditing ? 'ویرایش اطلاعات مهمان / ملاقات' : 'ثبت ملاقات جدید'}
          </Typography>
          <Button form="appointment-form" variant="outlined" size="small">
            مهمانان رزرو شده
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            gap: 8,
            mb: 3,
          }}
        >
          <Box display="flex" flexDirection="column">
            <GuestSection resetCount={resetCount} />
            <AppointmentSection scheduleTypeData={scheduleTypeData} isEditing={isEditing} />
          </Box>
          <Box display="flex">
            <AvatarUploadSection />
          </Box>
        </Box>

        {ACCORDIONS.map((item, index) => (
          <Accordion key={item.id} disableGutters disabled={item.disabled} sx={{ px: 2, mb: 1 }}>
            <AccordionSummary {...getA11yProps('wrapper', item.id)}>
              {renderTitle(item.title, item.disabled)}
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>{renderAccordionContent(index)}</AccordionDetails>
          </Accordion>
        ))}

        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" size="large" color="primary">
            {isEditing ? 'ذخیره تغییرات' : 'ثبت نهایی'}
          </Button>

          {!isEditing ? (
            <Button type="button" variant="outlined" size="large" onClick={handelCancel}>
              انصراف
            </Button>
          ) : (
            <Button variant="outlined" color="error" size="small" onClick={onEditCancelHandler}>
              انصراف از ویرایش
            </Button>
          )}
        </Stack>
      </Box>
    </FormProvider>
  );
}
