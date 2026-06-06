import { apiClient, fetcher, createItem, updateItem, deleteItem, getWithParams } from '@repo/api-client';

export { apiClient, fetcher, createItem, updateItem, deleteItem, getWithParams };

export const setItem = async (url, data) => {
  const response = await apiClient.post(url, data);
  return response.data;
};

export const endpoints = {
  auth: {
    getMe: '/auth/getme',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    getMySessions: '/auth/getmysessions',
    changePassword: '/auth/changepassword',
    terminateSession: '/auth/terminatesession',
    TerminateOtherSessions: '/auth/terminateothersessions',
    terminateOtherSession: '/auth/terminateothersessions',
  },
  uiComponents: {
    list: '/uicomponents/getuicomponents',
  },
  devices: {
    list: '/devices/getdevices',
    detail: '/devices/getdevicebyid',
    delete: '/devices/deletedevices',
    create: '/devices/createdevice',
    update: '/devices/updatedevice',
    authModes: '/devices/getdevicetypeauthenticationmodes',
    firmwareVersion: '/devices/getterminalfirmwareversion',
    getTrafficModes: '/devices/gettrafficmodes',
    settings: {
      networkTypes: '/devices/GetNetworkTypes',
      saveNetworkOptions: '/devices/savedevicenetworkoptions',
      saveInterfaceOptions: '/devices/savedeviceinterfaceoptions',
      saveSecurityOptions: '/devices/savedevicesecurityoptions',
      setNetworkOptions: '/devices/setdevicenetworkoptions',
      setInterfaceOptions: '/devices/setdeviceinterfaceoptions',
      setSecurityOptions: '/devices/setdevicesecurityoptions',
      virdiAccessLevels: '/devices/getvirdiaccesslevels',
      virdiApplicationModes: '/devices/getvirdiapplicationmodes',
      virdiAntipassbackValues: '/devices/getvirdiantipassbackvalues',
      virdiInputIDTypes: '/devices/getvirdiinputidtypes',
      virdiTerminalSecurityLevels: '/devices/getvirditerminalsecuritylevels'
    },
    commands: {
      getVirdiTerminalDoorStatus: '/devices/getvirditerminaldoorstatus',
      setDeviceDoorStatus: '/devices/setdevicedoorstatus',
      setMaintenanceMode: '/devices/setmaintenancemode',
      syncDevicesWithAccessGroup: '/devices/syncdevicesuserswithaccessgroup',
      changeDeviceGroup: '/devices/changedevicegroup',
      setRegionDoorStatus: '/devices/setdevicesdoorstatusbyregionid',
      getBiometricData: '/devices/getbiometricdatafromdevice',
      setBiometricDataToDevice: '/devices/sendbiometricdatatodevice'
    }
  },
  regions: {
    list: '/regions/getregions',
    delete: '/regions/deleteregions',
    create: '/regions/createregion',
    update: '/regions/updateregion',
    detail: '/regions/getregionbyid'
  },
  deviceTypes: {
    list: '/devices/getdevicetypes',
    create: '/devices/createdevicetype',
    delete: '/devices/deletedevicetypes',
    update: '/devices/updatedevicetype',
    detail: '/devices/getdevicetypebyid',
    brands: '/devices/getbrands',
    models: '/devices/getmodels',
  },
  accessLogs:
  {
    list: '/accesslogs/getaccesslogs'
  },
  calendars: {
    list: '/aclcalendars/getaclcalendars',
    create: '/aclcalendars/createaclcalendar',
    delete: '/aclcalendars/deleteaclcalendars',
    update: '/aclcalendars/updateaclcalendar',
    detail: '/aclcalendars/getaclcalendarbyid'
  },
  accessGroups: {
    list: '/accessgroups/getaccessgroups',
    create: '/accessgroups/createaccessgroup',
    delete: '/accessgroups/deleteaccessgroups',
    update: '/accessgroups/updateaccessgroup',
    detail: '/accessgroups/getaccessgroupbyid',
    setBiometricData: '/accessgroups/setbiometricdatatodevices',
  },
  aclUserManagement: {
    list: '/aclusersmanagement/getaclusers',
    create: '/aclusersmanagement/createacluser',
    delete: '/aclusersmanagement/deleteaclusers',
    update: '/aclusersmanagement/updateacluser',
    detail: '/aclusersmanagement/getacluserbyid',
    getAuthModes: '/aclusersmanagement/getauthmodes',
    getAuthTypes: '/aclusersmanagement/getauthtypes',
    getUserTypes: '/aclusersmanagement/getusertypes',
    getAccessTypes: '/aclusersmanagement/getaccesstypes',
    quickCreate: '/aclusersmanagement/createaclusershortcut',
    updateAuthTypeConfig: '/aclusersmanagement/changeauthtypeconfig',
    updateAccessGroupIds: '/aclusersmanagement/changeaccessgroup',
    updateAccessAuthorities: '/aclusersmanagement/changeaccessauthorities',
    getCardTypes: '/aclusersmanagement/getcardtypes',
    SetUserBiometricDataToDevices: '/aclusersmanagement/sendbiometricdatatodevicesbyuserid',
    getBiometricData: '/aclusersmanagement/getbiometricdatafromdeviceforselectedusers'
  },
  accountManagement: {
    list: '/accountmanagement/getusers',
  },
  apiKeyManagement: {
    list: '/apikeymanagement/getapikeys',
    create: '/apikeymanagement/createapikey',
    delete: '/apikeymanagement/deleteapikeys',
    update: '/apikeymanagement/updateapikey',
    detail: '/apikeymanagement/getapikeybyid',
    myList: '/apikeymanagement/getmyapikeys',
    myDelete: '/apikeymanagement/deletemyapikeys',
    myUpdate: '/apikeymanagement/updatemyapikey',
    myDetail: '/apikeymanagement/getmyapikeybyid',
    getScopes: '/apikeymanagement/getscopes'
  }
};

export default apiClient;
