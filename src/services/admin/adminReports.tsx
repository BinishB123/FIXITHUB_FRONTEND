import { adminReport } from "../../api/admin"
import { axiosInstance } from "../../api/common"


export const getReport = ()=>{
    return new Promise((resolve,reject)=>{
        axiosInstance.get(adminReport.report).then((response)=>{
            resolve(response.data)
        }).catch((error)=>{
            reject(error)
        })
    })
}


export const getReportDeatils = (id:string)=>{
    return new Promise((resolve,reject)=>{
        axiosInstance.get(adminReport.reportdetails+`/${id}`).then((response)=>{
            resolve(response.data)
        }).catch((error)=>{
            reject(error)
        })
    })
}


export const editReport = (id:string,status:string)=>{
    return new Promise((resolve,reject)=>{
        axiosInstance.patch(adminReport.editReport+`/${id}/${status}`).then((response)=>{
            resolve(response)
        }).catch((error)=>{
            reject(error)
        })
    })
}