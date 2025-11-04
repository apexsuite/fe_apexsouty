import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import {
  fetchBilling,
  createBilling,
  updateBilling,
  clearError,
} from '@/lib/billingSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, AddressElement } from '@stripe/react-stripe-js';
import { Save, Loader, Plus, Trash2 } from 'lucide-react';
import { Button, Card, Typography, Input, Switch } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';
import { useTheme } from '@/providers/theme';

const { Title } = Typography;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PKEY);

interface BillingFormProps {
  onBack?: () => void;
}

const BillingForm: React.FC<BillingFormProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { billing, loading } = useSelector((state: RootState) => state.billing);
  const { handleError, showSuccess } = useErrorHandler();
  const { theme } = useTheme();

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
  const [extraFields, setExtraFields] = useState<
    Array<{ key: string; value: string }>
  >([{ key: '', value: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [stripeKey, setStripeKey] = useState(0); // Force re-mount when theme changes

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchBilling());
  }, [dispatch]);

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

      if (billing.extra && Object.keys(billing.extra).length > 0) {
        const extraArray = Object.entries(billing.extra).map(
          ([key, value]) => ({
            key,
            value: String(value || ''),
          })
        );
        setExtraFields(
          extraArray.length > 0 ? extraArray : [{ key: '', value: '' }]
        );
      } else {
        setExtraFields([{ key: '', value: '' }]);
      }
    }
  }, [billing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExtraFieldChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updatedFields = [...extraFields];
    updatedFields[index]![field] = value;
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
    if (event.value) {
      const addressData = event.value.address || event.value;
      const nameData = event.value.name || addressData?.name;
      const phoneData = event.value.phone || addressData?.phone;
      setFormData(prev => {
        const newFormData = {
          ...prev,
          name: nameData || prev.name,
          line1: addressData?.line1 || prev.line1,
          line2: addressData?.line2 || '',
          city: addressData?.city || prev.city,
          state: addressData?.state || prev.state,
          postalCode: addressData?.postal_code || prev.postalCode,
          country: addressData?.country || prev.country,
          phone: phoneData || prev.phone,
        };
        return newFormData;
      });
    } else {
    }
  };

  const onFinish = async () => {
    setSubmitting(true);
    try {
      const extraObject = extraFields.reduce(
        (acc, field) => {
          if (field.key.trim() && field.value.trim()) {
            acc[field.key.trim()] = field.value.trim();
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const billingData = {
        name: formData.name.trim(),
        line1: formData.line1.trim(),
        line2: formData.line2.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        phone: formData.phone.trim(),
        footer: formData.footer.trim(),
        extra: extraObject,
      };

      if (!formData.line2.trim()) {
        delete billingData.line2;
      }

      if (billing) {
        await dispatch(updateBilling(billingData)).unwrap();
        showSuccess('billingUpdatedSuccessfully');
      } else {
        await dispatch(createBilling(billingData)).unwrap();
        showSuccess('billingCreatedSuccessfully');
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">
            {t('billing.loadingBilling') || 'Loading billing...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '1.5rem',
        minHeight: '100vh',
        backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
        color: theme === 'dark' ? '#ffffff' : '#111827',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  color: theme === 'dark' ? '#ffffff' : '#111827',
                }}
              >
                {t('billing.title') || 'Billing'}
              </h1>
              <p
                style={{
                  marginTop: '0.5rem',
                  color: theme === 'dark' ? '#d1d5db' : '#4b5563',
                }}
              >
                {t('billing.description') ||
                  'Manage your billing information and address'}
              </p>
            </div>
          </div>
        </div>

        <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-6">
            <div>
              <Title
                level={4}
                className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
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
                      colorTextSecondary:
                        theme === 'dark' ? '#9ca3af' : '#6b7280',
                      colorTextPlaceholder:
                        theme === 'dark' ? '#6b7280' : '#9ca3af',
                      fontFamily: 'system-ui, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '8px',
                      fontSizeBase: '16px',
                    },
                  },
                }}
              >
                <div
                  className={`rounded-lg border p-4 ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}
                >
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
                      allowedCountries: [
                        'TR',
                        'US',
                        'GB',
                        'DE',
                        'FR',
                        'IT',
                        'ES',
                        'NL',
                        'BE',
                        'AT',
                        'CH',
                        'SE',
                        'NO',
                        'DK',
                        'FI',
                      ],
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

            <div className="mt-4">
              <label
                className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {t('billing.footer') || 'Footer'}{' '}
                <span className="text-xs text-gray-500">
                  ({t('billing.footnote') || 'Dipnot'})
                </span>
              </label>
              <Input.TextArea
                name="footer"
                value={formData.footer}
                onChange={handleInputChange}
                placeholder={
                  t('billing.enterFooter') || 'Enter footer text (dipnot)'
                }
                rows={3}
                className={`dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
              />
            </div>
            <div>
              <div className="mb-4 flex items-center justify-between">
                <Title
                  level={4}
                  className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  {t('billing.additionalInfo') || 'Additional Information'}
                </Title>
                <Button
                  type="dashed"
                  size="small"
                  icon={<Plus size={16} />}
                  onClick={addExtraField}
                  style={{
                    backgroundColor:
                      theme === 'dark' ? '#1f2937' : 'transparent',
                    borderColor: theme === 'dark' ? '#4b5563' : '#3b82f6',
                    color: theme === 'dark' ? '#d1d5db' : '#3b82f6',
                  }}
                  className={`${
                    theme === 'dark'
                      ? 'hover:!border-gray-500 hover:!bg-gray-700 hover:!text-white'
                      : 'hover:!border-blue-400 hover:!bg-blue-50 hover:!text-blue-700'
                  }`}
                >
                  {t('billing.addExtraField') || 'Add Field'}
                </Button>
              </div>

              <div className="space-y-4">
                {extraFields.map((field, index) => (
                  <div key={index} className="flex items-end gap-3">
                    <div className="flex-1">
                      <label
                        className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {t('billing.key') || 'Key'}
                      </label>
                      <Input
                        value={field.key}
                        onChange={e =>
                          handleExtraFieldChange(index, 'key', e.target.value)
                        }
                        placeholder={t('billing.enterKey') || 'Enter key'}
                        className={`dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {t('billing.value') || 'Value'}
                      </label>
                      <Input
                        value={field.value}
                        onChange={e =>
                          handleExtraFieldChange(index, 'value', e.target.value)
                        }
                        placeholder={t('billing.enterValue') || 'Enter value'}
                        className={`dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
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

            <div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onChange={handleSwitchChange}
                  className="dark:bg-gray-600"
                />
                <span
                  className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('billing.isActive') || 'Is Active'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              {onBack && (
                <Button
                  size="large"
                  onClick={onBack}
                  className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
                  onFinish();
                }}
                className="border-blue-600 bg-blue-600 hover:border-blue-700 hover:bg-blue-700"
              >
                {submitting
                  ? t('billing.saving') || 'Saving...'
                  : t('billing.save') || 'Save'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BillingForm;
