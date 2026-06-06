import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// Get Location As Tree List View

export const getLocationTreeList = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.location.treeList, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Location Tree List View (without pagination):', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Create Country In Tree List View

export const createCountries = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.location.createCountries, data);
    return response.data;
  } catch (error) {
    console.error('Error creating Country:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Create Provience In Tree List View

export const createProvinces = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.location.createProvinces, data);
    return response.data;
  } catch (error) {
    console.error('Error creating Provience:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Create City In Tree List View

export const createCities = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.location.createCities, data);
    return response.data;
  } catch (error) {
    console.error('Error creating City:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Update Country In Tree List View With Id In Url

export const updateCountries = async ({ id, ...data }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.location.updateCountries}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating Country:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Update Provience In Tree List View With Id In Url

export const updateProvinces = async ({ id, ...data }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.location.updateProvinces}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating Provience:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Update City In Tree List View With Id In Url

export const updateCities = async ({ id, ...data }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.location.updateCities}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating City:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Delete Country In Tree List View

export const deleteCountries = async (id) => {
  try {
    await axiosInstance.delete(endpoints.location.deleteCountries, {
      data: { countryIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting Country:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Delete Provience In Tree List View

export const deleteProvinces = async (id) => {
  try {
    await axiosInstance.delete(endpoints.location.deleteProvinces, {
      data: { provinceIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting Provience:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Delete City In Tree List View

export const deleteCities = async (id) => {
  try {
    await axiosInstance.delete(endpoints.location.deleteCities, {
      data: { cityIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting City:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Get Country For SelectBox

export const getCountries = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.location.getCountries, {
      params: {
        page: 1,
        pageSize: 1000,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Country (without pagination):', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Get Provience For SelectBox

export const getProviences = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.location.getProvinces, {
      params: {
        page: 1,
        pageSize: 1000,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Provience (without pagination):', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Get City For SelectBox

export const getCities = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.location.getCities, {
      params: {
        page: 1,
        pageSize: 1000,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching City (without pagination):', error);
    throw error;
  }
};
