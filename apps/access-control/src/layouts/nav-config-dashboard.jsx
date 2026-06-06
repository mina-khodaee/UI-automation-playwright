
import { TbDoor } from 'react-icons/tb';
import { TbDoorEnter } from 'react-icons/tb';
import { MdDashboard } from 'react-icons/md';
import { TbShieldLock } from 'react-icons/tb';
import { FaUserShield } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/tb';
import { HiOutlineUser } from 'react-icons/hi2';
import { TbCalendarTime } from 'react-icons/tb';
import { FaNetworkWired } from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';
import { TbKey, TbReport } from 'react-icons/tb';
import { IconifyLocal } from '@repo/ui/iconify-local';
import { AiOutlineDeploymentUnit } from 'react-icons/ai';

import { paths } from 'src/routes/paths';

export const navData = [
  /**
   * Management
   */
  {
    subheader: 'deviceManagement.title',
    items: [
      {
        title: 'deviceManagement.device.title',
        path: paths.dashboard.device.root,
        icon: <IconifyLocal><AiOutlineDeploymentUnit size={22}/></IconifyLocal>
      },
      {
        title: 'deviceManagement.deviceType.title',
        path: paths.dashboard.deviceType.root,
        icon: <IconifyLocal><FaNetworkWired size={22}/></IconifyLocal>
      },
      {
        title: 'deviceManagement.region.title',
        path: paths.dashboard.region.root,
        icon: <IconifyLocal><GiPathDistance size={22}/></IconifyLocal> 
      }, 
      {
        title: 'deviceManagement.trafficReport.title',
        path: paths.dashboard.trafficReport.root,
        icon: <IconifyLocal><TbReport size={22}/></IconifyLocal>
      } 
    ]},
    {
    subheader: 'userManagement.title',
    items: [
      {
        title: 'userManagement.deviceUser.title',
        path: paths.dashboard.aclUserManagement.root,
        icon: <IconifyLocal><HiOutlineUser size={22}/></IconifyLocal>
      },
      {
        title: 'userManagement.accessGroup.title',
        path: paths.dashboard.accessGroup.root,
        icon: <IconifyLocal><FaUserShield size={22}/></IconifyLocal>
      }
    ]
  },
  {
    subheader: 'deviceScheduleManagement.title',
    items: [
      {
        title: 'deviceScheduleManagement.calendar.title',
        path: paths.dashboard.calendar.root,
        icon: <IconifyLocal><TbCalendarTime size={22} /></IconifyLocal>
      },
    ]
  },
  {
    subheader: 'apiKeyManagement.title',
    items: [
      {
        title: 'apiKeyManagement.APIs.title',
        path: paths.dashboard.APIKeys.root,
        icon: <IconifyLocal><TbKey size={22}/></IconifyLocal>
      },
    ]
  },
];
