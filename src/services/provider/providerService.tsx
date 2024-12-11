import { axiosInstance } from "../../api/common";
import { ProviderModel, ProviderRegisterResponse, ProviderSignResponse, signInData ,mainResponse } from "../../interfaces/provider";
import { apiUrl } from "../../api/common";



export const providerRegiterService = async (registerDatas: ProviderModel): Promise<ProviderRegisterResponse> => {
    try {
        const registerData = registerDatas
        const response = await axiosInstance.post(apiUrl + '/api/provider/auth/register', registerData)
        return response.data

    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Provider registration failed try again');
        }

    }
}

export const ProviderSign = async (registerData: signInData): Promise<ProviderSignResponse> => {
    try {

        const response = await axiosInstance.post(apiUrl + '/api/provider/auth/signin', { registerData: registerData })
        localStorage.setItem("provider",JSON.stringify(response.data.provider))
        return response.data

    } catch (error: any) {
        console.log(error.response);
        
        const statusCode = error.response.status
        if (statusCode === 401) {
            return { success: false, message: "The password you entered is incorrect. Please try again." }
        } else if (statusCode === 403) {
            return ({ success: false, message: error.response.data.message })
        } else if (statusCode === 404) {
            return ({ success: false, message: "No provider account found associated with this email." })
        } else if (statusCode === 403) {
            return ({ success: false, message: "Your registration request has been rejected" })
        }
        return ({ success: false, message: "The server is currently unavailable. Please try again later." })

    }
}




export const logout = async (): Promise<mainResponse> => {
    try {
        const response = await axiosInstance.delete(apiUrl + '/api/provider/auth/logout')
        if (response.data.success) {
            localStorage.removeItem("provider")
        }
        return response.data

    } catch (error: any) {
        return { success: false, message: "something went wrong" }
    }
}