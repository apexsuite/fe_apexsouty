import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/services/auth';
import { IForgotPasswordRequest } from '@/services/auth/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getForgotPasswordValidationSchema, ForgotPasswordFormData } from './forgotPassword.validation';
import { ControlledInputText } from '@/components/FormInputs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const currentLang = useSelector((state: RootState) => state.lang.language);
  const { t } = useTranslation();

  const validationSchema = useMemo(
    () => getForgotPasswordValidationSchema(t),
    [t]
  );

  const {
    control,
    handleSubmit,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: IForgotPasswordRequest) => forgotPassword(data),
    onSuccess: (response) => {
      if (response && !response.error) {
        toast.success(t('forgotPassword.success'));
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMessage =
          response?.error?.message ||
          response?.message ||
          t('forgotPassword.failed');
        toast.error(errorMessage);
      }
    },
    onError: (error: any) => {
      let errorMessage = t('forgotPassword.failed');

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

  const onSubmit = (data: ForgotPasswordFormData) => {
    const forgotPasswordData: IForgotPasswordRequest = {
      email: data.email,
      language: currentLang || 'en',
    };

    forgotPasswordMutation.mutate(forgotPasswordData);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="absolute right-4 top-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md px-4">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gray-800 dark:bg-gray-800 shadow-md">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <span className="text-3xl font-bold leading-tight tracking-tight text-gray-800 dark:text-white">
            ApexScouty
          </span>
        </div>

        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-semibold text-gray-800 dark:text-white">
            {t('forgotPassword.title')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('forgotPassword.subtitle')}
          </p>
        </div>

        <Card className="border-none shadow-md dark:bg-gray-800/50">
          <CardContent className="p-6">
            <div className="mb-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('forgotPassword.back')}
              </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <ControlledInputText
                control={control}
                name="email"
                label={t('forgotPassword.emailAddress')}
                placeholder={t('forgotPassword.emailPlaceholder')}
                required
                type="email"
                icon={Mail}
                autoComplete="email"
              />

              <Button
                type="submit"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-900"
                size="xl"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending
                  ? t('forgotPassword.sending')
                  : t('forgotPassword.button')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

