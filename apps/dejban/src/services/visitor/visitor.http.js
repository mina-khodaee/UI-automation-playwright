import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visitors List
export const getVisitors = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
} = {}) => {
  try {
    const params = { page, pageSize, searchTerm, sortColumn, sortOrder };
    const response = await axiosInstance.get(endpoints.visitor.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visitors:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Visitor By ID
export const getVisitorById = async (visitorId) => {
  try {
    const response = await axiosInstance.get(endpoints.visitor.getById(visitorId));
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Visitor
export const createVisitor = async (data, ...payload) => {
  try {
    const response = await axiosInstance.post(endpoints.visitor.create, data, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating visitor:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Visitor
export const updateVisitor = async ({ id, ...payload }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.visitor.update}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating visitor:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Visitors
export const deleteVisitors = async (id) => {
  try {
    // API expects { visitorIds: [id] }
    await axiosInstance.delete(endpoints.visitor.delete, { data: { visitorIds: [id] } });
    return true;
  } catch (error) {
    console.error('Error deleting visitors:', error);
    throw error;
  }
};
