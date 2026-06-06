import { z as zod } from 'zod';
import { useMemo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Autocomplete, Grid, TextField, Typography, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useDeviceUserStore } from 'src/stores/device-user-store';
import { CreateDeviceType, getModels, UpdateDeviceType, useGetBrands, useGetDeviceType, useGetDeviceTypes } from 'src/actions/device-type';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function DeviceTypeNewEditForm({ currentDeviceType }) {
  const { getCardTypes } = useDeviceUserStore();
  const router = useRouter();
  const { t: t_device } = useTranslate('device');
  const { t: t_common } = useTranslate();
  const NewDeviceTypeSchema = zod.object({
    description: zod.string().nullable().transform(value => value === '' ? null : value),
    usesTerminalId: zod.boolean().default(false),
    usesSerialNumber: zod.boolean().default(false),
    hasCamera: zod.boolean().default(false),
    cardTypes: zod.array(zod.string()).refine(value => value.length > 0, { message: t_device('formValidationErrors.cardTypes.required') }),
    brand: zod.string().min(1, { message: t_device('formValidationErrors.brand.required') }),
    model: zod.string().min(1, { message: t_device('formValidationErrors.model.required') }),
    deviceImage: zod.instanceof(File).refine(file => file?.size < 2 * 1024 * 1024, { message: 'File size must be less than 2MB' }).optional().nullable(),
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const { brands, brandsLoading } = useGetBrands();
  const [selectedBrand, setSelectedBrand] = useState(currentDeviceType?.brand || null);

  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [selectedCardTypes, setSelectedCardTypes] = useState(currentDeviceType?.cardTypes || []);
  const [cardTypesLoading, setCardTypesLoading] = useState(false);
  const [cardTypes, setCardTypes] = useState([]);
  const { mutate: editMutate } = useGetDeviceType(currentDeviceType?.id);
  const { mutate: listMutate } = useGetDeviceTypes();

  const defaultValues = useMemo(
    () => ({
      description: currentDeviceType?.description || '',
      usesTerminalId: currentDeviceType?.usesTerminalId || false,
      usesSerialNumber: currentDeviceType?.usesSerialNumber || false,
      cardTypes: currentDeviceType?.cardTypes || [],
      hasCamera: currentDeviceType?.hasCamera || false,
      brand: currentDeviceType?.brand || '',
      model: currentDeviceType?.model || '',
      deviceImage: null,
    }),
    [currentDeviceType]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewDeviceTypeSchema),
    defaultValues,
  });
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const FetchModels = async () => {
      try {
        setModelsLoading(true);
        const modelData = await getModels(selectedBrand);
        setModels(modelData);

      } catch (err) {
        console.log('Failed to fetch models', err);
      } finally {
        setModelsLoading(false);
      }
    };
    if (selectedBrand) {
      FetchModels();
    }
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBrand]);

  useEffect(() => {
    if (currentDeviceType) {
      reset(defaultValues);
      setSelectedBrand(currentDeviceType.brand);
    }
  }, [currentDeviceType, defaultValues, reset, selectedBrand]);

  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    methods.setValue('deviceImage', file);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Handle arrays separately
          if (Array.isArray(value)) {
            value.forEach((item) => {
              formData.append(key, item); // Append each array item separately
            });
          } else {
            formData.append(key, value);
          }
        }
      });

      if (currentDeviceType) {
        formData.append('id', currentDeviceType.id);
        await UpdateDeviceType(formData);
        await editMutate();
      }
      else {
        await CreateDeviceType(formData);
      }
      await listMutate();
      router.push(paths.dashboard.deviceType.root);
      toast.success(currentDeviceType ? t_device('toastMessages.updateDeviceType') : t_device('toastMessages.createDeviceType'));
    } catch (error) {
      toast.error(error);
    }
  });

  const renderActions = (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
        <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center" sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {!currentDeviceType ? t_device('button.addDeviceType') : t_common('button.update')}
          </Button>
        </Stack>
      </Box>
    </>
  );

  const renderProperties = (
    <>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ pt: 9, pb: 5, px: 3, mx: 3 }}>
          <Box sx={{ mb: 5, display: 'grid', textAlign: 'center', justifyItems: 'center' }}>
            <Box
              sx={{
                width: 180,
                height: 173,
                borderRadius: '5%',
                backgroundColor: 'grey.600',
                cursor: 'pointer',
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: 'grey.800',
                },
              }}
            >
              <input
                accept="image/*"
                type="file"
                style={{ display: 'none' }}
                id="device-image-input"
                onChange={handleSelectImage}
              />
              <label htmlFor="device-image-input">
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  {selectedImage ? (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '5%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {t_device('texts.selectImage')}
                    </Typography>
                  )}
                </Box>
              </label>
            </Box>
          </Box>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Controller
              name="brand"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  {...field}
                  fullWidth
                  options={brands || []}
                  getOptionLabel={(option) => option}
                  onChange={(event, newValue) => {
                    setSelectedBrand(newValue || null);
                    field.onChange(newValue || '');
                  }}
                  disableClearable
                  value={brands?.find((item) => item === field.value) || null}
                  isOptionEqualToValue={(option, value) => option === value}
                  loading={brandsLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t_device('formsInputs.brand')}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="model"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  {...field}
                  fullWidth
                  freeSolo
                  autoSelect
                  options={models || []}
                  getOptionLabel={(option) => option}
                  disabled={!currentDeviceType && !selectedBrand}
                  isOptionEqualToValue={(option, value) => option === value}
                  onChange={(event, newValue) => {
                    field.onChange(newValue || '');
                  }}
                  disableClearable
                  loading={modelsLoading}
                  value={models?.find((item) => item === field.value) || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t_device('formsInputs.model')}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="cardTypes"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  {...field}
                  multiple
                  options={cardTypes || []}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option || ''}
                  onChange={(event, newValue) => {
                    setValue('cardTypes', newValue);
                    setSelectedCardTypes(newValue);
                  }}
                  onFocus={async () => {
                    if (cardTypes.length <= 1) {
                      try {
                        setCardTypesLoading(true);
                        const result = await getCardTypes();
                        setCardTypes(result || []);
                      } catch (errors) {
                        toast.error(errors);
                      } finally {
                        setCardTypesLoading(false);
                      }
                    }
                  }}
                  limitTags={2}
                  value={selectedCardTypes}
                  isOptionEqualToValue={(option, value) => option === value}
                  loading={cardTypesLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t_device('formsInputs.cardTypes')}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="usesTerminalId"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label={t_device('formsInputs.usesTerminalId')}
                />
              )}
            />
            <Controller
              name="usesSerialNumber"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label={t_device('formsInputs.usesSerialNumber')}
                />
              )}
            />
            <Controller
              name="hasCamera"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label={t_device('formsInputs.hasCamera')}
                />
              )}
            />
          </Box>
          <Box>
            <Field.Text name="description" label={t_device('formsInputs.description')} multiline rows={3} />
          </Box>
          {renderActions}
        </Card>
      </Grid>
    </>
  );



  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>

        {renderProperties}

      </Grid >
    </Form>
  );
}
