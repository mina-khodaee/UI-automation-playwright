import moment from 'moment';
import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers';
import { Box, Card, Stack, Grid, TableContainer, Table, TableBody, Button, DialogActions, DialogContent, DialogTitle, Dialog, TextField } from '@mui/material';

import { useCalendarStore } from 'src/stores/calendar-store';
import { LocalizationProvider, useTranslate } from 'src/locales';

import { Field, Form } from 'src/components/hook-form';
import { TableHeadCustom, TableNoData } from 'src/components/table';

import { HolidayTableRow } from './calendar-shift-holiday-table-row';

// ----------------------------------------------------------------------


export function CalendarHolidaysForm({ open, onClose, holidays }) {
    const { removeHoliday, addHoliday } = useCalendarStore();
    const { t: t_device } = useTranslate('device');
    const { t: t_common } = useTranslate();
    const TABLE_HEAD = [
        { id: 'name', label: t_device('formsInputs.holidayName'), align: 'center', width: 200 },
        { id: 'date', label: t_device('formsInputs.holidayDate'), align: 'center', width: 200 },
        { id: 'description', label: t_device('formsInputs.description'), align: 'center', width: 320 },
        { id: 'delete', label: '', width: 180 },
    ];
    const HolidaysSchema = zod.object({
        description: zod.string().nullable().transform(value => value === "" ? null : value),
        name: zod.string().min(1, { message: t_device('formValidationErrors.holidayName.required') }),
        date: zod
            .string()
            .min(8, { message: t_device('formValidationErrors.holidayDate.required') })
            .refine(
                (value) =>
                    value === null || moment(value, 'YYYY-MM-DD', true).isValid(),
                { message: t_device('formValidationErrors.holidayDate.invalid') }
            ),
    });

    const defaultValues = useMemo(
        () => ({
            name: '',
            date: '',
            description: ''
        }),
        []
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(HolidaysSchema),
        defaultValues,
    });
    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(data => {
        try {
            addHoliday(data);
            reset();
        } catch (error) {
            toast.error(error.message);
        }

    });
    const handleDeleteRow = (holidayDate) => {
        removeHoliday(holidayDate);
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
                <Field.Text
                    inputProps={{ type: 'text' }}
                    name="name" label={t_device('formsInputs.holidayName')} />
                <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label={t_device('formsInputs.holidayDate')}
                            value={field.value ? moment(field.value, 'YYYY-MM-DD') : null}
                            onChange={(newValue) => {
                                field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
                            }}
                            slotProps={
                                {
                                    textField: {
                                        fullWidth: true,
                                    },
                                }
                            }
                        />
                    )}
                />


            </Box>
            <Box sx={{ mt: 3 }}>
                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            multiline
                            rows={4}
                            fullWidth
                            label={t_device('formsInputs.description')}
                            variant="outlined"
                            error={!!error}
                            helperText={error?.message}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    alignItems: 'flex-start', // Align multiline text to the top
                                },
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
                    {t_device('button.addHolidays')}
                </Button>
            </Stack>
        </Box>
    );
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle textAlign='center'>{t_device('formsInputs.holidays')}</DialogTitle>
            <DialogContent>
                <Grid size={{ xs: 9, md: 6 }}>
                    <LocalizationProvider>
                        <Form methods={methods} onSubmit={onSubmit}>
                            <Stack spacing={4} sx={{ m: 2, maxWidth: { xs: 700, xl: 860 } }}>
                                {renderProperties}
                                {renderActions}
                            </Stack>
                        </Form>
                    </LocalizationProvider>

                    <TableContainer sx={{ maxHeight: 400, mt: 3 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHeadCustom
                                headLabel={TABLE_HEAD}
                                rowCount={holidays?.length}
                            />
                            <TableBody>
                                {holidays?.map((row) => (
                                    <HolidayTableRow
                                        key={row.date}
                                        row={row}
                                        onDeleteRow={() => handleDeleteRow(row.date)}
                                    />
                                ))}
                                <TableNoData notFound={holidays?.length === 0} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Grid>
            </DialogContent>
            <DialogActions >
                <Button onClick={onClose} color="error"  >
                    {t_common('button.close')}
                </Button>
            </DialogActions>
        </Dialog>

    );
}

