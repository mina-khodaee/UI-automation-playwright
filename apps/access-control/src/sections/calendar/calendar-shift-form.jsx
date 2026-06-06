import moment from 'moment';
import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LocalizationProvider, renderTimeViewClock, TimePicker } from '@mui/x-date-pickers';
import { Box, Card, Stack, Grid, Switch, FormControlLabel, TableContainer, Table, TableBody, Button } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useCalendarStore } from 'src/stores/calendar-store';

import { Field, Form } from 'src/components/hook-form';
import { TableHeadCustom, TableNoData } from 'src/components/table';

import { ShiftTableRow } from './calendar-shift-holiday-table-row';

export function CalendarShiftForm({ dayIndex, dayOfWeek }) {
    const storedWeekDays = useCalendarStore((state) =>
        state.weekDays.find((day) => day.dayOfWeek === dayOfWeek)
    );
    const { addShift, removeShift } = useCalendarStore();
    const { t: t_device } = useTranslate('device');
    const { t: t_common } = useTranslate();
    const TABLE_HEAD = [
        { id: 'shiftNumber', label: t_device('formsInputs.shiftNumber'), align: 'center', width: 140 },
        { id: 'hasBreak', label: t_device('formsInputs.hasBreak'), align: 'center', width: 140 },
        { id: 'startTime', label: t_device('formsInputs.startTime'), align: 'center', width: 180 },
        { id: 'endTime', label: t_device('formsInputs.endTime'), align: 'center', width: 180 },
        { id: 'breakStart', label: t_device('formsInputs.breakStart'), align: 'center', width: 180 },
        { id: 'breakEnd', label: t_device('formsInputs.breakEnd'), align: 'center', width: 180 },
        { id: 'delete', label: '', width: 180 },
    ];
    const timeToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      };

    const ShiftsSchema = zod.object({
        shiftNumber: zod.coerce.number().min(1, { message: t_device('formValidationErrors.shiftNumber.required') }),
        hasBreak: zod.boolean(),
        startTime: zod.string().min(1, { message: t_device('formValidationErrors.shiftStartTime.required') }).refine(
            (value) => moment(value, 'HH:mm:ss', true).isValid(),
            { message: t_device('formValidationErrors.shiftStartTime.invalid') }
        ),
        endTime: zod.string().min(1, { message: t_device('formValidationErrors.shiftEndTime.required') }).refine(
            (value) => moment(value, 'HH:mm:ss', true).isValid(),
            { message: t_device('formValidationErrors.shiftEndTime.invalid') }
        ),
        breakStart: zod.string().nullable().refine(
            (value) => moment(value, 'HH:mm:ss', true).isValid() || value === null,
            { message: t_device('formValidationErrors.breakStartTime.invalid') }
        ),
        breakEnd: zod.string().nullable().refine(
            (value) => moment(value, 'HH:mm:ss', true).isValid() || value === null,
            { message: t_device('formValidationErrors.breakEndTime.invalid') }
        ),
    }).refine(
        (data) => {
            const startDate = timeToSeconds(data.startTime);
            const endDate = timeToSeconds(data.endTime);
            return startDate < endDate;
        },
        {
            message: t_device('formValidationErrors.shiftEndTime.greaterThanStartTime'),
            path: ['endTime'],
        }
    ).refine(
        (data) => {
            if (data.hasBreak && data.breakEnd) {
                const endDate = timeToSeconds(data.endTime);
                const breakEndDate = timeToSeconds(data.breakEnd);
                return breakEndDate <= endDate;
            } else {
                return true;
            }
        },
        {
            message: t_device('formValidationErrors.breakEndTime.betweenShift'),
            path: ['breakEnd'],
        }).refine(
            (data) => {
                if (data.hasBreak && data.breakEnd) {
                    const breakStartDate = timeToSeconds(data.breakStart);
                    const breakEndDate = timeToSeconds(data.breakEnd);
                    return breakStartDate < breakEndDate;
                } else {
                    return true;
                }
            },
            {
                message: t_device('formValidationErrors.breakEndTime.greaterThanStartTime'),
                path: ['breakEnd'],
            }
        ).refine(
            (data) => {
                if (data.hasBreak && data.breakStart) {
                    const startDate = timeToSeconds(data.startTime);
                    const breakStartDate = timeToSeconds(data.breakStart);
                    return startDate <= breakStartDate;
                } else {
                    return true;
                }
            },
            {
                message: t_device('formValidationErrors.breakStartTime.betweenShift'),
                path: ['breakStart'],
            }
        );

    const defaultValues = useMemo(
        () => ({
            shiftNumber: '',
            hasBreak: false,
            startTime: '',
            endTime: '',
            breakStart: null,
            breakEnd: null
        }),
        []
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(ShiftsSchema),
        defaultValues,
    });
    const {
        watch,
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(data => {
        try {
            addShift(dayIndex, data);
            reset();
        }
        catch (error) {
            toast.error(error.message);
        }
    });
    const handleDeleteRow = (shiftNumer) => {
        removeShift(dayOfWeek, shiftNumer);
    };

    const renderProperties = (
        <>
            <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                }}
            >
                <Field.Text name="shiftNumber" type="number" label={t_device('formsInputs.shiftNumber')} control={control} sx={{ width: 1 }} />
                <Controller
                    name="hasBreak"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                            }
                            label={t_device('formsInputs.hasBreak')}
                        />
                    )}
                />
                <Controller
                    name="startTime"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TimePicker
                            {...field}
                            ampm={false}
                            label={t_device('formsInputs.startTime')}
                            value={field.value ? moment(field.value, 'HH:mm:ss') : null}
                            onChange={(newValue) => {
                                field.onChange(newValue ? newValue.format('HH:mm:ss') : '');
                            }}
                            localeText={{
                                okButtonLabel: t_common('button.ok')
                            }}
                            slotProps={{
                                textField: {
                                    helperText: error?.message,
                                    error: !!error,
                                    fullWidth: true,
                                    label: t_device('formsInputs.startTime'),
                                }

                            }}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                        />

                    )}
                />
                <Controller
                    name="endTime"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TimePicker
                            {...field}
                            ampm={false}
                            label={t_device('formsInputs.endTime')}
                            value={field.value ? moment(field.value, 'HH:mm:ss') : null}
                            onChange={(newValue) => {
                                field.onChange(newValue ? newValue.format('HH:mm:ss') : '');
                            }}
                            localeText={{
                                okButtonLabel: t_common('button.ok')
                            }}
                            slotProps={{
                                textField: {
                                    helperText: error?.message,
                                    error: !!error,
                                    fullWidth: true,
                                    label: t_device('formsInputs.endTime'),
                                }

                            }}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                        />

                    )}
                />
                <Controller
                    name="breakStart"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TimePicker
                            {...field}
                            ampm={false}
                            localeText={{
                                okButtonLabel: t_common('button.ok')
                            }}
                            disabled={!watch('hasBreak')}
                            label={t_device('formsInputs.breakStart')}
                            value={field.value ? moment(field.value, 'HH:mm:ss') : null}
                            onChange={(newValue) => {
                                field.onChange(newValue ? newValue.format('HH:mm:ss') : '');
                            }}
                            slotProps={{
                                textField: {
                                    helperText: error?.message,
                                    error: !!error,
                                    fullWidth: true,
                                    label: t_device('formsInputs.breakStart'),
                                }

                            }}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                        />

                    )}
                />
                <Controller
                    name="breakEnd"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TimePicker
                            {...field}
                            ampm={false}
                            localeText={{
                                okButtonLabel: t_common('button.ok')
                            }}
                            disabled={!watch('hasBreak')}
                            label={t_device('formsInputs.breakEnd')}
                            value={field.value ? moment(field.value, 'HH:mm:ss') : null}
                            onChange={(newValue) => {
                                field.onChange(newValue ? newValue.format('HH:mm:ss') : '');
                            }}
                            slotProps={{
                                textField: {
                                    helperText: error?.message,
                                    error: !!error,
                                    fullWidth: true,
                                    label: t_device('formsInputs.breakEnd'),
                                }

                            }}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                        />

                    )}
                />
            </Box>
        </>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {t_device('button.addShift')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Grid size={{ xs: 12, md: 9 }}>
            <LocalizationProvider>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Stack spacing={4} sx={{ mx: 'auto', maxWidth: { xs: 700, xl: 860 } }}>
                        <Card sx={{ p: 3 }}>
                            {renderProperties}
                            {renderActions}
                        </Card>
                    </Stack>
                </Form>
            </LocalizationProvider>
            <Card sx={{ p: 3 }}>
                <TableContainer sx={{ maxHeight: 420 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHeadCustom
                            headLabel={TABLE_HEAD}
                            rowCount={storedWeekDays?.shifts.length}
                        />
                        <TableBody>
                            {storedWeekDays?.shifts
                                .map((row) => (
                                    <ShiftTableRow
                                        key={row.shiftNumber}
                                        row={row}
                                        onDeleteRow={() => handleDeleteRow(row.shiftNumber)}
                                    />
                                ))}
                            <TableNoData notFound={storedWeekDays?.shifts.length === 0} />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Grid>
    );
};