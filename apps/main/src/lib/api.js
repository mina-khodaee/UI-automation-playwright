import { createApiClient } from '@repo/api-client';

const api = createApiClient();

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
  },
  uiComponents: {
    list: '/uicomponents/getuicomponents',
  },
  accountManagement: {
    userClaimList: '/accountManagement/GetUserClaims',
    usersList: '/accountManagement/GetUsers',
    getSelectList: '/accountManagement/GetSelectUsers',
    getUserRoles: '/accountManagement/GetUserRoles',
    getUserActivityHistory: '/accountManagement/GetUserActivationHistory',
    getUsersWithSpecialClaim: '/accountManagement/GetUsersWithSpecialClaim',
    getUsersWithExcludedClaim: '/accountManagement/GetUsersWithExcludedClaim',
    getUserExcludedClaims: '/accountManagement/GetUserExcludedClaims',
    createExcludeUserClaims: '/accountManagement/ExcludeUserClaims',
    updateUser: '/accountManagement/UpdateUser',
    deleteUsers: '/accountManagement/DeleteUser',
  },

  roleManagement: {
    roleList: '/rolemanagement/getroles',
    createRole: '/rolemanagement/createrole',
    updateRole: '/rolemanagement/updaterole',
    deleteRole: '/rolemanagement/deleteroles',
    getById: '/RoleManagement/GetRoleById',
    assignClaimToRole: '/RoleManagement/AssignClaimsToRole',
    getRoleClaim: '/RoleManagement/GetRoleClaims',
  },
  site: {
    list: '/sites/getsites',
    listt: '/Sites/GetSelectSites',
    create: '/sites/createsite',
    update: '/sites/updatesite',
    delete: '/sites/deletesites',
  },
  positions: {
    list: '/Positions/GetPositions',
    getPositionClaim: '/Positions/GetPositionClaims',
    create: '/Positions/CreatePosition',
    update: '/Positions/UpdatePosition',
    delete: '/Positions/DeletePositions',
    getById: '/Positions/GetPositionById',
  },

  employmentType: {
    list: '/Personnels/GetEmploymentTypes',
    create: '/Personnels/CreateEmploymentType',
    update: '/Personnels/UpdateEmploymentType',
    delete: '/Personnels/DeleteEmploymentTypes',
    getById: '/Positions/GetPositionById',
  },
  staff: {
    list: '/Personnels/GetPersonnels',
    create: '/Personnels/Create',
    update: '/Personnels',
    delete: '/Personnels/DeleteEmploymentTypes',
    getById: '/Positions/GetPositionById',
    assignRoleToUser: '/AccountManagement/AssignRolesToUser',
    getUserRoleById: '/AccountManagement/GetUserRoles',
    getUserById: '/AccountManagement/GetUserById',
    changeUserPasswordAndUserNameByAdmin: '/AccountManagement/ChangeUserNamePassword',
  },
  occupationType: {
    list: '/Personnels/GetEmploymentStatuses',
    create: '/Personnels/CreateEmploymentStatus',
    update: '/Personnels/UpdateEmploymentStatus',
    delete: '/Personnels/DeleteEmploymentStatuses',
    getById: '/Positions/GetPositionById',
  },
  major: {
    list: '/Majors/GetMajors',
    create: '/Majors/Create',
    update: '/Majors',
    delete: '/Majors/DeleteMajors',
  },
  degree: {
    list: '/Degrees/GetDegrees',
    create: '/Degrees/Create',
    update: '/Degrees',
    delete: '/Degrees/DeleteDegrees',
  },
  doors: {
    list: '/Personnels/GetDoors',
    getById: '/Personnels/GetDoor',
    create: '/Personnels/CreateDoor',
    update: '/Personnels/UpdateDoor',
    delete: '/Personnels/DeleteDoors',
  },
  location: {
    treeList: '/Countries/GetLocationTree',
    createProvinces: '/Provinces/Create',
    createCountries: '/Countries/Create',
    createCities: '/Cities/Create',
    updateProvinces: '/Provinces',
    updateCountries: '/Countries',
    updateCities: '/Cities',
    deleteProvinces: '/Provinces/DeleteProvinces',
    deleteCountries: '/Countries/DeleteCountries',
    deleteCities: '/Cities/DeleteCities',
    getCountries: '/Countries/GetCountries',
    getProvinces: '/Provinces/GetProvinces',
    getCities: '/Cities/GetCities',
  },

  claimManagement: {
    // GET
    getClaimType: '/ClaimManagement/GetApplicationClaimTypes',
    getClaim: '/ClaimManagement/GetApplicationClaims',
    getClaimTypesWithClaims: '/ClaimManagement/GetClaimTypesWithClaims',

    // CREATE
    createClaim: '/ClaimManagement/CreateClaim',
    createClaimType: '/ClaimManagement/CreateClaimType',

    // UPDATE
    updateClaim: '/ClaimManagement/UpdateClaim',
    updateClaimType: '/ClaimManagement/UpdateClaimType',

    // DELETE
    deleteClaim: '/ClaimManagement/DeleteClaim',
    deleteClaimType: '/ClaimManagement/DeleteClaimType',
  },
  contractor: {
    create: '/Contractors/CreateContractor',
    createBoard: '/Contractors/SetBoardMembers',
    update: '/Contractors/UpdateContractor',
    delete: '/Contractors/DeleteContractors',
    list: '/Contractors/GetContractors',
    getById: '/Contractors',
  },
  contract: {
    create: '/Personnels/CreateContract',
    update: '/Personnels/UpdateContract',
    delete: '/Personnels/DeleteContracts',
    list: '/Personnels/GetContracts',
  },

  visitor: {
    create: '/Visitors/Create',
    delete: '/Visitors/DeleteVisitors',
    getById: (id) => `/Visitors/${id}`,
    update: `/Visitors`,
    list: '/Visitors/GetVisitors',
  },

  visitorType: {
    list: '/Visitors/GetVisitorTypes',
    selectList: '/Visitors/GetSelectVisitorTypes',
    delete: '/Visitors/DeleteVisitorTypes',
    update: (id) => `/Visitors/UpdateVisitorType/${id}`,
    create: '/Visitors/CreateVisitorType',
  },

  personnels: {
    create: '/Personnels/Create',
    getById: (id) => `/Personnels/${id}`,
    update: (id) => `/Personnels/${id}`,
    getEmploymentHistory: '/Personnels/GetPersonnelEmploymentHistory',
    list: '/Personnels/GetPersonnels',
    selectPersonnel: '/Personnels/GetSelectPersonnels',
  },
  employmentTypes: {
    create: '/Personnels/CreateEmploymentType',
    delete: '/Personnels/DeleteEmploymentType',
    list: '/Personnels/GetEmploymentTypes',
    getById: (id) => `/Personnels/UpdateEmploymentType/${id}`,
  },
  employmentStatus: {
    create: '/Personnels/CreateEmploymentStatus',
    delete: '/Personnels/DeleteEmploymentStatus',
    list: '/Personnels/GetEmploymentStatuses',
    update: (id) => `/Personnels/UpdateEmploymentStatus/${id}`,
  },
  units: {
    list: '/Units/GetUnits',
    getSelectList: '/Units/GetSelectUnits',
    getById: (id) => `/Units/GetUnitById/${id}`,
    create: '/Units/CreateUnit',
    update: (id) => `/Units/UpdateUnit/${id}`,
    delete: (id) => `/Units/DeleteUnit/${id}`,
  },
  visitReason: {
    list: '/Visitors/GetVisitReasons',
    create: '/Visitors/CreateVisitReason',
  },
  reservedCards: {
    list: '/Visitors/GetVisitorCards',
    create: '/Visitors/CreateVisitorCards',
  },
  VisitorItems: {
    list: '/Visitors/GetVisitorItems',
    create: '/Visitors/CreateVisitorItem',
  },
  VisitorItemsTypes: {
    list: '/Visitors/GetVisitorItemTypes',
    create: '/Visitors/CreateVisitorItemTypes',
  },
  VisitSchedules: {
    list: '/Visitors/GetVisitSchedules',
    create: '/Visitors/CreateVisitSchedule',
    mangerList: '/Visitors/GetMyVisitSchedules',
    approveSchedule: '/Visitors/ApproveVisitSchedule',
    denySchedule: '/Visitors/CloseVisitSchedule',
  },

  VisitSchedulesReserve: {
    list: '/Visitors/GetVisitSchedules',
    create: '/Visitors/CreateVisitSchedule',
  },

  VisitorAndVisitSchedule: {
    list: '/Visitors/GetVisitSchedules',
    create: '/Visitors/CreateVisitorAndVisitSchedule',
    getById: (id) => `/Visitors/GetVisitSchedule/${id}`,
    update: '/UpdateVisitorAndVisitSchedule',
  },

  VisitorCards: {
    list: '/Visitors/GetVisitorCards',
    create: '/Visitors/CreateVisitorCard',
    delete: '/Visitors/DeleteVisitorCards',
  },

  VisitorBlockList: {
    list: '/Visitors/GetVisitorBlackLists',
    create: '/Visitors/CreateBlackList',
    delete: '/Visitors/DeleteBlackLists',
  },
  VisitorBlackListReasons: {
    list: '/Visitors/GetVisitorBlackListReasons',
    create: '/Visitors/CreateBlackListReason',
    delete: '/Visitors/DeleteBlackListReasons',
  },
  PersonnelBlackList: {
    list: '/Personnels/GetPersonnelBlackLists',
    create: '/Personnels/CreateBlackList',
    delete: '/Personnels/DeleteBlackLists',
  },
  PersonnelBlackListReasons: {
    list: '/Personnels/GetPersonnelBlackListReasons',
    create: '/Personnels/CreateBlackListReason',
    delete: '/Personnels/DeleteBlackListReasons',
  },

  AccessGroups: {
    list: '/AccessGroups/GetAccessGroups',
    create: '/AccessGroups/CreateAccessGroup',
  },

  PersonnelAccessLogs: {
    list: '/AccessLogs/GetPairedAccessLogs',
    create: '/AccessLogs/CreatePairedAccessLogs',
    delete: '/AccessLogs/DeletePairedAccessLogs',
    update: '/AccessLogs/UpdatePairedAccessLogs',
  },

  VehicleAccessLogs: {
    list: '/AccessLogs/GetPairedVehicleAccessLogs',
    create: '/AccessLogs/CreatePairedVehicleAccessLogs',
    delete: '/AccessLogs/DeletePairedVehicleAccessLogs',
    update: '/AccessLogs/UpdatePairedVehicleAccessLogs',
  },

  Vehicle: {
    list: '/Vehicles/getVehicles',
    create: '/Vehicles/Create',
    delete: '/vehicles',
    update: '/vehicles/update',
  },

  SecurityEquipmentTypes: {
    list: '/Patrols/GetSecurityEquipmentTypes',
    create: '/Patrols/CreateSecurityEquipmentType',
    update: '/Patrols/UpdateSecurityEquipmentType',
    delete: '/Patrols/DeleteSecurityEquipmentTypes',
  },
  SecurityEquipments: {
    list: '/Patrols/GetSecurityEquipments',
    create: '/Patrols/CreateSecurityEquipment',
    update: '/Patrols/UpdateSecurityEquipment',
    delete: '/Patrols/DeleteSecurityEquipments',
  },
  PatrolArea: {
    list: '/Patrols/GetPatrolAreas',
    create: '/Patrols/CreatePatrolArea',
    update: '/Patrols/UpdatePatrolArea',
    delete: '/Patrols/DeletePatrolAreas',
  },
  PatrolGroups: {
    list: '/Patrols/GetPatrolGroups',
    create: '/Patrols/CreatePatrolGroup',
    update: '/Patrols/UpdatePatrolGroup',
    delete: '/Patrols/DeletePatrolGroups',
  },

  PatrolShifts: {
    list: '/Patrols/GetPatrolShifts',
    create: '/Patrols/CreatePatrolShift',
    update: '/Patrols/UpdatePatrolShift',
    delete: '/Patrols/DeletePatrolShifts',
  },

  PatrolBoards: {
    list: '/Patrols/GetPatrolBoards',
    boardList: '/Patrols/GetPatrolBoardPersonnels',
    create: '/Patrols/CreatePatrolBoard',
    update: '/Patrols/UpdatePatrolBoard',
  },

  Calendar: {
    list: '/Calendars/GetDejbanCalendars',
    create: '/Patrols/CreatePatrolBoard',
    update: '/Calendars/UpdateDejbanCalendar',
    delete: '/Calendars/DeleteDejbanCalendars',
  },

  AssignEquipments: {
    list: '/Patrols/GetPersonnelSecurityEquipments',
    create: '/Patrols/AssignEquipmentsToPersonnels',
  },
  ShiftSupervisorAndDeputy: {
    list: '/Patrols/GetShiftSupervisorsAndDeputies',
    create: '/Patrols/AssignDeputyToShift',
    update: 'Patrols/UpdateAssignDeputyToShift',
    delete: '/Patrols/DeleteShiftSupervisorAndDeputies',
  },
  PatrolShiftWorkPeriod: {
    list: '/Patrols/GetPatrolShiftWorkPeriods',
    create: '/Patrols/CreatePatrolShiftWorkPeriod',
    update: 'Patrols/UpdatePatrolShiftWorkPeriod',
    delete: '/Patrols/DeletePatrolShiftWorkPeriods',
  },
  munitionsDepot: {
    list: '/armory/locations',
    getById: (id) => `/armory/locations/${id}`,
    create: '/armory/locations',
    update: (id) => `/armory/locations/${id}`,
    delete: (id) => `/armory/locations/${id}`,
  },
  vehicle: {
    list: '/Vehicles/getVehicles',
    create: '/Vehicles/Create',
    update: '/vehicles/update',
    delete: '/vehicles',
  },
  equipment: {
    list: '/Equipment/getEquipment',
    selectList: '/Equipment/select-list',
    create: '/Equipment/create',
    update: '/equipment/update',
    delete: '/equipment',
  },
  maintenance: {
    list: '/maintenance',
    create: '/maintenance/create',
    update: '/maintenance/update',
    delete: '/maintenance',
  },
  vehicleAssignment: {
    activeAssignmentByVehicleId: '/VehicleAssignments/vehicle/active',
    create: '/VehicleAssignments/create',
    update: '/VehicleAssignments/update',
    delete: '/VehicleAssignments',
    end: '/VehicleAssignments/end',
  },
};

export default api;