import { axiosInstance } from "../../api/common";
import { bookings, serviceBookings } from "../../api/provider";


interface AddDateResponse {
  success: true;
  id: string;
}
export const addDate = (date: Date, id: string): Promise<AddDateResponse | null> => {
  return new Promise((resolve, reject) => {
    axiosInstance.post(bookings.addDate, { date: date, id: id }).then((response) => {
      resolve(response.data)

    }).catch(() => {
      reject(null)
    })
  })
}

export const getAddedDates = (id: string) => {
  return new Promise((resolve, reject) => {
    axiosInstance.get(`${bookings.getaddeddates}/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export const updateCount = (id: string, todo: string) => {
  return new Promise((resolve, reject) => {
    axiosInstance.patch(`${bookings.updateBookingCount}/${id}/${todo}`).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}


export const getBookingAccordingToDate = (providerId: string, date: Date) => {
  return new Promise((resolve, reject) => {
    axiosInstance.get(serviceBookings.getBookingsAccordingToDate + `/${providerId}/${date}`).then((response) => {
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const getBookingStillTodaysDate = (providerId: string, status?: string|undefined) => {
  return new Promise((resolve, reject) => {
    axiosInstance.get(status ? serviceBookings.getBookingStillTodaysDate + `/${providerId}?status=${status}` : serviceBookings.getBookingStillTodaysDate + `/${providerId}`).then((response) => {
      resolve(response)
    }).catch((error) => {
      
     reject(error)

    })
  })
}


export const latestBooking = (providerId:string)=>{
  return new Promise((resolve,reject)=>{
    axiosInstance.get(serviceBookings.viewBookings+`/${providerId}`).then((response)=>{
      resolve(response)
      console.log(response);
      
    }).catch((error)=>{
      reject(error)
    })
  })
}

export const updateServiceBookingStatus = (id:string,status:string,amount:number)=>{
        return new Promise((resolve,reject)=>{
          axiosInstance.patch(serviceBookings.updateServiceStatus+`/${id}/${status}/${amount}`).then((response)=>{
            resolve(response)
          }).catch((error)=>{
            reject(error)
          })
        })
}