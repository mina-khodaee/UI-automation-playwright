'use client'

import { useMemo, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useGetSites } from 'src/services/siteManagement/site.service';
import { useGetUnitsWithOutPagination } from 'src/services/units/units.service';
import { useCreateVehicle, useUpdateVehicle } from 'src/services/vehicle/vehicle.service';
import { detectActiveStepFromVehicle, mapVehicleToForm } from './map-vehicle-form';

export const useVehicleForm = ({ open, currentVehicle, activeStep: externalActiveStep, onClose, onRefetch }) => {
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const [internalActiveStep, setInternalActiveStep] = useState(0);

  const activeStep = externalActiveStep !== undefined ? externalActiveStep : internalActiveStep;

  // Schema validation
  const vehicleSchema = z.object({
    vehicleType: z
      .number({ required_error: 'نوع خودرو الزامی است' })
      .min(1, 'نوع خودرو الزامی است'),

    plateType: z
      .number({ required_error: 'نوع پلاک الزامی است' })
      .min(1, 'نوع پلاک الزامی است'),

    ownerShip: z
      .number({ required_error: 'نوع مالکیت الزامی است' })
      .min(1, 'نوع مالکیت الزامی است'),

    plateTwoDigits: z.string().optional(),
    plateLetters: z.string().optional(),
    plateThreeDigits: z.string().optional(),
    plateCode: z.string().optional(),
    motorPlateTop: z.string().optional(),
    motorPlateBottom: z.string().optional(),
    customPlateInput: z.string().optional(),

    siteIds: z.string().optional(),
    unitId: z.string().optional(),
    personnelCode: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    nationalCode: z.string().optional(),

    maximumCargo: z.string().optional(),
    cargoType: z.string().optional(),
    operationalWeight: z.string().optional(),
    height: z.string().optional(),
    equipments: z.string().optional(),

    model: z.string().optional(),
    color: z.string().optional(),
    fuelType: z.string().optional(),
    chassisNumber: z.string().optional(),
    vinNumber: z.string().optional(),
    engineNumber: z.string().optional(),
  });

  const defaultValues = useMemo(() => {
    return currentVehicle ? mapVehicleToForm(currentVehicle, activeStep) : {};
  }, [currentVehicle, activeStep]);

  // Form methods
  const methods = useForm({
    mode: 'onSubmit',
    // resolver: zodResolver(vehicleSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (open && currentVehicle) {
      const detectedStep = detectActiveStepFromVehicle(currentVehicle);
      // console.log('Setting internal step to:', detectedStep);
      setInternalActiveStep(detectedStep);
    }
  }, [open, currentVehicle]);

  // بازنشانی فرم - فقط موقع باز شدن دیالوگ
  useEffect(() => {
    if (open && currentVehicle) {
      const detectedStep = detectActiveStepFromVehicle(currentVehicle);
      // console.log('Initial form reset with step:', detectedStep);
      const formData = mapVehicleToForm(currentVehicle, detectedStep);
      // console.log('Initial form data:', formData);
      reset(formData);
    }
  }, [open, currentVehicle, reset]);

  // وقتی استپ تغییر می‌کنه، فرم رو با استپ جدید آپدیت کن
  useEffect(() => {
    if (open && currentVehicle) {
      // console.log('Step changed to:', activeStep);
      const formData = mapVehicleToForm(currentVehicle, activeStep);
      // console.log('Updating form for new step:', formData);
      reset(formData);
    }
  }, [activeStep, currentVehicle, open, reset]);

  useEffect(() => {
    if (!open) {
      reset({
        vehicleType: undefined,
        plateType: undefined,
        ownerShip: undefined,
        plateTwoDigits: '',
        plateLetters: '',
        plateThreeDigits: '',
        plateCode: '',
        motorPlateTop: '',
        motorPlateBottom: '',
        customPlateInput: '',
        siteIds: undefined,
        unitId: undefined,
        ownerId: null,
        maximumCargo: '',
        cargoType: undefined,
        operationalWeight: '',
        height: '',
        equipments: undefined,
        model: '',
        color: '',
        fuelType: undefined,
        chassisNumber: '',
        vinNumber: '',
        engineNumber: '',
      });
      setInternalActiveStep(0);
    }
  }, [open, reset]);

  const getVehicleCategory = () => {
    switch (activeStep) {
      case 0:
        return 0; // Standard

      case 1:
        return 1; // Cargo

      case 2:
        return 2; // Logestic

      case 3:
        return 3;

      case 4:
        return 4; // Other

      default:
        return 0;
    }
  };

  // Fetch data for select boxes
  const { data: getSites, isLoading: sitesLoading } = useGetSites();
  const { data: getUnits, isLoading: unitsLoading, error: unitsError } = useGetUnitsWithOutPagination();

  const siteOptions = useMemo(() => {
    try {
      if (!getSites) {
        return [];
      }

      if (getSites.items && Array.isArray(getSites.items)) {
        return getSites.items.map(site => ({
          label: site.name,
          value: site.id,
        }));
      }

      if (Array.isArray(getSites)) {
        return getSites.map(site => ({
          label: site.name,
          value: site.id,
        }));
      }

      if (getSites.data && Array.isArray(getSites.data)) {
        return getSites.data.map(site => ({
          label: site.name,
          value: site.id,
        }));
      }

      console.warn('Unexpected getSites structure:', getSites);
      return [];
    } catch (error) {
      console.error('Error in siteOptions:', error);
      return [];
    }
  }, [getSites]);

  const unitOptions = useMemo(() => {
    try {
      let unitsArray = null;

      if (getUnits?.items && Array.isArray(getUnits?.items)) {
        unitsArray = getUnits?.items;
      } else if (Array.isArray(getUnits)) {
        unitsArray = getUnits;
      } else if (getUnits?.data && Array.isArray(getUnits?.data)) {
        unitsArray = getUnits?.data;
      } else {
        console.warn('getUnits has no recognizable array structure:', getUnits);
        return [];
      }

      if (!values.siteIds) {
        return [];
      }

      const filtered = unitsArray
        .filter(unit => {
          if (!unit) return false;
          const siteId = unit?.site?.id || unit?.siteId;
          return siteId === values.siteIds;
        })
        .map(unit => ({
          label: unit.name,
          value: unit.id,
        }));

      return filtered;

    } catch (error) {
      console.error('Error in unitOptions:', error);
      return [];
    }
  }, [getUnits, values.siteIds, unitsLoading]);

  const transformFormDataToApiStructure = (formData) => {
    let plateValue = '';

    // فقط بر اساس activeStep فعلی، پلاک رو ترکیب کن
    if (activeStep === 2) {
      plateValue = formData.customPlateInput || '';
    } else if (activeStep === 3) {
      plateValue = [
        formData.motorPlateTop,
        formData.motorPlateBottom,
      ].filter(Boolean).join('');
    } else {
      plateValue = [
        formData.plateTwoDigits,
        formData.plateLetters,
        formData.plateThreeDigits,
        formData.plateCode,
      ].filter(Boolean).join('');
    }

    const toNullIfEmpty = (value) => {
      if (value === '' || value === undefined || value === null) return null;
      return value;
    };

    const toNumberOrNull = (value) => {
      if (value === '' || value === undefined || value === null) return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    return {
      PlateValue: plateValue,
      PlateType: formData.plateType,
      VehicleType: formData.vehicleType,
      OwnershipType: formData.ownerShip,
      FuelType: toNumberOrNull(formData.fuelType),
      // OwnerId: formData.ownerId?.value || formData.ownerId || '00000000-0000-0000-0000-000000000001',
      OwnerId: (() => {
        // اولویت اول: ایدی پرسنل
        if (formData.ownerId?.value || formData.ownerId) {
          return formData.ownerId?.value || formData.ownerId;
        }
        // اولویت دوم: ایدی سازمان (اگر انتخاب شده باشد)
        if (formData.siteIds) {
          return formData.siteIds;
        }
        // پیش‌فرض
        return '00000000-0000-0000-0000-000000000001';
      })(),
      SiteIds: formData.siteIds ? formData.siteIds : '00000000-0000-0000-0000-000000000001',
      // VehicleCategory: formData.vehicleCategory,
      VehicleCategory: getVehicleCategory(),
      Model: toNullIfEmpty(formData.model),
      Color: toNullIfEmpty(formData.color),
      OwnershipStartDate: formData.ownershipStartDate || null,
      ManufactureYear: toNumberOrNull(formData.manufactureYear),
      MaxPayloadKg: toNumberOrNull(formData.maximumCargo),
      AxleCount: toNumberOrNull(formData.axleCount),
      CargoType: formData.cargoType || 0,
      MaxLiftHeight: toNumberOrNull(formData.height),
      AttachmentType: toNullIfEmpty(formData.equipments),
      OperatingWeightKg: toNumberOrNull(formData.operationalWeight),
      Vin: toNullIfEmpty(formData.vinNumber),
      EngineNumber: toNullIfEmpty(formData.engineNumber),
    };
  };

  const transformToUpdateStructure = (formData) => {

    let plateValue = '';

    if (activeStep === 2) {
      plateValue = formData.customPlateInput || '';
    } else if (activeStep === 3) {
      plateValue = [
        formData.motorPlateTop,
        formData.motorPlateBottom,
      ].filter(Boolean).join('');
    } else {
      plateValue = [
        formData.plateTwoDigits,
        formData.plateLetters,
        formData.plateThreeDigits,
        formData.plateCode,
      ].filter(Boolean).join('');
    }

    const toNullIfEmpty = (value) =>
      value === '' || value === undefined || value === null ? null : value;

    const toNumberOrNull = (value) => {
      if (value === '' || value === undefined || value === null) return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    return {
      Id: currentVehicle.id,

      Model: toNullIfEmpty(formData.model),
      Color: toNullIfEmpty(formData.color),
      FuelType: toNumberOrNull(formData.fuelType),
      ManufactureYear: toNumberOrNull(formData.manufactureYear),
      Vin: toNullIfEmpty(formData.vinNumber),
      EngineNumber: toNullIfEmpty(formData.engineNumber),

      Status: formData.status ?? null,

      // ⭐ این قسمت مهمه (مطابق Command جدید)
      PlateValue: plateValue || null,
      PlateType: formData.plateType ?? null,

      SiteIds: formData.siteIds ?? null,

      MaxPayloadKg: toNumberOrNull(formData.maximumCargo),
      AxleCount: toNumberOrNull(formData.axleCount),
      CargoType: formData.cargoType ?? null,

      MaxLiftHeight: toNumberOrNull(formData.height),
      AttachmentType: toNullIfEmpty(formData.equipments),
      OperatingWeightKg: toNumberOrNull(formData.operationalWeight),
    };
  };

  // Submit handler
  const onSubmit = handleSubmit(async (data) => {
    try {
      const apiData = transformFormDataToApiStructure(data);

      if (currentVehicle) {
        // await updateVehicle.mutateAsync(apiData);
        const updateData = transformToUpdateStructure(data);
        await updateVehicle.mutateAsync(updateData);
      } else {
        await createVehicle.mutateAsync(apiData);
      }

      onClose();
      if (onRefetch) {
        onRefetch();
      }
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  // Reset form when dialog opens
  const resetForm = useCallback(() => {
    if (open) {
      if (currentVehicle) {
        const detectedStep = detectActiveStepFromVehicle(currentVehicle);
        setInternalActiveStep(detectedStep);
        reset(mapVehicleToForm(currentVehicle, detectedStep));
      } else {
        reset(defaultValues);
      }
    }
  }, [open, reset, defaultValues, currentVehicle]);

  // Update vehicle type when activeStep changes
  const updateVehicleType = useCallback(() => {
    if (activeStep === 3) {
      setValue('vehicleType', 8, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false
      });
    }
  }, [activeStep, setValue]);

  return {
    methods,
    values,
    isSubmitting,
    siteOptions,
    unitOptions,
    onSubmit,
    resetForm,
    updateVehicleType,
    activeStep,
    setActiveStep: setInternalActiveStep,
  };
};