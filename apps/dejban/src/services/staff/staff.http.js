import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Staffs Without Pagination (simple list)
export const getStaff = async (params = {}) => {
    try {
        const response = await axiosInstance.get(endpoints.employmentType.list, {
            params,
        });
        return response.data; // { items, totalCount }
    } catch (error) {
        console.error('Error fetching Staffs:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// GET Staffs with pagination
export const getStaffWithPagination = async ({
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

        const response = await axiosInstance.get(endpoints.staff.list, {
            params,
        });

        return response.data; // { items, totalCount }
    } catch (error) {
        console.error('Error fetching Staffs with pagination:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// GET Staff by Id
export const getStaffById = async (id) => {
    try {
        const response = await axiosInstance.get(
            `${endpoints.employmentType.getById}/${id}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching Staff by id:', error);
        throw error;
    }
}; 

// ----------------------------------------------------------------------
// CREATE Staff
export const createStaff = async (data) => {
    try {
        const response = await axiosInstance.post(
            endpoints.staff.create,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error creating Staff:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// Assign Role To User

export const assignRoleToUser = async (data) => {
    try {
        const response = await axiosInstance.post(
            endpoints.staff.assignRoleToUser,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error creating Staff:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// UPDATE Staff
export const updateStaff = async ({ id, ...data }) => {
    try {
        const response = await axiosInstance.put(`${endpoints.staff.update}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating Staff:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// DELETE Staff(We don't have the Api to remove Staff.)
export const deleteStaff = async (id) => {
    try {
        // API expects { ids: [id] }
        await axiosInstance.delete(endpoints.employmentType.delete, {
            data: { employmentTypeIds: [id] },
        });
        return true;
    } catch (error) {
        console.error('Error deleting Staff:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// Get User Role By UserId
export const getUserRoleById = async (params = {}) => {
    try {
        const response = await axiosInstance.get(endpoints.staff.getUserRoleById, {
            params,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Staffs:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// Get User Detail By UserId
export const getUserById = async (id) => {

    if (typeof id !== 'string' || !id) {
        console.warn('Invalid user id, request skipped:', id);
        return null;
    }

    try {
        const response = await axiosInstance.get(`${endpoints.staff.getUserById}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Staffs:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// Update UserName And Password By Admin
export const updateUserNameAndUserPasswordByAdmin = async (data) => {
    try {
        const response = await axiosInstance.patch(endpoints.staff.changeUserPasswordAndUserNameByAdmin, data);
        return response.data;
    } catch (error) {
        console.error('Error updating Staff:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// GET Select Personnels
export const getSelectPersonnels = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.personnel.selectPersonnel, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching select personnels:', error);
    throw error;
  }
};
