import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { AlertTriangle, Home } from 'lucide-react';

const AccessDenied: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector((state: RootState) => state.theme.theme);
  
  // Get the attempted path from navigation state, fallback to current path
  const attemptedPath = location.state?.attemptedPath || location.pathname;

  const handleGoHome = () => {
    navigate('/dashboard');
  };



  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md w-full mx-4">
        <div className={`rounded-lg p-8 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'}`}>
              <AlertTriangle size={48} className="text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('accessDenied.title')}
          </h1>

          {/* Description */}
          <p className={`text-lg mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('accessDenied.description')}
          </p>
          
          <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('accessDenied.attemptedPath')}
          </p>
          
          <p className={`text-sm mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <code className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {attemptedPath}
            </code>
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
         
            <button
              onClick={handleGoHome}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Home size={20} />
              {t('accessDenied.goHome')}
            </button>
          </div>

          {/* Additional Info */}
          <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {t('accessDenied.contactAdmin')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
