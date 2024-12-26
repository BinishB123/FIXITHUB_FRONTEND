
import {  axiosInstance } from "../../api/common"
import { userProfile } from "../../api/user"



export const getChatId = (providerId:string,userId:string)=>{
  return new Promise((resolve,reject)=>{
       axiosInstance.get(userProfile.getChatId+`/${providerId}/${userId}`).then((response)=>{
        resolve(response)
       }).catch((error)=>{
        reject(error)
       })
  })
}

export const getChatOfOneToOne = (chatId:string)=>{
      return new Promise((resolve,reject)=>{
        axiosInstance.post(userProfile.getChatOfOneToOne+`/${chatId}/user`).then((response)=>{
            resolve(response)
            console.log(response);
            
          }).catch((error)=>{
            reject(error)
          })
      })
}


export const getchats  = (whom:string,id:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(userProfile.fetchChat+`/${whom}/${id}`).then((response:any)=>{
      resolve(response)
    }).catch((error)=>{
      console.log(error);
      
      reject(error)
    })
  })
}

export const addNewMessage = (sender:string,chatId:string,message:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.post(userProfile.addMessage,{sender,chatId,message}).then((response)=>{
      resolve(response)
    }).catch((error)=>{
      reject(error)
    })
  })
}


export const NotificationUpdater = (id:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(userProfile.notification+`/${id}`).then((response)=>{
      resolve(response)
    }).catch((error)=>{
      reject(error)
    })
  })
}


export const notificationGetter = (id:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(userProfile.notificationGetter+`/${id}`).then((Response)=>{
      resolve(Response)
    }).catch((error)=>{
      reject(error)
    })
  })
}