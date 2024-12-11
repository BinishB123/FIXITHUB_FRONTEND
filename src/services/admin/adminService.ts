import { apiUrl, axiosInstance } from "../../api/common";
import { Response, SignData } from "../../interfaces/admin";



export const adminSignIn = async (registerData: SignData): Promise<Response> => {
    try {
        
        const response = await axiosInstance.post(apiUrl + '/api/admin/auth/signin', registerData);
         if (response.data.success) {
            localStorage.setItem("isAdmin", JSON.stringify({ isAdmin: true }));
        }  
        return { success: response.data.success };
    } catch (error: any) {

        const status = error.response?.status;
        console.log(status);
        
        

        if (status === 401) {
            return { success: false, message: 'Unauthorized. Incorrect email or password.' };
        } else {

            return { success: false, message: 'An error occurred during sign-in.' };
        }
    }
};

export const adminLogOut = async():Promise<Response>=>{
    try {
        const response  = await axiosInstance.get(apiUrl+'/api/admin/auth/logout')
        
        return {success:response.data.success,message:"logout success"}
    } catch (error) {
        return {success:false,message:"An error occured"}
    }
}
