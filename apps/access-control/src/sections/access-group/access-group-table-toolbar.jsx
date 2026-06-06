import { IoSearch } from "react-icons/io5";
import { usePopover } from 'minimal-shared';
import { IconifyLocal } from '@repo/ui/iconify-local';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Button, MenuItem, MenuList } from '@mui/material';

import { useTranslate } from 'src/locales';

import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function AccessGroupTableToolbar({ filters, onSearch, onSort, sort, sortOptions }) {
  const popover = usePopover();
  const { t } = useTranslate();
  const { t: t_device } = useTranslate('device');

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
         <Stack direction="row" alignItems="center" justifyContent='space-between' spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            value={filters.state.search}
            onChange={onSearch}
            placeholder={t('placeholders.search')}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyLocal><IoSearch sx={{ color: 'text.disabled' }} /></IconifyLocal>
                  </InputAdornment>
                )
              }
            }}
          />
        </Stack>
        <Stack direction="row" spacing={1} flexShrink={0}>
          <Button
            disableRipple
            color="inherit"
            onClick={popover.onOpen}
            endIcon={popover.open ? <IconifyLocal><IoIosArrowUp /> </IconifyLocal> : <IconifyLocal><IoIosArrowDown /></IconifyLocal>}
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
        </Stack>
       
      </Stack>
    </>
  );
}
