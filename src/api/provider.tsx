import { apiUrl } from "./common";

const apiToProfile = apiUrl + "/api/provider/profile";

export const providerProfile = {
  getproviderProfileData: apiToProfile + "/getproviderProfileData",
  editabout: apiToProfile + "/editabout",
  addLogo: apiToProfile + "/addlogo",
  updateData: apiToProfile + "/updataprofileData",
  changePassword: apiToProfile + "/changepassword",
  getallBrand: apiToProfile + "/getallBrands",
  changelogo: apiToProfile + "/changelogo",
  getChatId: apiToProfile + "/getchatid",
  getOnetoOneChat:apiToProfile+'/getonetonechat',
  addMessage:apiToProfile+"/newmessage"
};

const apiToBookingDate = apiUrl + "/api/provider/bookings";
export const bookings = {
  addDate: apiToBookingDate + "/adddate",
  getaddeddates: apiToBookingDate + "/getaddeddates",
  updateBookingCount: apiToBookingDate + "/updateCount",
  getBookingsAccordingToDate: apiToBookingDate,
};

const apiToServiceBookings = apiUrl + "/api/provider/servicebooking";
export const serviceBookings = {
  getBookingsAccordingToDate: apiToServiceBookings + "/getservicebooking",
  getBookingStillTodaysDate:apiToServiceBookings + "/getBookingStillTodaysDate",
  updateServiceStatus: apiToServiceBookings + "/updatestatus",
  viewBookings: apiToServiceBookings + "/viewbookings",
};
