import { cardClasses } from '@mui/material/Card';
import { setFont } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

export function applySettingsToComponents(settingsState) {
  const MuiCssBaseline = {
    styleOverrides: (theme) => ({
      html: {
        fontSize: settingsState?.fontSize,
        fontFamily: settingsState?.fontFamily
          ? setFont(settingsState.fontFamily)
          : theme.typography.fontFamily,
      },
      body: {
        [`& .${cardClasses.root}`]: {
          ...(settingsState?.contrast === 'high' && {
            '--card-shadow': theme.vars.customShadows.z1,
          }),
        },
      },
    }),
  };

  return {
    components: {
      MuiCssBaseline,
    },
  };
}