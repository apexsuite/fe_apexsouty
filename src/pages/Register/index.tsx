import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/services/auth';
import { IRegisterRequest } from '@/services/auth/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getRegisterValidationSchema, RegisterFormData } from './register.validation';
import { ControlledInputText } from '@/components/FormInputs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Lock } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export default function Register() {
    const navigate = useNavigate();
    const currentLang = useSelector((state: RootState) => state.lang.language);
    const { t } = useTranslation();

    const validationSchema = useMemo(
        () => getRegisterValidationSchema(t),
        [t]
    );

    const {
        control,
        handleSubmit,
    } = useForm<RegisterFormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const registerMutation = useMutation({
        mutationFn: (data: IRegisterRequest) => register(data),
        onSuccess: (response) => {
            if (response && !response.error) {
                toast.success(t('register.success'));
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        },
        onError: (error: any) => {
            let errorMessage = t('register.failed');

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

    const onSubmit = (data: RegisterFormData) => {
        const nameParts = data.fullName.trim().split(/\s+/);
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';

        const registerData: IRegisterRequest = {
            firstname,
            lastname,
            email: data.email,
            language: currentLang || 'en',
            password: data.password,
        };

        registerMutation.mutate(registerData);
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
                        {t('register.createAccount')}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {t('register.subtitle')}
                    </p>
                </div>

                {/* Form Card */}
                <Card className="border-none shadow-md">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Full Name */}
                            <ControlledInputText
                                control={control}
                                name="fullName"
                                label={t('register.fullName')}
                                placeholder={t('register.fullNamePlaceholder')}
                                required
                                type="text"
                                icon={User}
                            />

                            {/* Email */}
                            <ControlledInputText
                                control={control}
                                name="email"
                                label={t('register.emailAddress')}
                                placeholder={t('register.emailPlaceholder')}
                                required
                                type="email"
                                icon={Mail}
                                autoComplete="email"
                            />

                            {/* Password */}
                            <ControlledInputText
                                control={control}
                                name="password"
                                label={t('register.password')}
                                placeholder={t('register.passwordPlaceholder')}
                                required
                                type="password"
                                icon={Lock}
                                autoComplete="new-password"
                            />

                            {/* Confirm Password */}
                            <ControlledInputText
                                control={control}
                                name="confirmPassword"
                                label={t('register.confirmPassword')}
                                placeholder={t('register.confirmPasswordPlaceholder')}
                                required
                                type="password"
                                icon={Lock}
                                autoComplete="new-password"
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                size="xl"
                                disabled={registerMutation.isPending}
                            >
                                {registerMutation.isPending ? t('register.signingUp') : t('register.signUp')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    {t('register.haveAccount')}{' '}
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        {t('register.login')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

