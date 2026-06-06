import { Box, InputAdornment, CircularProgress } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';
import { convertEnToFa, formatPlateForDisplay } from '@repo/ui/utils';
import { getOwnerInfo, getPlateValue, getVehicleTypeValue } from './vehicle-access.utils';

export function VehicleSearchFields({
  vehiclesData,
  isVehicleLoading,
  searchTerm,
  setSearchTerm,
  selectedVehicle,
  setSelectedVehicle,
  currentItem,
  driverData,
  setValue,
  setOriginalPlate,
  setOriginalOwnerId,
  setOriginalOwnerName,
}) {
  const handleVehicleChange = (_, value) => {
    if (value && typeof value !== 'string') {
      const plateValue = getPlateValue(value);
      const vehicleTypeValue = getVehicleTypeValue(value);
      const { ownerId, ownerName } = getOwnerInfo(value);

      setOriginalPlate(plateValue);
      setOriginalOwnerId(ownerId);
      setOriginalOwnerName(ownerName);

      setSelectedVehicle({
        id: value.id,
        plate: plateValue,
        vehicleType: vehicleTypeValue,
        driverName: '',
        ownerName,
      });

      setValue('selectedVehicleId', String(value.id));
      setValue('vehicleType', vehicleTypeValue);
      setValue('vehiclePlate', formatPlateForDisplay(plateValue));
    } else if (value === null) {
      setSelectedVehicle(null);
      setOriginalPlate('');
      setOriginalOwnerId('');
      setOriginalOwnerName('');
      setValue('selectedVehicleId', '');
      setValue('driverName', '');
      setValue('vehicleType', '');
      setValue('vehiclePlate', '');
    }
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, minHeight: 64, mb: 3 }}>
      <Field.Autocomplete
        name="searchQuery"
        freeSolo
        options={vehiclesData}
        isLoading={isVehicleLoading}
        placeholder="جستجوی خودرو"
        onInputChange={(_, value) => !currentItem && setSearchTerm(value)}
        disabled={!!currentItem}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          const plate = getPlateValue(option);
          const formattedPlate = convertEnToFa(plate);
          const model = option.model || '';
          return `${formattedPlate} - ${model}`;
        }}
        onChange={handleVehicleChange}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          onKeyDown: (e) => {
            if (e.key === 'Enter') e.preventDefault();
          },
        }}
      />

      <Field.Text
        name="driverName"
        label="نام راننده"
        size="small"
        disabled
        InputProps={{
          endAdornment: driverData.loading && (
            <InputAdornment position="end">
              <CircularProgress size={16} />
            </InputAdornment>
          ),
        }}
      />

      <Field.Text
        name="vehicleType"
        label="نوع خودرو"
        size="small"
        disabled
      />

      <Field.Text
        name="vehiclePlate"
        label="پلاک خودرو"
        size="small"
        disabled
      />
    </Box>
  );
}