// 'use client';

// import { mergeClasses } from 'minimal-shared/utils';

// import { styled } from '@mui/material/styles';

// import { layoutClasses } from './classes';

// // ----------------------------------------------------------------------

// export function MainSection({ children, className, sx, ...other }) {
//   return (
//     <MainRoot className={mergeClasses([layoutClasses.main, className])} sx={sx} {...other}>
//       {children}
//     </MainRoot>
//   );
// }

// // ----------------------------------------------------------------------

// const MainRoot = styled('main')({
//   display: 'flex',
//   flex: '1 1 auto',
//   flexDirection: 'column',
// });

'use client';

import { mergeClasses } from 'minimal-shared/utils';
import { styled } from '@mui/material/styles';
import { layoutClasses } from '../core/classes';
import { useEffect } from 'react';
import { useSettingsContext } from '../../components/settings/context/use-settings-context';
import { useColorScheme } from '@mui/material/styles';
import { grey } from '../../theme';
// ---------------------------------------------------------------------
export function MainSection({ children, className, sx, ...other }) {

  const settings = useSettingsContext();

  const { mode, setMode, systemMode } = useColorScheme();

  useEffect(() => {
    if (mode === 'system' && systemMode) {
      settings.setState({ mode: systemMode });
    }
  }, [mode, systemMode]);


  const backgroundColor =
    settings?.state?.mode === 'light' ? grey[200] : grey[750];
  return (
    <MainRoot className={mergeClasses([layoutClasses.main, className])} bgcolor={backgroundColor} sx={sx}{...other}>
      {children}
    </MainRoot>

  );
}
// ----------------------------------------------------------------------
const MainRoot = styled('main')(({ theme, bgcolor }) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  backgroundColor: bgcolor,
}));
