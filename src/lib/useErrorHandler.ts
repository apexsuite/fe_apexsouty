import { useTranslation } from 'react-i18next';
import {
  handleApiError,
  handleValidationErrors,
  showSuccessToast,
  showWarningToast,
  showInfoToast,
} from './errorHandler';

/**
 * Error handling için custom hook
 * API hatalarını handle etmek ve toast notification göstermek için kullanılır
 */
export const useErrorHandler = () => {
  const { t } = useTranslation();

  return {
    /**
     * API hatalarını handle eder
     * @param error - API'den gelen hata objesi
     */
    handleError: (error: any) => handleApiError(error, t),

    /**
     * Validation hatalarını handle eder
     * @param error - API'den gelen validation hata objesi
     */
    handleValidationError: (error: any) => handleValidationErrors(error, t),

    /**
     * Başarı mesajı gösterir
     * @param message - Gösterilecek mesaj key'i
     */
    showSuccess: (message: string) => showSuccessToast(message, t),

    /**
     * Uyarı mesajı gösterir
     * @param message - Gösterilecek mesaj key'i
     */
    showWarning: (message: string) => showWarningToast(message, t),

    /**
     * Bilgi mesajı gösterir
     * @param message - Gösterilecek mesaj key'i
     */
    showInfo: (message: string) => showInfoToast(message, t),
  };
};
