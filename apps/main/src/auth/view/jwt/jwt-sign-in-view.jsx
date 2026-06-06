'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconifyLocal } from '@repo/ui/iconify-local';
import { getErrorMessage } from '@repo/ui/error-message';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { CardMedia } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';
import { AuthCenteredLayout } from '../AuthCenteredLayout';

export function JwtSignInView() {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const { t } = useTranslate();

  const [errorMessage, setErrorMessage] = useState('');

  const password = useBoolean();

  const defaultValues = {
    username: '',
    password: '',
  };

  const SignInSchema = zod.object({
    username: zod
      .string()
      .min(1, { message: t('formValidationErrors.username.required') }),
    password: zod
      .string()
      .min(1, { message: t('formValidationErrors.password.required') }),
  });

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ username: data.username, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  });

  const renderForm = () => (
    <Box sx={{ width: '100%' }}>
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <Typography sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {t('commonTexts.enterYourAccount')}
        </Typography>
        <CardMedia
          component="img"
          image="/organizationLogo.jpg"
          alt="Organization Logo"
          sx={{ width: '50%', m: 2, borderRadius: '30px' }}
        />
      </Box>

      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', mt: 3 }}>
        <Field.Text
          name="username"
          label={t('formsInputs.username')}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
          <Field.Text
            name="password"
            label={t('formsInputs.password')}
            placeholder="6+ characters"
            type={password.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <IconifyLocal>
                        {password.value ? <GoEyeClosed /> : <GoEye />}
                      </IconifyLocal>
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          loadingIndicator={t('commonTexts.signingIn')}
        >
          {t('button.signIn')}
        </Button>
      </Box>
    </Box>
  );

  return (
    <AuthCenteredLayout>
      <FormHead
        description={<></>}
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </AuthCenteredLayout>
  );
}
