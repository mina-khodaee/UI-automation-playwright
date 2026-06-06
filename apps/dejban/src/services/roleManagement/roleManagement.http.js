import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Roles
export const getRoles = async ({ page = 1, pageSize = 10, searchTerm = '', sortColumn, sortOrder }) => {
  try {
    const params = {
      page,
      pageSize,
      searchTerm,
      sortColumn,
      sortOrder,
    };
    const response = await axiosInstance.get(endpoints.roleManagement.roleList, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Role
export const createRole = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.roleManagement.createRole, data);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Role
export const updateRole = async (data) => {
  try {
    const response = await axiosInstance.put(endpoints.roleManagement.updateRole, data);
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Role
export const deleteRole = async (ids) => {
  try {
    // API expects { ids: [id] }
    await axiosInstance.delete(endpoints.roleManagement.deleteRole, { data: { ids: [ids] } });
    return true;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

// Get Role By Id
export const getRoleById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${endpoints.roleManagement.getById}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching role by id:', error);
    throw error;
  }
};


export const assignClaimToRole = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.roleManagement.assignClaimToRole, data);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const getRoleClaim = async (params = {}) => {
    try {
        const response = await axiosInstance.get(endpoints.roleManagement.getRoleClaim, {
            params,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching positions:', error);
        throw error;
    }
};

export const getRolesWithoutPagination = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.roleManagement.roleList , {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching units (without pagination):', error);
    throw error;
  }
};
