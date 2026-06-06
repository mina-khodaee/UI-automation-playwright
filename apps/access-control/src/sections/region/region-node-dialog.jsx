import { IoMdMore } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";
import { usePopover } from "minimal-shared/hooks";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, MenuList, Slide, Tooltip, Typography } from "@mui/material";

import { useTranslate } from "src/locales";

import { Label } from "src/components/label";
import { IconifyLocal } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

function Transition({ ref, ...other }) {
  return <Slide direction="up" ref={ref} {...other} />;
}
export function RegionNodeDialog({ open, onClose, onDelete, onEdit, node }) {
  const { t: t_common } = useTranslate();
  const { t: t_device } = useTranslate('device');

  const editPopover = usePopover();

  return (
    <Dialog open={open} onClose={onClose} fullWidth slots={{ transition: Transition }} maxWidth='sm'>
      <DialogTitle sx={{ position: "relative", textAlign: "center" }}>
        {node?.parent === null &&
          <Box
            sx={{
              position: "absolute",
              left: 22,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              gap: 1,
            }}
          >
            <Label color="success">{t_device('texts.rootRegion')}</Label>
          </Box>
        }
        {node?.name}
        <Box
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            gap: 1,
          }}
        >
          <IconButton
            color={editPopover.open ? 'inherit' : 'default'}
            onClick={editPopover.onOpen}
            sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
          >
            <Tooltip title={t_common('button.more')} arrow>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IoMdMore />
              </Box>
            </Tooltip>
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          rowGap={3}
          columnGap={1}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
          }}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {node?.parent !== null && (
            <Box columnGap={1} rowGap={3} display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <>
                <Box sx={{ color: 'text.secondary' }}>{t_device('formsInputs.parentId')}:</Box>
                <Box sx={{ width: 160 }}>
                  {node?.parent?.name}
                </Box>
              </>
            </Box>
          )}
          {node?.subRegions.length > 0 &&
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              flexWrap="wrap"
            >
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t_device('formsInputs.subRegions')}:
              </Typography>
            </Box>
          }
          {node?.subRegions.length > 0 && (node?.subRegions.map((region) => (
            <Box
              key={region.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'black',
                  marginRight: 1.5,
                }}
              />
              <Typography variant="body2" color="text.primary">
                {t_device('formsInputs.regionName')}: {region.name}
              </Typography>
            </Box>
          )))}

          {node?.devices?.length > 0 &&
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              flexWrap="wrap"
              sx={{ my: 1 }}
            >
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t_device('formsInputs.regionDevices')}:
              </Typography>
            </Box>
          }
          {node?.devices?.length > 0 && (node?.devices.map((device) => (
            <Box
              key={device.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: 0.5
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'black',
                  marginRight: 1.5,
                  mt: 0.5,
                }}
              />
              <Box
                sx={{
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  width: '100%',
                  maxWidth: '100%',
                  lineHeight: 1.5,
                }}
              >
                <Typography variant="body2" color="text.primary">
                  {t_device('formsInputs.deviceName')}: {device.deviceType.brand} / {device.deviceType.model}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {`${t_device('formsInputs.terminalId')} / ${t_device('formsInputs.serialNumber')}`}: {device?.serialNumber || device?.terminalId}
                </Typography>
              </Box>
            </Box>
          )))}
          <Box
            sx={{
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              width: '100%',
              maxWidth: '100%',
              lineHeight: 1.5,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {t_device('formsInputs.description')}:
            </Typography>
            <Typography variant="body1" color="text.primary">
              {node?.description ?? '-'}
            </Typography>
          </Box>

        </Box>
      </DialogContent>
      <CustomPopover
        open={editPopover.open}
        anchorEl={editPopover.anchorEl}
        onClose={editPopover.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              editPopover.onClose();
              onEdit();
            }}
          >
            <IconifyLocal ><BiSolidPencil size={18} /></IconifyLocal>
            {t_common('button.edit')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              editPopover.onClose();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <IconifyLocal ><MdDelete size={18} /></IconifyLocal>
            {t_common('button.delete')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
      <DialogActions>
        <Button onClick={onClose} color="error">
          {t_common('button.close')}
        </Button>
      </DialogActions>
    </Dialog >
  )
}