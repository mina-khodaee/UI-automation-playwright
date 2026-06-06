import { useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { mergeClasses } from 'minimal-shared/utils';

import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';

import { usePathname } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { NavList } from './nav-list';
import { Nav, NavUl, NavLi, NavSubheader } from '../components';
import { navSectionClasses, navSectionCssVars } from '../styles/index';


// ----------------------------------------------------------------------

export function NavSectionVertical({
  sx,
  data,
  render,
  className,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
  cssVars: overridesVars,
  ...other
}) {
  const theme = useTheme();
  const cssVars = { ...navSectionCssVars.vertical(theme), ...overridesVars };

  return (
    <Nav
      className={mergeClasses([navSectionClasses.vertical, className])}
      sx={[{ ...cssVars }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => {
          const groupItems = group.items ?? group.children;
          const defaultOpen = group.defaultOpen ?? false;

          return (
            <Group
              key={group.subheader ?? groupItems[0]?.title}
              subheader={group.subheader}
              items={groupItems}
              render={render}
              slotProps={slotProps}
              checkPermissions={checkPermissions}
              enabledRootRedirect={enabledRootRedirect}
              defaultOpen={defaultOpen}
            />
          );
        })}
      </NavUl>
    </Nav>
  );
}

// ----------------------------------------------------------------------

function Group({ items, render, subheader, slotProps, checkPermissions, enabledRootRedirect, defaultOpen }) {
  const pathname = usePathname();
  const groupOpen = useBoolean(defaultOpen ?? false);
  const { t } = useTranslate('navbar');

  useEffect(() => {
    if (!defaultOpen) {
      const checkActive = (list) =>
        list?.some((item) => {
          if (item.path && pathname.startsWith(item.path)) return true;
          if (item.children) return checkActive(item.children);
          return false;
        });

      if (checkActive(items)) {
        groupOpen.onTrue();
      } else {
        groupOpen.onFalse();
      }
    }
  }, [pathname, items, defaultOpen]);

  const renderContent = () => (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {items?.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={1}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );

  return (
    <NavLi>
      {subheader ? (
        <>
          <NavSubheader
            data-title={subheader}
            open={groupOpen.value}
            onClick={groupOpen.onToggle}
            sx={{
              ...slotProps?.subheader,
              fontSize: '0.85rem',
              fontWeight: 'bold',
              '& .MuiListSubheader-icon': {
                fontSize: '1rem',
              },
            }}
          >
            {t(subheader)}
          </NavSubheader>

          <Collapse in={groupOpen.value}>{renderContent()}</Collapse>
        </>
      ) : (
        renderContent()
      )}
    </NavLi>
  );
}