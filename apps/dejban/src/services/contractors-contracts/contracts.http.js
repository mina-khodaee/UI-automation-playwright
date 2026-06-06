import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Contracts with pagination
export const getContracts = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
  personnelId,
  ...filters
} = {}) => {
  try {
    const params = {
      page,
      pageSize,
      searchTerm,
      sortColumn,
      sortOrder,
      personnelId,
      ...filters,
    };

    const response = await axiosInstance.get(endpoints.contract.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Contract
export const createContract = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.contract.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating contract:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Contract
export const updateContract = async ({ id, ...data }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.contract.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating contract:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Contracts (multiple)
export const deleteContracts = async (contractIds) => {
  try {
    // اگر آرایه نیست، تبدیل به آرایه کن
    const ids = Array.isArray(contractIds) ? contractIds : [contractIds];
    
    const response = await axiosInstance.delete(endpoints.contract.delete, {
      data: { contractIds: ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting contracts:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Contracts without pagination
export const getContractsWithoutPagination = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.contract.list, {
      params: {
        ...params,
        pageSize: 1000,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching contracts (without pagination):', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Contract by ID
export const getContractById = async (id) => {
  try {
    const response = await axiosInstance.get(`${endpoints.contract.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contract by ID:', error);
    throw error;
  }
};