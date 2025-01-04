import { axiosInstance } from "../../api/common";
import { apiUrl } from "../../api/common";
import { Iusersignup, mainResponse, SignInData, userResponse } from "../../interfaces/userInterface";


export const updateOrAddImageService = async (
    image:File,
    id:string,
    url?: string

) => {
    try {
        const formData = new FormData();
        
        formData.append("files", image);
        formData.append("id", id); 
        if(url){
            formData.append("url",url)
        }
       
        const response = await axiosInstance.patch(
            `${apiUrl}/api/user/profile/updateImage`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            }
        );

        console.log(response);
        
        return response.data;
    } catch (error) {
        console.error('Error updating or adding image:', error);
        throw error;
    }
};


export const updateUserData = async (
    id: string,
    newData: string,
    whichIstoChange: string
  ): Promise<{ success: boolean; newData: string;changed?:string;message: string }> => { 
    try {
      const response = await axiosInstance.patch(
        `${apiUrl}/api/user/profile/updateData/${id}`,
        { newData, whichIstoChange }
      );
  
      return {
        success: true,
        newData: response.data.newData || "", 
        changed:whichIstoChange,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        newData: "", 
        message: error.response?.data?.message || 'An error occurred',
      };
    }
  };
  
  
export const signupAndverify = async (userData: Iusersignup, finalotp: string): Promise<mainResponse> => {
    try {
        const response = await axiosInstance.post(apiUrl + '/api/user/auth/verify&signup', { userData, finalotp })
        localStorage.setItem("user", JSON.stringify(response.data.user))
        return response.data
    } catch (error: any) {
        return { success: false, message: error.response.data.message }

    }
}


export const logout = async (): Promise<mainResponse> => {
    try {
        const response = await axiosInstance.delete(apiUrl + '/api/user/auth/logout')
        if (response.data.success) {
            localStorage.removeItem("user")
        }
        return response.data

    } catch (error: any) {
        return { success: false, message: "something went wrong" }
    }
}

export const signin = async (SignInData: SignInData): Promise<userResponse> => {
    try {
        const response = await axiosInstance.post(apiUrl + '/api/user/auth/login', { SignInData })


        if (response.data.success) {
            localStorage.setItem("user", JSON.stringify(response.data.user))
        }


        return response.data
    } catch (error: any) {

        if (error.response && error.response.data) {

            return {
                success: false,
                message: error.response.data.message || "An error occurred during login"
            };
        } else {
            // Fallback error message if no response was received or other issues
            return {
                success: false,
                message: "Something went wrong. Please try again."
            };
        }
    }
}