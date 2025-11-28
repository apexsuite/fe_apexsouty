import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/store';
import { checkAuth, clearError } from '@/lib/authSlice';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/auth';
import { ILoginRequest } from '@/services/auth/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getLoginValidationSchema, LoginFormData } from './login.validation';
import { ControlledInputText } from '@/components/FormInputs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Lock } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useErrorHandler } from '@/lib/useErrorHandler';
import useQueryParamHandler from '@/utils/hooks/useQueryParamHandler';
import { requestConsentsCallback } from '@/services/consents';
import { IConsentsCallback } from '@/services/consents/types';

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      return !!(token && user);
    }
    return false;
  });

  useQueryParamHandler();

  const validationSchema = useMemo(
    () => getLoginValidationSchema(t),
    [t]
  );

  const {
    control,
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const requestConsentsCallbackMutation = useMutation({
    mutationFn: (params: IConsentsCallback) => requestConsentsCallback(params),
    onSuccess: (response) => {
      const redirectUrl = response?.data;
      if (redirectUrl && typeof redirectUrl === 'string') {
        localStorage.removeItem('pendingAmazonCallbackParams');
        window.location.href = redirectUrl;
      } else {
        handleError({ message: 'Authorization URL not found in response' });
        localStorage.removeItem('pendingAmazonCallbackParams');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Error requesting Amazon consent callback');
      handleError(error);
      localStorage.removeItem('pendingAmazonCallbackParams');
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: ILoginRequest) => login(data),
    onSuccess: async (response) => {
      if (response && !response.error) {
        // Save token if present in response
        if (response.token) {
          localStorage.setItem('token', response.token);
        } else if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }

        toast.success(t('notification.success'));

        try {
          await dispatch(checkAuth()).unwrap();
          setIsAuthenticated(true);

          const pendingCallbackParams = localStorage.getItem(
            'pendingAmazonCallbackParams'
          );

          if (pendingCallbackParams) {
            try {
              const params = JSON.parse(pendingCallbackParams);
              if (
                params.amazonCallbackUri &&
                params.amazonState &&
                params.sellingPartnerId
              ) {
                requestConsentsCallbackMutation.mutate({
                  amazonCallbackUri: params.amazonCallbackUri,
                  amazonState: params.amazonState,
                  sellingPartnerId: params.sellingPartnerId,
                });
                return;
              }
            } catch (parseError) {
              console.error(
                'Error parsing pendingAmazonCallbackParams:',
                parseError
              );
              localStorage.removeItem('pendingAmazonCallbackParams');
            }
          }

          navigate('/dashboard');
        } catch (checkError) {
          console.error('CheckAuth failed after login:', checkError);
          navigate('/dashboard');
          setIsAuthenticated(true);
        }
      } else {
        const errorMessage =
          response?.error?.message || response?.message || t('login.failed');
        toast.error(errorMessage);
      }
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      let errorMessage = t('login.failed');

      if (error?.data?.error) {
        errorMessage = error.data.error.message || errorMessage;
        if (
          error.data.error.validations &&
          error.data.error.validations.length > 0
        ) {
          const validationMessages = error.data.error.validations
            .map((v: any) => v.message)
            .join(', ');
          errorMessage = `${errorMessage}: ${validationMessages}`;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: LoginFormData) => {
    const loginData: ILoginRequest = {
      email: data.email,
      password: data.password,
    };

    loginMutation.mutate(loginData);
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center"
      style={{ backgroundColor: '#f0f4f8' }}
    >
      {/* Language Switcher - Top Right */}
      <div className="absolute right-4 top-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md px-4">
        {/* Logo and Brand */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gray-800 shadow-md">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <span className="text-3xl font-bold leading-tight tracking-tight text-gray-800">
            ApexScouty
          </span>
        </div>

        {/* Title and Subtitle */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-semibold text-gray-800">
            {t('login.signInTitle')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <ControlledInputText
                control={control}
                name="email"
                label={t('login.emailAddress')}
                placeholder={t('login.emailPlaceholder')}
                required
                type="email"
                icon={Mail}
                autoComplete="email"
              />

              {/* Password */}
              <ControlledInputText
                control={control}
                name="password"
                label={t('login.password')}
                placeholder={t('login.passwordPlaceholder')}
                required
                type="password"
                icon={Lock}
                autoComplete="current-password"
              />

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {t('login.forgot')}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="xl"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t('login.loggingIn') : t('login.signIn')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {t('login.noAccount')}{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            {t('login.signUp')}
          </Link>
        </div>
      </div>
    </div>
  );
}

