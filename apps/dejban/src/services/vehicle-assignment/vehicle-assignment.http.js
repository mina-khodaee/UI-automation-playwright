import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Active Vehicle Assignments by Vehicle ID
export const getActiveVehicleAssignmentsByVehicleId = async (vehicleId) => {
    if (!vehicleId || typeof vehicleId !== "string") {
        throw new Error("Invalid vehicleId");
    }

    try {
        const response = await axiosInstance.get(
            `${endpoints.vehicleAssignment.activeAssignmentByVehicleId}/${vehicleId}`
        );
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching active vehicle assignments by vehicle ID:",
            error
        );
        throw error;
    }
};

// ----------------------------------------------------------------------
// CREATE Vehicle Assignment
export const createVehicleAssignment = async (data) => {
    try {
        const response = await axiosInstance.post(endpoints.vehicleAssignment.create, data);
        return response.data;
    } catch (error) {
        console.error('Error creating vehicle assignment:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// UPDATE Vehicle Assignment
export const updateVehicleAssignment = async (data ) => {
    try {
        const response = await axiosInstance.put(`${endpoints.vehicleAssignment.update}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating vehicle assignment:', error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// DELETE Vehicle Assignment
export const deleteVehicleAssignment = async (id) => {
    try {
        // await axiosInstance.delete(endpoints.vehicleAssignment.delete, {
        //     data: { id: [id] },
        // });
        await axiosInstance.delete(`${endpoints.vehicleAssignment.delete}/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting vehicle assignment:', error);
        throw error;
    }
};

export const endVehicleAssignment = async (data) => {
    try {
        const response = await axiosInstance.post(
            `${endpoints.vehicleAssignment.end}`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error ending vehicle assignment:', error);
        throw error;
    }
};
