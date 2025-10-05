import { toast } from 'react-toastify';

// API'den gelen hata yapısı
interface ValidationError {
  key: string;
  message: string;
}

// Field key'lerini kullanıcı dostu başlıklara çeviren mapping
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
 * API'den gelen validation hatalarını parse eder ve toast notification olarak gösterir
 * @param error - API'den gelen hata objesi
 * @param t - i18n translation fonksiyonu
 */
export const handleValidationErrors = (error: any, t: (key: string) => string) => {
  try {
    // Hata yapısını kontrol et
    if (!error?.error?.validations || !Array.isArray(error.error.validations)) {
      // Validation hatası değilse genel hata mesajını göster
      const apiMessage = error?.error?.message || error?.message;
      
      if (apiMessage && typeof apiMessage === 'string') {
        // i18n key pattern'i kontrol et
        const isTranslationKey = /^[a-z][a-zA-Z0-9]*$/.test(apiMessage) || /^[a-z]+(-[a-z]+)*$/.test(apiMessage);
        
        if (isTranslationKey) {
          // Key ise translate et
          const translatedMessage = t(`notification.${apiMessage}`) || apiMessage;
          toast.error(translatedMessage);
        } else {
          // Direkt string ise olduğu gibi göster
          toast.error(apiMessage);
        }
      } else {
        toast.error(t('notification.anErrorOccurred'));
      }
      return;
    }

    const validations = error.error.validations as ValidationError[];
    
    // Sadece ilk validation hatasını göster
    if (validations.length > 0) {
      const firstValidation = validations[0];
      const { key, message } = firstValidation;
      
      // Field key'ini kullanıcı dostu başlığa çevir
      const fieldTitle = fieldKeyMapping[key] || key.charAt(0).toUpperCase() + key.slice(1);
      
      // i18n'den mesajı çevir
      const translatedMessage = t(`notification.${message}`) || message;
      
      // Toast notification göster
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
    // Parse hatası durumunda genel hata mesajını göster
    toast.error(t('notification.anErrorOccurred'));
  }
};

/**
 * Genel API hatalarını handle eder
 * @param error - API'den gelen hata objesi
 * @param t - i18n translation fonksiyonu
 */
export const handleApiError = (error: any, t: (key: string) => string) => {
  try {
    // Axios error yapısını kontrol et - asıl hata data içinde
    const actualError = error?.data || error;
    
    console.log('=== API ERROR DEBUG ===');
    console.log('actualError:', actualError);
    console.log('error:', error);
    console.log('actualError?.error:', actualError?.error);
    console.log('========================');
    
    // Önce validation hatalarını kontrol et
    if (actualError?.error?.validations && Array.isArray(actualError.error.validations)) {
      handleValidationErrors(actualError, t);
      return;
    }
    
    // Eğer error objesi var ama validations yoksa, message'ı kontrol et
    if (actualError?.error?.message) {
      const apiMessage = actualError.error.message;
      
      if (apiMessage && typeof apiMessage === 'string') {
        // i18n key pattern'i kontrol et
        const isTranslationKey = /^[a-z][a-zA-Z0-9]*$/.test(apiMessage) || /^[a-z]+(-[a-z]+)*$/.test(apiMessage);
        
        if (isTranslationKey) {
          // Key ise translate et
          const translatedMessage = t(`notification.${apiMessage}`) || apiMessage;
          toast.error(translatedMessage);
        } else {
          // Direkt string ise olduğu gibi göster
          toast.error(apiMessage);
        }
        return;
      }
    }
    
    // HTTP status koduna göre hata mesajı belirle
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
        // API'den gelen mesajı kullan - error objesi içindeki message
        console.log('=== ERROR DEBUG ===');
        console.log('actualError:', actualError);
        console.log('error:', error);
        console.log('actualError?.error?.message:', actualError?.error?.message);
        console.log('error?.error?.message:', error?.error?.message);
        console.log('error?.message:', error?.message);
        console.log('==================');
        
        const apiMessage = actualError?.error?.message || error?.error?.message || error?.message;
        
        // Eğer mesaj direkt string ise (key değilse) direkt göster
        if (apiMessage && typeof apiMessage === 'string') {
          // i18n key pattern'i kontrol et (genellikle camelCase veya kebab-case)
          const isTranslationKey = /^[a-z][a-zA-Z0-9]*$/.test(apiMessage) || /^[a-z]+(-[a-z]+)*$/.test(apiMessage);
          
          if (isTranslationKey) {
            // Key ise translate et
            errorMessage = t(`notification.${apiMessage}`) || apiMessage;
          } else {
            // Direkt string ise olduğu gibi göster
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
 * Başarı mesajları için toast gösterir
 * @param message - Gösterilecek mesaj
 * @param t - i18n translation fonksiyonu
 */
export const showSuccessToast = (message: string, t: (key: string) => string) => {
  const translatedMessage = t(`notification.${message}`) || message;
  toast.success(translatedMessage);
};

/**
 * Uyarı mesajları için toast gösterir
 * @param message - Gösterilecek mesaj
 * @param t - i18n translation fonksiyonu
 */
export const showWarningToast = (message: string, t: (key: string) => string) => {
  const translatedMessage = t(`notification.${message}`) || message;
  toast.warning(translatedMessage);
};

/**
 * Bilgi mesajları için toast gösterir
 * @param message - Gösterilecek mesaj
 * @param t - i18n translation fonksiyonu
 */
export const showInfoToast = (message: string, t: (key: string) => string) => {
  const translatedMessage = t(`notification.${message}`) || message;
  toast.info(translatedMessage);
};
