import { MdDashboard } from 'react-icons/md';
import { TbAppWindow } from 'react-icons/tb';
import { IoSettingsSharp } from 'react-icons/io5';

import { paths } from 'src/routes/paths';

export const _account = [
  {
    label: 'sidebar.dashboard',
    href: paths.dashboard.root,
    icon: <MdDashboard />,
  },
  {
    label: 'sidebar.accountManagement',
    href: paths.account.root,
    icon: <IoSettingsSharp />,
  },
  {
    label: 'sidebar.modules',
    href: '/home/',
    icon: <TbAppWindow />,
    external: true,
  },
];
