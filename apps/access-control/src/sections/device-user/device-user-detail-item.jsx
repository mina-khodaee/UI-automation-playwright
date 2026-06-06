import { useState } from "react";
import { TbCancel } from "react-icons/tb";
import { BsCheckCircleFill } from "react-icons/bs";
import { MdArrowBackIosNew } from "react-icons/md";

import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';
import { Box, Divider, Grid, Typography, TableContainer, Table, TableBody, TableCell, TableRow } from "@mui/material";

import { fDateTime } from "src/utils/format-time";

import { useTranslate } from "src/locales";

import { Label } from "src/components/label";
import { TableHeadCustom } from "src/components/table";

// ---------------------------------------------------------

export function DeviceUserDetailItem({ deviceUser }) {
    const { t, currentLang } = useTranslate('user');
    const [expanded, setExpanded] = useState('panel1');
    const FINGERPRINT_TABLE_HEAD = [
        { id: 'fingerId', label: t('formsInputs.fingerId'), align: 'center', width: 140 },
        { id: 'isDuressFinger', label: t('formsInputs.isDuressFinger'), align: 'center', width: 140 }
    ];
    const CARD_TABLE_HEAD = [
        { id: 'cardNumber', label: t('formsInputs.cardNumber'), align: 'center', width: 140 },
        { id: 'rfid', label: t('formsInputs.rfid'), align: 'center', width: 140 },
        { id: 'cardType', label: t('formsInputs.cardType'), align: 'center', width: 140 },
    ];
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const Accordion = styled((props) => (
        <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&::before': {
            display: 'none',
        },
    }));

    const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
        padding: theme.spacing(2),
        borderTop: '1px solid rgba(0, 0, 0, .125)',
    }));
    const AccordionSummary = styled((props) => (
        <MuiAccordionSummary
            expandIcon={<MdArrowBackIosNew sx={{ fontSize: '0.9rem' }} />}
            {...props}
        />
    ))(({ theme }) => ({
        flexDirection: 'row-reverse',
        [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
        {
            transform: 'rotate(-90deg)',
        },
        [`& .${accordionSummaryClasses.content}`]: {
            marginLeft: theme.spacing(1),
        },
        ...theme.applyStyles('dark', {
            backgroundColor: 'rgba(255, 255, 255, .05)',
        }),
    }));

    return (
        <Grid container spacing={{ xs: 1, lg: 2 }}>
            <Grid size={{ xs: 12, md: 11, lg: 12 }}>
                <Box columnGap={2} display="flex" alignItems="center" justifyContent="start" sx={{ mb: 3 }}>
                    {deviceUser?.isAdmin &&
                        <Label variant="soft" ratio="10" color='info'>
                            {t('formsInputs.isAdmin')}
                        </Label>}
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                        {deviceUser?.userName}
                    </Typography>
                    <Box sx={{ typography: 'caption', color: 'text.dark', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Box display='flex'>{t('formsInputs.createdAt')}: {fDateTime(deviceUser?.createdAt)}</Box>
                        <Box display='flex'>{t('formsInputs.lastUpdate')}: {fDateTime(deviceUser?.updatedAt) ?? '-'}</Box>
                    </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                    rowGap={4}
                    columnGap={1}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    }}
                    sx={{ whiteSpace: 'nowrap', mt: 4 }}
                >
                    <Box sx={{ width: 160 }}>
                        {t('formsInputs.userId')}: {deviceUser?.userID}
                    </Box>
                    {deviceUser?.uniqueID &&
                        <Box sx={{ width: 160 }}>
                            {t('formsInputs.uniqueId')}: {deviceUser?.uniqueID}
                        </Box>}
                    <Box sx={{ width: 160 }}>
                        {t('formsInputs.userName')}: {deviceUser?.userName}
                    </Box>
                    <Box sx={{ width: 160 }}>
                        {t('formsInputs.userType')}: {deviceUser?.userType.displayValues[currentLang?.value]}
                    </Box>
                    {/* <Box sx={{ width: 160 }}>
                            {t('formsInputs.authTypeConfig')}: {deviceUser?.authTypeConfig}
                        </Box> */}
                    {deviceUser?.applicationUser && <Box sx={{ width: 160 }}>
                        {t('formsInputs.applicationUserId')}: {deviceUser?.applicationUser.userName || deviceUser?.applicationUser.fullName}
                    </Box>}
                </Box>

                <Box sx={{ my: 4, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 3 }}>
                        {t('formsInputs.accessGroupIds')}:
                    </Typography>
                    {deviceUser?.aclUserAccessGroups.map((accessGroup) => (
                        <Box
                            key={accessGroup.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mr: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: 'black',
                                    marginRight: 1,
                                }}
                            />
                            <Typography variant="body2" color="text.primary">
                                {accessGroup.name}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Box>
                    {deviceUser?.authTypeConfig.isFingerprint && <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ maxWidth: 500 }}>
                        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                            <Typography component="span">{t('buttons.fingerprintSettings')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer sx={{ maxHeight: 300, maxWidth: 400 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHeadCustom
                                        headLabel={FINGERPRINT_TABLE_HEAD}
                                        rowCount={deviceUser.fingerPrints.length}
                                    />
                                    <TableBody>
                                        {deviceUser?.fingerPrints.map((row) => (
                                            <TableRow hover tabIndex={-1} key={row?.fingerID}>
                                                <TableCell sx={{ textAlign: 'center' }}>
                                                    {row?.fingerID}
                                                </TableCell>
                                                <TableCell sx={{ textAlign: 'center' }}>
                                                    {row?.isDuressFinger ? (
                                                        <Box sx={{ color: 'success.main', fontSize: 20, alignItems: 'center' }}>
                                                            <BsCheckCircleFill />
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ color: 'error.main', fontSize: 20, alignItems: 'center' }}>
                                                            <TbCancel />
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            </TableRow >
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>}
                    {deviceUser?.authTypeConfig.isCard && <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                            <Typography component="span">{t('buttons.cardSettings')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer sx={{ maxHeight: 300, maxWidth: 400 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHeadCustom
                                        headLabel={CARD_TABLE_HEAD}
                                    />
                                    <TableBody>
                                        {deviceUser?.cards.map((row) => (
                                            <TableRow hover tabIndex={-1} key={row.rfid}>
                                                <TableCell sx={{ textAlign: 'center' }}>
                                                    {row?.cardNumber}
                                                </TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                                    {row?.rfid}
                                                </TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                                    {row?.cardType}
                                                </TableCell>
                                            </TableRow >
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>}
                </Box>
            </Grid>
        </Grid>
    )
}