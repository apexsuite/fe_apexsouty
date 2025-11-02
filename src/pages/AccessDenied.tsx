import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Home } from 'lucide-react';
import { useTheme } from '@/providers/theme';

const AccessDenied: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  // Get the attempted path from navigation state, fallback to current path
  const attemptedPath = location.state?.attemptedPath || location.pathname;

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="mx-4 w-full max-w-md">
        <div
          className={`rounded-lg p-8 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div
              className={`rounded-full p-4 ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'}`}
            >
              <AlertTriangle size={48} className="text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h1
            className={`mb-4 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            {t('accessDenied.title')}
          </h1>

          {/* Description */}
          <p
            className={`mb-2 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {t('accessDenied.description')}
          </p>

          <p
            className={`mb-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {t('accessDenied.attemptedPath')}
          </p>

          <p
            className={`mb-8 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <code
              className={`rounded px-2 py-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              {attemptedPath}
            </code>
          </p>

          {/* Actions */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={handleGoHome}
              className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Home size={20} />
              {t('accessDenied.goHome')}
            </button>
          </div>

          {/* Additional Info */}
          <div
            className={`mt-8 border-t pt-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <p
              className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
            >
              {t('accessDenied.contactAdmin')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
