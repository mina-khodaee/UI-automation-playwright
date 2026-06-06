// src/services/armory-inventory/armory-inventory.http.js


export {
    getInventoryList,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
    disableInventory,
    enableInventory,
    changeStatus,
} from './armory-inventory.mock';

// import axiosInstance, { endpoints } from 'src/lib/api';

// export const getInventoryList = async ({ page = 1, pageSize = 10, searchTerm = '', sortColumn, sortOrder } = {}) => {
//   try {
//     const params = { page, pageSize, searchTerm, sortColumn, sortOrder };
//     const response = await axiosInstance.get(endpoints.armoryInventory.list, { params });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching inventory:', error);
//     throw error;
//   }
// };

// export const getInventoryById = async (id) => {
//   try {
//     const response = await axiosInstance.get(endpoints.armoryInventory.getById(id));
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching inventory item:', error);
//     throw error;
//   }
// };

// export const createInventory = async (data) => {
//   try {
//     const response = await axiosInstance.post(endpoints.armoryInventory.create, data);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating inventory:', error);
//     throw error;
//   }
// };

// export const updateInventory = async ({ id, ...payload }) => {
//   try {
//     const response = await axiosInstance.put(endpoints.armoryInventory.update(id), payload);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating inventory:', error);
//     throw error;
//   }
// };

// export const deleteInventory = async (id) => {
//   try {
//     await axiosInstance.delete(endpoints.armoryInventory.delete(id));
//     return true;
//   } catch (error) {
//     console.error('Error deleting inventory:', error);
//     throw error;
//   }
// };

// export const disableInventory = async (id) => {
//   try {
//     const response = await axiosInstance.patch(endpoints.armoryInventory.disable(id));
//     return response.data;
//   } catch (error) {
//     console.error('Error disabling inventory:', error);
//     throw error;
//   }
// };

// export const enableInventory = async (id) => {
//   try {
//     const response = await axiosInstance.patch(endpoints.armoryInventory.enable(id));
//     return response.data;
//   } catch (error) {
//     console.error('Error enabling inventory:', error);
//     throw error;
//   }
// };

// export const changeStatus = async (id, status) => {
//   try {
//     const response = await axiosInstance.patch(endpoints.armoryInventory.changeStatus(id), { status });
//     return response.data;
//   } catch (error) {
//     console.error('Error changing status:', error);
//     throw error;
//   }
// };