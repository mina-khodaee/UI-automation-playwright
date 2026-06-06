import { z as zod } from 'zod';
import jMoment from 'moment-jalaali';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Autocomplete, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';

import { LocalizationProvider, useTranslate } from 'src/locales';
import { useAPIKeyActions } from 'src/stores/api-key-actions-store';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function APIKeyNewEditFormDialog({ currentAPIKey, open, onClose, myAPI, onRefetch, onOpenShowKey }) {
  const { getScopes, createAPIKey, updateAPIKey, updateMyAPIKey, loading, scopes } = useAPIKeyActions();
  const { t: t_common } = useTranslate();
  const { t: t_user } = useTranslate('user');
  const NewAPIKeySchema = zod.object({
    name: zod.string().min(1, { message: t_user('formValidationErrors.APIKeyName.required') }),
    description: zod.string().nullable().transform(value => value === '' ? null : value),
    expirationDate: zod.string({ message: t_user('formValidationErrors.expirationDate.invalid') }).datetime({ message: t_user('formValidationErrors.expirationDate.required') }).refine((value) => new Date(value) > new Date(), {
      message: t_user('formValidationErrors.expirationDate.greaterThanNow'),
    }),
    scopes: zod.array(zod.string()).min(1, { message: t_user('formValidationErrors.scopes.required') }),
  });

  const defaultValues = useMemo(
    () => ({
      description: currentAPIKey?.description || '',
      name: currentAPIKey?.name || '',
      expirationDate: currentAPIKey?.expirationDate || '',
      scopes: currentAPIKey?.scopes || [],
    }),
    [currentAPIKey]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewAPIKeySchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // useEffect(() => {
  //   if (currentAPIKey) {
  //     reset(defaultValues);
  //   }
  // }, [currentAPIKey, defaultValues, reset]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentAPIKey && myAPI) {
        await updateMyAPIKey({ id: currentAPIKey.id, ...data });
        toast.success(t_user('toastMessages.updateAPIKey'));
      }
      else if (currentAPIKey) {
        await updateAPIKey({ id: currentAPIKey.id, ...data });
        toast.success(t_user('toastMessages.updateAPIKey'));
      }
      else {
        await createAPIKey(data);
      }
      onClose();
      onRefetch();
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  });

  const renderActions = (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
        <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {!currentAPIKey ? t_user('buttons.createAPIKey') : t_common('button.update')}
          </Button>
        </Stack>
      </Box>
    </>
  );

  const renderProperties = (
    <Box sx={{ mt: 3 }}>
      <Box
        rowGap={3}
        columnGap={1}
        sx={{ mt: 3 }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        <Field.Text
          inputProps={{ type: 'text' }}
          name="name" label={t_user('formsInputs.apiKeyName')} />
        <Controller
          name="expirationDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              ampm={false}
              label={t_user('formsInputs.expirationDate')}
              onChange={(newValue) => {
                const formattedValue = newValue ? newValue.toISOString() : null;
                field.onChange(formattedValue);
              }}
              localeText={{
                okButtonLabel: t_common('button.ok'),
              }}
              value={field.value ? jMoment(field.value) : null}
              slotProps={{
                textField: {
                  name: "expiration-date-input",
                  placeholder: t_user('formsInputs.expirationDate'),
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
      <Box rowGap={3}
        columnGap={1}
        sx={{ mt: 3 }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
        }}>
        <Controller
          name="scopes"
          control={control}
          rules={{ required: t_user('formValidationErrors.scopes.required') }}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              fullWidth
              multiple
              disableCloseOnSelect
              options={scopes || []}
              getOptionLabel={(option) => option}
              onChange={(event, newValue) => {
                field.onChange(newValue || null);
              }}
              onBlur={() => {
                field.onBlur();
                if (!field.value) {
                  setValue("userType", "", { shouldValidate: true });
                }
              }}
              limitTags={2}
              onFocus={async () => {
                if (scopes.length < 1 || currentAPIKey) {
                  try {
                    await getScopes();
                  } catch (error) {
                    console.error("Error fetching user types:", error);
                  }
                }
              }}
              value={field.value || []}

              isOptionEqualToValue={(option, value) => option === value}
              disableClearable
              loading={loading.scopes}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t_user('formsInputs.scopes')}
                  error={!!fieldState?.error}
                  helperText={fieldState?.error ? fieldState.error.message : ''}
                />
              )}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              multiline
              rows={4}
              fullWidth
              label={t_user('formsInputs.description')}
              variant="outlined"
              error={!!error}
              helperText={error?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  alignItems: 'flex-start',
                },
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle textAlign='center'>{t_user('buttons.newAPIKey')}</DialogTitle>
      <DialogContent>
        <Grid size={{ xs: 12, md: 8 }}>
          <LocalizationProvider>
            <Form methods={methods} onSubmit={onSubmit}>
              <Stack spacing={5} sx={{ m: 2, maxWidth: { xs: 720, xl: 880 } }}>
                  {renderProperties}
                  {renderActions}
              </Stack >
            </Form>
          </LocalizationProvider>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          {t_common('button.close')}
        </Button>
      </DialogActions>
    </Dialog>

  );
}
