'use client';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

export function ToggleSwitchGroup({ value, onChange, options = [], height = 38 }) {
  const activeIndex = options.findIndex((o) => o.value === value);
  const widthPercent = 100 / options.length;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        minWidth: 'fit-content',
        height,
        borderRadius: 1,
        backgroundColor: 'grey.300',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 2,
          left: `calc(${activeIndex * widthPercent}% + 2px)`,
          width: `calc(${widthPercent}% - 4px)`,
          height: height - 6,
          borderRadius: 1,
          bgcolor: 'common.white',
          boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
          transition: 'all 0.25s ease',
        }}
      />
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, newValue) => {
          if (newValue !== null) onChange(newValue);
        }}
        sx={{
          height: '100%',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {options.map((opt) => (
          <ToggleButton
            key={opt.value}
            value={opt.value}
            disableRipple
            size="small"
            sx={{
              flex: 1,
              zIndex: 1,
              border: 'none',
              borderRadius: 1,
              fontSize: 12,
              whiteSpace: 'nowrap',
              px: 2,
              color: 'text.primary',
              bgcolor: 'transparent',
              '&.Mui-selected': {
                bgcolor: 'transparent',
                fontWeight: 600,
              },
            }}
          >
            {opt.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
