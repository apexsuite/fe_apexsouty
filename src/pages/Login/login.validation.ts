import * as yup from 'yup';

export interface LoginFormData {
  email: string;
  password: string;
}

export const getLoginValidationSchema = (t: (key: string) => string) =>
  yup.object().shape({
    email: yup
      .string()
      .required(t('login.validation.emailRequired'))
      .email(t('login.validation.emailInvalid')),
    password: yup
      .string()
      .required(t('login.validation.passwordRequired'))
      .min(6, t('login.validation.passwordMin')),
  });

