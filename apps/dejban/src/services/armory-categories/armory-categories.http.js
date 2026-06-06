// src/services/armory-categories/armory-categories.http.js


export {
    getCategoriesList,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from './armory-categories.mock';



// import axiosInstance, { endpoints } from 'src/lib/api';

// export const getCategoriesList = async ({
//   page = 1,
//   pageSize = 10,
//   searchTerm = '',
//   sortColumn,
//   sortOrder,
// } = {}) => {
//   try {
//     const params = { page, pageSize, searchTerm, sortColumn, sortOrder };
//     const response = await axiosInstance.get(endpoints.armoryCategories.list, { params });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     throw error;
//   }
// };

// export const getCategoryById = async (id) => {
//   try {
//     const response = await axiosInstance.get(endpoints.armoryCategories.getById(id));
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching category:', error);
//     throw error;
//   }
// };

// export const createCategory = async (data) => {
//   try {
//     const response = await axiosInstance.post(endpoints.armoryCategories.create, data);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating category:', error);
//     throw error;
//   }
// };

// export const updateCategory = async ({ id, ...payload }) => {
//   try {
//     const response = await axiosInstance.put(endpoints.armoryCategories.update(id), payload);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating category:', error);
//     throw error;
//   }
// };

// export const deleteCategory = async (id) => {
//   try {
//     await axiosInstance.delete(endpoints.armoryCategories.delete(id));
//     return true;
//   } catch (error) {
//     console.error('Error deleting category:', error);
//     throw error;
//   }
// };