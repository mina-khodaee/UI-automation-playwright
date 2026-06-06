import { IoSettingsSharp } from 'react-icons/io5';
import { TbAppWindow } from 'react-icons/tb';

import { paths } from 'src/routes/paths';

export const _account = [
  {
    label: 'sidebar.accountManagement',
    href: paths.home.root,
    icon: <IoSettingsSharp />,
  },
  {
    label: 'sidebar.modules',
    href: '/home/',
    icon: <TbAppWindow />,
    external: true,
  },
];
