import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Select, InputNumber, Button, theme } from 'antd';
import PermissionGuard from '@/components/PermissionGuard';
import { useErrorHandler } from '@/lib/useErrorHandler';
import { DollarSign, Calendar, Activity } from 'lucide-react';
import { AppDispatch } from '@/lib/store';
import { useDispatch } from 'react-redux';
import { createPrice } from '@/lib/productSlice';
import { useTheme } from '@/providers/theme';

const { Option } = Select;

interface CreatePriceModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  productId: string;
}

interface CreatePriceFormData {
  currency: string;
  interval: string;
  unitAmount: number;
}

const CreatePriceModal: React.FC<CreatePriceModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  productId,
}) => {
  const { t } = useTranslation();
  const { } = theme.useToken();
  const dispatch = useDispatch<AppDispatch>();
  const { theme: currentTheme } = useTheme();
  const { handleError, showSuccess } = useErrorHandler();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CreatePriceFormData) => {
    setLoading(true);
    try {
      await dispatch(createPrice({ productId, priceData: values })).unwrap();
      showSuccess('priceCreatedSuccessfully');
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const currencyOptions = [{ value: 'usd', label: 'USD - US Dollar' }];

  const intervalOptions = [
    { value: 'month', label: t('price.intervals.month') },
    { value: 'year', label: t('price.intervals.year') },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
            <DollarSign
              size={20}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>
          <span className="text-gray-900 dark:text-white">
            {t('price.createPrice')}
          </span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className={`${currentTheme === 'dark' ? 'dark-modal' : ''}`}
      style={{
        backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
      >
        <div className="space-y-6">
          {/* Currency Field */}
          <Form.Item
            name="currency"
            label={
              <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <DollarSign
                  size={16}
                  className="text-gray-500 dark:text-gray-400"
                />
                {t('price.currency')}
              </span>
            }
            rules={[{ required: true, message: t('price.currencyRequired') }]}
          >
            <Select
              placeholder={t('price.selectCurrency')}
              size="large"
              className={`${currentTheme === 'dark' ? 'dark-select' : ''}`}
            >
              {currencyOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Interval Field */}
          <Form.Item
            name="interval"
            label={
              <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calendar
                  size={16}
                  className="text-gray-500 dark:text-gray-400"
                />
                {t('price.interval')}
              </span>
            }
            rules={[{ required: true, message: t('price.intervalRequired') }]}
          >
            <Select
              placeholder={t('price.selectInterval')}
              size="large"
              className={`${currentTheme === 'dark' ? 'dark-select' : ''}`}
            >
              {intervalOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Unit Amount Field */}
          <Form.Item
            name="unitAmount"
            label={
              <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Activity
                  size={16}
                  className="text-gray-500 dark:text-gray-400"
                />
                {t('price.unitAmount')}
              </span>
            }
            rules={[
              { required: true, message: t('price.unitAmountRequired') },
              { type: 'number', min: 1, message: t('price.unitAmountMin') },
            ]}
            extra={t('price.unitAmountHelp')}
          >
            <InputNumber
              placeholder={t('price.enterUnitAmount')}
              size="large"
              min={1}
              step={1}
              className="w-full"
              style={{
                backgroundColor:
                  currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
                borderColor: currentTheme === 'dark' ? '#404040' : '#d9d9d9',
                color: currentTheme === 'dark' ? '#ffffff' : '#000000',
              }}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={() => 1}
            />
          </Form.Item>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
          <Button
            onClick={handleCancel}
            size="large"
            className="px-6"
            style={{
              backgroundColor: currentTheme === 'dark' ? '#404040' : '#f5f5f5',
              borderColor: currentTheme === 'dark' ? '#404040' : '#d9d9d9',
              color: currentTheme === 'dark' ? '#ffffff' : '#000000',
            }}
          >
            {t('common.cancel')}
          </Button>
          <PermissionGuard permission="create-price" mode="hide">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="border-blue-600 bg-blue-600 px-6 hover:border-blue-700 hover:bg-blue-700"
            >
              {t('price.createPrice')}
            </Button>
          </PermissionGuard>
        </div>
      </Form>
    </Modal>
  );
};

export default CreatePriceModal;
