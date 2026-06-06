import { useState } from 'react';
import { skipToken, useQuery } from '@tanstack/react-query';
import { useGetVehicles } from 'src/services/vehicle/vehicle.service';
import { useGetActiveVehicleAssignmentsByVehicleId } from 'src/services/vehicle-assignment/vehicle-assignment.service';
import { getPersonnelById } from 'src/services/personnels/personnels.http';

export function useVehicleSearch(currentItem) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [originalPlate, setOriginalPlate] = useState('');
  const [originalOwnerId, setOriginalOwnerId] = useState('');
  const [originalOwnerName, setOriginalOwnerName] = useState('');

  const { data: vehicles, isLoading: isVehicleLoading } = useGetVehicles({ 
    searchTerm: searchTerm || undefined 
  });
  const vehiclesData = vehicles?.items || [];

  const { data: assignmentData, isLoading: assignmentLoading } =
    useGetActiveVehicleAssignmentsByVehicleId(selectedVehicle?.id || skipToken);

  const driverId = assignmentData?.[0]?.driverId || currentItem?.deriverId || null;

  const { data: personnelData, isLoading: personnelLoading } = useQuery({
    queryKey: ['personnel', driverId],
    queryFn: () => getPersonnelById(driverId),
    enabled: !!driverId,
  });

  const driverNameFromApi = personnelData
    ? `${personnelData.firstName || ''} ${personnelData.lastName || ''}`.trim()
    : '';

  return {
    searchTerm,
    setSearchTerm,
    selectedVehicle,
    setSelectedVehicle,
    originalPlate,
    setOriginalPlate,
    originalOwnerId,
    setOriginalOwnerId,
    originalOwnerName,
    setOriginalOwnerName,
    driverData: {
      id: driverId,
      name: currentItem ? currentItem.deriverName || '' : driverNameFromApi,
      loading: personnelLoading,
    },
    vehiclesData,
    isVehicleLoading,
    assignmentLoading,
  };
}