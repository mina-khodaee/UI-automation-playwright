import { z as zod } from 'zod';
import { useMemo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Autocomplete, Grid, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetAccessGroups } from 'src/actions/access-group';
import { useDeviceActions } from 'src/stores/device-actions-store';
import { useRegionActions } from 'src/stores/region-actions-store';
import { useDeviceTypeActions } from 'src/stores/device-type-actions';
import { CreateDevice, UpdateDevice, useGetDevice, useGetDevices } from 'src/actions/device';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function DeviceNewEditForm({ currentDevice }) {
  const {getDeviceTypes} = useDeviceTypeActions();
  const {getTrafficModes, trafficModes, deviceActionsLoading} = useDeviceActions();
  const {getRegions, regions} = useRegionActions();
  const router = useRouter();
  const { t: t_device } = useTranslate('device');
  const { t: t_common, currentLang } = useTranslate();
  const [selectedDeviceBrand, setSelectedDeviceBrand] = useState('');
  const { accessGroups, accessGroupsLoading } = useGetAccessGroups();
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [deviceTypesLoading, setDeviceTypesLoading] = useState(false);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const { mutate: deviceMutate } = useGetDevices();
  const { mutate: editMutate } = useGetDevice();

  const NewDeviceSchema = zod.object({
    description: zod.string().nullable().transform(value => value === "" ? null : value),
    syncUsersWithAccessGroup: zod.boolean().default(false),
    syncSettingsWithAccessGroup: zod.boolean().default(false),
    deviceTypeId: zod.coerce.number().transform(value => value === 0 ? null : value).refine(
      (value) => value !== null || currentDevice !== undefined,
      {
        message: t_device('formValidationErrors.deviceTypeId.required')
      }
    ),
    trafficMode: zod.string().min(1, { message: t_device('formValidationErrors.trafficMode.required') }),
    terminalId: zod
      .coerce.number()
      .nullable().transform(value => value === 0 ? null : value).refine(value => selectedDeviceBrand !== "Virdi" || value !== null || currentDevice !== undefined,
        {message: t_device('formValidationErrors.terminalId.required')}),
    accessGroupId: zod
      .coerce.number().nullable().transform(value => value === 0 ? null : value).refine(
        (value) => value !== null || currentDevice !== undefined,
        {
          message: t_device('formValidationErrors.accessGroupId.required')
        }
      ),
    regionId: zod.optional(zod
      .coerce.number()
      .nullable().transform(value => value === 0 ? null : value)
    ),
    serialNumber: zod.string().nullable().transform(value => value === "" ? null : value)
      .refine(value => value !== null || (selectedDeviceBrand !== "ZK" && selectedDeviceBrand !== "Tiam") || currentDevice !== undefined,
        {message: t_device('formValidationErrors.serialNumber.required')}),
    firmwareVersion: zod.string().nullable().transform(value => value === "" ? null : value),
    terminalIP: zod.string()
      .nullable()
      .transform(value => value === "" ? null : value)
      .refine(value => value !== null || selectedDeviceBrand !== "ZK", {
        message: t_device('formValidationErrors.terminalIP.required')
      })
      .refine(value => value === null || zod.string().ip().safeParse(value).success, {
        message: t_device('formValidationErrors.terminalIP.invalid')
      }),
    terminalPort: zod.coerce.number().nullable().transform(value => value === 0 ? null : value).refine(value => value !== null || selectedDeviceBrand !== "ZK", {
      message: t_device('formValidationErrors.terminalPort.required')
    }).refine(value => value !== null || selectedDeviceBrand !== "ZK", {
      message: t_device('formValidationErrors.terminalPort.required')
    }),
    terminalPassword: zod.coerce.number().nullable().transform(value => value === 0 ? null : value).refine(value => value !== null || selectedDeviceBrand !== "ZK", {
      message: t_device('formValidationErrors.terminalPassword.required')
    }),
    terminalMacAddress: zod.string().nullable().transform(value => value === "" ? null : value),
  });


  const defaultValues = useMemo(
    () => ({
      deviceTypeId: currentDevice?.deviceType?.id || '',
      description: currentDevice?.description || '',
      syncUsersWithAccessGroup: false,
      syncSettingsWithAccessGroup: false,
      terminalIP: currentDevice?.terminalIP || '',
      terminalPort: currentDevice?.terminalPort || '',
      terminalPassword: currentDevice?.terminalPassword || '',
      regionId: currentDevice?.region?.id || '',
      trafficMode: currentDevice?.trafficMode?.value || '',
      firmwareVersion: currentDevice?.firmwareVersion || '',
      serialNumber: '',
      terminalId: '',
      terminalMacAddress: currentDevice?.terminalMacAddress || '',
      accessGroupId: '',
    }),
    [currentDevice]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewDeviceSchema),
    defaultValues,
  });
  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentDevice) {
      setDeviceTypes([currentDevice?.deviceType]);
      reset(defaultValues);
    }
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDevice]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentDevice) {
        await UpdateDevice({ id: currentDevice.id, ...data });
        await editMutate();
      } else {
        await CreateDevice(data);
      }
      await deviceMutate();
      toast.success(currentDevice ? t_device('toastMessages.update') : t_device('toastMessages.create'));
      router.push(paths.dashboard.device.root);
    } catch (error) {
      toast.error(error);
    }
  });
  const onError = (errors) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message || error.root.message);
    });
  };

  const renderProperties = (
    <>
      <Box
        columnGap={3}
        rowGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        }}
      >
        <Controller
          name="deviceTypeId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              fullWidth
              options={deviceTypes || []}
              getOptionLabel={(option) => `${option.brand} / ${option.model}`}
              onChange={(event, newValue) => {
                field.onChange(newValue ? newValue.id : null);
                setSelectedDeviceBrand(newValue.brand)
              }}
              onFocus={async () => {
                if (deviceTypes.length <= 1) {
                  try {
                    setDeviceTypesLoading(true);
                    const pageSize = 100;
                    const result = await getDeviceTypes(pageSize);
                    setDeviceTypes(result || []);
                  } catch (errors) {
                    toast.error(errors);
                  } finally {
                    setDeviceTypesLoading(false);
                  }
                }
              }}
              value={deviceTypes?.find((item) => item.id === field.value) || null}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              disableClearable
              loading={deviceTypesLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t_device('formsInputs.deviceModel')}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />
        <Controller
          name="regionId"
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              fullWidth
              options={regions || [currentDevice?.region] || []}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                field.onChange(newValue ? newValue.id : null);
              }}
              onFocus={async () => {
                if (regions.length < 1) {
                  try {
                    setRegionsLoading(true);
                    await getRegions();
                  } catch (error) {
                    toast.error(error);
                  } finally {
                    setRegionsLoading(false);
                  }
                }

              }}
              value={regions?.find((item) => item.id === field.value) || null}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={regionsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t_device('formsInputs.region')}
                  error={!!fieldState?.error}
                  helperText={fieldState?.error ? fieldState.error.message : ''}
                />
              )}
            />
          )}
        />
        {!currentDevice && (<Controller
          name="accessGroupId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              fullWidth
              options={accessGroups || []}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                field.onChange(newValue ? Number(newValue.id) : null);
              }}
              value={accessGroups?.find((item) => item.id === field.value) || null}
              disableClearable
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={accessGroupsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t_device('formsInputs.accessGroup')}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />)}
        <Controller
          name="trafficMode"
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              fullWidth
              options={trafficModes || [currentDevice?.trafficMode] || []}
              getOptionLabel={(option) => option.displayValues[currentLang.value]}
              onChange={(event, newValue) => {
                field.onChange(newValue ? newValue.value : null);
              }}
              onFocus={async () => {
                if (trafficModes.length < 1) {
                  try {
                    await getTrafficModes();
                  } catch (error) {
                    toast.error(error);
                  }
                }
              }}
              value={trafficModes?.find((item) => item.value === field.value) || null}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              loading={deviceActionsLoading.getTrafficModes}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t_device('formsInputs.trafficMode')}
                  error={!!fieldState?.error}
                  helperText={fieldState?.error ? fieldState.error.message : ''}
                />
              )}
            />
          )}
        />
        </Box>
        <Box
        columnGap={3}
        rowGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
        sx={{
          my: 3,
        }}
      >
        <Field.Text name="terminalIP" label={t_device('formsInputs.terminalIP')} control={control} />
        <Field.Text type="number" name="terminalPort" label={t_device('formsInputs.terminalPort')} control={control} />
        <Field.Text type="number" name="terminalPassword" label={t_device('formsInputs.terminalPassword')} control={control} />
      </Box>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
        sx={{
          my: 3,
        }}
      >
        {!currentDevice && <>
          <Field.Text inputProps={{ type: 'number' }} name="terminalId" label={t_device('formsInputs.terminalId')} control={control}/>
          <Field.Text name="serialNumber" label={t_device('formsInputs.serialNumber')} control={control} />
        </>
        }
        <TextField
          name="firmwareVersion"
          label={t_device('formsInputs.firmwareVersion')}
          variant="outlined"
          fullWidth
          control={control}
        />
        <Field.Text
          name="terminalMacAddress"
          label={t_device('formsInputs.terminalMacAddress')}
          variant="outlined"
          fullWidth
          control={control}
        />

      </Box>
      <Box
        sx={{ mb: 1 }}
        columnGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        {!currentDevice && <><Controller
          name="syncUsersWithAccessGroup"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                />
              }
              label={t_device('formsInputs.syncUsersWithAccessGroup')}
            />
          )}
        />
        <Controller
          name="syncSettingsWithAccessGroup"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                />
              }
              label={t_device('formsInputs.syncSettingsWithAccessGroup')}
            />
          )}
        /></>}
      </Box>
      <Box>
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
                  alignItems: 'flex-start',
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
            {!currentDevice ? t_device('button.create') : t_common('button.update')}
          </Button>
        </Stack>
      </Box>
  );

  return (
    <Grid size={{ xs: 12, md: 8 }}>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
        <Stack spacing={5} sx={{ mx: 'auto', maxWidth: { xs: 740, xl: 950 } }}>
          <Card sx={{ p: 3 }}>
            {renderProperties}
            {renderActions}
          </Card>
        </Stack>
      </Form>
    </Grid>
  );
}
