import { themeConfig } from '@repo/ui/theme';
import { useEffect, useCallback } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";
import { IconifyLocal } from '@repo/ui/iconify-local';
import { hasKeys, varAlpha } from 'minimal-shared/utils';
import { primaryColorPresets } from '@repo/ui/theme-with-settings';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

import { useTranslate } from 'src/locales';

import { settingIcons } from './icons';
import { BaseOption } from './base-option';
import { Scrollbar } from '../../scrollbar';
import { SmallBlock, LargeBlock } from './styles';
import { PresetsOptions } from './presets-options';
import { FullScreenButton } from './fullscreen-button';
import { FontSizeOptions, FontFamilyOptions } from './font-options';
import { useSettingsContext } from '../context/use-settings-context';
import { NavColorOptions, NavLayoutOptions } from './nav-layout-option';

// ----------------------------------------------------------------------

export function SettingsDrawer({ sx, defaultSettings }) {
  const settings = useSettingsContext();
  const { t } = useTranslate('navbar');

  const { mode, setMode, systemMode } = useColorScheme();

  useEffect(() => {
    if (mode === 'system' && systemMode) {
      settings.setState({ colorScheme: systemMode });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, systemMode]);

  // Visible options by default settings
  const isFontFamilyVisible = hasKeys(defaultSettings, ['fontFamily']);
  const isCompactLayoutVisible = hasKeys(defaultSettings, ['compactLayout']);
  const isDirectionVisible = hasKeys(defaultSettings, ['direction']);
  const isColorSchemeVisible = hasKeys(defaultSettings, ['colorScheme']);
  const isContrastVisible = hasKeys(defaultSettings, ['contrast']);
  const isNavColorVisible = hasKeys(defaultSettings, ['navColor']);
  const isNavLayoutVisible = hasKeys(defaultSettings, ['navLayout']);
  const isPrimaryColorVisible = hasKeys(defaultSettings, ['primaryColor']);
  const isFontSizeVisible = hasKeys(defaultSettings, ['fontSize']);

  const handleReset = useCallback(() => {
    settings.onReset();
    setMode(defaultSettings.colorScheme);
  }, [defaultSettings.colorScheme, setMode, settings]);

  const renderHead = () => (
    <Box
      sx={{
        py: 2,
        pr: 1,
        pl: 2.5,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {t('sidebar.settings')}
      </Typography>

      <FullScreenButton />

      <Tooltip title={t('sidebar.resetAll')}>
        <IconButton onClick={handleReset}>
          <Badge color="error" variant="dot" invisible={!settings.canReset}>
            <IconifyLocal>
              <VscDebugRestart />
            </IconifyLocal>
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title={t('sidebar.close')}>
        <IconButton onClick={settings.onCloseDrawer}>
          <IconifyLocal><IoCloseOutline /></IconifyLocal>
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderMode = () => (
    <BaseOption
      label={t('sidebar.darkMode')}
      selected={settings.state.colorScheme === 'dark'}
      icon={<SvgIcon>{settingIcons.moon}</SvgIcon>}
      onChangeOption={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
        settings.setState({ colorScheme: mode === 'light' ? 'dark' : 'light' });
      }}
    />
  );

  const renderContrast = () => (
    <BaseOption
      label={t('sidebar.contrast')}
      selected={settings.state.contrast === 'high'}
      icon={<SvgIcon>{settingIcons.contrast}</SvgIcon>}
      onChangeOption={() =>
        settings.setState({
          contrast: settings.state.contrast === 'default' ? 'high' : 'default',
        })
      }
    />
  );

  const renderRtl = () => (
    <BaseOption
      label={t('sidebar.RTL')}
      selected={settings.state.direction === 'rtl'}
      icon={<SvgIcon>{settingIcons.alignRight}</SvgIcon>}
      onChangeOption={() =>
        settings.setState({
          direction: settings.state.direction === 'ltr' ? 'rtl' : 'ltr',
        })
      }
    />
  );

  const renderCompact = () => (
    <BaseOption
      tooltip={t('sidebar.compactTooltip')}
      label={t('sidebar.compact')}
      selected={!!settings.state.compactLayout}
      icon={<SvgIcon>{settingIcons.autofitWidth}</SvgIcon>}
      onChangeOption={() => settings.setState({ compactLayout: !settings.state.compactLayout })}
    />
  );

  const renderPresets = () => (
    <LargeBlock
      title={t('sidebar.presets')}
      canReset={settings.state.primaryColor !== defaultSettings.primaryColor}
      onReset={() => settings.setState({ primaryColor: defaultSettings.primaryColor })}
    >
      <PresetsOptions
        icon={<SvgIcon sx={{ width: 28, height: 28 }}>{settingIcons.siderbarDuotone}</SvgIcon>}
        options={Object.keys(primaryColorPresets).map((key) => ({
          name: key,
          value: primaryColorPresets[key].main,
        }))}
        value={settings.state.primaryColor}
        onChangeOption={(newOption) => settings.setState({ primaryColor: newOption })}
      />
    </LargeBlock>
  );

  const renderNav = () => (
    <LargeBlock title={t('sidebar.nav')} tooltip={t('sidebar.dashboardOnly')} sx={{ gap: 2.5 }}>
      {isNavLayoutVisible && (
        <SmallBlock
          label={t('sidebar.layout')}
          canReset={settings.state.navLayout !== defaultSettings.navLayout}
          onReset={() => settings.setState({ navLayout: defaultSettings.navLayout })}
        >
          <NavLayoutOptions
            value={settings.state.navLayout}
            onChangeOption={(newOption) => settings.setState({ navLayout: newOption })}
            options={[
              {
                value: 'vertical',
                icon: (
                  <SvgIcon sx={{ width: 1, height: 'auto' }}>{settingIcons.navVertical}</SvgIcon>
                ),
              },
              {
                value: 'horizontal',
                icon: (
                  <SvgIcon sx={{ width: 1, height: 'auto' }}>{settingIcons.navHorizontal}</SvgIcon>
                ),
              },
              {
                value: 'mini',
                icon: <SvgIcon sx={{ width: 1, height: 'auto' }}>{settingIcons.navMini}</SvgIcon>,
              },
            ]}
          />
        </SmallBlock>
      )}
      {isNavColorVisible && (
        <SmallBlock
          label={t('sidebar.color')}
          canReset={settings.state.navColor !== defaultSettings.navColor}
          onReset={() => settings.setState({ navColor: defaultSettings.navColor })}
        >
          <NavColorOptions
            value={settings.state.navColor}
            onChangeOption={(newOption) => settings.setState({ navColor: newOption })}
            options={[
              {
                label: t('sidebar.integrate'),
                value: 'integrate',
                icon: <SvgIcon>{settingIcons.sidebarOutline}</SvgIcon>,
              },
              {
                label: t('sidebar.apparent'),
                value: 'apparent',
                icon: <SvgIcon>{settingIcons.sidebarFill}</SvgIcon>,
              },
              {
                label: t('sidebar.theme'),
                value: 'theme',
                icon: <SvgIcon>{settingIcons.siderbarDuotone}</SvgIcon>,
              },
            ]}
          />
        </SmallBlock>
      )}
    </LargeBlock>
  );

  const renderFont = () => (
    <LargeBlock title={t('sidebar.font')} sx={{ gap: 2.5 }}>
      {isFontFamilyVisible && (
        <SmallBlock
          label={t('sidebar.family')}
          canReset={settings.state.fontFamily !== defaultSettings.fontFamily}
          onReset={() => settings.setState({ fontFamily: defaultSettings.fontFamily })}
        >
          <FontFamilyOptions
            value={settings.state.fontFamily}
            onChangeOption={(newOption) => settings.setState({ fontFamily: newOption })}
            options={[
              themeConfig.fontFamily.primary,
              'Inter Variable',
              'DM Sans Variable',
              'Nunito Sans Variable',
            ]}
            icon={<SvgIcon sx={{ width: 28, height: 28 }}>{settingIcons.font}</SvgIcon>}
          />
        </SmallBlock>
      )}
      {isFontSizeVisible && (
        <SmallBlock
          label={t('sidebar.size')}
          canReset={settings.state.fontSize !== defaultSettings.fontSize}
          onReset={() => settings.setState({ fontSize: defaultSettings.fontSize })}
          sx={{ gap: 5 }}
        >
          <FontSizeOptions
            options={[12, 20]}
            value={settings.state.fontSize}
            onChangeOption={(newOption) => settings.setState({ fontSize: newOption })}
          />
        </SmallBlock>
      )}
    </LargeBlock>
  );

  return (
    <Drawer
      anchor="right"
      open={settings.openDrawer}
      onClose={settings.onCloseDrawer}
      ModalProps={{
        keepMounted: true,
        disableScrollLock: true,
      }}
      slotProps={{
        backdrop: { invisible: true },
        paper: {
          sx: [
            (theme) => ({
              ...theme.mixins.paperStyles(theme, {
                color: varAlpha(theme.vars.palette.background.defaultChannel, 0.9),
              }),
              width: 360,
            }),
            ...(Array.isArray(sx) ? sx : [sx]),
          ],
        },
      }}
    >
      {renderHead()}

      <Scrollbar>
        <Box
          sx={{
            pb: 5,
            gap: 6,
            px: 2.5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              gap: 2,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {isColorSchemeVisible && renderMode()}
            {isContrastVisible && renderContrast()}
            {isDirectionVisible && renderRtl()}
            {isCompactLayoutVisible && renderCompact()}
          </Box>

          {(isNavColorVisible || isNavLayoutVisible) && renderNav()}
          {isPrimaryColorVisible && renderPresets()}
          {(isFontFamilyVisible || isFontSizeVisible) && renderFont()}
        </Box>
      </Scrollbar>
    </Drawer>
  );
}
