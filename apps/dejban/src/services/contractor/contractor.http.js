import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Contractors with pagination
export const getContractors = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
} = {}) => {
  try {
    const params = {
      page,
      pageSize,
      searchTerm,
      sortColumn,
      sortOrder,
    };

    const response = await axiosInstance.get(endpoints.contractor.list, { params });

    return response.data;
  } catch (error) {
    console.error('Error fetching Contractors:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Contractors
export const createContractors = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.contractor.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating Contractors:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Contractors With Id In Url
export const updateContractors = async (data) => {
  try {
    const response = await axiosInstance.put(endpoints.contractor.update, data);
    return response.data;
  } catch (error) {
    console.error('Error updating Contractors:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Contractors
export const deleteContractor = async (id) => {
  try {
    await axiosInstance.delete(endpoints.contractor.delete, {
      data: { ids: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting Contractors:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Contractors without pagination

export const getContractorsWithoutPagination = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.degree.list, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Contractors (without pagination):', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Board
export const createBoard = async (data) => {
    try {
        const response = await axiosInstance.post(endpoints.contractor.createBoard, data);
        return response.data;
    } catch (error) {
        console.error('Error creating Board:', error);
        throw error;
    }
};

export const getContractorById = async (id) => {
    try {
        const response = await axiosInstance.get(
            `${endpoints.contractor.getById}/${id}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching contractor by id:', error);
        throw error;
    }
};

