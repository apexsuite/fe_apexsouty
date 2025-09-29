
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchBilling, createBilling, updateBilling, clearError } from '@/lib/billingSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, AddressElement } from '@stripe/react-stripe-js';
import { Save, Loader, Plus, Trash2 } from 'lucide-react';
import { message, Button, Card, Typography, Input, Switch } from 'antd';

const { Title } = Typography;

// Stripe public key - .env dosyasındaki VITE_STRIPE_PKEY kullanılıyor
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PKEY || 'pk_test_your_stripe_publishable_key_here');

interface BillingFormProps {
  onBack?: () => void;
}

const BillingForm: React.FC<BillingFormProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { billing, loading, error } = useSelector((state: RootState) => state.billing);
  const theme = useSelector((state: RootState) => state.theme.theme);
  
  const [formData, setFormData] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    footer: '',
    isActive: true,
    extra: {},
  });
  const [extraFields, setExtraFields] = useState<Array<{key: string, value: string}>>([
    { key: '', value: '' }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [stripeKey, setStripeKey] = useState(0); // Force re-mount when theme changes

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchBilling());
  }, [dispatch]);

  // Force re-mount Stripe Elements when theme changes
  useEffect(() => {
    setStripeKey(prev => prev + 1);
  }, [theme]);

  useEffect(() => {
    if (billing) {
      setFormData({
        name: billing.name || '',
        line1: billing.line1 || '',
        line2: billing.line2 || '',
        city: billing.city || '',
        state: billing.state || '',
        postalCode: billing.postalCode || '',
        country: billing.country || '',
        phone: billing.phone || '',
        footer: billing.footer || '',
        isActive: billing.isActive || true,
        extra: billing.extra || {},
      });
      
      // Convert extra object to key-value pairs
      if (billing.extra && Object.keys(billing.extra).length > 0) {
        const extraArray = Object.entries(billing.extra).map(([key, value]) => ({
          key,
          value: String(value || '')
        }));
        setExtraFields(extraArray.length > 0 ? extraArray : [{ key: '', value: '' }]);
      } else {
        setExtraFields([{ key: '', value: '' }]);
      }
    }
  }, [billing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExtraFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedFields = [...extraFields];
    updatedFields[index][field] = value;
    setExtraFields(updatedFields);
  };

  const addExtraField = () => {
    setExtraFields([...extraFields, { key: '', value: '' }]);
  };

  const removeExtraField = (index: number) => {
    if (extraFields.length > 1) {
      setExtraFields(extraFields.filter((_, i) => i !== index));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked,
    }));
  };

  const handleAddressChange = (event: any) => {
    console.log('AddressElement onChange event:', event);
    console.log('Event complete:', event.complete);
    console.log('Event value:', event.value);
    
    // AddressElement'ten gelen verileri işle
    if (event.value) {
      console.log('Event value exists, checking structure...');
      
      // Farklı veri yapılarını kontrol et
      const addressData = event.value.address || event.value;
      const nameData = event.value.name || addressData?.name;
      const phoneData = event.value.phone || addressData?.phone;
      
      console.log('Address data:', addressData);
      console.log('Name data:', nameData);
      console.log('Phone data:', phoneData);
      
      setFormData(prev => {
        const newFormData = {
          ...prev,
          name: nameData || prev.name,
          line1: addressData?.line1 || prev.line1,
          line2: addressData?.line2 || prev.line2,
          city: addressData?.city || prev.city,
          state: addressData?.state || prev.state,
          postalCode: addressData?.postal_code || prev.postalCode,
          country: addressData?.country || prev.country,
          phone: phoneData || prev.phone,
        };
        console.log('Updated formData:', newFormData);
        return newFormData;
      });
    } else {
      console.log('AddressElement data not available yet');
    }
  };

  const onFinish = async () => {
    console.log('onFinish called, formData:', formData);
    setSubmitting(true);
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        console.log('Name validation failed:', formData.name);
        message.error('Lütfen adres formundaki "Ad ve soyadı" alanını doldurun');
        setSubmitting(false);
        return;
      }

      if (!formData.line1.trim()) {
        message.error('Lütfen adres formundaki "Adres satırı 1" alanını doldurun');
        setSubmitting(false);
        return;
      }

      if (!formData.city.trim()) {
        message.error('Lütfen adres formundaki "İl" alanını doldurun');
        setSubmitting(false);
        return;
      }

      if (!formData.state.trim()) {
        message.error('Lütfen adres formundaki "İlçe" alanını doldurun');
        setSubmitting(false);
        return;
      }

      if (!formData.postalCode.trim()) {
        message.error('Lütfen adres formundaki "Posta kodu" alanını doldurun');
        setSubmitting(false);
        return;
      }

      if (!formData.country.trim()) {
        message.error('Lütfen adres formundaki "Ülke" alanını doldurun');
        setSubmitting(false);
        return;
      }

      if (!formData.phone.trim()) {
        message.error('Lütfen adres formundaki "Telefon numarası" alanını doldurun');
        setSubmitting(false);
        return;
      }

      // Convert extra fields to object
      const extraObject = extraFields.reduce((acc, field) => {
        if (field.key.trim() && field.value.trim()) {
          acc[field.key.trim()] = field.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);

      const billingData = {
        name: formData.name.trim(),
        line1: formData.line1.trim(),
        line2: formData.line2.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        phone: formData.phone.trim(),
        footer: formData.footer.trim(),
        extra: extraObject,
      };

      if (billing) {
        await dispatch(updateBilling(billingData)).unwrap();
        message.success(t('billing.billingUpdatedSuccessfully') || 'Billing updated successfully!');
      } else {
        await dispatch(createBilling(billingData)).unwrap();
        message.success(t('billing.billingCreatedSuccessfully') || 'Billing created successfully!');
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.message || t('billing.errorUpdatingBilling') || 'Error updating billing';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin mx-auto h-12 w-12 text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('billing.loadingBilling') || 'Loading billing...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
     

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <div className="text-center text-red-600 dark:text-red-400">
              <p>{error}</p>
            </div>
          </Card>
        )}

        {/* Form */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="space-y-6">
            {/* Stripe Address Element */}
            <div>
              <Title level={4} className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('billing.address') || 'Address Information'}
              </Title>
              
              <Elements 
                key={stripeKey} 
                stripe={stripePromise}
                options={{
                  appearance: {
                    theme: theme === 'dark' ? 'night' : 'stripe',
                    variables: {
                      colorPrimary: '#3b82f6',
                      colorBackground: theme === 'dark' ? '#111827' : '#ffffff',
                      colorText: theme === 'dark' ? '#f9fafb' : '#1f2937',
                      colorDanger: '#ef4444',
                      colorTextSecondary: theme === 'dark' ? '#9ca3af' : '#6b7280',
                      colorTextPlaceholder: theme === 'dark' ? '#6b7280' : '#9ca3af',
                      fontFamily: 'system-ui, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '8px',
                      fontSizeBase: '16px',
                    },
                  },
                }}
              >
                <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                  <AddressElement
                    options={{
                      mode: 'shipping',
                      fields: {
                        phone: 'always',
                      },
                      validation: {
                        phone: {
                          required: 'always',
                        },
                      },
                      allowedCountries: ['TR', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI'],
                      defaultValues: {
                        name: formData.name,
                        address: {
                          line1: formData.line1,
                          line2: formData.line2,
                          city: formData.city,
                          state: formData.state,
                          postal_code: formData.postalCode,
                          country: formData.country,
                        },
                        phone: formData.phone,
                      },
                    }}
                    onChange={handleAddressChange}
                  />
                </div>
              </Elements>
            </div>

            {/* Extra Fields */}
            <div className="mt-4">
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('billing.footer') || 'Footer'} <span className="text-xs text-gray-500">({t('billing.footnote') || 'Dipnot'})</span>
              </label>
              <Input.TextArea
                name="footer"
                value={formData.footer}
                onChange={handleInputChange}
                placeholder={t('billing.enterFooter') || 'Enter footer text (dipnot)'}
                rows={3}
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <Title level={4} className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t('billing.additionalInfo') || 'Additional Information'}
                </Title>
                <Button
                  type="dashed"
                  size="small"
                  icon={<Plus size={16} />}
                  onClick={addExtraField}
                  style={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : 'transparent',
                    borderColor: theme === 'dark' ? '#4b5563' : '#3b82f6',
                    color: theme === 'dark' ? '#d1d5db' : '#3b82f6',
                  }}
                  className={`${
                    theme === 'dark' 
                      ? 'hover:!border-gray-500 hover:!text-white hover:!bg-gray-700' 
                      : 'hover:!border-blue-400 hover:!text-blue-700 hover:!bg-blue-50'
                  }`}
                >
                  {t('billing.addExtraField') || 'Add Field'}
                </Button>
              </div>
              
              <div className="space-y-4">
                {extraFields.map((field, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('billing.key') || 'Key'}
                      </label>
                      <Input
                        value={field.key}
                        onChange={(e) => handleExtraFieldChange(index, 'key', e.target.value)}
                        placeholder={t('billing.enterKey') || 'Enter key'}
                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
                      />
                    </div>
                    <div className="flex-1">
                      <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('billing.value') || 'Value'}
                      </label>
                      <Input
                        value={field.value}
                        onChange={(e) => handleExtraFieldChange(index, 'value', e.target.value)}
                        placeholder={t('billing.enterValue') || 'Enter value'}
                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
                      />
                    </div>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<Trash2 size={16} />}
                      onClick={() => removeExtraField(index)}
                      disabled={extraFields.length === 1}
                      className="mb-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onChange={handleSwitchChange}
                  className="dark:bg-gray-600"
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('billing.isActive') || 'Is Active'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              {onBack && (
                <Button
                  size="large"
                  onClick={onBack}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {t('billing.cancel') || 'Cancel'}
                </Button>
              )}
              <Button
                type="primary"
                size="large"
                loading={submitting}
                icon={<Save size={16} />}
                onClick={() => {
                  console.log('Save button clicked');
                  onFinish();
                }}
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
              >
                {submitting ? (t('billing.saving') || 'Saving...') : (t('billing.save') || 'Save')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BillingForm;
