import { apiUrl } from "./common";

const commonSettingApi = apiUrl + "/api/admin/settings";
const provider = apiUrl + "/api/admin/providers"
const settings = {
  getSettingsDatas: commonSettingApi + "/settingsDatas",
  addBrand: commonSettingApi + "/addbrand",
  addvehicleType: commonSettingApi + "/vehicletype",
  addGeneralServiceOrRoadAssistance: commonSettingApi + "/addservices",
  addNewSubType: commonSettingApi + "/addSubtype",
  deleteSubType: commonSettingApi + "/deletesubtype",
  editServiceName:commonSettingApi+'/editservicename'
};

export const adminProvider = {
   monthlyrevenue:provider+'/monthly-revenue',
  topbookedService:provider+'/top-booked-Service'
}
 
export default settings;
