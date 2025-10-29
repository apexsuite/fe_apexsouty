import { toast } from 'react-toastify';

interface ValidationError {
  key: string;
  message: string;
}

const fieldKeyMapping: Record<string, string> = {
  'icon': 'Icon',
  'name': 'Name',
  'email': 'Email',
  'password': 'Password',
  'username': 'Username',
  'description': 'Description',
  'path': 'Path',
  'component': 'Component',
  'title': 'Title',
  'content': 'Content',
  'slug': 'Slug',
  'category': 'Category',
  'status': 'Status',
  'role': 'Role',
  'permission': 'Permission',
  'marketplace': 'Marketplace',
  'product': 'Product',
  'price': 'Price',
  'currency': 'Currency',
  'interval': 'Interval',
  'unitAmount': 'Unit Amount',
  'website': 'Website',
  'url': 'URL',
  'phone': 'Phone',
  'address': 'Address',
  'city': 'City',
  'state': 'State',
  'postalCode': 'Postal Code',
  'country': 'Country',
  'firstName': 'First Name',
  'lastName': 'Last Name',
  'firstname': 'First Name',
  'lastname': 'Last Name',
  'parentID': 'Parent ID',
  'isActive': 'Is Active',
  'isVisible': 'Is Visible',
  'isUnderConstruction': 'Under Construction',
  'isDefault': 'Is Default',
  'isStripe': 'Is Stripe',
  'marketingFeatures': 'Marketing Features',
  'statementDescriptor': 'Statement Descriptor',
  'unitLabel': 'Unit Label',
};

/**
 * @param error - API'den gelen hata objesi
 * @param t - i18n translation fonksiyonu
 */
export const handleValidationErrors = (error: any, t: (key: string) => string) => {
  try {
    if (!error?.error?.validations || !Array.isArray(error.error.validations)) {
      const apiMessage = error?.error?.message || error?.message;
      
      if (apiMessage && typeof apiMessage === 'string') {
        const isTranslationKey = /^[a-z][a-zA-Z0-9]*$/.test(apiMessage) || /^[a-z]+(-[a-z]+)*$/.test(apiMessage);
        
        if (isTranslationKey) {
          const translatedMessage = t(`notification.${apiMessage}`) || apiMessage;
          toast.error(translatedMessage);
        } else {
          toast.error(apiMessage);
        }
      } else {
        toast.error(t('notification.anErrorOccurred'));
      }
      return;
    }

    const validations = error.error.validations as ValidationError[];
    
    if (validations.length > 0) {
      const firstValidation = validations[0];
      const { key, message } = firstValidation;
      
            const fieldTitle = fieldKeyMapping[key] || key.charAt(0).toUpperCase() + key.slice(1);
      
      const translatedMessage = t(`notification.${message}`) || message;
      
      toast.error(`${fieldTitle}: ${translatedMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
  } catch (parseError) {
    console.error('Error parsing validation errors:', parseError);
    toast.error(t('notification.anErrorOccurred'));
  }
};

/**
 * @param error - API'den gelen hata objesi
 * @param t - i18n translation fonksiyonu
 */
export const handleApiError = (error: any, t: (key: string) => string) => {
  try {
    const actualError = error?.data || error;
    
    
    if (actualError?.error?.validations && Array.isArray(actualError.error.validations)) {
      handleValidationErrors(actualError, t);
      return;
    }
    
    if (actualError?.error?.message) {
      const apiMessage = actualError.error.message;
      
      if (apiMessage && typeof apiMessage === 'string') {
        const isTranslationKey = /^[a-z][a-zA-Z0-9]*$/.test(apiMessage) || /^[a-z]+(-[a-z]+)*$/.test(apiMessage);
        
        if (isTranslationKey) {
          const translatedMessage = t(`notification.${apiMessage}`) || apiMessage;
          toast.error(translatedMessage);
        } else {
          toast.error(apiMessage);
        }
        return;
      }
    }
    
    const status = error?.status || error?.response?.status;
    
    let errorMessage = t('notification.anErrorOccurred');
    
    switch (status) {
      case 400:
        errorMessage = t('notification.someValidationErrorsOccurred');
        break;
      case 401:
        errorMessage = t('notification.errInvalidCredentials');
        break;
      case 403:
        errorMessage = t('notification.errNotAllowedForOnBehalfOfUsers');
        break;
      case 404:
        errorMessage = t('notification.recordNotFound');
        break;
      case 409:
        errorMessage = t('notification.userAlreadyExists');
        break;
      case 429:
        errorMessage = t('notification.tooManyRequests');
        break;
      case 500:
        errorMessage = t('notification.serviceUnavailable');
        break;
      default:
              
        const apiMessage = actualError?.error?.message || error?.error?.message || error?.message;
        
        if (apiMessage && typeof apiMessage === 'string') {
          const isTranslationKey = /^[a-z][a-zA-Z0-9]*$/.test(apiMessage) || /^[a-z]+(-[a-z]+)*$/.test(apiMessage);
          
          if (isTranslationKey) {
            errorMessage = t(`notification.${apiMessage}`) || apiMessage;
          } else {
            errorMessage = apiMessage;
          }
        } else {
          errorMessage = t('notification.anErrorOccurred');
        }
    }
    
    toast.error(errorMessage);
    
  } catch (parseError) {
    console.error('Error handling API error:', parseError);
    toast.error(t('notification.anErrorOccurred'));
  }
};

/**
 * @param message - Gösterilecek mesaj
 * @param t - i18n translation fonksiyonu
 */
export const showSuccessToast = (message: string, t: (key: string) => string) => {
  const translatedMessage = t(`notification.${message}`) || message;
  toast.success(translatedMessage);
};

/**
 * @param message - Gösterilecek mesaj
 * @param t - i18n translation fonksiyonu
 */
export const showWarningToast = (message: string, t: (key: string) => string) => {
  const translatedMessage = t(`notification.${message}`) || message;
  toast.warning(translatedMessage);
};

/**
 * @param message - Gösterilecek mesaj
 * @param t - i18n translation fonksiyonu
 */
export const showInfoToast = (message: string, t: (key: string) => string) => {
  const translatedMessage = t(`notification.${message}`) || message;
  toast.info(translatedMessage);
};
