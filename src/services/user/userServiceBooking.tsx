import { toast } from "sonner"
import { axiosInstance } from "../../api/common"
import { services } from "../../api/user"
import axios from "axios"
import { IRequiredDataDForBooking } from "../../interfaces/userInterface"

export const getbookingdates = (id: string) => {
    return new Promise((resolve, reject) => {
        axiosInstance.get(services.getBookingDates + `/${id}`, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        }).then((Response) => {


            resolve(Response.data)
        })
    })
}

export const stripePayment = async (dateid: string, dataRequiredBooking: IRequiredDataDForBooking, initailAmountToPay: number): Promise<{ success: boolean, sessionId: string; url: string, statusCode?: number }> => {
    try {
        if (!dataRequiredBooking.providerId) {
            return { success: false, sessionId: "", url: "" }
        }
        const response = await axiosInstance.post(services.checkout_Session, {
            idOfdDate: dateid,
            dataRequiredBooking: dataRequiredBooking,
            initailAmountToPay: initailAmountToPay
        });

        return { ...response.data, success: true };
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status;
            if (statusCode === 409) {
                return { success: false, sessionId: "", url: "", statusCode: 409 };
            }
        }

        toast.error("Something went wrong");
        return { success: false, sessionId: "", url: "" };
    }
};


export const getlatestBooking = (userid: string) => {
    return new Promise((resolve, reject) => {
        axiosInstance.get(services.latestservice + `/${userid}`).then((response) => {
            console.log(response);
            resolve(response)
        }).catch((error) => {
            reject(error)
            console.log(error);

        })
    })
}


export const getServiceHistory = (userId: string, startIndex: number, endIndex: number) => {
    return new Promise((resolve, reject) => {
        axiosInstance.get(services.servicHistory + `/${userId}/${startIndex}/${endIndex}`).then((response) => {
            resolve(response)
        }).catch((error) => {
            reject(error)
        })
    })
}

export const confirmPayment = (docId: string, selectedServices: any) => {
    return new Promise((resolve, reject) => {
        axiosInstance.post(services.makefullpayement, { selectedServices, docId }).then((response) => {
            resolve(response)
        }).catch((error) => {
            reject(error)
        })
    })
}

export const cancelBooking = (id: string, amountToRefund: number, date: string) => {
    return new Promise((resolve, reject) => {
        axiosInstance.patch(services.cancelBooking, { id, amountToRefund, date }).then((Response) => {
            resolve(Response)
        }).catch((error) => {
            reject(error)
        })
    })
}


export const addReviewApi = (Files: FormData) => {

    return new Promise((resolve, reject) => {
        axiosInstance.post(services.addReview, Files, {
            headers: {
                "Content-Type": "multipart/form-data", // Important for FormData
            }
        }).then((response) => {
            resolve(response)
        }).catch((error) => {
            reject(error)
        })
    })
}


export const getreviewdetails = (id: string) => {
    return new Promise((resolve, reject) => {
        axiosInstance.get(services.getreviewdetails + `/${id}`).then((response) => {
            resolve(response)
        }).catch((error) => {
            reject(error)
        })
    })
}


export const deleteImageservice = (id:string,url:string)=>{
    return new Promise((resolve,reject)=>{
        axiosInstance.patch(services.deleteanimage,{id,url}).then((response)=>{
            resolve(response)
        }).catch((error)=>{
            reject(error)
        })
    })
}

export const editReviewService = (id:string,newReview:string)=>{
    return new Promise((resolve,reject)=>{
        axiosInstance.patch(services.editreview,{id,newReview}).then((response)=>{
            resolve(response)
        }).catch((error)=>{
            reject(error)
        })
    })

}

export const getFeedBacks = (id:string,limit:number)=>{
    console.log(id);
    
    return new Promise((resolve,reject)=>{
        axiosInstance.get(services.getfeedbacks+`/${id}/${limit}`,).then((response)=>{
            resolve(response)
        }).catch((error)=>{
            reject(error)
        })
    })

}



