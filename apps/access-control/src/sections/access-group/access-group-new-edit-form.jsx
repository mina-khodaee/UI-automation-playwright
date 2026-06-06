import { z as zod } from 'zod';
import { useMemo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Autocomplete, Checkbox, Grid, Radio, RadioGroup, TextField, Typography, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetCalendars } from 'src/actions/calendar';
import { CreateAccessGroup, UpdateAccessGroup, useGetAccessGroup, useGetAccessGroups } from 'src/actions/access-group';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function AccessGroupNewEditForm({ currentAccessGroup }) {
  const router = useRouter();
  const { t: t_device } = useTranslate('device');
  const { t: t_common } = useTranslate();
  const NewAccessGroupSchema = zod.object({
    description: zod.string().nullable().transform(value => value === '' ? null : value),
    isDefault: zod.boolean(),
    name: zod.string().min(1, { message: t_device('formValidationErrors.accessGroupName.required') }),
    syncDeviceSettingsWithAccessGroup: zod.boolean().default(false),
    aclCalendarId: zod.coerce.number().min(1, { message: t_device('formValidationErrors.aclCalendarId.required') }).transform(value => value === 0 ? null : value),
    allowedAuthTypes: zod.object({
      isAndOperation: zod.boolean(),
      face: zod.boolean(),
      fingerprint: zod.boolean(),
      // fpCard: zod.boolean(),
      password: zod.boolean(),
      card: zod.boolean(),
      // cardID: zod.boolean()
    }).refine(
      authTypes => Object.entries(authTypes)
        .filter(([key]) => key !== 'isAndOperation')
        .some(([, value]) => value === true),
      {
        message: t_device('formValidationErrors.allowedAuthTypes.required'),
        path: ['allowedAuthTypes'],
      }
    ).refine(
      (authTypes) => {
        if (!authTypes.isAndOperation) {
          const selectedCount = ['face', 'fingerprint', 'password', 'card']
            .filter((key) => authTypes[key] === true)
            .length;

          return selectedCount <= 2;
        }
        return true;
      },
      {
        message: t_device('formValidationErrors.allowedAuthTypes.limitExceeded'),
        path: ['allowedAuthTypes.isAndOperation'],
      }
    ),
  });

  const [selectedAuthTypes, setSelectedAuthTypes] = useState({
    face: false,
    fingerprint: false,
    password: false,
    card: false,
  });
  const { calendars, calendarsLoading } = useGetCalendars();
  const { mutate: editMutate } = useGetAccessGroup(currentAccessGroup?.id);
  const { mutate: createMutate } = useGetAccessGroups();

  const defaultValues = useMemo(
    () => ({
      description: currentAccessGroup?.description || '',
      isDefault: currentAccessGroup?.isDefault || false,
      name: currentAccessGroup?.name || '',
      syncDeviceSettingsWithAccessGroup: false,
      aclCalendarId: currentAccessGroup?.aclCalendar.id || '',
      allowedAuthTypes: {
        isAndOperation: currentAccessGroup?.allowedAuthTypes?.isAndOperation || false,
        face: currentAccessGroup?.allowedAuthTypes?.face || false,
        fingerprint: currentAccessGroup?.allowedAuthTypes?.fingerprint || false,
        // fpCard: currentAccessGroup?.allowedAuthTypes?.fpCard || false,
        password: currentAccessGroup?.allowedAuthTypes?.password || false,
        card: currentAccessGroup?.allowedAuthTypes?.card || false,
        // cardID: currentAccessGroup?.allowedAuthTypes?.cardID || false,
      },
    }),
    [currentAccessGroup]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewAccessGroupSchema),
    defaultValues,

  });
  const {
    reset,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentAccessGroup) {
      const authTypeConfig = currentAccessGroup?.allowedAuthTypes || {};
      const updatedAuthTypes = { ...selectedAuthTypes };
      Object.entries(authTypeConfig).forEach(([key, value]) => {
        if (key === 'face' && value) {
          updatedAuthTypes.face = true;
        }
        if (key === 'fingerprint' && value) {
          updatedAuthTypes.fingerprint = true;
        }
        if (key === 'password' && value) {
          updatedAuthTypes.password = true;
        }
        if (key === 'card' && value) {
          updatedAuthTypes.card = true;
        }
      });
      setSelectedAuthTypes(updatedAuthTypes);
      reset(defaultValues);
    }
  }, [currentAccessGroup, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentAccessGroup) {
        await UpdateAccessGroup({ id: currentAccessGroup.id, ...data });
        await editMutate();
      }
      else {
        await CreateAccessGroup(data);
      }
      await createMutate();
      router.push(paths.dashboard.accessGroup.root);
      toast.success(currentAccessGroup ? t_device('toastMessages.updateAccessGroup') : t_device('toastMessages.createAccessGroup'));
    } catch (error) {
      console.error(error);
    }
  });
  const onError = (errors) => {
    console.log(errors);
    Object.values(errors).forEach((error) => {
      toast.error(error.message || error.root.message);
    });
  };

  const allowedAuthTypesFields = [
    { key: 'face', label: t_device('formsInputs.face'), icon: '/icons/face.png' },
    { key: 'fingerprint', label: t_device('formsInputs.fingerprint'), icon: '/icons/fingerprint.png' },
    // { key: 'fpCard', label: t_device('formsInputs.fpCard'), icon: '/icons/fpCard.png' },
    { key: 'password', label: t_device('formsInputs.password'), icon: '/icons/password.png' },
    { key: 'card', label: t_device('formsInputs.card'), icon: '/icons/card.png' },
    // { key: 'cardID', label: t_device('formsInputs.cardID'), icon: '/icons/cardID.png' },
  ];
  const handleAuthTypeChange = (authType) => {
    const newSelectedAuthTypes = { ...selectedAuthTypes, [authType]: !selectedAuthTypes[authType] };

    // if (!newSelectedAuthTypes[authType] && !selectedAuthTypes[authType]) {
    //   return; 
    // }
    // if (!values.allowedAuthTypes.isAndOperation && Object.values(newSelectedAuthTypes).filter(Boolean).length > 2) {
    //   return; 
    // }
    setSelectedAuthTypes(newSelectedAuthTypes);
    setValue('allowedAuthTypes', { ...newSelectedAuthTypes, isAndOperation: values.allowedAuthTypes.isAndOperation });
  };

  const renderAuthTypesCheckboxes = (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h8">{t_device('formsInputs.allowedAuthTypes')}</Typography>
      <Box>
        <Controller
          name="allowedAuthTypes.isAndOperation"
          control={control}
          render={({ field }) => (
            <Box sx={{ mt: 2 }}>
              <RadioGroup
                value={field.value ?? false}
                onChange={(e) => {
                  const isAndOperation = e.target.value === 'true';
                  if (!isAndOperation) {
                    const currentSelectedTypes = Object.keys(selectedAuthTypes).filter(
                      (key) => selectedAuthTypes[key] && key !== "isAndOperation"
                    );
                    if (currentSelectedTypes.length > 2) {
                      currentSelectedTypes.slice(2).forEach((key) => {
                        selectedAuthTypes[key] = false;
                      });
                    }
                    setValue("allowedAuthTypes", selectedAuthTypes);
                  }

                  setSelectedAuthTypes({
                    ...selectedAuthTypes,
                    isAndOperation,
                  });
                  field.onChange(isAndOperation);
                }}
              >
                <FormControlLabel
                  value
                  control={<Radio />}
                  label={t_device('formsInputs.isAndOperation')}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label={t_device('formsInputs.isOrOperation')}
                />
              </RadioGroup>
            </Box>
          )}
        />
      </Box>
      <Box
        rowGap={3}
        columnGap={1}
        sx={{ mt: 2 }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
      >
        {allowedAuthTypesFields.map(({ key, label, icon }) => (
          <Controller
            key={key}
            name={`allowedAuthTypes.${key}`}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ mx: 1 }}
                    checked={selectedAuthTypes[key] ?? false}
                    onChange={() => handleAuthTypeChange(key)}
                    disabled={
                      !values.allowedAuthTypes.isAndOperation &&
                      Object.values(selectedAuthTypes).filter(Boolean).length >= 2 &&
                      !selectedAuthTypes[key]
                    }
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    {/* <img src={icon} alt={label} style={{ width: 24, height: 24 }} /> */}
                    {label}
                  </Box>
                }
              />
            )}
          />
        ))}
      </Box>
    </Box>
  );
  const renderActions = (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
        <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {!currentAccessGroup ? t_device('button.createAccessGroup') : t_common('button.update')}
          </Button>
        </Stack>
      </Box>
    </>
  );

  const renderProperties = (
    <>

      <Box
        rowGap={3}
        columnGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
      >
        <Field.Text
          inputProps={{ type: 'text' }}
          name="name" label={t_device('formsInputs.accessGroupName')} />
        <Controller
          name="aclCalendarId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              fullWidth
              options={calendars || []}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                field.onChange(newValue ? Number(newValue.id) : '');
              }}
              disableClearable
              value={calendars?.find((item) => item.id === field.value) || null}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={calendarsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t_device('formsInputs.calendar')}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />
        <Controller
          name="isDefault"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                />
              }
              label={t_device('formsInputs.defaultAccessGroup')}
            />
          )}
        />
      </Box>
      <Stack spacing={1}>
        {renderAuthTypesCheckboxes}
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Field.Text name="description" label={t_device('formsInputs.description')} multiline rows={3} />
      </Box>

    </>
  );



  return (
    <Grid size={{ xs: 12, md: 8 }}>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
        <Stack spacing={5} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
          <Card sx={{ p: 3 }}>
            {renderProperties}
            {renderActions}
          </Card>
        </Stack >
      </Form>
    </Grid>
  );
}
