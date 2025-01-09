import { axiosInstance } from "../../api/common";
import { userProfile } from "../../api/user";
import { reportData } from "../../interfaces/userInterface";

export const getChatId = (providerId: string, userId: string) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(userProfile.getChatId + `/${providerId}/${userId}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getChatOfOneToOne = (chatId: string) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(userProfile.getChatOfOneToOne + `/${chatId}/user`)
      .then((response) => {
        resolve(response);
        console.log(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getchats = (whom: string, id: string) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(userProfile.fetchChat + `/${whom}/${id}`)
      .then((response: any) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const addNewMessage = (
  sender: string,
  chatId: string,
  message: string
) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(userProfile.addMessage, { sender, chatId, message })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const NotificationUpdater = (id: string) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(userProfile.notification + `/${id}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const notificationGetter = (id: string) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(userProfile.notificationGetter + `/${id}`)
      .then((Response) => {
        resolve(Response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createReport = (data: reportData) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(userProfile.createReport, { data })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getreport = (id: string) => {
  return new Promise(function (resolve, reject) {
    axiosInstance
      .get(userProfile.getreport + `/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
