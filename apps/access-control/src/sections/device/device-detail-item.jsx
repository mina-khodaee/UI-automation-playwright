import { TbCancel } from "react-icons/tb";
import { BsCheckCircleFill } from "react-icons/bs";

import { Box, Divider, Grid, Typography } from "@mui/material";

import { fToNow } from "src/utils/format-time";

import { useTranslate } from "src/locales";
import { CONFIG } from "src/global-config";

import { Label } from "src/components/label";
import { Image } from 'src/components/image';

// ----------------------------------------------------------------------

export function DeviceDetailItem({ device }) {
    const { t } = useTranslate('device');
    const { currentLang } = useTranslate();
    return (
        <Grid container spacing={{ xs: 1, lg: 2 }}>
            <Grid size={{ xs: 12, md: 3, lg: 4 }}>
                <Image src={`${CONFIG.serverUrl}/${device.deviceType?.imageUrl}`}
                    onError={event => {
                        event.target.src = '/assets/images/mock/device/default-device1.png';
                        event.target.onerror = null;
                    }} alt={device.deviceType?.brand} sx={{ borderRadius: 2, overflow: 'hidden' }} />
            </Grid>
            <Grid size={{ xs: 12, md: 8, lg: 7 }}>
                <Box columnGap={2} display="flex" alignItems="center" justifyContent="start" sx={{ mb: 2 }}>
                    {device.isOnline ? (
                        <Label color="success">{t('filters.online')}</Label>
                    ) : (
                        <Label color="error">{t('filters.offline')}</Label>
                    )}
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                        {device.deviceType?.brand} / {device.deviceType?.model}
                    </Typography>
                    {device.isOnline && <Box component="span" display='flex' sx={{ typography: 'caption', alignContent: 'center', color: 'text.dark', justifyContent: 'flex-end' }}>
                        {t('formsInputs.uptime')}:{fToNow(device?.lastConnected) ?? '-'}
                    </Box>}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                    rowGap={3}
                    columnGap={1}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.terminalMacAddress')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.terminalMacAddress ?? '-'}
                        </Box>
                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.serialNumber')}/{t('formsInputs.terminalId')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.serialNumber ?? device.terminalId}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.terminalIP')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.terminalIP ?? '-'}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.terminalPort')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.terminalPort ?? '-'}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.terminalPassword')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.terminalPassword ?? '-'}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.trafficMode')}:</Box>
                        <Box sx={{ width: 140 }}>
                            <Box>
                                {device.trafficMode.displayValues?.[currentLang?.value] ?? device.trafficMode.value}
                            </Box>
                        </Box>
                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.usersLastSync')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device?.usersLastSync ?? '-'}
                        </Box>
                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.region')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.region?.name ?? '-'}
                        </Box>
                    </Box>
                </Box>
                <Box columnGap={1} display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                    sx={{ my: 3 }}
                >
                    <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.firmwareVersion')}:</Box>
                    <Box sx={{ width: 160 }}>
                        {device?.firmwareVersion}
                    </Box>
                </Box>
                <Divider sx={{ my: 2 }}>{t('button.networkSettings')}</Divider>
                <Box
                    rowGap={3}
                    columnGap={1}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.networkType')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.networkOptions?.networkType}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.serverIP')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.networkOptions?.serverIP}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.serverPort')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.networkOptions?.serverPort}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.subnet')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.networkOptions?.subnet ?? '-'}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.gateway')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.networkOptions?.gateway ?? '-'}
                        </Box>

                    </Box>
                </Box>
                <Divider sx={{ my: 2 }}>{t('button.securitySettings')}:</Divider>
                <Box
                    rowGap={3}
                    columnGap={1}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.authenticationMode')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.securityOptions?.authentication}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.accessLevel')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.securityOptions?.accessLevel ?? '-'}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.applicationMode')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.securityOptions?.application ?? '-'}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.antipassback')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.securityOptions?.antipassback ?? '-'}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.securityLevel_1To1')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.securityOptions?.securityLevel_1To1 ?? '-'}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.securityLevel_1ToN')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.securityOptions?.securityLevel_1ToN ?? '-'}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.inputIDType')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.securityOptions?.inputIDType ?? '-'}
                        </Box>

                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.inputIDLength')}:</Box>
                        <Box sx={{ width: 160 }}>
                            {device.securityOptions?.inputIDLength ?? '-'}
                        </Box>

                    </Box>
                </Box>
                <Divider sx={{ my: 2 }}>{t('button.interfaceSettings')}:</Divider>
                <Box
                    rowGap={3}
                    columnGap={1}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.sound')}:</Box>
                        <Box sx={{ width: 140 }}>
                            {device.interfaceOptions?.sound ?? ''}
                        </Box>
                    </Box>
                    <Box columnGap={1} display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.autoEnterKey')}:</Box>
                        <Box sx={{ width: 140 }}>
                            {device.interfaceOptions?.autoEnterKey ? (
                                <Box sx={{ color: 'success.main', fontSize: 20, alignItems: 'center' }}>
                                    <BsCheckCircleFill />
                                </Box>
                            ) : (
                                <Box sx={{ color: 'error.main', fontSize: 20, alignItems: 'center' }}>
                                    <TbCancel />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box columnGap={1} display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                    sx={{ my: 3 }}
                >
                    <Box sx={{ color: 'text.secondary' }}>{t('formsInputs.printText')}:</Box>
                    <Box sx={{ width: 160 }}>
                        {device.interfaceOptions?.printText ?? ''}
                    </Box>
                </Box>
                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {device.description}
                </Typography>
            </Grid>
        </Grid >
    )
}
