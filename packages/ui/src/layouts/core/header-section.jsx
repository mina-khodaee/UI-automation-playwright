'use client';

import { useScrollOffsetTop } from 'minimal-shared/hooks';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import AppBar from '@mui/material/AppBar';
import { styled, useColorScheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { layoutClasses } from './classes';
import { useSettingsContext } from '../../components/settings';
import { useEffect } from 'react';
import { primaryColorPresets } from '../../theme/with-settings';
import { grey } from '../../theme';

// ----------------------------------------------------------------------

export function HeaderSection({
  sx,
  slots,
  slotProps,
  className,
  disableOffset,
  disableElevation,
  layoutQuery = 'md',
  ...other
}) {
  const { offsetTop: isOffset } = useScrollOffsetTop();

  return (
    <HeaderRoot
      position="sticky"
      color="transparent"
      isOffset={isOffset}
      disableOffset={disableOffset}
      disableElevation={disableElevation}
      className={mergeClasses([layoutClasses.header, className])}
      sx={[
        (theme) => ({
          ...(isOffset && {
            '--color': `var(--offset-color, ${theme.vars.palette.text.primary})`,
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {slots?.topArea}

      <HeaderContainer layoutQuery={layoutQuery} {...slotProps?.container}>
        {slots?.leftArea}

        <HeaderCenterArea {...slotProps?.centerArea}>{slots?.centerArea}</HeaderCenterArea>

        {slots?.rightArea}
      </HeaderContainer>

      {slots?.bottomArea}
    </HeaderRoot>
  );
}

// ----------------------------------------------------------------------

const HeaderRoot = styled(AppBar, {
  shouldForwardProp: (prop) =>
    !['isOffset', 'disableOffset', 'disableElevation', 'sx'].includes(prop),
})(({ isOffset, disableOffset, disableElevation, theme }) => {
  const pauseZindex = { top: -1, bottom: -2 };

  const pauseStyles = {
    opacity: 0,
    content: '""',
    visibility: 'hidden',
    position: 'absolute',
    transition: theme.transitions.create(['opacity', 'visibility'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
  };

  const settings = useSettingsContext();

  const { mode, setMode, systemMode } = useColorScheme();

  useEffect(() => {
    if (mode === 'system' && systemMode) {
      settings.setState({ mode: systemMode });
    }
  }, [mode, systemMode]);

  const preset = settings?.state?.primaryColor || 'default';
  const presetColorLight = primaryColorPresets[preset]?.lighter || primaryColorPresets.default.main;
  const presetColorDark = primaryColorPresets[preset]?.darker || primaryColorPresets.default.lighter;



  const headerBackgroundStyles = '#0d1b2a'


  const bgStyles = {
    backgroundColor: headerBackgroundStyles,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: pauseZindex.top,
    transition: theme.transitions.create(['opacity', 'visibility'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
    opacity: 1,
    visibility: 'visible',
    content: '""',
  };

  const shadowStyles = {
    ...pauseStyles,
    left: 0,
    right: 0,
    bottom: 0,
    height: 24,
    margin: 'auto',
    borderRadius: '50%',
    width: `calc(100% - 48px)`,
    zIndex: pauseZindex.bottom,
    boxShadow: theme.vars.customShadows.z8,
    ...(isOffset && { opacity: 0.48, visibility: 'visible' }),
  };

  return {
    zIndex: 'var(--layout-header-zIndex)',
    backgroundColor: '#0d1b2a',
    ...(!disableOffset && { '&::before': bgStyles }),
    ...(!disableElevation && { '&::after': shadowStyles }),
  };
});

const HeaderContainer = styled(Container, {
  shouldForwardProp: (prop) => !['layoutQuery', 'sx'].includes(prop),
})(({ layoutQuery = 'md', theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: 'var(--color)',
  height: 'var(--layout-header-mobile-height)',
  [theme.breakpoints.up(layoutQuery)]: { height: 'var(--layout-header-desktop-height)' },
}));

const HeaderCenterArea = styled('div')(() => ({
  display: 'flex',
  flex: '1 1 auto',
  justifyContent: 'center',
}));
