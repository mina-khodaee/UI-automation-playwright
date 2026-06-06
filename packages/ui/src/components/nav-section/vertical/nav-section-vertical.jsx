'use client';

import { useBoolean } from 'minimal-shared/hooks';
import { mergeClasses } from 'minimal-shared/utils';

import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useTranslate } from 'src/locales';

import { NavList } from './nav-list';
import { Nav, NavUl, NavLi, NavSubheader } from '../components';
import { navSectionClasses, navSectionCssVars } from '../styles';

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
  pathname,
  ...other
}) {
  const theme = useTheme();
  const { t } = useTranslate('navbar');

  const cssVars = { ...navSectionCssVars.vertical(theme), ...overridesVars };

  return (
    <Nav
      className={mergeClasses([navSectionClasses.vertical, className])}
      sx={[{ ...cssVars }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => {
          const groupTitle = group.subheader ?? group.title;
          const groupItems = group.items ?? group.children;
          const defaultOpen = group.defaultOpen ?? false;

          return (
            <Group
              key={groupTitle ?? groupItems[0]?.title}
              subheader={t(groupTitle)}
              items={groupItems}
              render={render}
              slotProps={slotProps}
              checkPermissions={checkPermissions}
              enabledRootRedirect={enabledRootRedirect}
              defaultOpen={defaultOpen}
              pathname={pathname}
            />
          );
        })}
      </NavUl>
    </Nav>
  );
}

// ----------------------------------------------------------------------

function Group({ items, render, subheader, slotProps, checkPermissions, enabledRootRedirect, defaultOpen, pathname }) {
  const groupOpen = useBoolean(defaultOpen ?? false);

  useEffect(() => {
    if (!defaultOpen && pathname) {
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
            {subheader}
          </NavSubheader>

          <Collapse in={groupOpen.value}>{renderContent()}</Collapse>
        </>
      ) : (
        renderContent()
      )}
    </NavLi>
  );
}