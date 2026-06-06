import React from 'react';
import { Grid, Box, Stack, Button } from '@mui/material';
import { Field, Form } from 'src/components/hook-form';
import { PersonnelSelectField } from './personnel-select-field';

export function MoneySupplyFormFields({
    methods,
    personnels,
    personnelsLoading,
    contractorOptions,
    onSubmit,
    onCancel,
    isSubmitting,
    currentData,
    t_common,
}) {
    const { control } = methods;

    console.log('contractor options v-1',contractorOptions);

    console.log('contractor options v-2',contractorOptions);

    console.log('contractor options v-3',contractorOptions)

    console.log('contractor options v-4',contractorOptions)

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid size={12}>
                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(3, 1fr)',
                            md: 'repeat(3, 1fr)',
                        }}
                        sx={{ mt: 1 }}
                    >
                        <Field.Text
                            name="route"
                            label="انتخاب مسیر"
                            inputProps={{ type: 'text' }}
                            size="small"
                        />
                        <Field.Text
                            name="vehicleType"
                            label="نوع خودرو"
                            inputProps={{ type: 'text' }}
                            size="small"
                        />
                        <Field.Text
                            name="escortOperation"
                            label="عملیات اسکورت"
                            inputProps={{ type: 'text' }}
                            size="small"
                        />
                        <Field.Text
                            name="amount"
                            label="مبلغ"
                            inputProps={{ type: 'text' }}
                            size="small"
                        />
                        <Field.Text
                            name="currencyType"
                            label="نوع ارز"
                            inputProps={{ type: 'text' }}
                            size="small"
                        />
                        <Field.Text
                            name="coinBagCount"
                            label="تعداد کیسه سکه"
                            inputProps={{ type: 'text' }}
                            size="small"
                        />
                        <Field.Text
                            name="bagCount"
                            label="تعداد کیسه"
                            size="small"
                        />
                        
                        <PersonnelSelectField
                            name="deliveryPersonnelCode"
                            label="تحویل دار"
                            control={control}
                            personnels={personnels}
                            personnelsLoading={personnelsLoading}
                            required
                        />
                        <PersonnelSelectField
                            name="helperPersonnelCode"
                            label="کمک تحویل دار"
                            control={control}
                            personnels={personnels}
                            personnelsLoading={personnelsLoading}
                        />
                        <PersonnelSelectField
                            name="requesterPersonnelCode"
                            label="درخواست دهنده"
                            control={control}
                            personnels={personnels}
                            personnelsLoading={personnelsLoading}
                            required
                        />

                        <Field.Select
                            name="contractorId"
                            label="مرکز"
                            required
                            data={contractorOptions}
                            displayExp="label"
                            valueExp="value"
                            size="small"
                        />
                    </Box>

                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(1, 1fr)',
                            md: 'repeat(1, 1fr)',
                        }}
                        sx={{ mt: 1 }}
                    >
                        <Field.Text
                            name="description"
                            label="توضیحات"
                            multiline
                            rows={3}
                            size="small"
                        />
                    </Box>
                </Grid>
            </Grid>

            <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
                <Button
                    type="submit"
                    color="success"
                    variant="contained"
                    loading={isSubmitting}
                    size="small"
                >
                    {currentData ? t_common('button.update') : t_common('button.create')}
                </Button>
                <Button onClick={onCancel} color="error" variant="contained" size="small">
                    {t_common('button.cancel')}
                </Button>
            </Stack>
        </Form>
    );
}