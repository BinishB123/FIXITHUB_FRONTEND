import { adminProvider } from "../../api/admin"
import { axiosInstance } from "../../api/common"

export const monthlyRevenue = ()=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(adminProvider.monthlyrevenue).then((response)=>{
      resolve(response)
    }).catch((error)=>{
      reject(error)
    })
  })
}

export const bookedService = ()=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(adminProvider.topbookedService).then((response)=>{
      resolve(response)
    }).catch((error)=>{
      reject(error)
    })
  })
}