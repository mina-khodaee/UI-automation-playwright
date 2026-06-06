import { z as zod } from 'zod';
import moment from 'moment-jalaali';
import { useTheme } from '@emotion/react';
import { useMemo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import { DateTimePicker } from '@mui/x-date-pickers';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Autocomplete, Checkbox, Divider, Grid, Radio, RadioGroup, TextField, Typography, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetAccessGroups } from 'src/actions/access-group';
import { useDeviceUserStore } from 'src/stores/device-user-store';
import { useApplicationUserActions } from 'src/stores/application-user-actions-store';
import { CreateDeviceUser, getUserTypes, UpdateDeviceUser, useGetDeviceUser } from 'src/actions/device-user';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { CardSettings } from './device-user-card-dialog';
import AccessGroupTransferList from './device-user-transfer-list';

// ----------------------------------------------------------------------

export function DeviceUserNewEditForm({ currentDeviceUser }) {
  const getApplicationUsers = useApplicationUserActions((state) => state.getApplicationUsers);
  const { cards, resetCards, resetFingerprints, getAccessTypes, accessTypes, loading } = useDeviceUserStore();

  const router = useRouter();
  const { t: t_user } = useTranslate('user');
  const { t: t_device } = useTranslate('device');
  const { t: t_common, currentLang } = useTranslate();
  const { accessGroups, accessGroupsLoading } = useGetAccessGroups(undefined, undefined, 100);
  const transformedAccessGroups = accessGroups.map(({ id, name }) => ({ id, name }));
  const NewDeviceUserSchema = zod.object({
    userID: zod.coerce.number({ message: t_user('formValidationErrors.userId.number') }).int().min(1, { message: t_user('formValidationErrors.userId.required') }),
    uniqueID: zod.string().nullable().transform(value => value === "" ? null : value),
    isAdmin: zod.boolean().default(false),
    applicationUserId: zod.string().nullable().transform(value => value === "" ? null : value),
    userName: zod.string().min(1, { message: t_user('formValidationErrors.userName.required') }),
    userType: zod.string().min(1, { message: t_user('formValidationErrors.userType.required') }),
    accessGroupIds: zod.array(zod.coerce.number()).nullable().transform((value) => (value && value.length === 0 ? null : value))
      .refine(
        (value) => value !== null || currentDeviceUser !== undefined,
        {
          message: t_user('formValidationErrors.accessGroupIds.required')
        }
      ),
    syncWithDevicesInUserAccessGroups: zod.boolean().default(false),
    authTypeConfig: zod.object({
      isAndOperation: zod.boolean().default(false),
      isFace: zod.boolean().default(false),
      isFingerprint: zod.boolean().default(false),
      isPassword: zod.boolean().default(false),
      isCard: zod.boolean().default(false),
      isFPCard: zod.boolean().default(false),
      isCardID: zod.boolean().default(false),
    }).refine(
      (authTypes) => {
        const selectedTypes = ['isFace', 'isFingerprint', 'isPassword', 'isCard'].some((key) => authTypes[key]) || currentDeviceUser !== undefined;
        return selectedTypes;
      },
      {
        message: t_user('formValidationErrors.authTypeConfig.required'),
      }
    ),
    password: zod.coerce.number({ message: t_user('formValidationErrors.password.invalid') }).nullable().transform(value => value === "" ? null : value),
    accessAuthority: zod
      .object({
        accessType: zod
          .string()
          .min(1, { message: t_user('formValidationErrors.accessType.required') })
          .nullable()
          .refine((val) => val !== null, {
            message: t_user('formValidationErrors.accessType.required')
          }),
        startDate: zod
          .string({ message: t_user('formValidationErrors.startDate.required') })
          .nullable(),
        endDate: zod
          .string({ message: t_user('formValidationErrors.endDate.required') })
          .nullable(),
      })
      .refine(
        (data) => {
          // Skip validation if we're editing (currentDeviceUser exists)
          if (currentDeviceUser !== undefined) return true;

          // If accessType is Allowed_Period or Not_Allowed_Period, 
          // at least one date must be filled
          if (data.accessType === 'Allowed_Period' || data.accessType === 'Not_Allowed_Period') {
            return data.startDate !== null || data.endDate !== null;
          }

          // For other access types, validation passes
          return true;
        },
        {
          message: t_user('formValidationErrors.dateRequired.required'),
          path: ['startDate'], // This will show the error on startDate field
        }
      )
      .refine(
        (data) => {
          // If both dates are provided, startDate must be before endDate
          if (data.startDate && data.endDate) {
            return new Date(data.startDate) < new Date(data.endDate);
          }
          return true;
        },
        {
          message: t_user('formValidationErrors.endDate.greaterThanStartDate'),
          path: ['endDate'],
        }
      ),
  }).refine((data) => !data.authTypeConfig.isCard || cards.length > 0, {
    message: t_user("formValidationErrors.cards.required"),
  }).refine((data) => !data.authTypeConfig.isPassword || data.password !== null, {
    message: t_user("formValidationErrors.password.required"), path: ['password']
  });

  const [userTypes, setUserTypes] = useState([]);
  const [userTypesLoading, setUserTypesLoading] = useState(false);
  const [applicationUsers, setApplicationUsers] = useState([]);
  const [applicationUsersLoading, setApplicationUsersLoading] = useState(false);
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [selectedAccessGroupIds, setSelectedAccessGroupIds] = useState([]);
  const { mutate: editMutate } = useGetDeviceUser();

  const [selectedAuthTypes, setSelectedAuthTypes] = useState({
    isFace: false,
    isFingerprint: false,
    isPassword: false,
    isCard: false,
  });

  const defaultValues = useMemo(
    () => ({
      userID: currentDeviceUser?.userID || '',
      uniqueID: currentDeviceUser?.uniqueID || '',
      isAdmin: currentDeviceUser?.isAdmin || false,
      userName: currentDeviceUser?.userName || '',
      userType: currentDeviceUser?.userType?.value || '',
      accessGroupIds: [],
      syncWithDevicesInUserAccessGroups: false,
      applicationUserId: currentDeviceUser?.applicationUser?.id || '',
      authTypeConfig: {
        isAndOperation: false,
        isFace: false,
        isFingerprint: false,
        isPassword: false,
        isCard: false,
        isFPCard: false,
        isCardID: false,
      },
      password: '',
      accessAuthority: {
        accessType: null,
        startDate: null,
        endDate: null,
      },
    }),
    [currentDeviceUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewDeviceUserSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    trigger,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentDeviceUser) {
      setUserTypes([currentDeviceUser.userType]);
      if (currentDeviceUser.applicationUser) {
        setApplicationUsers([currentDeviceUser.applicationUser]);
      }
      reset(defaultValues);
    }
    return () => {
      resetCards();
      resetFingerprints();
    };
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDeviceUser]);
  useEffect(() => {
    if (!values.authTypeConfig.isPassword) {
      clearErrors("password");
    } else {
      trigger("password"); // optional: re-validate when enabling
    }
  }, [values.authTypeConfig.isPassword]);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const renderAccessGroupField = () => {
    if (isMdUp) {
      return (
        !accessGroupsLoading &&
        <AccessGroupTransferList
          options={transformedAccessGroups}
          onGet={setAccessGroups}
          selectedAccessGroups={currentDeviceUser?.aclUserAccessGroups || []}
        />
      );
    }

    return (
      <Controller
        name="accessGroupIds"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            {...field}
            multiple
            options={accessGroups || []}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name || ''}
            onChange={(event, newValue) => {
              const accessGroupsIds = newValue.map((group) => group.id);
              setValue('accessGroupIds', accessGroupsIds);
              setSelectedAccessGroupIds(newValue);
            }}
            limitTags={2}
            value={selectedAccessGroupIds}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={accessGroupsLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t_user('formsInputs.accessGroupIds')}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        )}
      />
    );
  };

  const setAccessGroups = (selectedAccessGroups) => {
    const accessGroupsIds = selectedAccessGroups.map((accessGroup) => accessGroup.id);
    setValue('accessGroupIds', accessGroupsIds);
  }

  const allowedAuthTypesFields = [
    { key: 'isFace', label: t_device('formsInputs.face') },
    { key: 'isFingerprint', label: t_device('formsInputs.fingerprint') },
    { key: 'isPassword', label: t_device('formsInputs.password') },
    { key: 'isCard', label: t_device('formsInputs.card') },
  ];
  const handleAuthTypeChange = (authType) => {
    const newSelectedAuthTypes = { ...selectedAuthTypes, [authType]: !selectedAuthTypes[authType] };

    if (!selectedAuthTypes.isAndOperation && Object.values(newSelectedAuthTypes).filter(Boolean).length > 2) {
      return;
    }
    setSelectedAuthTypes(newSelectedAuthTypes);
    setValue('authTypeConfig', newSelectedAuthTypes);
  };

  const onSubmit = (async (data) => {
    try {
      if (currentDeviceUser) {
        await UpdateDeviceUser({ ...data, id: currentDeviceUser.id });
        await editMutate();
      } else {
        const payload = {
          ...data,
          cards: data.authTypeConfig.isCard ? cards : [],
        };
        await CreateDeviceUser(payload);
      }
      toast.success(currentDeviceUser ? t_user('toastMessages.updateDeviceUser') : t_user('toastMessages.createDeviceUser'));
      router.push(paths.dashboard.aclUserManagement.root);
    } catch (error) {
      toast.error(error);
    }
  });
  const onError = (errors) => {
    console.log('Form errors:', errors);

    const processError = (error) => {
      // Direct message (e.g., userName, userID errors)
      if (error?.message) {
        return error.message;
      }

      // Nested errors (e.g., accessAuthority.startDate)
      if (typeof error === 'object' && error !== null) {
        return Object.values(error)
          .map(processError)
          .filter(Boolean)[0]; // Get first non-null message
      }

      return null;
    };

    // Process all errors
    const errorMessages = Object.values(errors)
      .map(processError)
      .filter(Boolean);

    // Show first error with translation
    if (errorMessages.length > 0) {
      toast.error(t_user(errorMessages[0]));
    }
  };

  const renderProperties = (
    <>
      <Box
        columnGap={3}
        rowGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
      >
        <Field.Text
          inputProps={{ type: 'number' }}
          name="userID" label={t_user('formsInputs.userId')} />
        <Field.Text
          inputProps={{ type: 'number' }}
          name="uniqueID" label={t_user('formsInputs.uniqueId')} />
        <Field.Text
          inputProps={{ type: 'text' }}
          name="userName" label={t_user('formsInputs.userName')} />
        <Controller
          name="userType"
          control={control}
          rules={{ required: t_user('formValidationErrors.userType.required') }}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              fullWidth
              options={userTypes}
              getOptionLabel={(option) => option.displayValues[currentLang.value]}
              onChange={(event, newValue) => {
                field.onChange(newValue ? newValue.value : null);
              }}
              onBlur={() => {
                field.onBlur();
                if (!field.value) {
                  setValue("userType", "", { shouldValidate: true });
                }
              }}
              onFocus={async () => {
                if (userTypes.length <= 1) {
                  try {
                    setUserTypesLoading(true);
                    const result = await getUserTypes();
                    setUserTypes(result || []);
                  } catch (error) {
                    console.error("Error fetching user types:", error);
                  } finally {
                    setUserTypesLoading(false);
                  }
                }
              }}
              value={userTypes?.find((item) => item.value === field.value) || null}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              disableClearable
              loading={userTypesLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t_user('formsInputs.userType')}
                  error={!!fieldState?.error}
                  helperText={fieldState?.error ? fieldState.error.message : ''}
                />
              )}
            />
          )}
        />
        <Controller
          name="applicationUserId"
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              fullWidth
              options={applicationUsers}
              getOptionLabel={(option) => option.fullName || option.userName}
              onChange={(event, newValue) => {
                field.onChange(newValue ? newValue.id : null);
              }}
              onFocus={async () => {
                if (applicationUsers.length <= 1) {
                  try {
                    setApplicationUsersLoading(true);
                    const pageSize = 100;
                    const result = await getApplicationUsers(pageSize);
                    setApplicationUsers(result || []);
                  } catch (error) {
                    console.error("Error fetching application Users:", error);
                  } finally {
                    setApplicationUsersLoading(false);
                  }
                }

              }}
              value={applicationUsers?.find((item) => item.id === field.value) || null}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={applicationUsersLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t_user('formsInputs.applicationUserId')}
                  error={!!fieldState?.error}
                  helperText={fieldState?.error ? fieldState.error.message : ''}
                />
              )}
            />
          )}
        />
        {!currentDeviceUser && <Field.Text
          inputProps={{ type: 'number' }}
          name="password" label={t_user('formsInputs.password')} disabled={!selectedAuthTypes.isPassword} />}
        {!currentDeviceUser &&
          <>
            <Controller
              name="accessAuthority.accessType"
              control={control}
              render={({ field, fieldState }) => (
                <Autocomplete
                  {...field}
                  fullWidth
                  disableClearable
                  options={accessTypes || []}
                  getOptionLabel={(option) => option.displayValues[currentLang.value]}
                  onChange={(event, newValue) => {
                    field.onChange(newValue ? newValue.value : null);
                  }}
                  onFocus={async () => {
                    if (accessTypes.length < 1) {
                      try {
                        await getAccessTypes();
                      } catch (error) {
                        toast.error(error);
                      }
                    }
                  }}
                  value={accessTypes?.find((item) => item.value === field.value) || null}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  loading={loading.getTrafficModes}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t_user('formsInputs.accessType')}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error ? fieldState.error.message : ''}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="accessAuthority.startDate"
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
                  disabled={values.accessAuthority.accessType === "Without_Limit" || values.accessAuthority.accessType === null}
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
              name="accessAuthority.endDate"
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
                  disabled={values.accessAuthority.accessType === "Without_Limit" || values.accessAuthority.accessType === null}
                  slotProps={{
                    textField: {
                      name: "start-date-input",
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
          </>
        }
      </Box>
      {!currentDeviceUser && <><Divider sx={{ my: 2 }} /><Box sx={{ mt: 3 }}>
        <Typography variant="h7">{t_user('formsInputs.authTypeConfig')}:</Typography>
        <Box>
          <Controller
            name="authTypeConfig.isAndOperation"
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
                      setValue("authTypeConfig", selectedAuthTypes);
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
          rowGap={2}
          columnGap={0.25}
          sx={{ mt: 2 }}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {allowedAuthTypesFields.map(({ key, label }) => (
            <Controller
              key={key}
              name={`authTypeConfig.${key}`}
              control={control}
              render={({ field, fieldState }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={selectedAuthTypes[key] ?? false}
                      onChange={() => handleAuthTypeChange(key)}
                      disabled={
                        !values.authTypeConfig.isAndOperation &&
                        Object.values(selectedAuthTypes).filter(Boolean).length >= 2 &&
                        !selectedAuthTypes[key]
                      }
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      {label}
                    </Box>
                  }
                />
              )}
            />
          ))}
        </Box>
      </Box>
        < Divider sx={{ my: 2 }} />
        <Box
          rowGap={3}
          columnGap={1}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)'
          }}
          sx={{
            my: 3,
          }}
        >
          <Controller
            name="isAdmin"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                  />
                }
                label={t_user('formsInputs.isAdmin')}
              />
            )}
          />
          <Controller
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
                label={t_user('formsInputs.syncWithDevicesInUserAccessGroups')}
              />
            )}
          />
        </Box>
        <Box
          sx={{ my: 3 }}
          columnGap={3}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          <Button
            sx={{ width: '200px' }}
            variant="contained"
            disabled={!selectedAuthTypes.isCard}
            onClick={() => setOpenCardDialog(true)}
          >
            {t_user('buttons.cardSettings')}
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} /></>}

      {!currentDeviceUser && renderAccessGroupField()}
      <CardSettings open={openCardDialog} onClose={() => setOpenCardDialog(false)} />
    </>
  );
  const renderActions = (
    <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
      <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {!currentDeviceUser ? t_user('buttons.createDeviceUser') : t_common('button.update')}
        </Button>
      </Stack>
    </Box>
  );
  return (
    <Grid size={{ xs: 12, md: 10 }}>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
        <Stack spacing={5} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 950 } }}>
          <Card sx={{ p: 3 }}>
            {renderProperties}
            {renderActions}
          </Card>
        </Stack>
      </Form>
    </Grid>
  );
}

