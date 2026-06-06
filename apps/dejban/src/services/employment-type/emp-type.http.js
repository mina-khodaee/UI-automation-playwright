import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Employment Type Without Pagination
export const getEmploymentType = async (params = {}) => {
    try {
        const response = await axiosInstance.get(endpoints.employmentType.list, {
            params,
        });
        return response.data; // { items, totalCount }
    } catch (error) {
        console.error('Error fetching Employment Type:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// GET Employment Type with pagination
export const getEmploymentTypeWithPagination = async ({
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

        const response = await axiosInstance.get(endpoints.employmentType.list, {
            params,
        });

        return response.data; // { items, totalCount }
    } catch (error) {
        console.error('Error fetching Employment Type with pagination:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// GET Employment Type by Id
export const getEmploymentTypeById = async (id) => {
    try {
        const response = await axiosInstance.get(
            `${endpoints.employmentType.getById}/${id}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching Employment Type by id:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// CREATE Employment Type
export const createEmploymentType = async (data) => {
    try {
        const response = await axiosInstance.post(
            endpoints.employmentType.create,
            data
        );
        return response.data; // createdKey یا object
    } catch (error) {
        console.error('Error creating Employment Type:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// UPDATE Employment Type
export const updateEmploymentType = async ({ id, ...data }) => {
    try {
        const response = await axiosInstance.put(`${endpoints.employmentType.update}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating Employment Type:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// DELETE Employment Type
export const deleteEmploymentType = async (id) => {
    try {
        // API expects { ids: [id] }
        await axiosInstance.delete(endpoints.employmentType.delete, {
            data: { employmentTypeIds: [id] },
        });
        return true;
    } catch (error) {
        console.error('Error deleting Employment Type:', error);
        throw error;
    }
};
