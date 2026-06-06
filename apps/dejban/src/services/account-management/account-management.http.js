import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET User Claims
export const getUserClaims = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.accountManagement.userClaimList, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user claims:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Users List
export const getUsersList = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.accountManagement.usersList, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users list:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Select Users List
export const getSelectUsersList = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.accountManagement.getSelectList, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching select users list:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET User Roles
export const getUserRoles = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.accountManagement.getUserRoles, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET User Activity History
export const getUserActivityHistory = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.accountManagement.getUserActivityHistory, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user activity history:', error);
    throw error;
  }
};

export const createExcludeUserClaims = async (data) => {
  try {
    const response = await axiosInstance.post(
      endpoints.accountManagement.createExcludeUserClaims,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error creating ExcludeUser Claims:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Users With Special Claim (جدید)
export const getUsersWithSpecialClaim = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.accountManagement.getUsersWithSpecialClaim, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users with special claim:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Users With Excluded Claim (جدید)
export const getUsersWithExcludedClaim = async (params) => {
  try {
    const response = await axiosInstance.get(
      endpoints.accountManagement.getUsersWithExcludedClaim,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching users with excluded claim:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET User Excluded Claims (جدید)
export const getUserExcludedClaims = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.accountManagement.getUserExcludedClaims, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user excluded claims:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE User
export const updateUser = async (data) => {
  try {
    const response = await axiosInstance.put(endpoints.accountManagement.updateUser, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE User
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`${endpoints.accountManagement.deleteUsers}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
