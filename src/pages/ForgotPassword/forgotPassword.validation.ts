import * as yup from 'yup';

export interface ForgotPasswordFormData {
  email: string;
}

export const getForgotPasswordValidationSchema = (t: (key: string) => string) =>
  yup.object().shape({
    email: yup
      .string()
      .required(t('forgotPassword.validation.emailRequired'))
      .email(t('forgotPassword.validation.emailInvalid')),
  });

