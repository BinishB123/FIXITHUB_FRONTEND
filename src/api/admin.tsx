import { apiUrl } from "./common";

const commonSettingApi = apiUrl + "/api/admin/settings";
const reportApi = apiUrl + "/api/admin/report";
const provider = apiUrl + "/api/admin/providers";
const settings = {
  getSettingsDatas: commonSettingApi + "/settingsDatas",
  addBrand: commonSettingApi + "/addbrand",
  addvehicleType: commonSettingApi + "/vehicletype",
  addGeneralServiceOrRoadAssistance: commonSettingApi + "/addservices",
  addNewSubType: commonSettingApi + "/addSubtype",
  deleteSubType: commonSettingApi + "/deletesubtype",
  editServiceName: commonSettingApi + "/editservicename",
};

export const adminReport = {
  report: reportApi + "/getreport",
  editReport: reportApi + "/ediReport",
  reportdetails: reportApi + "/reportdetails",
  getSalesReport : reportApi+'/get-salesReport'
};

export const adminProvider = {
  monthlyrevenue: provider + "/monthly-revenue",
  topbookedService: provider + "/top-booked-Service",
};

export default settings;
