'use client'

import { useCallback } from 'react';
import { toast } from 'sonner';
import {
  useCreateCities,
  useCreateCountries,
  useCreateProvinces,
  useDeleteCity,
  useDeleteCountry,
  useDeleteProvience,
  useUpdateCity,
  useUpdateCountry,
  useUpdateProvience
} from 'src/services/location/location.service';
import { LOCATION_TYPES, DIALOG_MODES } from './constants';

export const useLocationOperations = () => {
  // Api Hooks
  const addCountry = useCreateCountries();
  const addProvince = useCreateProvinces();
  const addCity = useCreateCities();
  
  const deleteCountry = useDeleteCountry();
  const deleteProvince = useDeleteProvience();
  const deleteCity = useDeleteCity();
  
  const updateCountry = useUpdateCountry();
  const updateProvince = useUpdateProvience();
  const updateCity = useUpdateCity();

  // Create new location 
  const handleAddLocation = useCallback(async (data, dialogMode, selectedItem) => {
    try {
      switch (dialogMode) {
        case DIALOG_MODES.ADD_COUNTRY: {
          const payload = {
            name: data.name,
            enName: data.enName,
            parentId: 0,
            phoneCode: data.phoneCode,
            twoLetterCountryCode: data.twoLetterCountryCode,
            twoLetterLanguageCode: data.twoLetterLanguageCode,
          };

          await addCountry.mutateAsync(payload, {
            onSuccess: () => {
              toast.success('کشور با موفقیت افزوده شد.');
            },
            onError: () => {
              toast.error('افزودن کشور ناموفق بود.');
            }
          });
          break;
        }

        case DIALOG_MODES.ADD_PROVINCE: {
          const payload = {
            name: data.name,
            enName: data.enName,
            latitude: data.latitude,
            longitude: data.longitude,
            phoneCode: data.phoneCode,
            countryId: selectedItem.id,
          };

          await addProvince.mutateAsync(payload, {
            onSuccess: () => {
              toast.success('استان با موفقیت افزوده شد.');
            },
            onError: () => {
              toast.error('افزودن استان ناموفق بود.');
            }
          });
          break;
        }

        case DIALOG_MODES.ADD_CITY: {
          const payload = {
            name: data.name,
            enName: data.enName,
            latitude: data.latitude,
            longitude: data.longitude,
            provinceId: selectedItem.id,
          };

          await addCity.mutateAsync(payload, {
            onSuccess: () => {
              toast.success('شهر با موفقیت افزوده شد.');
            },
            onError: () => {
              toast.error('افزودن شهر ناموفق بود.');
            }
          });
          break;
        }

        default:
          return;
      }

      return true;
    } catch (error) {
      console.error('Error adding location:', error);
      return false;
    }
  }, [addCountry, addProvince, addCity]);

  // Delete Location
  const handleDeleteLocation = useCallback(async (selectedItem) => {
    if (!selectedItem) return false;

    try {
      switch (selectedItem.type) {
        case LOCATION_TYPES.COUNTRY:
          await deleteCountry.mutateAsync(selectedItem.id);
          break;
        case LOCATION_TYPES.PROVINCE:
          await deleteProvince.mutateAsync(selectedItem.id);
          break;
        case LOCATION_TYPES.CITY:
          await deleteCity.mutateAsync(selectedItem.id);
          break;
        default:
          return false;
      }

      toast.success('آیتم با موفقیت حذف شد.');
      return true;
    } catch (error) {
      toast.warning('به دلیل وجود زیرشاخه، حذف امکان‌پذیر نیست!');
      return false;
    }
  }, [deleteCountry, deleteProvince, deleteCity]);

  // Edit Location
  const handleEditLocation = useCallback(async (formData, item) => {
    try {
      switch (item.type) {
        case LOCATION_TYPES.COUNTRY: {
          const payload = {
            id: item.id,
            name: formData.name.trim(),
            enName: formData.enName?.trim() || '',
            phoneCode: formData.phoneCode?.trim() || '',
            twoLetterCountryCode: formData.twoLetterCountryCode?.trim() || '',
            twoLetterLanguageCode: formData.twoLetterLanguageCode?.trim() || '',
          };

          await updateCountry.mutateAsync(payload, {
            onSuccess: () => {
              toast.success('کشور با موفقیت ویرایش شد.');
            },
            onError: () => {
              toast.error('ویرایش کشور ناموفق بود.');
            }
          });
          break;
        }
     
        case LOCATION_TYPES.PROVINCE: {
          const payload = {
            id: item.id,
            name: formData.name.trim(),
            enName: formData.enName?.trim() || '',
            latitude: formData.latitude ?? null,
            longitude: formData.longitude ?? null,
            phoneCode: formData.phoneCode?.trim() || '',
            countryId: item.data.parentId,
          };

          await updateProvince.mutateAsync(payload, {
            onSuccess: () => {
              toast.success('استان با موفقیت ویرایش شد.');
            },
            onError: () => {
              toast.error('ویرایش استان ناموفق بود.');
            }
          });
          break;
        }

        case LOCATION_TYPES.CITY: {
          const payload = {
            id: item.id,
            name: formData.name.trim(),
            enName: formData.enName?.trim() || '',
            latitude: formData.latitude ?? null,
            longitude: formData.longitude ?? null,
            provinceId: item.data.parentId,
          };

          await updateCity.mutateAsync(payload, {
            onSuccess: () => {
              toast.success('شهر با موفقیت ویرایش شد.');
            },
            onError: () => {
              toast.error('ویرایش شهر ناموفق بود.');
            }
          });
          break;
        }

        default:
          return false;
      }

      return true;
    } catch (error) {
      console.error('Error editing location:', error);
      return false;
    }
  }, [updateCountry, updateProvince, updateCity]);

  return {
    handleAddLocation,
    handleDeleteLocation,
    handleEditLocation,
    isLoading: addCountry.isLoading || addProvince.isLoading || addCity.isLoading,
    isDeleting: deleteCountry.isLoading || deleteProvince.isLoading || deleteCity.isLoading,
    isEditing: updateCountry.isLoading || updateProvince.isLoading || updateCity.isLoading
  };
};