import { paths } from 'src/routes/paths';
import {
  TbChartInfographic,
  TbHierarchy,
  TbLockAccess,
  TbSitemap,
  TbTarget,
  TbUsersMinus,
} from 'react-icons/tb';
import { TbId } from 'react-icons/tb';
import { TbUsers } from 'react-icons/tb';
import { TbDoor } from 'react-icons/tb';

import { TbScanPosition } from 'react-icons/tb';
import { IconifyLocal } from 'src/components/iconify';
import { TbTemplate } from 'react-icons/tb';
import { TbCalendarCheck } from 'react-icons/tb';
import { ImTrello } from 'react-icons/im';
import { IoSchoolSharp } from 'react-icons/io5';
import { LiaSchoolSolid } from 'react-icons/lia';
import { FaMapLocationDot } from 'react-icons/fa6';
import { FaIdCard, FaUserClock } from 'react-icons/fa';
import { AiOutlineDeploymentUnit } from 'react-icons/ai';
import { MdOutlineWorkHistory } from 'react-icons/md';
import { FaNetworkWired } from 'react-icons/fa';
import { TbUserOff } from 'react-icons/tb';
import { TbListDetails } from 'react-icons/tb';
import { TbFilePencil } from 'react-icons/tb';
import { TbTools } from 'react-icons/tb';
import { TbFileAnalytics } from 'react-icons/tb';
import { TbCar } from 'react-icons/tb';
import { TbEye } from 'react-icons/tb';
import { TbClockHour4 } from 'react-icons/tb';
import { TbShieldCheck } from 'react-icons/tb';
import { TbCalendarTime } from 'react-icons/tb';
import { TbUserCheck } from 'react-icons/tb';
import { TbUsersGroup } from 'react-icons/tb';
import { TbShieldLock } from 'react-icons/tb';
import { TbUserCircle } from 'react-icons/tb';
import { TbListCheck } from 'react-icons/tb';
import { TbFileDescription } from 'react-icons/tb';
import { BsInboxesFill } from 'react-icons/bs';
import { HiLocationMarker } from 'react-icons/hi';
import { SiAlwaysdata } from 'react-icons/si';
import { GiBullets } from 'react-icons/gi';

import {
  GiAmmoBox,
  GiArchiveResearch,
  GiCash,
  GiMoneyStack,
  GiPistolGun,
  GiRifle,
} from 'react-icons/gi';
import { TbDoorEnter } from 'react-icons/tb';
import { FaUserShield } from 'react-icons/fa';
import { FaLandmark } from 'react-icons/fa';

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: 'منوی اصلی',
    items: [
      // ==========================================================
      // گروه 1: مدیریت منابع انسانی
      // ==========================================================

      // {
      //   title: 'basicInformation.title',
      //   path: '#',
      //   icon: (
      //     <IconifyLocal>
      //       <TbUsersGroup size={22} />
      //     </IconifyLocal>
      //   ),
      //   children: [
      //     {
      //       title: 'employmentType.title',
      //       path: paths.dashboard.employmentType.root,
      //       icon: (
      //         <IconifyLocal>
      //           <TbTemplate size={22} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'occupationType.title',
      //       path: paths.dashboard.occupationType.root,
      //       icon: (
      //         <IconifyLocal>
      //           <ImTrello size={20} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'major.title',
      //       path: paths.dashboard.major.root,
      //       icon: (
      //         <IconifyLocal>
      //           <IoSchoolSharp size={20} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'degree.title',
      //       path: paths.dashboard.degree.root,
      //       icon: (
      //         <IconifyLocal>
      //           <LiaSchoolSolid size={20} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'location.title',
      //       path: paths.dashboard.location.root,
      //       icon: (
      //         <IconifyLocal>
      //           <FaMapLocationDot size={20} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'positions.title',
      //       path: paths.dashboard.positions.root,
      //       icon: (
      //         <IconifyLocal>
      //           <TbScanPosition size={22} />
      //         </IconifyLocal>
      //       ),
      //     },
      //   ],
      // },
      //
      // {
      //   title: 'humanResourceManagement.title',
      //   path: '#',
      //   icon: (
      //     <IconifyLocal>
      //       <TbUsersGroup size={22} />
      //     </IconifyLocal>
      //   ),
      //   children: [
      //     {
      //       title: 'staff.title',
      //       path: paths.dashboard.staff.root,
      //       icon: (
      //         <IconifyLocal>
      //           <TbUsersGroup size={22} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'staffAccess.title',
      //       path: paths.dashboard.staffAccess.root,
      //       icon: (
      //         <IconifyLocal>
      //           <TbUserCircle size={22} />
      //         </IconifyLocal>
      //       ),
      //     },
      //
      //     {
      //       title: 'units.title',
      //       path: paths.dashboard.units.root,
      //       icon: (
      //         <IconifyLocal>
      //           <AiOutlineDeploymentUnit size={22} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'قرارداد پیمانکار',
      //       path: paths.dashboard.contractor.contractAgreement,
      //       icon: (
      //         <IconifyLocal>
      //           <TbFilePencil size={22} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'هییت مدیره پیمانکار',
      //       path: paths.dashboard.contractor.contractorBoardOfDirectorsRoot,
      //       icon: (
      //         <IconifyLocal>
      //           <FaNetworkWired size={22} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'پیمانکار',
      //       path: paths.dashboard.contractor.contractorsRoot,
      //       icon: (
      //         <IconifyLocal>
      //           <MdOutlineWorkHistory size={22} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'personnelBlackList.title',
      //       path: paths.dashboard.personnelBlackList.root,
      //       icon: (
      //         <IconifyLocal>
      //           <TbUserOff size={22} />
      //         </IconifyLocal>
      //       ),
      //     },
      //     {
      //       title: 'personnelBlackListReasons.title',
      //       path: paths.dashboard.personnelBlackListReasons.root,
      //       icon: (
      //         <IconifyLocal>
      //           <TbListDetails size={22} />
      //         </IconifyLocal>
      //       ),
      //     },
      //   ],
      // },

      ///test

      /// cartable

      {
        title: 'manageCartable.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <TbDoor size={25} />
          </IconifyLocal>
        ),
        children: [
          {
            title: 'managerCartable.title',
            path: paths.dashboard.manageCartable.root,
            icon: (
              <IconifyLocal>
                <AiOutlineDeploymentUnit size={22} />
              </IconifyLocal>
            ),
          },
        ],
      },

      // base information
      {
        title: 'humanResourceManagement.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <TbUsersGroup size={22} />
          </IconifyLocal>
        ),
        children: [
          // ========== بخش اطلاعات پایه ==========
          {
            title: 'basicInformation.title',
            path: '#',
            icon: (
              <IconifyLocal>
                <TbUsersGroup size={22} />
              </IconifyLocal>
            ),
            children: [
              {
                title: 'employmentType.title',
                path: paths.dashboard.employmentType.root,
                icon: (
                  <IconifyLocal>
                    <TbTemplate size={22} />
                  </IconifyLocal>
                ),
              },
              {
                title: 'occupationType.title',
                path: paths.dashboard.occupationType.root,
                icon: (
                  <IconifyLocal>
                    <ImTrello size={20} />
                  </IconifyLocal>
                ),
              },
              {
                title: 'major.title',
                path: paths.dashboard.major.root,
                icon: (
                  <IconifyLocal>
                    <IoSchoolSharp size={20} />
                  </IconifyLocal>
                ),
              },
              {
                title: 'degree.title',
                path: paths.dashboard.degree.root,
                icon: (
                  <IconifyLocal>
                    <LiaSchoolSolid size={20} />
                  </IconifyLocal>
                ),
              },
              {
                title: 'location.title',
                path: paths.dashboard.location.root,
                icon: (
                  <IconifyLocal>
                    <FaMapLocationDot size={20} />
                  </IconifyLocal>
                ),
              },
              {
                title: 'positions.title',
                path: paths.dashboard.positions.root,
                icon: (
                  <IconifyLocal>
                    <TbScanPosition size={22} />
                  </IconifyLocal>
                ),
              },
            ],
          },
          // ========== بخش اصلی مدیریت منابع انسانی ==========
          {
            title: 'staff.title',
            path: paths.dashboard.staff.root,
            icon: (
              <IconifyLocal>
                <TbUsersGroup size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'organizationChart.title',
            path: paths.dashboard.organizationChart.root,
            icon: (
              <IconifyLocal>
                <TbSitemap size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'organizationTree.title',
            path: paths.dashboard.organizationTree.root,
            icon: (
              <IconifyLocal>
                <TbChartInfographic size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'personnelBlackList.title',
            path: paths.dashboard.personnelBlackList.root,
            icon: (
              <IconifyLocal>
                <TbUserOff size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'personnelBlackListReasons.title',
            path: paths.dashboard.personnelBlackListReasons.root,
            icon: (
              <IconifyLocal>
                <TbListDetails size={22} />
              </IconifyLocal>
            ),
          },
        ],
      },

      ///test

      // ==========================================================
      // گروه 2: مدیریت مراجعین و مهمانان
      // ==========================================================
      {
        title: 'guestVisitor.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <FaUserClock size={22} />
          </IconifyLocal>
        ),
        children: [
          {
            title: 'VisitorAndAppointment.title',
            path: paths.dashboard.VisitorAndAppointment.root,
            icon: (
              <IconifyLocal>
                <FaUserClock size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'guestVisitorList.title',
            path: paths.dashboard.guestVisitor.root,
            icon: (
              <IconifyLocal>
                <TbUsersMinus size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'guestReserve.title',
            path: paths.dashboard.guestReserve.root,
            icon: (
              <IconifyLocal>
                <TbCalendarCheck size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'visitorCards.title',
            path: paths.dashboard.visitorCards.root,
            icon: (
              <IconifyLocal>
                <TbUserOff size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'visitorBlackList.title',
            path: paths.dashboard.visitorBlockList.root,
            icon: (
              <IconifyLocal>
                <TbUserOff size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'visitorBlackListReasons.title',
            path: paths.dashboard.visitorBlackListReasons.root,
            icon: (
              <IconifyLocal>
                <TbListDetails size={22} />
              </IconifyLocal>
            ),
          },
        ],
      },

      {
        title: 'trafficOperations.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <TbDoor size={25} />
          </IconifyLocal>
        ),
        children: [
          {
            title: 'staffAccess.title',
            path: paths.dashboard.staffAccess.root,
            icon: (
              <IconifyLocal>
                <TbUserCircle size={22} />
              </IconifyLocal>
            ),
          },

          {
            title: 'vehicleAccess.title',
            path: paths.dashboard.vehicleAccess.root,
            icon: (
              <IconifyLocal>
                <TbUserCircle size={22} />
              </IconifyLocal>
            ),
          },
        ],
      },

      //contractors

      {
        title: 'contractors.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <FaIdCard size={25} />
          </IconifyLocal>
        ),
        children: [
          {
            title: 'قرارداد پیمانکار',
            path: paths.dashboard.contractor.contractAgreement,
            icon: (
              <IconifyLocal>
                <TbFilePencil size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'هییت مدیره پیمانکار',
            path: paths.dashboard.contractor.contractorBoardOfDirectorsRoot,
            icon: (
              <IconifyLocal>
                <FaNetworkWired size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'پیمانکار',
            path: paths.dashboard.contractor.contractorsRoot,
            icon: (
              <IconifyLocal>
                <MdOutlineWorkHistory size={22} />
              </IconifyLocal>
            ),
          },
        ],
      },

      // ==========================================================
      // گروه 3: مدیریت خودروها
      // ==========================================================
      {
        title: 'carsManagement.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <TbCar size={22} />
          </IconifyLocal>
        ),
        children: [
          {
            title: 'تجهیزات خودرو',
            path: paths.dashboard.vehicleEquipment.root,
            icon: (
              <IconifyLocal>
                <TbTools size={22} />
              </IconifyLocal>
            ),
          },

          {
            title: 'تعمیرات و نگهداری خودرو ها',
            path: paths.dashboard.vehicleMaintenance.root,
            icon: (
              <IconifyLocal>
                <TbFileAnalytics size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'خودرو ها',
            path: paths.dashboard.vehicle.root,
            icon: (
              <IconifyLocal>
                <TbCar size={22} />
              </IconifyLocal>
            ),
          },
        ],
      },
      // ==========================================================
      // گروه 4: مدیریت شیفت و گشت‌زنی
      // ==========================================================
      {
        title: 'arrangements.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <TbEye size={22} />
          </IconifyLocal>
        ),
        children: [
          {
            title: 'patrolArea.title',
            path: paths.dashboard.patrolArea.root,
            icon: (
              <IconifyLocal>
                <TbEye size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'patrolShift.title',
            path: paths.dashboard.patrolShift.root,
            icon: (
              <IconifyLocal>
                <TbClockHour4 size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'assignEquipments.title',
            path: paths.dashboard.assignEquipments.root,
            icon: (
              <IconifyLocal>
                <TbShieldCheck size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'patrolShiftWorkPeriod.title',
            path: paths.dashboard.patrolShiftWorkPeriod.root,
            icon: (
              <IconifyLocal>
                <TbCalendarTime size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'shiftSupervisorAndDeputy.title',
            path: paths.dashboard.shiftSupervisorAndDeputy.root,
            icon: (
              <IconifyLocal>
                <TbUserCheck size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'groupShiftArrangement.title',
            path: paths.dashboard.groupShiftArrangement.root,
            icon: (
              <IconifyLocal>
                <TbUserCheck size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'singleShiftArrangement.title',
            path: paths.dashboard.singleShiftArrangement.root,
            icon: (
              <IconifyLocal>
                <TbUserCheck size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'patrolGroups.title',
            path: paths.dashboard.patrolGroups.root,
            icon: (
              <IconifyLocal>
                <TbUsersGroup size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'guardPlaque.title',
            path: paths.dashboard.guardPlaque.root,
            icon: (
              <IconifyLocal>
                <TbShieldLock size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'securityEquipmentTypes.title',
            path: paths.dashboard.securityEquipmentTypes.root,
            icon: (
              <IconifyLocal>
                <TbLockAccess size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'securityEquipments.title',
            path: paths.dashboard.securityEquipments.root,
            icon: (
              <IconifyLocal>
                <TbLockAccess size={22} />
              </IconifyLocal>
            ),
          },
        ],
      },

      {
        title: 'centerGrouping.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <TbDoor size={25} />
          </IconifyLocal>
        ),
        children: [
          {
            title: 'sites.title',
            path: paths.dashboard.sites.root,
            icon: (
              <IconifyLocal>
                <AiOutlineDeploymentUnit size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'units.title',
            path: paths.dashboard.units.root,
            icon: (
              <IconifyLocal>
                <AiOutlineDeploymentUnit size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'doors.title',
            path: paths.dashboard.doors.doorsManagementRoot,
            icon: (
              <IconifyLocal>
                <TbDoorEnter size={25} />
              </IconifyLocal>
            ),
          },
        ],
      },

      {
        title: 'reports.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <TbDoor size={25} />
          </IconifyLocal>
        ),
        children: [
          {
            title: 'guestReport.title',
            path: paths.dashboard.report.guestReportRoot,
            icon: (
              <IconifyLocal>
                <TbUsers size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'staffAccessReport.title',
            path: paths.dashboard.report.staffAccessReportRoot,
            icon: (
              <IconifyLocal>
                <TbId size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'vehicleAccessReport.title',
            path: paths.dashboard.report.vehicleAccessReportRoot,
            icon: (
              <IconifyLocal>
                <TbCar size={22} />
              </IconifyLocal>
            ),
          },
        ],
      },

      // ==========================================================
      // گروه 5: تنظیمات
      // ==========================================================
      {
        title: 'setting.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <TbShieldLock size={22} />
          </IconifyLocal>
        ),
        children: [
          {
            title: 'roleManagement.title',
            path: paths.dashboard.roleManagement.root,
            icon: (
              <IconifyLocal>
                <TbShieldLock size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'claimTypes.title',
            path: paths.dashboard.claimTypes.root,
            icon: (
              <IconifyLocal>
                <TbListCheck size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'claimList.title',
            path: paths.dashboard.claimList.root,
            icon: (
              <IconifyLocal>
                <TbFileDescription size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'accessPermission.title',
            path: paths.dashboard.accessPermission.root,
            icon: (
              <IconifyLocal>
                <TbShieldLock size={22} />
              </IconifyLocal>
            ),
          },
        ],
      },
      // ==========================================================
      // گروه 6: انبار
      // ==========================================================
      {
        title: 'armory.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <BsInboxesFill size={22} />
          </IconifyLocal>
        ),
        children: [
          // {
          //   title: 'armoryCategories.title',
          //   path: paths.dashboard.armory.armoryCategoriesRoot,
          //   icon: (
          //     <IconifyLocal>
          //       <FcOrgUnit size={22} />
          //     </IconifyLocal>
          //   ),
          // },
          {
            title: 'munitionsDepot.title',
            path: paths.dashboard.armory.munitionsDepotRoot,
            icon: (
              <IconifyLocal>
                <TbHierarchy size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'ammunition.title',
            path: paths.dashboard.armory.ammunitionRoot,
            icon: (
              <IconifyLocal>
                <GiAmmoBox size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'weaponModel.title',
            path: paths.dashboard.armory.weaponModelRoot,
            icon: (
              <IconifyLocal>
                <GiRifle size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'firearm.title',
            path: paths.dashboard.armory.firearmRoot,
            icon: (
              <IconifyLocal>
                <GiPistolGun size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'cartridgeDefinitions.title',
            path: paths.dashboard.armory.cartridgeDefinitionsRoot,
            icon: (
              <IconifyLocal>
                <GiBullets size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'assets.title',
            path: paths.dashboard.armory.assetsRoot,
            icon: (
              <IconifyLocal>
                <GiCash size={22} />
              </IconifyLocal>
            ),
          },
          {
            title: 'assetDefinitions.title',
            path: paths.dashboard.armory.assetDefinitionsRoot,
            icon: (
              <IconifyLocal>
                <GiArchiveResearch size={22} />
              </IconifyLocal>
            ),
          },

          // {
          //   title: 'armoryEquipments.title',
          //   path: paths.dashboard.armory.armoryEquipmentsRoot,
          //   icon: (
          //     <IconifyLocal>
          //       <BsInboxesFill size={20} />
          //     </IconifyLocal>
          //   ),
          // },
          // {
          //   title: 'armoryInventory.title',
          //   path: paths.dashboard.armory.armoryInventoryRoot,
          //   icon: (
          //     <IconifyLocal>
          //       <BsPersonFillGear size={22} />
          //     </IconifyLocal>
          //   ),
          // },
        ],
      },
      // ==========================================================
      // گروه 7: حمل و نقل پول
      // ==========================================================
      {
        title: 'cashInTransit.title',
        path: '#',
        icon: (
          <IconifyLocal>
            <GiMoneyStack size={25} />
          </IconifyLocal>
        ),
        children: [
          {
            title: 'عملیات پول رسانی',
            path: paths.dashboard.cashInTransit.moneySupplyRoot,
            icon: (
              <IconifyLocal>
                <GiMoneyStack size={25} />
              </IconifyLocal>
            ),
          },
          {
            title: 'اطلاعات تحویل دار',
            path: paths.dashboard.cashInTransit.recipientInfoRoot,
            icon: (
              <IconifyLocal>
                <FaUserShield size={25} />
              </IconifyLocal>
            ),
          },
          {
            title: 'اطلاعات خزانه',
            path: paths.dashboard.cashInTransit.treasuryInfoRoot,
            icon: (
              <IconifyLocal>
                <FaLandmark size={25} />
              </IconifyLocal>
            ),
          },
          {
            title: 'اطلاعات ایستگاه ها',
            path: paths.dashboard.cashInTransit.stationInfoRoot,
            icon: (
              <IconifyLocal>
                <HiLocationMarker size={25} />
              </IconifyLocal>
            ),
          },
          {
            title: 'اطلاعات مسیر ها',
            path: paths.dashboard.cashInTransit.wayInfoRoot,
            icon: (
              <IconifyLocal>
                <SiAlwaysdata size={25} />
              </IconifyLocal>
            ),
          },
          {
            title: 'اطلاعات مقاصد',
            path: paths.dashboard.cashInTransit.destinationIinfoRoot,
            icon: (
              <IconifyLocal>
                <TbTarget size={25} />{' '}
              </IconifyLocal>
            ),
          },
        ],
      },
      // ==========================================================
      // گروه 8: مدیریت درب ها
      // ==========================================================
    ],
  },
];
