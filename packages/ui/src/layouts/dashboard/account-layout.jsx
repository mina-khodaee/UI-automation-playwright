'use client';

import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import { useColorScheme, useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';

import { allLangs } from 'src/locales';

import { useSettingsContext } from '../../components/settings';

import { NavMobile } from './nav-mobile';
import { layoutClasses } from '../core/classes';
import { _account } from '../nav-config-account';
import { MainSection } from '../core/main-section';
import { Searchbar } from '../components/searchbar';
import { MenuButton } from '../components/menu-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { LanguagePopover } from '../components/language-popover';
import { navData as dashboardNavData } from '../nav-config-dashboard';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';

// ----------------------------------------------------------------------

export function AccountLayout({ sx, cssVars, children, slotProps, layoutQuery = 'lg' }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { mode, setMode, systemMode } = useColorScheme();

  useEffect(() => {
    if (mode === 'system' && systemMode) {
      settings.setState({ colorScheme: systemMode });
    }
  }, [mode, systemMode]);

  const navVars = dashboardNavColorVars(theme);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const navData = slotProps?.nav?.data ?? dashboardNavData;
  const accountData = slotProps?.account?.data ?? _account;

  const isNavVertical = settings.state.navLayout === 'vertical' || settings.state.navLayout === 'mini';

  const rightAreaBackgroundStyles = '#0d1b2a';

  const rightAreaBorderStyles = '1px solid #000000';

  const renderHeader = () => {
    const headerSlotProps = {
      container: {
        maxWidth: false,
        sx: {
          ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
          ...(settings.state.navLayout === 'horizontal' && {
            bgcolor: 'var(--layout-nav-bg)',
            height: { [layoutQuery]: 'var(--layout-nav-horizontal-height)' },
            [`& .${iconButtonClasses.root}`]: { color: 'var(--layout-nav-text-secondary-color)' },
          }),
        },
      },
    };

    const headerSlots = {
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          <NavMobile data={navData} open={open} onClose={onClose} cssVars={navVars.section} />
        </>
      ),
      rightArea: (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0, sm: 0.75 },
            border: rightAreaBorderStyles,
            borderRadius: '10px',
            backgroundColor: rightAreaBackgroundStyles,
            px: 1.5,
            py: 1,
          }}
        >
          {/** @slot Searchbar */}
          <Searchbar data={navData} />

          {/** @slot Language popover */}
          <LanguagePopover data={allLangs} />

          {/** @slot Settings button */}
          <SettingsButton />

          {/** @slot Account drawer */}
          <AccountDrawer data={accountData} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableElevation
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
