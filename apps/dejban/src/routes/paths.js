import { useCreatePatrolShiftWorkPeriod } from '../services/patrol-shift-work-period/patrol-shift-work-period.service';

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  maintenance: '/maintenance',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    blank: `${ROOTS.DASHBOARD}/blank`,

    roleManagement: {
      root: `${ROOTS.DASHBOARD}/management/role-management`,
    },
    VisitorAndAppointment: {
      root: `${ROOTS.DASHBOARD}/clientele/visitor-and-appointment`,
    },

    guestVisitor: {
      root: `${ROOTS.DASHBOARD}/clientele/guest-visitor`,
    },
    positions: {
      root: `${ROOTS.DASHBOARD}/personnel/positions`,
    },
    units: {
      root: `${ROOTS.DASHBOARD}/personnel/units`,
    },
    employmentType: {
      root: `${ROOTS.DASHBOARD}/personnel/employment-type`,
    },
    occupationType: {
      root: `${ROOTS.DASHBOARD}/personnel/occupation-type`,
    },
    staff: {
      root: `${ROOTS.DASHBOARD}/personnel/staff`,
    },
    organizationChart: {
      root: `${ROOTS.DASHBOARD}/personnel/organization-chart`,
    },
    organizationTree: {
      root: `${ROOTS.DASHBOARD}/personnel/organization-tree`,
    },
    manageCartable: {
      root: `${ROOTS.DASHBOARD}/personnel/manager-cartable`,
    },
    staffAccess: {
      root: `${ROOTS.DASHBOARD}/personnel/staff-access`,
    },
    major: {
      root: `${ROOTS.DASHBOARD}/personnel/major`,
    },
    degree: {
      root: `${ROOTS.DASHBOARD}/personnel/degree`,
    },
    location: {
      root: `${ROOTS.DASHBOARD}/personnel/location`,
    },
    personnelBlackList: {
      root: `${ROOTS.DASHBOARD}/personnel/personnel-black-list`,
    },
    personnelBlackListReasons: {
      root: `${ROOTS.DASHBOARD}/personnel/personnel-black-list-reasons`,
    },
    sites: {
      root: `${ROOTS.DASHBOARD}/personnel/sites`,
    },
    visitorBlockList: {
      root: `${ROOTS.DASHBOARD}/clientele/visitor-black-list`,
    },
    visitorBlackListReasons: {
      root: `${ROOTS.DASHBOARD}/clientele/visitor-black-list-reasons`,
    },
    guestReserve: {
      root: `${ROOTS.DASHBOARD}/clientele/guest-reserve`,
    },
    visitorCards: {
      root: `${ROOTS.DASHBOARD}/clientele/visitor-cards`,
    },
    vehicle: {
      root: `${ROOTS.DASHBOARD}/car/vehicle`,
    },
    vehicleMaintenance: {
      root: `${ROOTS.DASHBOARD}/car/vehicle-maintenance`,
    },
    vehicleAccess: {
      root: `${ROOTS.DASHBOARD}/car/vehicle-access`,
    },
    vehicleEquipment: {
      root: `${ROOTS.DASHBOARD}/car/vehicle-equipment`,
    },
    contractor: {
      contractorsRoot: `${ROOTS.DASHBOARD}/personnel/contractor/contractors`,
      contractorBoardOfDirectorsRoot: `${ROOTS.DASHBOARD}/personnel/contractor/board-of-directors`,
      contractAgreement: `${ROOTS.DASHBOARD}/personnel/contractor/agreement`,
    },
    accessPermission: {
      root: `${ROOTS.DASHBOARD}/management/access-permission`,
    },
    claimTypes: {
      root: `${ROOTS.DASHBOARD}/management/claim-types`,
    },
    claimList: {
      root: `${ROOTS.DASHBOARD}/management/claim-list`,
    },

    patrolArea: {
      root: `${ROOTS.DASHBOARD}/arrangement/patrol-area`,
    },

    patrolShift: {
      root: `${ROOTS.DASHBOARD}/arrangement/patrol-shifts`,
    },

    assignEquipments: {
      root: `${ROOTS.DASHBOARD}/arrangement/assign-equipments`,
    },
    shiftSupervisorAndDeputy: {
      root: `${ROOTS.DASHBOARD}/arrangement/shift-supervisor-and-deputy`,
    },
    groupShiftArrangement: {
      root: `${ROOTS.DASHBOARD}/arrangement/group-shift-arrangement`,
    },
    singleShiftArrangement: {
      root: `${ROOTS.DASHBOARD}/arrangement/single-shift-arrangement`,
    },
    patrolShiftWorkPeriod: {
      root: `${ROOTS.DASHBOARD}/arrangement/patrol-shift-work-period`,
    },
    patrolGroups: {
      root: `${ROOTS.DASHBOARD}/arrangement/patrol-groups`,
    },
    securityEquipmentTypes: {
      root: `${ROOTS.DASHBOARD}/arrangement/security-equipment-types`,
    },
    securityEquipments: {
      root: `${ROOTS.DASHBOARD}/arrangement/security-equipments`,
    },
    guardPlaque: {
      root: `${ROOTS.DASHBOARD}/arrangement/guard-plaque`,
    },

    report: {
      guestReportRoot: `${ROOTS.DASHBOARD}/reports/guest-report`,
      staffAccessReportRoot: `${ROOTS.DASHBOARD}/reports/staff-access-report`,
      vehicleAccessReportRoot: `${ROOTS.DASHBOARD}/reports/vehicle-access-report`,
    },

    armory: {
      munitionsDepotRoot: `${ROOTS.DASHBOARD}/armory/munitions-depot`,
      armoryCategoriesRoot: `${ROOTS.DASHBOARD}/armory/armory-categories`,
      armoryEquipmentsRoot: `${ROOTS.DASHBOARD}/armory/armory-equipments`,
      armoryInventoryRoot: `${ROOTS.DASHBOARD}/armory/armory-inventory`,
      weaponModelRoot: `${ROOTS.DASHBOARD}/armory/weapon-models`,
      firearmRoot: `${ROOTS.DASHBOARD}/armory/firearm`,
      ammunitionRoot: `${ROOTS.DASHBOARD}/armory/ammunition`,
      cartridgeDefinitionsRoot: `${ROOTS.DASHBOARD}/armory/cartridge-definitions`,
      assetsRoot: `${ROOTS.DASHBOARD}/armory/assets`,
      assetDefinitionsRoot: `${ROOTS.DASHBOARD}/armory/asset-definitions`,
    },
    cashInTransit: {
      moneySupplyRoot: `${ROOTS.DASHBOARD}/cash-in-transit/money-supply`,
      stationInfoRoot: `${ROOTS.DASHBOARD}/cash-in-transit/station-info`,
      wayInfoRoot: `${ROOTS.DASHBOARD}/cash-in-transit/way-info`,
      treasuryInfoRoot: `${ROOTS.DASHBOARD}/cash-in-transit/treasury-info`,
      destinationIinfoRoot: `${ROOTS.DASHBOARD}/cash-in-transit/destination-info`,
      recipientInfoRoot: `${ROOTS.DASHBOARD}/cash-in-transit/recipient-info`,
    },
    doors: {
      doorsManagementRoot: `${ROOTS.DASHBOARD}/doors/doors-management`,
    },
  },
};
