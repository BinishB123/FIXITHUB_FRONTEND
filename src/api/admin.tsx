import { apiUrl } from "./common";

const commonSettingApi = apiUrl + "/api/admin/settings";
const settings = {
  getSettingsDatas: commonSettingApi + "/settingsDatas",
  addBrand: commonSettingApi + "/addbrand",
  addvehicleType: commonSettingApi + "/vehicletype",
  addGeneralServiceOrRoadAssistance: commonSettingApi + "/addservices",
  addNewSubType: commonSettingApi + "/addSubtype",
  deleteSubType: commonSettingApi + "/deletesubtype",
  editServiceName:commonSettingApi+'/editservicename'
};

export default settings;
