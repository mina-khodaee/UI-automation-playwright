'use client'

import { VEHICLE_TYPES, PLATE_TYPES, OWNERSHIP_TYPES, CARGO_TYPES } from './constants';
import Box from '@mui/material/Box';
import { Field } from 'src/components/hook-form';
import VehicleAdditionalInfo from './vehicle-additional-info';
import VehicleOwnershipFields from './vehicle-ownership-fields';
import VehiclePlateInput from './vehicle-plate-input';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { useGetEquipmentWithoutPagination } from 'src/services/equipment/equipment.service';

const VehicleFormFields = ({
  activeStep,
  values,
  siteOptions,
  unitOptions,
  t_staff
}) => {

  const isMotorcycle = activeStep === 3;
  const filteredVehicleOptions = VEHICLE_TYPES.filter(item =>
    activeStep === 3 ? item?.value === 8 : item?.value !== 8
  );

  const { setValue, watch } = useFormContext();

  const vehicleType = watch("vehicleType");

  useEffect(() => {
    if (
      activeStep === 3 &&
      filteredVehicleOptions.length === 1 &&
      vehicleType !== filteredVehicleOptions[0].value
    ) {
      setValue('vehicleType', filteredVehicleOptions[0].value, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false
      });
    }
  }, [activeStep, filteredVehicleOptions, vehicleType, setValue]);


  const { data: getEquipment } = useGetEquipmentWithoutPagination();
  const getAllEquipment = getEquipment || []


  const equipmentOption = getAllEquipment?.map((e) => ({
    label: e.equipmentName,
    value: e.id,
  }));


  const getFilteredPlateTypes = () => {
    switch (activeStep) {
      case 0:
      case 1:
        return PLATE_TYPES.filter(item =>
          item.value === 1 || item.value === 4 // Standard And Diplomat
        );

      case 2:
        return PLATE_TYPES.filter(item =>
          item.value === 3 // Internal
        );

      case 3:
        return PLATE_TYPES.filter(item =>
          item.value === 2 // Motorcycle
        );

      case 4:
      default:
        return PLATE_TYPES; // All Data
    }
  };

  const filteredPlateTypes = getFilteredPlateTypes();

  return (
    <>
      <Field.Select
        name="vehicleType"
        label='نوع خودرو'
        data={filteredVehicleOptions}
        displayExp="label"
        valueExp="value"
        size='small'
        disabled={isMotorcycle}
        sx={{ mt: 3 }}
      />

      <Field.Select
        name="plateType"
        label='نوع پلاک'
        data={filteredPlateTypes}
        displayExp="label"
        valueExp="value"
        size='small'
        sx={{ mt: 3 }}
      />

      <VehiclePlateInput activeStep={activeStep} />

      <Box sx={{ gridColumn: { sm: 'span 2' } }}>
        <Field.Select
          name="ownerShip"
          label='نوع مالکیت'
          data={OWNERSHIP_TYPES}
          displayExp="label"
          valueExp="value"
          size='small'
        />
      </Box>

      <Box><br /></Box>
      <Box><br /></Box>

      <VehicleOwnershipFields
        ownershipType={values.ownerShip}
        siteOptions={siteOptions}
        unitOptions={unitOptions}
        t_staff={t_staff}
      />

      {activeStep === 1 && (
        <>
          <Field.Text name="maximumCargo" label='حداکثر بار' size='small' />
          <Field.Select
            name="cargoType"
            label='نوع بار'
            data={CARGO_TYPES}
            displayExp="label"
            valueExp="value"
            size='small'
          />
        </>
      )}

      {activeStep === 2 && (
        <>
          <Field.Text name="operationalWeight" label='وزن عملیاتی' size='small' />
          <Field.Text name="height" label='ارتفاع' size='small' />
          <Field.Select
            name="equipments"
            label='تجهیزات'
            data={equipmentOption}
            displayExp="label"
            valueExp="value"
            size='small'
          />
        </>
      )}

      <VehicleAdditionalInfo />
    </>
  );
};

export default VehicleFormFields;