import { getChatId } from "../services/user/userProfile";
import { apiUrl } from "./common";

const serviceApi = apiUrl + "/api/user/service";
const apiToProfile = apiUrl + "/api/user/profile";

export const services = {
  getallServiceAccordingToCategory: serviceApi + "/getservices",
  getallbrands: serviceApi + "/getallbrands",
  getShops: serviceApi + "/getshops",
  getshopdetail: serviceApi + "/getshopdetail",
  getBookingDates: serviceApi + "/getbookingdates",
  checkout_Session: serviceApi + "/checkout-session",
  latestservice: serviceApi + "/latestBooking",
  servicHistory: serviceApi + "/servicehistory",
  makefullpayement: serviceApi + "/makefullpayment",
  cancelBooking: serviceApi + "/cancelpayment",
};

export const userAuth = {
  checker: apiUrl + `/api/user/auth/checker`,
};

export const userProfile = {
  getChatId:apiToProfile+'/getChatId',
  getChatOfOneToOne: apiToProfile + "/getchatofOneToOne",
  fetchChat: apiToProfile + "/getchat",
  addMessage: apiToProfile + "/newmessage",
};
