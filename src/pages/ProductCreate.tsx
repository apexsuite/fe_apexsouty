import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '@/lib/store';
import { createProduct } from '@/lib/productSlice';
import { ArrowLeft, Save } from 'lucide-react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Typography,
  Switch,
  Divider,
  theme,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useErrorHandler } from '@/lib/useErrorHandler';
import { useTheme } from '@/providers/theme';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ProductCreate: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = theme.useToken();
  const { theme: currentTheme } = useTheme();
  const { handleError, showSuccess } = useErrorHandler();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const productData = {
        name: values.name,
        description: values.description || '',
        isActive: values.isActive !== false,
        isDeafultProduct: values.isDeafultProduct || false,
        isStripeProduct: values.isStripeProduct || false,
        marketingFeatures: values.marketingFeatures || [],
        statementDescriptor: values.statementDescriptor || '',
        unitLabel: values.unitLabel || '',
        capacity:
          typeof values.capacity === 'number' ? values.capacity : null,
      };

      await dispatch(createProduct(productData)).unwrap();
      showSuccess('productCreatedSuccessfully');
      navigate('/products');
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor:
          currentTheme === 'dark' ? '#141414' : token.colorBgContainer,
        color: token.colorText,
      }}
    >
      <div className="mb-6">
        <Button
          icon={<ArrowLeft size={16} />}
          onClick={handleCancel}
          className="mb-4"
          style={{
            backgroundColor:
              currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
            borderColor: token.colorBorder,
            color: token.colorText,
          }}
        >
          {t('common.back')}
        </Button>
        <Title level={2} style={{ color: token.colorText }}>
          {t('product.create')}
        </Title>
        <Paragraph style={{ color: token.colorTextSecondary }}>
          {t('product.createDescription')}
        </Paragraph>
      </div>

      <Card
        className="max-w-4xl"
        style={{
          backgroundColor:
            currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated,
          borderColor: token.colorBorder,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isActive: true,
            isDeafultProduct: false,
            isStripeProduct: false,
            marketingFeatures: [''],
            capacity: null,
          }}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <Form.Item
                name="name"
                label={t('product.name')}
                rules={[
                  { required: true, message: t('product.nameRequired') },
                  { min: 2, message: t('product.nameMinLength') },
                  { max: 100, message: t('product.nameMaxLength') },
                ]}
              >
                <Input
                  placeholder={t('product.namePlaceholder')}
                  size="large"
                  style={{
                    backgroundColor:
                      currentTheme === 'dark'
                        ? '#262626'
                        : token.colorBgContainer,
                    borderColor: token.colorBorder,
                    color: token.colorText,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={t('product.description')}
                rules={[
                  { max: 500, message: t('product.descriptionMaxLength') },
                ]}
              >
                <TextArea
                  placeholder={t('product.descriptionPlaceholder')}
                  rows={4}
                  showCount
                  maxLength={500}
                  style={{
                    backgroundColor:
                      currentTheme === 'dark'
                        ? '#262626'
                        : token.colorBgContainer,
                    borderColor: token.colorBorder,
                    color: token.colorText,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="unitLabel"
                label={t('product.unitLabel')}
                rules={[{ max: 50, message: t('product.unitLabelMaxLength') }]}
              >
                <Input
                  placeholder={t('product.unitLabelPlaceholder')}
                  size="large"
                  style={{
                    backgroundColor:
                      currentTheme === 'dark'
                        ? '#262626'
                        : token.colorBgContainer,
                    borderColor: token.colorBorder,
                    color: token.colorText,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="capacity"
                label={t('product.capacity')}
                rules={[
                  { required: true, message: t('product.capacityRequired') },
                  {
                    type: 'number',
                    min: 0,
                    message: t('product.capacityMin'),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t('product.capacityPlaceholder')}
                  min={0}
                  style={{
                    width: '100%',
                    backgroundColor:
                      currentTheme === 'dark'
                        ? '#262626'
                        : token.colorBgContainer,
                    borderColor: token.colorBorder,
                    color: token.colorText,
                  }}
                />
              </Form.Item>
            </div>

            <div className="space-y-6">
              <Form.Item
                name="statementDescriptor"
                label={t('product.statementDescriptor')}
                rules={[
                  {
                    max: 100,
                    message: t('product.statementDescriptorMaxLength'),
                  },
                ]}
              >
                <Input
                  placeholder={t('product.statementDescriptorPlaceholder')}
                  size="large"
                  style={{
                    backgroundColor:
                      currentTheme === 'dark'
                        ? '#262626'
                        : token.colorBgContainer,
                    borderColor: token.colorBorder,
                    color: token.colorText,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="isActive"
                label={t('product.status')}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={t('common.active')}
                  unCheckedChildren={t('common.inactive')}
                />
              </Form.Item>

              <Form.Item
                name="isDeafultProduct"
                label={t('product.isDeafultProduct')}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={t('common.yes')}
                  unCheckedChildren={t('common.no')}
                />
              </Form.Item>

              <Form.Item
                name="isStripeProduct"
                label={t('product.isStripeProduct')}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={t('common.yes')}
                  unCheckedChildren={t('common.no')}
                />
              </Form.Item>

              <Form.Item
                name="marketingFeatures"
                label={t('product.marketingFeatures')}
              >
                <Form.List name="marketingFeatures">
                  {(fields, { add, remove }) => (
                    <div className="space-y-2">
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="flex items-center gap-2">
                          <Form.Item
                            {...restField}
                            name={[name]}
                            rules={[
                              {
                                required: true,
                                message: t('product.marketingFeatureRequired'),
                              },
                              {
                                max: 100,
                                message: t('product.marketingFeatureMaxLength'),
                              },
                            ]}
                            className="mb-0 flex-1"
                          >
                            <Input
                              placeholder={t(
                                'product.marketingFeaturePlaceholder'
                              )}
                              style={{
                                backgroundColor:
                                  currentTheme === 'dark'
                                    ? '#262626'
                                    : token.colorBgContainer,
                                borderColor: token.colorBorder,
                                color: token.colorText,
                              }}
                            />
                          </Form.Item>
                          {fields.length > 1 && (
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              className="cursor-pointer text-red-500 hover:text-red-700"
                            />
                          )}
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        style={{
                          backgroundColor:
                            currentTheme === 'dark'
                              ? '#262626'
                              : token.colorBgContainer,
                          borderColor: token.colorBorder,
                          color: token.colorText,
                        }}
                      >
                        {t('product.addMarketingFeature')}
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Form.Item>
            </div>
          </div>

          <Divider />

          <div className="flex justify-end gap-3">
            <Button
              onClick={handleCancel}
              size="large"
              style={{
                backgroundColor:
                  currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
                borderColor: token.colorBorder,
                color: token.colorText,
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<Save size={16} />}
              size="large"
            >
              {t('product.create')}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProductCreate;
