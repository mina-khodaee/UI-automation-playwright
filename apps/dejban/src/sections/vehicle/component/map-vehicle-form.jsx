
export const mapVehicleToForm = (vehicle, activeStep) => {
  if (!vehicle) return {};

  // First, determine which is the correct temperature for this car.
  const correctStep = detectActiveStepFromVehicle(vehicle);

  // If activeStep is not the same as the correct tab, return everything blank.
  if (activeStep !== correctStep) {
    return {
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
    };
  }

  // Now fill in all the fields.

  const plateValue = vehicle?.plate?.value || '';
  const plateType = vehicle?.plate?.type;

  // Find active ownership
  const activeOwnership = vehicle?.activeOwnership || vehicle?.ownerships?.find(o => o.isActive) || vehicle?.ownerships?.[0];

  // Fill in the plate based on the type of step.
  let plateFields = {
    plateTwoDigits: '',
    plateLetters: '',
    plateThreeDigits: '',
    plateCode: '',
    motorPlateTop: '',
    motorPlateBottom: '',
    customPlateInput: '',
  };

  // Step 0,1,4
  if ((activeStep === 0 || activeStep === 1 || activeStep === 4) && (plateType === 1 || plateType === 4)) {
    const match = plateValue.match(/^(\d{2})(\D)(\d{3})(\d{2})$/);
    if (match) {
      plateFields = {
        plateTwoDigits: match[1],
        plateLetters: match[2],
        plateThreeDigits: match[3],
        plateCode: match[4],
        motorPlateTop: '',
        motorPlateBottom: '',
        customPlateInput: '',
      };
    } else {
      // If it doesn't match the pattern, put the entire license plate in customPlateInput
      plateFields = {
        customPlateInput: plateValue,
        plateTwoDigits: '',
        plateLetters: '',
        plateThreeDigits: '',
        plateCode: '',
        motorPlateTop: '',
        motorPlateBottom: '',
      };
    }
  }

  // Step 3 (Motor)
  if (activeStep === 3 && plateType === 2 && plateValue.length === 8) {
    plateFields = {
      motorPlateTop: plateValue.slice(0, 3),
      motorPlateBottom: plateValue.slice(3),
      plateTwoDigits: '',
      plateLetters: '',
      plateThreeDigits: '',
      plateCode: '',
      customPlateInput: '',
    };
  }

  // Step 2
  if (activeStep === 2 && plateType === 3) {
    plateFields = {
      customPlateInput: plateValue,
      plateTwoDigits: '',
      plateLetters: '',
      plateThreeDigits: '',
      plateCode: '',
      motorPlateTop: '',
      motorPlateBottom: '',
    };
  }

  // Now fill in all the fields based on the vehicle data.
  return {
    vehicleType: vehicle?.vehicleType?.value ?? undefined,
    plateType: plateType ?? undefined,
    ownerShip: activeOwnership?.ownershipType?.value ?? undefined,
    ...plateFields,
    siteIds: vehicle?.siteIds ?? undefined,
    unitId: activeOwnership?.unitId ?? undefined,
    ownerId: activeOwnership?.ownerId
      ? { value: activeOwnership.ownerId, label: '' }
      : null,
    maximumCargo: vehicle?.cargoDetails?.maxPayloadKg?.toString() ?? '',
    cargoType: vehicle?.cargoDetails?.cargoType?.value ?? undefined,
    operationalWeight: vehicle?.constructionDetails?.operatingWeightKg?.toString() ?? '',
    height: vehicle?.constructionDetails?.maxLiftHeight?.toString() ?? '',
    equipments: vehicle?.constructionDetails?.attachmentType?.value ?? undefined,
    model: vehicle?.model ?? '',
    color: vehicle?.color ?? '',
    fuelType: vehicle?.fuelType?.value ?? undefined,
    chassisNumber: vehicle?.chassisNumber ?? '',
    vinNumber: vehicle?.vin ?? '',
    engineNumber: vehicle?.engineNumber ?? '',
  };
};

export const detectActiveStepFromVehicle = (vehicle) => {
  if (!vehicle) return 0;

  const vehicleType = vehicle?.vehicleType?.value;
  const plateType = vehicle?.plate?.type;

  // First, identify based on the type of license plate (this is the strongest criterion).
  if (plateType === 2) {
    // console.log('Detected as motorcycle (plate type 2)');
    return 3; // Motor
  }
  if (plateType === 3) {
    // console.log('Detected as industrial (plate type 3)');
    return 2; // Logestic
  }

  if (vehicleType === 8) {
    // console.log('Detected as motorcycle (vehicle type 8)');
    return 3; // Motor
  }

  // Logestic Vehicle Type
  const industrialTypes = [9, 10, 11, 12, 13, 14, 15];
  if (industrialTypes.includes(vehicleType)) {
    // console.log('Detected as industrial (vehicle type)', vehicleType);
    return 2; // Logestic
  }

  // Cargo Details
  if (vehicle?.cargoDetails) {
    if (vehicle.cargoDetails.maxPayloadKg || vehicle.cargoDetails.cargoType) {
      // console.log('Detected as cargo (has cargo details)');
      return 1; // Cargo
    }
  }

  // Cargo Vehicle Type
  const cargoTypes = [4, 5, 6, 7];
  if (cargoTypes.includes(vehicleType)) {
    // console.log('Detected as cargo (vehicle type)', vehicleType);
    return 1; // Cargo
  }

  // Construction Details
  if (vehicle?.constructionDetails) {
    if (vehicle.constructionDetails.operatingWeightKg ||
      vehicle.constructionDetails.maxLiftHeight ||
      vehicle.constructionDetails.attachmentType) {
      // console.log('Detected as industrial (has construction details)');
      return 2; // Lagestic
    }
  }

  // Other Vehicle Type
  const miscellaneousTypes = [16, 17, 18];
  if (miscellaneousTypes.includes(vehicleType)) {
    // console.log('Detected as miscellaneous (vehicle type)', vehicleType);
    return 4; // Other
  }

  return 0;
};