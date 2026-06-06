import { forwardRef } from 'react';
import { GiKeyring } from "react-icons/gi";
import { FaUsersCog } from "react-icons/fa";
import { MdTimelapse } from "react-icons/md";
import { TbDeviceImacSearch } from "react-icons/tb";

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

import { navSectionClasses } from 'src/components/nav-section/styles/classes';

import { useNavItem } from './hooks';
import { Iconify } from '../../iconify';
import { sharedStyles, stateClasses } from '../styles';
import { navItemStyles } from '../styles/nav-item-styles';



export const NavItem = forwardRef(
  (
    {
      path,
      icon,
      info,
      title,
      caption,
      open,
      depth,
      render,
      active,
      disabled,
      hasChild,
      slotProps,
      externalLink,
      enabledRootRedirect,
      ...other
    },
    ref
  ) => {
    const navItem = useNavItem({
      path,
      icon,
      info,
      depth,
      render,
      hasChild,
      externalLink,
      enabledRootRedirect,
    });
    const shouldForwardProp = (prop) =>
      !['open', 'active', 'disabled', 'variant', 'sx'].includes(prop);
    const ownerState = {
      open,
      active,
      disabled,
      variant: navItem.rootItem ? 'rootItem' : 'subItem',
    };



    const ItemArrow = styled(Iconify, { shouldForwardProp })(({ theme }) => ({
      ...navItemStyles.arrow(theme),
    }));


    let menuIcons;
    switch (title) {
      case ' مدیریت دستگاه‌ها':
        menuIcons = <TbDeviceImacSearch style={{ fontSize: 22 }} />;
        break;
      case 'مدیریت کاربران':
        menuIcons = <FaUsersCog style={{ fontSize: 22 }} />;
        break;
      case 'مدیریت زمانبندی دستگاه‌ها':
        menuIcons = <MdTimelapse style={{ fontSize: 22 }} />;
        break;
      case 'مدیریت کلیدهای API':
        menuIcons = <GiKeyring style={{ fontSize: 22 }} />;
        break;
        default:
          break;
    }

    return (
      <>
        {title && (
          <StyledNavItem
            ref={ref}
            aria-label={title}
            depth={depth}
            active={active}
            disabled={disabled}
            open={open && !active}
            title={title}
            sx={{
              ...slotProps?.sx,
              [`& .${navSectionClasses.item.icon}`]: slotProps?.icon,
              [`& .${navSectionClasses.item.texts}`]: slotProps?.texts,
              [`& .${navSectionClasses.item.title}`]: slotProps?.title,
              [`& .${navSectionClasses.item.caption}`]: slotProps?.caption,
              [`& .${navSectionClasses.item.info}`]: slotProps?.info,
              [`& .${navSectionClasses.item.arrow}`]: slotProps?.arrow,
            }}
            className={stateClasses({ open: open && !active, active, disabled })}
            {...navItem.baseProps}
            {...other}
          >
            {icon && (
              <Box component="span" className={navSectionClasses.item.icon}>
                {navItem.renderIcon}
              </Box>
            )}
            {title && (
              <Box component="span" className={navSectionClasses.item.texts}>
                <Box component="span" className={navSectionClasses.item.title}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: 1 }}
                  >
                    {menuIcons}
                    {title}
                  </Box>
                </Box>

                {caption && (
                  <Tooltip title={caption} placement="top-start">
                    <Box component="span" className={navSectionClasses.item.caption}>
                      {caption}
                    </Box>
                  </Tooltip>
                )}
              </Box>
            )}
            {info && (
              <Box component="span" className={navSectionClasses.item.info}>
                {navItem.renderInfo}
              </Box>
            )}
            {hasChild && (
              <ItemArrow
                {...ownerState}
                icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                className={navSectionClasses.item.arrow}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: open ? 'none' : 'rotate(180deg)',
                  transition: 'transform 0.3s ease',
                  ...slotProps?.arrow,
                }}
              />
            )}
          </StyledNavItem>
        )}
      </>
    );
  }
);

const StyledNavItem = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    prop !== 'active' && prop !== 'open' && prop !== 'disabled' && prop !== 'depth',
})(({ active, open, disabled, depth, theme, title }) => {
  const rootItem = depth === 1;

  const bulletSvg = `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23efefef' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E"`;
  const bulletStyles = {
    left: 0,
    content: '""',
    position: 'absolute',
    width: 'var(--nav-bullet-size)',
    height: 'var(--nav-bullet-size)',
    backgroundColor: 'var(--nav-bullet-light-color)',
    mask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
    WebkitMask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
    transform:
      theme.direction === 'rtl'
        ? 'translate(calc(var(--nav-bullet-size) * 1), calc(var(--nav-bullet-size) * -0.4)) scaleX(-1)'
        : 'translate(calc(var(--nav-bullet-size) * -1), calc(var(--nav-bullet-size) * -0.4))',
    ...theme.applyStyles('dark', {
      backgroundColor: 'var(--nav-bullet-dark-color)',
    }),
  };

  const highlightTitles = [
    ' مدیریت دستگاه‌ها',
    'مدیریت کاربران',
    'مدیریت زمانبندی دستگاه‌ها',
    'مدیریت کلیدهای API'
  ];
  const isHighlighted = highlightTitles.includes(title);
  const subItem = !rootItem;

  const baseStyles = {
    item: {
      width: '100%',
      paddingTop: 'var(--nav-item-pt)',
      paddingLeft: 'var(--nav-item-pl)',
      paddingRight: 'var(--nav-item-pr)',
      paddingBottom: 'var(--nav-item-pb)',
      borderRadius: 'var(--nav-item-radius)',
      color: 'var(--nav-item-color)',
      '&:hover': {
        backgroundColor: 'var(--nav-item-hover-bg)',
        color: 'var(--nav-item-color)',
      },
    },
    texts: { minWidth: 0, flex: '1 1 auto' },
    title: {
      ...sharedStyles.noWrap,
      ...theme.typography.body2,
      fontWeight: active ? theme.typography.fontWeightSemiBold : theme.typography.fontWeightMedium,
      color: 'var(--nav-item-color)',
    },
    caption: {
      ...sharedStyles.noWrap,
      ...theme.typography.caption,
      color: 'var(--nav-item-caption-color)',
    },
    icon: {
      ...sharedStyles.icon,
      width: 'var(--nav-icon-size)',
      height: 'var(--nav-icon-size)',
      margin: 'var(--nav-icon-margin)',
    },
    arrow: { ...sharedStyles.arrow },
    info: { ...sharedStyles.info },
  };

  return {
    ...(rootItem && {
      ...baseStyles.item,
      minHeight: 'var(--nav-item-root-height)',
      [`& .${navSectionClasses.item.icon}`]: { ...baseStyles.icon },
      [`& .${navSectionClasses.item.texts}`]: { ...baseStyles.texts },
      [`& .${navSectionClasses.item.title}`]: { ...baseStyles.title },
      [`& .${navSectionClasses.item.caption}`]: { ...baseStyles.caption },
      [`& .${navSectionClasses.item.arrow}`]: { ...baseStyles.arrow },
      [`& .${navSectionClasses.item.info}`]: { ...baseStyles.info },
      '&:hover': {
        backgroundColor: 'var(--nav-item-hover-bg)',
      },
      ...(active && {
        backgroundColor: 'var(--nav-item-root-active-bg)',
        color: isHighlighted && 'rgba(255, 255, 255, 0.25)',
        '&:hover': {
          backgroundColor: 'var(--nav-item-root-active-hover-bg)',
        },
      }),
      ...(open && {
        color: isHighlighted && 'var(--nav-item-color)',
        backgroundColor: 'var(--nav-item-root-open-bg)',
      }),
    }),
    ...(subItem && {
      ...baseStyles.item,
      minHeight: 'var(--nav-item-sub-height)',
      '&::before': bulletStyles,
      [`& .${navSectionClasses.item.icon}`]: { ...baseStyles.icon },
      [`& .${navSectionClasses.item.texts}`]: { ...baseStyles.texts },
      [`& .${navSectionClasses.item.title}`]: { ...baseStyles.title },
      [`& .${navSectionClasses.item.caption}`]: { ...baseStyles.caption },
      [`& .${navSectionClasses.item.arrow}`]: { ...baseStyles.arrow },
      [`& .${navSectionClasses.item.info}`]: { ...baseStyles.info },
      ...(active && {
        backgroundColor: 'var(--nav-item-sub-active-bg)',
        color: 'var(--nav-item-sub-active-color)',
      }),
      ...(open && {
        color: isHighlighted && 'var(--nav-item-sub-open-color)',
        backgroundColor: isHighlighted ? 'var(--nav-item-sub-open-bg)' : undefined,
      }),
    }),

    ...(disabled && sharedStyles.disabled),
  };
});
