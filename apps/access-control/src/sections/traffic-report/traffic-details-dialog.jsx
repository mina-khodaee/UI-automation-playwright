
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid } from "@mui/material";

import { fDate, fTime } from "src/utils/format-time"

import { useTranslate } from "src/locales";

import { Label } from "src/components/label";

// -------------------------------------------------------------------

export function TrafficDetials({ open, onClose, details }) {
    const { t: t_common, currentLang } = useTranslate();
    const { t: t_report } = useTranslate('report');
    const { t: t_user } = useTranslate('user');
    return (

        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle textAlign='center'>{t_report('button.details')}</DialogTitle>
            <DialogContent>
                <Grid container spacing={{ xs: 2, md: 4, lg: 6 }}>
                    <Grid size={{ xs: 12 }}>
                        <Box columnGap={2} display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Label variant="soft" ratio="10" color={(details?.isAuthorized === true ? 'success' : 'error')} >
                                {details?.isAuthorized ? t_report('columns.authorized') : t_report('columns.unauthorized')}
                            </Label>
                            <Box sx={{ mt: 2 }}>
                                <Box display='flex' component="span" sx={{ typography: 'caption', alignContent: 'center', color: 'text.disabled' }}>
                                    {fTime(details?.dateTime, true)} - {fDate(details?.dateTime, true)}
                                </Box>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 3 }} />
                        <Box
                            rowGap={4}
                            columnGap={1}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                md: 'repeat(2, 1fr)',
                            }}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            <Box columnGap={2} display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <Box sx={{ color: 'text.secondary' }}>{t_report('columns.userName')}:</Box>
                                <Box sx={{ width: 160 }}>
                                    {details?.aclUser?.userName}
                                </Box>
                            </Box>
                            <Box columnGap={2} display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <Box sx={{ color: 'text.secondary' }}>{t_report('columns.userType')}:</Box>
                                <Box sx={{ width: 160 }}>
                                    {details?.aclUser?.userType?.displayValues?.[currentLang?.value] ?? details?.aclUser?.userType?.value ?? '-'}
                                </Box>
                            </Box>
                            <Box columnGap={1} display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <Box sx={{ color: 'text.secondary' }}>{t_user('formsInputs.userId')}:</Box>
                                <Box sx={{ width: 180 }}>
                                    {details?.aclUser?.aclUserId}
                                </Box>

                            </Box>

                            <Box columnGap={2} display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <Box sx={{ color: 'text.secondary' }}>{t_report('columns.trafficMode')}:</Box>
                                <Box sx={{ width: 160 }}>
                                    {details?.trafficMode?.displayValues?.[currentLang?.value] ?? details?.trafficMode?.value}
                                </Box>

                            </Box>

                            <Box columnGap={1} display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <Box sx={{ color: 'text.secondary' }}>{t_report('columns.tagId')}:</Box>
                                <Box sx={{ width: 180 }}>
                                    {details?.tagId}
                                </Box>

                            </Box>
                            <Box columnGap={1} display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <Box sx={{ color: 'text.secondary' }}>{t_report('columns.site')}:</Box>
                                <Box sx={{ width: 180 }}>
                                    {details?.site?.name}
                                </Box>

                            </Box>
                            <Box columnGap={2} display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <Box sx={{ color: 'text.secondary' }}>{t_report('columns.door')}:</Box>
                                <Box sx={{ width: 160 }}>
                                    {details?.door?.doorName}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid >
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    {t_common('button.close')}
                </Button>
            </DialogActions>
        </Dialog >
    )
}
