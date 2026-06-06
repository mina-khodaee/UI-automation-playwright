import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Ocuupation Type Without Pagination (simple list)
export const getOccupationType = async (params = {}) => {
    try {
        const response = await axiosInstance.get(endpoints.occupationType.list, {
            params,
        });
        return response.data; // { items, totalCount }
    } catch (error) {
        console.error('Error fetching Ocuupation Type:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// GET Ocuupation Type with pagination
export const getOccupationTypeWithPagination = async ({
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

        const response = await axiosInstance.get(endpoints.occupationType.list, {
            params,
        });

        return response.data; // { items, totalCount }
    } catch (error) {
        console.error('Error fetching Ocuupation Type with pagination:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// GET Ocuupation Type by Id
export const getOccupationTypeById = async (id) => {
    try {
        const response = await axiosInstance.get(
            `${endpoints.occupationType.getById}/${id}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching Ocuupation Type by id:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// CREATE Ocuupation Type
export const createOccupationType = async (data) => {
    try {
        const response = await axiosInstance.post(
            endpoints.occupationType.create,
            data
        );
        return response.data; // createdKey یا object
    } catch (error) {
        console.error('Error creating Ocuupation Type:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// UPDATE Ocuupation Type
export const updateOccupationType = async ({ id, ...data }) => {
    try {
        const response = await axiosInstance.put(`${endpoints.occupationType.update}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating Ocuupation Type:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// DELETE Ocuupation Type
export const deleteOccupationType = async (id) => {
    try {
        // API expects { ids: [id] }
        await axiosInstance.delete(endpoints.occupationType.delete, {
            data: { employmentStatusIds: [id] },
        });
        return true;
    } catch (error) {
        console.error('Error deleting Ocuupation Type:', error);
        throw error;
    }
};
