import { z as zod } from 'zod';
import { useMemo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Autocomplete, Button, FormControlLabel, Grid, Switch, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { WEEK_DAYS } from 'src/_mock';
import { useTranslate } from 'src/locales';
import { RTLLanguages } from 'src/locales/locales-config';
import { useCalendarStore } from 'src/stores/calendar-store';
import { CreateCalendar, UpdateCalendar, useGetCalendar, useGetCalendars } from 'src/actions/calendar';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { CalendarWorkDays } from './calendar-work-days-dialog';
import { CalendarHolidaysForm } from './calendar-holiday-form-dialog';

// ----------------------------------------------------------------------

export function CalendarNewEditForm({ currentCalendar }) {
    const { resetWeekDays, setHolidays, resetHolidays, setWeekDays, weekDays, holidays } = useCalendarStore();
    const { mutate: getCalendarsMutate } = useGetCalendars();
    const { mutate: getCalendarMutate } = useGetCalendar(currentCalendar?.id);

    const router = useRouter();
    const { t: t_device } = useTranslate('device');
    const { currentLang } = useTranslate();
    const [selectedWorkDays, setSelectedWorkDays] = useState([]);
    const [openShiftDialog, setOpenShiftDialog] = useState(false);
    const [openHolidaysDialog, setOpenHolidaysDialog] = useState(false);
    const NewCalendarSchema = zod.object({
        description: zod.string().nullable().transform(value => value === "" ? null : value),
        name: zod.string().min(1, { message: t_device('formValidationErrors.calendarName.required') }),
        isDefaultCalendar: zod.boolean(),
        firstDayIndex: zod
            .coerce.number().min(0, { message: t_device('formValidationErrors.weekStartDayIndex.required') }).transform(value => value === "" ? null : value)
    });
    const defaultValues = useMemo(
        () => ({
            description: currentCalendar?.description || '',
            name: currentCalendar?.name || '',
            isDefaultCalendar: currentCalendar?.isDefaultCalendar || false,
            firstDayIndex: currentCalendar?.firstDayIndex ?? '',
        }),
        [currentCalendar]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewCalendarSchema),
        defaultValues,
    });
    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const values = watch();

    useEffect(() => {
        if (currentCalendar) {
            setWeekDays(currentCalendar.weekDays);
            setHolidays(currentCalendar.holidays || []);
            const workDays = currentCalendar.weekDays
                .filter(weekDay => weekDay.isWorkDay)
                .map((day) => WEEK_DAYS.find((option) => option.value === day.dayOfWeek));
            setSelectedWorkDays(workDays);
            methods.setValue('workDays', workDays.map((item) => item.value));
            reset(defaultValues);
        }

        return () => {
            resetWeekDays();
            resetHolidays();
        };
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentCalendar, setWeekDays, reset, defaultValues]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const hasConflict = selectedWorkDays.map((workDay) =>
                weekDays.some(
                    (weekDay) => weekDay.dayOfWeek === workDay.value && !weekDay.isWorkDay
                )
            );
            if (hasConflict.includes(true)) {
                toast.error(t_device('formValidationErrors.shift.required'));
                return;
            }
            const updatedWeekDays = weekDays.map((day) => {
                if (selectedWorkDays.some((workDay) => workDay.value === day.dayOfWeek)) {
                    // If the day is in selectedWorkDays, mark it as a work day
                    return {
                        ...day,
                        isWorkDay: true,
                    };
                } else {
                    // If not in selectedWorkDays, reset it
                    return {
                        ...day,
                        isWorkDay: false,
                        shifts: [],
                    };
                }
            });

            if (currentCalendar) {
                await UpdateCalendar({ ...data, id: currentCalendar?.id, weekDays: updatedWeekDays, holidays });
                await getCalendarMutate();
            } else {
                await CreateCalendar({ ...data, weekDays: updatedWeekDays, holidays });
            }
            await getCalendarsMutate();
            resetWeekDays();
            toast.success(currentCalendar ? t_device('toastMessages.updateCalendar') : t_device('toastMessages.createCalendar'));
            router.push(paths.dashboard.calendar.root);
            reset(defaultValues);
        } catch (error) {
            toast.error(error || 'error');
        }
    });

    const renderProperties = (
        <>
            <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                }}
                sx={{
                    mb: 3,
                }}
            >
                <Field.Text
                    inputProps={{ type: 'text' }}
                    name="name" label={t_device('formsInputs.calendarName')} />
                <Controller
                    name="isDefaultCalendar"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                            }
                            label={t_device('formsInputs.isDefaultCalendar')}
                        />
                    )}
                />
                <Controller
                    name="firstDayIndex"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                            {...field}
                            fullWidth
                            options={WEEK_DAYS}
                            getOptionLabel={(option) => option.label[currentLang.value]}
                            onChange={(event, newValue) => {
                                field.onChange(newValue ? newValue.index : null);
                            }}
                            disableClearable
                            value={WEEK_DAYS.find((item) => item.index === field.value) || null}
                            isOptionEqualToValue={(option, value) => option.index === value.index}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t_device('formsInputs.weekStartDayIndex')}
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    name="workDays"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                            {...field}
                            sx={{ maxWidth: 500, maxLines: 1 }}
                            fullWidth
                            multiple
                            disableCloseOnSelect
                            options={WEEK_DAYS}
                            getOptionLabel={(option) => option.label[currentLang.value]}
                            onChange={(event, newValue) => {
                                const selectedValues = newValue.map((item) => item.value);
                                field.onChange(selectedValues);
                                setSelectedWorkDays(newValue);
                            }}
                            limitTags={2}
                            value={selectedWorkDays}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{ maxWidth: 450, maxLines: 1 }}
                                    label={t_device('formsInputs.workDays')}
                                    error={!!error}
                                    helperText={error?.message}
                                />

                            )}
                        />
                    )}
                />
                <Button

                    disabled={selectedWorkDays.length === 0}
                    variant="contained"
                    onClick={() => setOpenShiftDialog(true)}
                >
                    {t_device('button.setShifts')}
                </Button>
                <Button

                    variant="contained"
                    onClick={() => setOpenHolidaysDialog(true)}
                >
                    {t_device('button.setHolidays')}
                </Button>
            </Box>
            <Box>
                <TextField
                    name="description"
                    multiline rows={3}
                    label={t_device('formsInputs.description')}
                    variant="outlined"
                    fullWidth
                    value={values.description}
                    onChange={(e) => methods.setValue('description', e.target.value)}
                />
            </Box>

        </>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {!currentCalendar ? t_device('button.createCalendar') : t_device('button.updateCalendar')}
                </Button>
            </Stack>
        </Box>

    );

    return (
        <>
            <Grid size={{ xs: 12, md: 8 }}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Stack spacing={5} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
                        <Card sx={{ p: 3 }}>
                            {renderProperties}
                            {renderActions}
                        </Card>
                    </Stack>
                </Form>
            </Grid>
            <CalendarWorkDays open={openShiftDialog} onClose={() => setOpenShiftDialog(false)} workDays={selectedWorkDays} />
            <CalendarHolidaysForm open={openHolidaysDialog} onClose={() => setOpenHolidaysDialog(false)} holidays={holidays} />
        </>
    );
}
