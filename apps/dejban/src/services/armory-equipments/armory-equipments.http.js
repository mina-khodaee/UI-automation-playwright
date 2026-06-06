// src/services/armory-equipments/armory-equipments.http.js

// ============================================================
// 🟢 فعلاً از MOCK استفاده می‌کنیم (تا بک‌اند آماده بشه)
// ============================================================

export {
    getEquipmentsList,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
} from './armory-equipments.mock';

// ============================================================
// 🟡 وقتی بک‌اند آماده شد، قسمت بالا رو کامنت کن و پایین رو فعال کن
// ============================================================

// import axiosInstance, { endpoints } from 'src/lib/api';

// export const getEquipmentsList = async ({ page = 1, pageSize = 10, searchTerm = '', sortColumn, sortOrder } = {}) => {
//   try {
//     const params = { page, pageSize, searchTerm, sortColumn, sortOrder };
//     const response = await axiosInstance.get(endpoints.armoryEquipments.list, { params });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching equipments:', error);
//     throw error;
//   }
// };

// export const getEquipmentById = async (id) => {
//   try {
//     const response = await axiosInstance.get(endpoints.armoryEquipments.getById(id));
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching equipment:', error);
//     throw error;
//   }
// };

// export const createEquipment = async (data) => {
//   try {
//     const response = await axiosInstance.post(endpoints.armoryEquipments.create, data);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating equipment:', error);
//     throw error;
//   }
// };

// export const updateEquipment = async ({ id, ...payload }) => {
//   try {
//     const response = await axiosInstance.put(endpoints.armoryEquipments.update(id), payload);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating equipment:', error);
//     throw error;
//   }
// };

// export const deleteEquipment = async (id) => {
//   try {
//     await axiosInstance.delete(endpoints.armoryEquipments.delete(id));
//     return true;
//   } catch (error) {
//     console.error('Error deleting equipment:', error);
//     throw error;
//   }
// };