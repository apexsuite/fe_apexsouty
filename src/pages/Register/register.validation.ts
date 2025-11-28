import * as yup from 'yup';

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const getRegisterValidationSchema = (t: (key: string) => string) =>
  yup.object().shape({
    fullName: yup
      .string()
      .required(t('register.validation.fullNameRequired'))
      .min(2, t('register.validation.fullNameMin')),
    email: yup
      .string()
      .required(t('register.validation.emailRequired'))
      .email(t('register.validation.emailInvalid')),
    password: yup
      .string()
      .required(t('register.validation.passwordRequired'))
      .min(6, t('register.validation.passwordMin')),
    confirmPassword: yup
      .string()
      .required(t('register.validation.confirmPasswordRequired'))
      .oneOf([yup.ref('password')], t('register.validation.passwordsNotMatch')),
  });

