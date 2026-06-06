import { useState } from 'react';
import { useTabs } from 'minimal-shared';

import { Tab, Tabs, Card, Box, Button, DialogActions, DialogContent, DialogTitle, Dialog } from '@mui/material';

import { WEEK_DAYS } from 'src/_mock';
import { useTranslate } from 'src/locales';

import { CalendarShiftForm } from './calendar-shift-form';

// ----------------------------------------------------------------------


export function CalendarWorkDays({ open, onClose, workDays }) {
    const { t: t_device } = useTranslate('device');
    const { t: t_common, currentLang } = useTranslate();
    const TABS = [
        ...(Array.isArray(WEEK_DAYS) ? WEEK_DAYS : []).map((weekDay) => ({
            value: weekDay.value,
            index: weekDay.index,
            label: weekDay.label[currentLang.value] || '',
        })),
        { value: 7, label: '' }
    ];
    const tabs = useTabs(7);
    const isTabDisabled = (value) => !workDays.some((workDay) => workDay.value === value);
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle textAlign='center'>{t_device('formsInputs.workDays')}</DialogTitle>
            <DialogContent>
                <Box
                    display="flex"
                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                    sx={{
                        width: 1,
                        px: { md: 3 },
                        bgcolor: 'background.paper',
                    }}
                >
                    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ width: 1 }}>
                        {TABS?.map((tab) => (
                            <Tab key={tab.value} value={tab.value} label={tab.label} disabled={isTabDisabled(tab.value)}
                                sx={{
                                    display: tab.value === 7 ? 'none' : 'block',
                                    minHeight: 48,
                                    minWidth: 0.098,
                                    fontSize: '1rem',
                                    p: 1,
                                }} />
                        ))}
                    </Tabs>
                </Box>
                {typeof tabs.value === "string" && <CalendarShiftForm dayOfWeek={tabs.value} dayIndex={TABS.find((tab) => tab.value === tabs.value).index} />}

            </DialogContent>
            <DialogActions >
                <Button onClick={onClose} color="error"  >
                    {t_common('button.close')}
                </Button>
            </DialogActions>
        </Dialog>

    );
}

