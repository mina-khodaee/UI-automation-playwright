'use client'

import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Form } from 'src/components/hook-form';
import { useTranslate } from 'src/locales';
import { PiIdentificationBadge, PiUserThin, PiBuilding } from 'react-icons/pi';
import Box from '@mui/material/Box';
import { useVehicleForm } from './component/use-vehicle-form';
import VehicleFormFields from './component/vehicle-form-fields';
import CustomizedSteppers from './vehicle-stepper';
import { STEPPER_LIST } from './component/constants';

const GridFormSpacing = ({ children }) => {
  return (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      sx={{ mt: 5, mb: 5 }}
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(4, 1fr)',
      }}
    >
      {children}
    </Box>
  );
};

const VehicleNewEditForm = ({ open, onClose, currentVehicle, onRefetch }) => {
  const [localActiveStep, setLocalActiveStep] = React.useState(0);
  const { t: t_staff } = useTranslate('staff');

  const {
    methods,
    values,
    isSubmitting,
    siteOptions,
    unitOptions,
    onSubmit,
    resetForm,
    updateVehicleType,
    activeStep: hookActiveStep,
    setActiveStep: setHookActiveStep,
  } = useVehicleForm({
    open,
    currentVehicle,
    activeStep: localActiveStep,
    onClose,
    onRefetch
  });

  useEffect(() => {
    if (currentVehicle && hookActiveStep !== undefined) {
      setLocalActiveStep(hookActiveStep);
    }
  }, [currentVehicle, hookActiveStep]);

  // Reset form on open with detected step
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        resetForm();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open, currentVehicle, resetForm]);

  // Update vehicle type when step changes
  useEffect(() => {
    updateVehicleType();
  }, [localActiveStep, updateVehicleType]);

  // Handle step change from stepper
  const handleStepChange = (step) => {
    setLocalActiveStep(step);
    setHookActiveStep(step);

    if (step === 3) {
      methods.setValue('vehicleType', 8, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false
      });
    }
  };

  // Cleanup on unmount or close
  useEffect(() => {
    if (!open) {
      setLocalActiveStep(0);
    }
  }, [open]);

  const stepperListWithIcons = STEPPER_LIST.map((step, index) => ({
    ...step,
    icon: index === 0 ? <PiIdentificationBadge style={{ fontSize: 25 }} /> :
      index === 1 ? <PiUserThin style={{ fontSize: 25 }} /> :
        <PiBuilding style={{ fontSize: 25 }} />,
  }));

 
  useEffect(() => {
    if (!currentVehicle) return;

    const categoryStepMap = {
      0: 0, // Standard → Step 0
      1: 1, // Cargo → Step 1
      2: 2, // Logestic → Step 2
      3: 3,  // Motor → Step 3
      4: 4  // Other → Step 4
    };

    const step =
      categoryStepMap[currentVehicle.vehicleCategory.value] ?? 0;

    setLocalActiveStep(step);
    setHookActiveStep(step);

  }, [currentVehicle]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: '700px', maxWidth: '90%' } }}
      fullWidth
    >
      <DialogTitle textAlign='center'>
        {currentVehicle ? 'ویرایش خودرو' : 'ایجاد خودرو'}
      </DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Card sx={{ p: 2 }}>
                <CustomizedSteppers
                  steps={stepperListWithIcons}
                  activeStep={localActiveStep}
                  getActiveStep={handleStepChange}
                />

                <GridFormSpacing>
                  <VehicleFormFields
                    activeStep={localActiveStep}
                    values={values}
                    siteOptions={siteOptions}
                    unitOptions={unitOptions}
                    t_staff={t_staff}
                  />
                </GridFormSpacing>

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-start"
                  sx={{ mt: 3 }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    size='small'
                  >
                    {currentVehicle ? 'ویرایش' : 'ثبت'}
                  </LoadingButton>
                  <LoadingButton
                    onClick={onClose}
                    color="error"
                    variant="contained"
                    size="small"
                  >
                    انصراف
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleNewEditForm;