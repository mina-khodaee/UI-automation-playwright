import { RiTodoLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { BsCalendarWeek } from "react-icons/bs";
import { MdCalendarMonth } from "react-icons/md";
import { usePopover } from 'minimal-shared/hooks';
import { MdArrowBackIosNew, MdArrowForwardIos, MdToday } from "react-icons/md";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useTranslate } from 'src/locales';
import { RTLLanguages } from 'src/locales/locales-config';

import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function CalendarToolbar({
  date,
  view,
  loading,
  onToday,
  onNextDate,
  onPrevDate,
  onChangeView,
}) {
  const { t } = useTranslate('device');
  const { currentLang } = useTranslate();
  const isRTL = RTLLanguages.includes(currentLang.value);
  const VIEW_OPTIONS = [
    { value: 'dayGridMonth', label: t('button.month'), icon: <MdCalendarMonth /> },
    { value: 'timeGridWeek', label: t('button.week'), icon: <BsCalendarWeek/> },
    { value: 'timeGridDay', label: t('button.day'), icon: <MdToday /> },
    { value: 'listWeek', label: t('button.listWeek'), icon: <RiTodoLine /> },
  ];
  const popover = usePopover();

  const selectedItem = VIEW_OPTIONS.filter((item) => item.value === view)[0];

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2.5, pr: 2, position: 'relative' }}
      >
        <Button
          size="small"
          color="inherit"
          onClick={popover.onOpen}
          startIcon={selectedItem.icon}
          endIcon={<IoIosArrowDown sx={{ ml: -0.5 }} />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          {selectedItem.label}
        </Button>

        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={onPrevDate}>
          {isRTL ? <MdArrowForwardIos/> : <MdArrowBackIosNew />}
          </IconButton>

          <Typography variant="h6">{date}</Typography>

          <IconButton onClick={onNextDate}>
            {isRTL ? <MdArrowBackIosNew/> : <MdArrowForwardIos/>}
          </IconButton>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Button size="small" color="error" variant="contained" onClick={onToday}>
            {t('button.today')}
          </Button>
        </Stack>

        {loading && (
          <LinearProgress
            color="inherit"
            sx={{
              left: 0,
              width: 1,
              height: 2,
              bottom: 0,
              borderRadius: 0,
              position: 'absolute',
            }}
          />
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-left' } }}
      >
        <MenuList>
          {VIEW_OPTIONS.map((viewOption) => (
            <MenuItem
              key={viewOption.value}
              selected={viewOption.value === view}
              onClick={() => {
                popover.onClose();
                onChangeView(viewOption.value);
              }}
            >
              {viewOption.icon}
              {viewOption.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
