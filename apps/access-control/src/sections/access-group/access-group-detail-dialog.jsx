
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Slide, Typography } from "@mui/material";

import { fDateTime } from "src/utils/format-time"

import { useTranslate } from "src/locales";
import { useGetAccessGroup } from "src/actions/access-group";

import { Label } from "src/components/label";

//------------------------------------------------------------------------

function Transition({ ref, ...other }) {
    return <Slide direction="up" ref={ref} {...other} />;
}
export function AccessGroupDetials({ open, onClose, accessGroupId }) {
    const { t: t_common } = useTranslate();
    const { t: t_device } = useTranslate('device');
    const { accessGroup } = useGetAccessGroup(accessGroupId);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth slots={{ transition: Transition }} maxWidth='sm'>
                <DialogTitle textAlign='center'>{t_common('button.details')}</DialogTitle>
                <DialogContent>
                    <Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            flexWrap="wrap"
                            sx={{ m: 1, gap: 1 }}
                        >
                            <Typography variant="h8">
                                {accessGroup?.name}
                            </Typography>
                            {accessGroup?.isDefault && (
                                <Label
                                    variant="soft"
                                    ratio="10"
                                    color="success"
                                    sx={{ flexShrink: 0 }}
                                >
                                    {t_device('formsInputs.defaultAccessGroup')}
                                </Label>
                            )}
                        </Box>
                        <Box>
                            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled', display: 'block' }}>
                                {`${t_common('formsInputs.createdDateTime')}: ${fDateTime(accessGroup?.createdAt)}`}
                            </Box>
                            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled', display: 'block' }}>
                                {`${t_common('formsInputs.lastUpdatedDateTime')}: ${fDateTime(accessGroup?.updatedAt)}`}
                            </Box>
                        </Box>
                    </Box>


                    <Divider sx={{ my: 3 }} />
                    <Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            flexWrap="wrap"
                            sx={{ mb: 1, gap: 1 }}
                        >
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                {t_device('formsInputs.calendar')}:
                            </Typography>
                            <Typography variant="body2">
                                {accessGroup?.aclCalendar?.name}
                            </Typography>
                        </Box>

                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            flexWrap="wrap"
                            sx={{ mb: 1, gap: 1 }}
                        >
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                {t_device('formsInputs.allowedAuthTypes')}:
                            </Typography>
                            <Typography variant="body2">
                                {accessGroup?.allowedAuthTypes?.isAndOperation
                                    ? `(${t_device('formsInputs.authTypeAndOperation')})`
                                    : `(${t_device('formsInputs.authTypeOrOperation')})`}
                            </Typography>
                        </Box>
                        <Box gridColumn="span 2" sx={{ mt: 1 }}>
                            {Object.entries(accessGroup?.allowedAuthTypes || {})
                                .filter(([key, value]) => key !== 'isAndOperation' && value === true)
                                .map(([key]) => (
                                    <Box
                                        key={key}
                                        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
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
                                            {t_device(`formsInputs.${key}`)}
                                        </Typography>
                                    </Box>
                                ))}
                        </Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            flexWrap="wrap"
                            sx={{ my: 1, gap: 1 }}
                        >
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                {t_device('formsInputs.devices')}:
                            </Typography>
                        </Box>
                        {accessGroup?.devices?.length > 0 ? (
                            accessGroup?.devices?.map((device) => (
                                <Box
                                    key={device.id}
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
                                    {device.terminalId && (<Typography variant="body2" color="text.primary">
                                        {t_device('formsInputs.terminalId')}: {device.terminalId}
                                    </Typography>)}
                                    {device.serialNumber && (
                                        <>
                                            <Typography
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {t_device('formsInputs.serialNumber')}: {device.serialNumber}
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2">
                                {t_device('texts.noDeviceInAccessGroup')}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error">
                        {t_common('button.close')}
                    </Button>
                </DialogActions>
            </Dialog >

        </>
    )
}
