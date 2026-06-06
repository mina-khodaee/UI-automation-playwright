import { z as zod } from 'zod';
import { useState } from 'react';
import { ImInfo } from "react-icons/im";
import { TbCancel } from 'react-icons/tb';
import { MdDelete } from 'react-icons/md';
import { usePopover } from 'minimal-shared/hooks';
import { BsCheckCircleFill } from 'react-icons/bs';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconifyLocal } from '@repo/ui/iconify-local';

import { Box, Card, Stack, Grid, Switch, FormControlLabel, TableContainer, Table, TableBody, IconButton, Tooltip, TableCell, TableRow, TextField, Dialog, DialogContent, DialogTitle, DialogActions, Button, Autocomplete, InputAdornment } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useDeviceUserStore } from 'src/stores/device-user-store';

import { Image } from 'src/components/image';
import { Form } from 'src/components/hook-form';
import { CustomPopover } from 'src/components/custom-popover';
import { TableHeadCustom, TableNoData } from 'src/components/table';

import { OnlineDeviceList } from '../device/online-device-list';

// ----------------------------------------------------------------------

export function FingerprintSettings({ open, onClose, onGet }) {
    const fingerIndexPopover = usePopover();
    const storedFingerprints = useDeviceUserStore((state) => state.fingerprints);
    const handleAddFingerprint = useDeviceUserStore((state) => state.addFingerprint);
    const handleRemoveFingerprint = useDeviceUserStore((state) => state.removeFingerprint);
    const { t: t_user } = useTranslate('user');
    const { t: t_common } = useTranslate();

    const [onlineDevices, setOnlineDevices] = useState([]);
    const handleOnlineDevices = (OnlineDevicesList) => {
        setOnlineDevices(OnlineDevicesList);
    }
    const TABLE_HEAD = [
        { id: 'fingerId', label: t_user('formsInputs.fingerId'), align: 'center', width: 140 },
        { id: 'isDuressFinger', label: t_user('formsInputs.isDuressFinger'), align: 'center', width: 140 },
        { id: 'delete', label: '', width: 120 },
    ];

    const FingerprintSchema = zod.object({
        enrollmentDeviceTerminalId: zod.coerce.number({
            message: t_user('formValidationErrors.enrollmentDeviceTerminalId.required')
        }).transform(value => (value === "" ? null : value)),
        isDuressFinger: zod.boolean().default(false),
        fingerID:
            zod.union([
                zod.string()
                    .transform(value => (value === "" ? "" : Number(value)))
                    .refine(
                        value => value === "" || (Number.isInteger(value) && value >= 1 && value <= 10),
                        {
                            message: t_user('formValidationErrors.fingerId.invalid')

                        }
                    ),
                zod.literal("")
            ])
                .refine(value => value !== "", { message: t_user('formValidationErrors.fingerId.required') }),
    });

    const defaultValues = {
        fingerID: '',
        isDuressFinger: false,
        enrollmentDeviceTerminalId: '',
    }
    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(FingerprintSchema),
        defaultValues,
    });
    const {
        watch,
        resetField,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmitFingerprint = handleSubmit((data) => {
        const { fingerID, isDuressFinger } = data;
        handleAddFingerprint({ fingerID, isDuressFinger });
        resetField('fingerID');
        resetField('isDuressFinger');
    });

    const handleDeleteRow = (fingerID) => {
        handleRemoveFingerprint(fingerID);
    };

    const renderProperties = (
        <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
            }}
        >

            <Controller
                name="enrollmentDeviceTerminalId"
                control={control}
                rules={{ required: t_user('formValidationErrors.enrollmentDeviceTerminalId.required') }}
                render={({ field, fieldState }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={onlineDevices}
                        getOptionLabel={(option) => String(option.terminalID || option.serialNumber || '')}
                        onChange={(event, newValue) => {
                            field.onChange(newValue ? newValue.terminalID || newValue.serialNumber : null);
                            onGet(newValue ? newValue.terminalID || newValue.serialNumber : null);
                        }}
                        value={onlineDevices?.find(
                            (item) =>
                                String(item.terminalID) === String(field.value) ||
                                String(item.serialNumber) === String(field.value)
                        ) || null}
                        isOptionEqualToValue={(option, value) =>
                            String(option.terminalID) === String(value.terminalID) ||
                            String(option.serialNumber) === String(value.serialNumber)
                        }
                        disableClearable
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_user('formsInputs.enrollmentDeviceTerminalId')}
                                error={!!fieldState?.error}
                                helperText={fieldState?.error ? fieldState.error.message : ''}
                            />
                        )}
                    />

                )}
            />
            <Controller
                name="fingerID"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        type="number"
                        label={t_user('formsInputs.fingerId')}
                        variant="outlined"
                        fullWidth
                        disabled={!values.enrollmentDeviceTerminalId}
                        error={!!error}
                        helperText={error?.message}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={fingerIndexPopover.onOpen}>
                                            <IconifyLocal>
                                                <ImInfo />
                                            </IconifyLocal>
                                        </IconButton>
                                        <CustomPopover
                                            open={fingerIndexPopover.open}
                                            onClose={fingerIndexPopover.onClose}
                                            anchorEl={fingerIndexPopover.anchorEl}
                                            slotProps={{
                                                arrow: { placement: 'top-center' },
                                                paper: { sx: { padding: 2, backgroundColor: 'white', backgroundImage: 'none' } },
                                            }}
                                        >
                                            <Image
                                                src="/assets/images/finger-numbers.png"
                                                alt="finger-numbers"
                                                sx={{ borderRadius: 2 }}
                                            />
                                        </CustomPopover>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                )}
            />
            <Controller
                name="isDuressFinger"
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={field.value}
                                onChange={field.onChange}
                            />
                        }
                        disabled={!values.enrollmentDeviceTerminalId || values.fingerID === ""}
                        label={t_user('formsInputs.isDuressFinger')}
                    />
                )}
            />
        </Box>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {t_user('buttons.addFingerprint')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose}>
            <OnlineDeviceList onGet={handleOnlineDevices} />
            <DialogTitle textAlign='center'>{t_user('buttons.fingerprintSettings')}</DialogTitle>
            <DialogContent>
                <Grid size={{ xs: 12, md: 9 }}>
                    <Form methods={methods} onSubmit={(e) => {
                        e.stopPropagation();
                        onSubmitFingerprint(e);
                    }}
                    >
                        <Stack spacing={4} sx={{ m: 2, maxWidth: { xs: 700, xl: 860 } }}>
                            {renderProperties}
                            {renderActions}
                        </Stack>
                    </Form>
                    <Card sx={{ p: 3 }}>
                        <TableContainer sx={{ maxHeight: 420 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHeadCustom
                                    headLabel={TABLE_HEAD}
                                    rowCount={storedFingerprints?.length}
                                />
                                <TableBody>
                                    {storedFingerprints?.map((row) => (
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
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Stack direction="row" alignItems="center">
                                                    <Tooltip title={t_common('button.delete')} placement="top" arrow>
                                                        <IconButton onClick={() => handleDeleteRow(row.fingerID)} sx={{ color: 'error.main' }}>
                                                            <MdDelete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow >
                                    ))}
                                    <TableNoData notFound={storedFingerprints?.length === 0} />
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



