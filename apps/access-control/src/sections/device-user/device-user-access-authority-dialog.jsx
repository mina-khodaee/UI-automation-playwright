import moment from 'moment';
import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Box, Card, Stack, Grid, TableContainer, Table, TableBody, IconButton, Tooltip, TableCell, TableRow, TextField, Autocomplete, Dialog, DialogContent, DialogTitle, DialogActions, Button, FormHelperText, Typography, Switch, FormControlLabel } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useDeviceUserStore } from 'src/stores/device-user-store';
import { updateAccessAuthorities } from 'src/actions/device-user';

import { Form } from 'src/components/hook-form';
import { TableHeadCustom, TableNoData } from 'src/components/table';

// ----------------------------------------------------------------------

export function AccessAuthoritiesSettings({ open, onClose, quick, userID, onMutate }) {
    const { accessAuthorities, addAccessAuthority } = useDeviceUserStore((state) => state.accessAuthorities);
    const handleAddAccessAuthority = useDeviceUserStore((state) => state.addAccessAuthority);
    const handleRemoveAccessAuthority = useDeviceUserStore((state) => state.removeAccessAuthority);
    const { t: t_user } = useTranslate('user');
    const { t: t_common, currentLang } = useTranslate();
    const TABLE_HEAD = [
        { id: 'dateType', label: t_user('formsInputs.dateType'), align: 'center', width: 140 },
        { id: 'startDate', label: t_user('formsInputs.startDate'), align: 'center', width: 140 },
        { id: 'endDate', label: t_user('formsInputs.endDate'), align: 'center', width: 180 },
        { id: 'delete', label: '', width: 120 },
    ];
    const [dateTypes, setDateTypes] = useState([]);
    const [dateTypesLoading, setDateTypesLoading] = useState(false);
    const AccessAuthoritiesSchema = zod.object({
        syncWithDevicesInUserAccessGroups: zod.boolean().default(false),
        dateType: zod
            .object({
                value: zod.string().min(1, { message: t_user('formValidationErrors.dateType.required') }),
                displayValues: zod.object({
                    "fa-IR": zod.string().optional(),
                    "en-US": zod.string().optional(),
                }).optional(),
            })
            .refine((obj) => !!obj.value, {
                message: t_user('formValidationErrors.dateType.required'),
                path: ['dateType'],
            }),
        startDate: zod
            .string('formValidationErrors.startDate.required')
            .datetime({ message: t_user('formValidationErrors.startDate.required') })
            .min(1, { message: t_user('formValidationErrors.startDate.required') }),
        endDate: zod
            .string('formValidationErrors.endDate.required')
            .datetime({ message: t_user('formValidationErrors.endDate.required') })
            .min(1, { message: t_user('formValidationErrors.endDate.required') }),
    }).refine(
        (data) => {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);
            return startDate < endDate;
        },
        {
            message: t_user('formValidationErrors.endDate.greaterThanStartDate'),
            path: ['endDate'],
        }
    );

    const defaultValues = {
        syncWithDevicesInUserAccessGroups: false,
        dateType: {
            value: '',
            displayValues: {},
        },
        startDate: '',
        endDate: '',
    };

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(AccessAuthoritiesSchema),
        defaultValues,
    });
    const {
        reset,
        control,
        getValues,
        resetField,
        watch,
        trigger,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const values = watch();

    const handleAdd = async () => {
        try {
            const formValues = { ...getValues() };
            delete formValues.syncWithDevicesInUserAccessGroups;

            const isValid = await trigger();
            if (isValid) {
                handleAddAccessAuthority(formValues);
                resetField('dateType');
                resetField('startDate');
                resetField('endDate');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteRow = (accessAuthority) => {
        handleRemoveAccessAuthority(accessAuthority);
    };
    const handleQuickEdit = async (data) => {
        try {
            const filteredaccessAuthorities = accessAuthorities.map(({ dateType, startDate, endDate }) => ({
                dateType: dateType.value,
                startDate,
                endDate,
            }));
            const syncWithDevicesInUserAccessGroups = values.syncWithDevicesInUserAccessGroups
            await updateAccessAuthorities({ filteredaccessAuthorities, userID, syncWithDevicesInUserAccessGroups });
            await onMutate();
            reset(defaultValues);
            onClose();
            toast.success(t_user('toastMessages.updateAccessAuthorities'));
        } catch (error) {
            console.error('Error updating access authorities:', error);
            toast.error(t_common(error));
        }
    };

    const renderProperties = (
        <>
            <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                }}
            >
                <Controller
                    name="dateType"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Autocomplete
                            fullWidth
                            options={dateTypes}
                            getOptionLabel={(option) => option.displayValues[currentLang.value] || ''}
                            onChange={(event, newValue) => {
                                field.onChange(newValue || null);
                            }}
                            onFocus={async () => {
                                if (dateTypes.length === 0) {
                                    try {
                                        setDateTypesLoading(true);
                                        // const result = await getVirdiAccessDateTypes();
                                        // setDateTypes(result.filter(value => value.value !== 'NOT_USED') || []);
                                    } catch (error) {
                                        console.error('Error fetching date types:', error);
                                        toast.error(error);
                                    } finally {
                                        setDateTypesLoading(false);
                                    }
                                }
                            }}
                            value={field.value || null}
                            isOptionEqualToValue={(option, value) => option.value === value}
                            disableClearable
                            loading={dateTypesLoading}
                            renderInput={(params) => (
                                <>
                                    <TextField
                                        {...params}
                                        label={t_user('formsInputs.dateType')}
                                        error={!!fieldState?.error}
                                        helperText={fieldState?.error ? fieldState.error.message : ''}
                                    />
                                    <FormHelperText>
                                        {/* <Box>{t_user('texts.firstCaption')}</Box> */}
                                        <Box>{t_user('texts.secondCaption')}</Box>
                                        <Box>{t_user('texts.thirdCaption')}</Box>
                                    </FormHelperText>
                                </>
                            )}
                        />
                    )}
                />
            </Box>
            <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 3 }}
            >
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <DateTimePicker
                            ampm={false}
                            value={field.value ? moment(field.value) : null}
                            label={t_user('formsInputs.startDate')}
                            onChange={(newValue) => {
                                field.onChange(newValue ? newValue.toISOString() : null);
                            }}
                            localeText={{
                                okButtonLabel: t_common('button.ok'),
                            }}
                            slotProps={{
                                textField: {
                                    name: "start-date-input",
                                    placeholder: t_user('formsInputs.startDate'),
                                    variant: "outlined",
                                    sx: { width: '100%' },
                                    error: !!error,
                                    helperText: error?.message,
                                },
                            }}
                        />
                    )}
                />

                <Controller
                    name="endDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <DateTimePicker
                            ampm={false}
                            value={field.value ? moment(field.value) : null}
                            label={t_user('formsInputs.endDate')}
                            onChange={(newValue) => {
                                field.onChange(newValue ? newValue.toISOString() : null);
                            }}
                            localeText={{
                                okButtonLabel: t_common('button.ok'),
                            }}
                            slotProps={{
                                textField: {
                                    name: "end-date-input",
                                    placeholder: t_user('formsInputs.endDate'),
                                    variant: "outlined",
                                    sx: { width: '100%' },
                                    error: !!error,
                                    helperText: error?.message,
                                },
                            }}
                        />
                    )}
                />
            </Box>
            {quick && <Controller
                name="syncWithDevicesInUserAccessGroups"
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={field.value}
                                onChange={field.onChange}
                            />
                        }
                        sx={{ mt: 3 }}
                        label={t_user('formsInputs.syncWithDevicesInUserAccessGroups')}
                    />
                )}
            />}
        </>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button
                    type="button"
                    variant="contained"
                    loading={isSubmitting}
                    onClick={(e) => {
                        e.preventDefault();
                        handleAdd();
                    }}>
                    {t_user('buttons.addAccessAuthority')}
                </Button>
                {quick && (
                    <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting || accessAuthorities.length === 0}
                        loading={isSubmitting}
                        onClick={(e) => {
                            e.preventDefault();
                            handleQuickEdit();
                        }}>
                        {t_common('button.update')}
                    </Button>
                )}
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle textAlign='center'>{t_user('buttons.accessAuthoritiesSettings')}</DialogTitle>
            <DialogContent>
                <Grid size={{ xs: 12, md: 9 }}>
                    <LocalizationProvider>
                        <Form methods={methods} onSubmit={handleSubmit((data) => {
                            handleAdd();
                        })}>
                            <Stack spacing={4} sx={{ m: 2, maxWidth: { xs: 700, xl: 860 } }}>
                                {renderProperties}
                                {renderActions}
                            </Stack>
                        </Form>
                    </LocalizationProvider>
                    <Card sx={{ p: 3 }}>
                        <TableContainer sx={{ minHeight: 400 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHeadCustom
                                    headLabel={TABLE_HEAD}
                                    rowCount={accessAuthorities?.length}
                                />
                                <TableBody>
                                    {accessAuthorities?.map((row) => (
                                        <TableRow hover tabIndex={-1} key={row.startDate}>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {row?.dateType?.displayValues[currentLang.value]}
                                            </TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                                {fDateTime(row?.startDate)}
                                            </TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                                {fDateTime(row?.endDate)}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Stack direction="row" alignItems="center">
                                                    <Tooltip title={t_common('button.delete')} placement="top" arrow>
                                                        <IconButton onClick={() => handleDeleteRow(row)} sx={{ color: 'error.main' }}>
                                                            <MdDelete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow >
                                    ))}
                                    <TableNoData notFound={accessAuthorities?.length === 0} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    {t_common('button.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};