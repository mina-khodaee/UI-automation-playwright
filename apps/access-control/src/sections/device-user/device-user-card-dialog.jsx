import { z as zod } from 'zod';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Card, Stack, Grid, TableContainer, Table, TableBody, IconButton, Tooltip, TableCell, TableRow, Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField, Autocomplete } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useDeviceUserStore } from 'src/stores/device-user-store';

import { Field, Form } from 'src/components/hook-form';
import { TableHeadCustom, TableNoData } from 'src/components/table';

// ----------------------------------------------------------------------

export function CardSettings({ open, onClose }) {
    const { getCardTypes, cards, addCard, setCards, removeCard } = useDeviceUserStore();
    const { t: t_user } = useTranslate('user');
    const { t: t_common } = useTranslate();
    const TABLE_HEAD = [
        { id: 'cardNumber', label: t_user('formsInputs.cardNumber'), align: 'center', width: 140 },
        { id: 'rfid', label: t_user('formsInputs.rfid'), align: 'center', width: 140 },
        { id: 'cardType', label: t_user('formsInputs.cardType'), align: 'center', width: 140 },
        { id: 'delete', label: '', width: 120 },
    ];

    const [cardTypes, setCardTypes] = useState([]);
    const [cardTypesLoading, setCardTypesLoading] = useState(false);

    const CardSchema = zod.object({
        rfid: zod.string().min(1, { message: t_user('formValidationErrors.rfid.required') }),
        cardType: zod.string().min(1, { message: t_user('formValidationErrors.cardType.required') }),
    });

    const defaultValues = {
        rfid: '',
        cardType: ''
    };

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(CardSchema),
        defaultValues,
    });
    const {
        reset,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(data => {
        const newCard = {
            cardNumber: cards?.length + 1,
            rfid: data.rfid,
            cardType: data.cardType
        };
        addCard(newCard);
        reset();
    });
    const handleDeleteRow = (cardNumber) => {
        removeCard(cardNumber);
        const updatedCards = cards
            .filter(card => card.cardNumber !== cardNumber)
            .map((card, index) => ({
                ...card,
                cardNumber: index + 1,
            }));
        setCards(updatedCards);
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
            <Field.Text name="rfid" type="text" label={t_user('formsInputs.rfid')} control={control} sx={{ width: 1 }} />
            <Controller
                name="cardType"
                control={control}
                rules={{ required: t_user('formValidationErrors.cardType.required') }}
                render={({ field, fieldState }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={cardTypes}
                        getOptionLabel={(option) => option}
                        onChange={(event, newValue) => {
                            field.onChange(newValue || null);
                        }}
                        onBlur={() => {
                            field.onBlur();
                            if (!field.value) {
                                setValue("cardType", "", { shouldValidate: true });
                            }
                        }}
                        onFocus={async () => {
                            if (cardTypes.length <= 1) {
                                try {
                                    setCardTypesLoading(true);
                                    const result = await getCardTypes();
                                    setCardTypes(result || null);
                                } catch (error) {
                                    console.error('Error fetching card types:', error);

                                } finally {
                                    setCardTypesLoading(false);
                                }
                            }
                        }}
                        value={cardTypes?.find((item) => item === field) || null}
                        isOptionEqualToValue={(option, value) => option === value}
                        disableClearable
                        loading={cardTypesLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t_user('formsInputs.cardType')}
                                error={!!fieldState?.error}
                                helperText={fieldState?.error ? fieldState.error.message : ''}
                            />
                        )}
                    />
                )}
            />
        </Box>
    );

    const renderActions = (
        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {t_user('buttons.addCard')}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle textAlign='center'>{t_user('buttons.cardSettings')}</DialogTitle>
            <DialogContent>
                <Grid size={{ xs: 12, md: 9 }}>
                    <Form methods={methods} onSubmit={(e) => {
                        e.stopPropagation();
                        onSubmit(e);
                    }}>
                        <Stack spacing={4} sx={{ m: 2, maxWidth: { xs: 700, xl: 860 } }}>
                            {renderProperties}
                            {renderActions}
                        </Stack>
                    </Form>
                    <Card sx={{ p: 3, mt: 3 }}>
                        <TableContainer sx={{ maxHeight: 420, minHeight: 220 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHeadCustom
                                    headLabel={TABLE_HEAD}
                                    rowCount={cards?.length}
                                />
                                <TableBody>
                                    {cards?.map((row) => (
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
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Stack direction="row" alignItems="center">
                                                    <Tooltip title={t_common('button.delete')} placement="top" arrow>
                                                        <IconButton onClick={() => handleDeleteRow(row.cardNumber)} sx={{ color: 'error.main' }}>
                                                            <MdDelete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow >
                                    ))}
                                    <TableNoData notFound={cards?.length === 0} />
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