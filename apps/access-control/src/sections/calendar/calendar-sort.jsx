import { usePopover } from 'minimal-shared/hooks';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

import { useTranslate } from 'src/locales';

import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function CalendarSort({ sort, onSort, sortOptions }) {
  const popover = usePopover();
  const { t: t_device } = useTranslate('device');

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          popover.open ? <IoIosArrowUp /> : <IoIosArrowDown />
        }
        sx={{ fontWeight: 'fontWeightSemiBold' }}
      >
        {t_device('button.sortBy')}
        <Box
          component="span"
          sx={{ ml: 0.5, fontWeight: 'fontWeightBold', textTransform: 'capitalize' }}
        >
          {sort && t_device(`filters.${sort}`)}
        
        </Box>
      </Button>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === sort}
              onClick={() => {
                popover.onClose();
                onSort(option.value);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
