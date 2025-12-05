import * as yup from 'yup';
import {
  IUserCreateRequest,
  IUserUpdateRequest,
} from '@/services/user-managment/types';

export const userFormValidationSchema = (
  isEditMode: boolean
): yup.ObjectSchema<IUserCreateRequest | IUserUpdateRequest, any, any, ''> =>
  yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    firstname: yup.string().required('First name is required'),
    lastname: yup.string().required('Last name is required'),
    password: isEditMode
      ? yup.string().optional()
      : yup.string().required('Password is required'),
    userType: yup.string().required('User type is required'),
    isActive: yup.boolean().required('Is active is required'),
  }) as yup.ObjectSchema<IUserCreateRequest | IUserUpdateRequest>;

export default userFormValidationSchema;
