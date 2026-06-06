'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Accordion,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { GuestSection } from './form-components/guest-section/GuestSection';
import { AppointmentSection } from './form-components/appointment-section/AppointmentSection';
import { CompanionSection } from './form-components/companion-section/CompanionSection';
import { CommoditySection } from './form-components/commodity-section/CommoditySection';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateVisitorAndVisitSchedule } from 'src/services/visitor-and-visitSchedule/visitorAndVisitSchedule.service';
import { createVisitScheduleSchema } from './validation/visitSchedule.schema';
import { toast } from 'src/components/snackbar';
import { ComponentBox } from 'src/components/component-box';
import Paper from '@mui/material/Paper';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import Accordion, { accordionClasses } from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import { useTranslate } from 'src/locales';

export function VisitorAppointmentCreateForm({ open, onClose, groups, items }) {
  const { t: tGuest } = useTranslate('guest-visitor');
  const { t: tAppointment } = useTranslate('appointment');
  // react-hook-form
  const methods = useForm({
    resolver: zodResolver(
      createVisitScheduleSchema({
        guest: tGuest,
        appointment: tAppointment,
      })
    ),
    defaultValues: {
      visitorTypeId: '',
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      mobileNumber: '',
      nationalCode: null,
      passportNumber: null,
      inclusiveNumber: null,
      //appointment
      visitorId: '',
      cardType: '',
      visitorCardId: null,
      hostId: '',
      visitReasonId: '',
      accessGroupId: '',
      visitDate: '',
      visitEndDate: '',
      visitorItemIds: [],
      note: null,
      companions: [
        {
          firstName: '',
          lastName: '',
          gender: '',
          nationalCode: null,
          phoneNumber: null,
        },
      ],
    },
    mode: 'all',
  });

  const { control, watch, setValue, handleSubmit } = methods;

  //  React Query mutation
  const CreateVisitorAndVisitSchedule = useCreateVisitorAndVisitSchedule();

  // Updated ACCORDIONS data to match your 3 tabs
  const ACCORDIONS = [
    // {
    //   id: 'panel-1',
    //   value: 'panel1',
    //   title: 'اطلاعات مهمان و قرار ملاقات ', // Appointment Info
    //   disabled: false,
    // },
    {
      id: 'panel-3',
      value: 'panel3',
      title: 'کالا و اقلام', // Commodities
      disabled: false,
    },
    {
      id: 'panel-4',
      value: 'panel4',
      title: 'همراهان', // Companions
      disabled: false,
    },
  ];

  //  Submit handler
  const onSubmit = async (data) => {
    try {
      const payload = {
        visitorTypeId: data.visitorTypeId,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: null,
        nationalCode: data.nationalCode,
        mobileNumber: data.mobileNumber,
        passportNumber: data.passportNumber,
        inclusiveNumber: data.inclusiveNumber,
        // photoURL: null,
        // isPublic: false,
        //appointment
        visitorId: data.visitorId,
        visitorCardId: data.visitorCardId,
        cardType: data.cardType,
        hostId: data.hostId,
        visitReasonId: data.visitReasonId,
        accessGroupId: data.accessGroupId,
        visitDate: data.visitDate,
        visitEndDate: data.visitEndDate,
        note: data.note,
        visitorItemIds: data.visitorItemIds || [],

        companions: data.companions || [],
      };
      await CreateVisitorAndVisitSchedule.mutateAsync(payload);
      toast.success('ثبت ملاقات با موفقیت انجام شد!');
      onClose();
    } catch (error) {
      toast.error('خطا در ثبت ملاقات');
    }
  };

  const renderTitle = (title, disabled, subheader) => (
    <Typography
      component="span"
      variant="subtitle1"
      sx={{
        ...(subheader && { width: '33%', flexShrink: 0 }),
      }}
    >
      {title} {!!disabled && '(disabled)'}
    </Typography>
  );

  // Helper to render the specific component based on index
  const renderAccordionContent = (index) => {
    switch (index) {
      // case 0:
      //   return (
      //     <Box display="flex" flexDirection="row" gap={3}>
      //       <GuestSection control={control} watch={watch} />
      //       <AppointmentSection control={control} watch={watch} setValue={setValue} />
      //     </Box>
      //   );

      case 0:
        return <CommoditySection control={control} watch={watch} groups={groups} items={items} />;
      case 1:
        return <CompanionSection control={control} />;
      default:
        return null;
    }
  };

  const getA11yProps = (prefix, id) => ({
    id: `${prefix}-panel${id}-header`,
    'aria-controls': `${prefix}-panel${id}-content`,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle textAlign="center">ثبت ملاقات جدید</DialogTitle>
      <DialogContent
        sx={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <Box
          component="form"
          id="appointment-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ height: '100%' }}
        >
          <Box display="flex" flexDirection="row" gap={3}>
            <GuestSection control={control} watch={watch} />
            <AppointmentSection control={control} watch={watch} setValue={setValue} />
          </Box>
          <ComponentBox fullWidth sx={{ mb: 5, gap: 0 }}>
            <Paper fullWidth variant="outlined">
              {ACCORDIONS.map((item, index) => (
                <Accordion
                  key={item.id}
                  disableGutters
                  disabled={item.disabled}
                  defaultExpanded={index === 0} // Open the first tab by default
                  sx={{ px: 2 }}
                >
                  <AccordionSummary {...getA11yProps('wrapper', item.id)}>
                    {renderTitle(item.title, item.disabled)}
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    {/* Render the specific component here */}
                    {renderAccordionContent(index)}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </ComponentBox>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button type="submit" form="appointment-form" variant="contained" size="small">
          ثبت نهایی
        </Button>
        <Button onClick={onClose} color="error" variant="contained" size="small">
          انصراف
        </Button>
      </DialogActions>
    </Dialog>
  );
}
