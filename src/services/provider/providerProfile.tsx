
import {  axiosInstance } from "../../api/common"
import { providerProfile } from "../../api/provider"


export const getChatId = (providerId:string,userId:string)=>{
      return new Promise((resolve,reject)=>{
        axiosInstance.get(providerProfile.getChatId+`/${providerId}/${userId}`).then((response)=>{
            resolve(response)
          }).catch((error)=>{
            reject(error)
          })
      })
}




export const getOneToOneChat = (chatId:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(providerProfile.getOnetoOneChat+`/${chatId}`).then((response:any)=>{
      resolve(response)
    }).catch((error)=>{
      console.log(error);
      
      reject(error)
    })
  })
}

export const addNewMessage = (sender:string,chatId:string,message:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.post(providerProfile.addMessage,{sender,chatId,message}).then((response)=>{
      resolve(response)
    }).catch((error)=>{
      reject(error)
    })
  })
}


export const notificationCounter = (id:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(providerProfile.notificationCounterUpdater+`/${id}`).then((response)=>{
      resolve(response)
    }).catch((error)=>{
      reject(error)
    })
  })
}

export const notificationGetter = (id:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(providerProfile.notificationGetter+`/${id}`).then((response)=>{
      resolve(response)
    }).catch((error)=>{
      reject(error)
    })
  })
}

export const monthlyRevenue = (id:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(providerProfile.monthlyrevenue+`/${id}`).then((response)=>{
      resolve(response)
    }).catch((error)=>{
      reject(error)
    })
  })
}

export const bookedService = (id:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(providerProfile.topbookedService+`/${id}`).then((response)=>{
      resolve(response)
    }).catch((error)=>{
      reject(error)
    })
  })
}