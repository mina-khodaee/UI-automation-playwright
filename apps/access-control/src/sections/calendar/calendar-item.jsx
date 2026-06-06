import { IoEye } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import { usePopover } from 'minimal-shared';
import { BiSolidPencil } from "react-icons/bi";

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { WEEK_DAYS } from 'src/_mock';
import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function CalendarItem({ calendar, onEdit, onDelete, onView }) {
  const popover = usePopover();
  const { t: t_device } = useTranslate('device');
  const { t: t_common, currentLang } = useTranslate();

  return (
    <>
      <Card>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IoMdMore />
        </IconButton>
        {calendar?.isDefaultCalendar &&
          <Box sx={{ position: 'absolute', top: 14, right: 50 }}>
            <Label color="success">{t_device('formsInputs.isDefaultCalendar')}</Label>
          </Box>}

        <Stack sx={{ p: 2, pb: 2 }}>
          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link
                component={RouterLink}
                href={paths.dashboard.calendar.details(calendar.id)}
                color="inherit"
              >
                {calendar.name}
              </Link>
            }
            secondary={<>
              <Box sx={{ my: 1 }}>
                {`${t_device('formsInputs.createdAt')}: ${fDate(calendar.createdAt)}`}
              </Box>
              <Box sx={{ mt: 1 }}>
                {`${t_device('formsInputs.updatedAt')}: ${fDate(calendar.updatedAt)}`}
              </Box>
            </>}
            slotProps={{ primary: {typography: 'subtitle1'}, secondary: {mt: 1, component: 'span', typography: 'caption', color: 'text.disabled'} }}
          />

          <Box
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{
              typography: 'caption',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%', // Set an appropriate fixed width for the ellipsis
            }}
          >
            {t_device('formsInputs.description')} : {calendar.description}
          </Box>


        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
          {[
            {
              label: t_device('formsInputs.timeZone'),
              value: calendar.timeZone,
            },
            {
              label: t_device('formsInputs.weekStartDayIndex'),
              value: WEEK_DAYS.find((day) => day.index === calendar.firstDayIndex)?.label[currentLang.value],
            }
          ].map((item) => (
            <Stack
              key={item.label}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              <Typography variant="caption" noWrap>
                {item.label} : {item.value}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              onView();
            }}
          >
            <IoEye />
            {t_common('button.view')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              onEdit();
            }}
          >
            <BiSolidPencil />
            {t_common('button.edit')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <MdDelete />
            {t_common('button.delete')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
