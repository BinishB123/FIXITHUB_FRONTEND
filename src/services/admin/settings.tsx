import { axiosInstance } from "../../api/common";
import settings from "../../api/admin";

// Add Brand API
export const addBrandApi = async (brand: string) => {
    try {
        const response = await axiosInstance.post(settings.addBrand, { brand });
        return response.data;
    } catch (error: any) {
        const statusCode = error.response?.status;
        return { error, statusCode };
    }
};

// Add Vehicle Type API
export const addVehicleTypeApi = async (vehicletype: number) => {
    try {
        const response = await axiosInstance.post(settings.addvehicleType, { type: vehicletype });
        return response.data;
    } catch (error: any) {
        const statusCode = error.response?.status;
        return { error, statusCode };
    }
};

// Add Services API
export const addServicesApi = async (formData: any) => {
    try {
        const response = await axiosInstance.post(settings.addGeneralServiceOrRoadAssistance, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data;
    } catch (error: any) {
        const statusCode = error.response?.status;
        return { error, statusCode };
    }
};

// Add New SubType API
export const addNewSubTypeApi = async (id: string, newSubtype: string) => {
    try {
        const response = await axiosInstance.patch(settings.addNewSubType, {
            id,
            type: newSubtype,
        });
        
        return response.data;
    } catch (error: any) {
        const statusCode = error.response?.status;
        return { error, statusCode };
    }
};

// Delete SubType API
export const deleteSubTypeApi = async (id: string, typeToDelete: string) => {
    try {
        const response = await axiosInstance.delete(settings.deleteSubType, {
            data: { id, type: typeToDelete },
        });
        return response.data;
    } catch (error: any) {
        const statusCode = error.response?.status;
        return { error, statusCode };
    }
};
