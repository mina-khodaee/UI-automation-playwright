import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Positions (simple list)
export const getPositions = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.positions.list, {
      params,
    });
    return response.data; // { items, totalCount }
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Positions with pagination
export const getPositionsWithPagination = async ({
  page,
  pageSize,
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

    const response = await axiosInstance.get(endpoints.positions.list, {
      params,
    });

    return response.data; // { items, totalCount }
  } catch (error) {
    console.error('Error fetching positions with pagination:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Position by Id
export const getPositionById = async (id) => {
  try {
    const response = await axiosInstance.get(`${endpoints.positions.getById}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching position by id:', error);
    throw error;
  }
};

// GET Position Claim
export const getPositionClaim = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.positions.getPositionClaim, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching position by id:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Position
export const createPosition = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.positions.create, data);
    return response.data; // createdKey یا object
  } catch (error) {
    console.error('Error creating position:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Position
export const updatePosition = async (data) => {
  try {
    const response = await axiosInstance.put(endpoints.positions.update, data);
    return response.data;
  } catch (error) {
    console.error('Error updating position:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Position
export const deletePosition = async (id) => {
  try {
    // API expects { ids: [id] }
    await axiosInstance.delete(endpoints.positions.delete, {
      data: { ids: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting position:', error);
    throw error;
  }
};
