// src/services/armory-locations/armory-locations.http.js

// استفاده از Mock (فعلاً فعال)
export {
  getArmoryLocationsList,
  getArmoryLocationById,
  createArmoryLocation,
  updateArmoryLocation,
  deleteArmoryLocation,
} from './armory-locations.mock';

// import axiosInstance, { endpoints } from 'src/lib/api';

// export const getArmoryLocationsList = async ({ page = 1, pageSize = 10, searchTerm = '', sortColumn, sortOrder } = {}) => {
//   try {
//     const params = { page, pageSize, searchTerm, sortColumn, sortOrder };
//     const response = await axiosInstance.get(endpoints.munitionsDepot.list, { params });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching armory locations:', error);
//     throw error;
//   }
// };

// export const getArmoryLocationById = async (id) => {
//   try {
//     const response = await axiosInstance.get(endpoints.munitionsDepot.getById(id));
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching armory location:', error);
//     throw error;
//   }
// };

// export const createArmoryLocation = async (data) => {
//   try {
//     const response = await axiosInstance.post(endpoints.munitionsDepot.create, data);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating armory location:', error);
//     throw error;
//   }
// };

// export const updateArmoryLocation = async ({ id, ...payload }) => {
//   try {
//     const response = await axiosInstance.put(endpoints.munitionsDepot.update(id), payload);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating armory location:', error);
//     throw error;
//   }
// };

// export const deleteArmoryLocation = async (id) => {
//   try {
//     await axiosInstance.delete(endpoints.munitionsDepot.delete(id));
//     return true;
//   } catch (error) {
//     console.error('Error deleting armory location:', error);
//     throw error;
//   }
// };
