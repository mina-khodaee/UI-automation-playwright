'use client'

// ----------------------------------------------------------------------

export function dashboardLayoutVars(theme) {
  return {
    '--layout-transition-easing': 'linear',
    '--layout-transition-duration': '120ms',
    '--layout-nav-mini-width': '88px',
    '--layout-nav-vertical-width': '300px',
    '--layout-nav-horizontal-height': '64px',
    '--layout-dashboard-content-pt': theme.spacing(1),
    '--layout-dashboard-content-pb': theme.spacing(8),
    '--layout-dashboard-content-px': theme.spacing(5),
  };
}

// ----------------------------------------------------------------------

export function dashboardNavColorVars(theme) {
  const {
    vars: { palette },
  } = theme;

  return {
    layout: {
      '--layout-nav-bg': '#0d1b2a',
      '--layout-nav-horizontal-bg': '#0d1b2a',
      '--layout-nav-border-color': 'transparent',
      '--layout-nav-text-primary-color': palette.common.white,
      '--layout-nav-text-secondary-color': palette.grey[500],
      '--layout-nav-text-disabled-color': palette.grey[600],
    },
    section: {
      '--nav-item-caption-color': palette.common.white,
      '--nav-subheader-color': palette.common.white,
      '--nav-subheader-hover-color': palette.common.white,
      '--nav-item-color': palette.common.white,
      '--nav-item-root-active-color': palette.primary.light,
      '--nav-item-root-open-color': palette.common.white,
      '--nav-bullet-light-color': 'white',
      '--nav-item-sub-active-color': palette.common.white,
      '--nav-item-sub-open-color': palette.common.white,
    },
  };
}
