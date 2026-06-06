import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Sites (simple list - no pagination)
export const getSites = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.site.list, {
      params,
    });

    return response.data; // array OR { items, totalCount }
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Sites with pagination
export const getSitesWithPagination = async ({
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

    const response = await axiosInstance.get(endpoints.site.list, {
      params,
    });

    return response.data; // { items, totalCount }
  } catch (error) {
    console.error('Error fetching sites with pagination:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Site
export const createSite = async (data) => {
  try {
    const response = await axiosInstance.post(
      endpoints.site.create,
      data
    );

    return response.data; // createdKey یا object
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Site
export const updateSite = async ({ id, ...data }) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.site.update}/${id}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error('Error updating site:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Site
export const deleteSite = async (id) => {
  try {
    await axiosInstance.delete(endpoints.site.delete, {
      data: { ids: [id] },
    });

    return true;
  } catch (error) {
    console.error('Error deleting site:', error);
    throw error;
  }
};
