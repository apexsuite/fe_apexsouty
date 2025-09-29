import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchProduct, updateProduct } from '@/lib/productSlice';
import { ArrowLeft, Save } from 'lucide-react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Switch, 
  message,
  Divider,
  Spin,
  theme
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ProductEdit: React.FC = () => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { product, loading: fetchLoading } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (product && !fetchLoading) {
      // Form'u product verisi ile doldur
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        isActive: product.isActive,
        marketingFeatures: product.marketingFeatures.length > 0 
          ? product.marketingFeatures 
          : [''],
        statementDescriptor: product.statementDescriptor,
        unitLabel: product.unitLabel,
      });
      setInitialLoading(false);
    }
  }, [product, fetchLoading, form]);

  const loadProduct = async () => {
    try {
      await dispatch(fetchProduct(productId!)).unwrap();
    } catch (error: any) {
      message.error(error.message || t('product.fetchError'));
      navigate('/products');
    }
  };

  const onFinish = async (values: any) => {
    if (!productId) return;

    setLoading(true);
    try {
      // API'ye gönderilecek veriyi hazırla
      const productData = {
        name: values.name,
        description: values.description || '',
        isActive: values.isActive !== false,
        marketingFeatures: values.marketingFeatures || [],
        statementDescriptor: values.statementDescriptor || '',
        unitLabel: values.unitLabel || '',
      };

      await dispatch(updateProduct({ productId, productData })).unwrap();
      message.success(t('product.updateSuccess'));
      navigate('/products');
    } catch (error: any) {
      message.error(error.message || t('product.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (initialLoading || fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Title level={3}>{t('product.notFound')}</Title>
          <Button onClick={handleCancel}>
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              <div>
                <Title level={2} className="mb-1 text-gray-900 dark:text-white">
                  {t('product.edit')}
                </Title>
                <Paragraph className="text-gray-600 dark:text-gray-300 mb-0">
                  {t('product.editDescription')}
                </Paragraph>
              </div>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sol Kolon */}
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
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
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
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </Form.Item>

                <Form.Item
                  name="unitLabel"
                  label={t('product.unitLabel')}
                  rules={[
                    { max: 50, message: t('product.unitLabelMaxLength') },
                  ]}
                >
                  <Input 
                    placeholder={t('product.unitLabelPlaceholder')}
                    size="large"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </Form.Item>
              </div>

              {/* Sağ Kolon */}
              <div className="space-y-6">
                <Form.Item
                  name="statementDescriptor"
                  label={t('product.statementDescriptor')}
                  rules={[
                    { max: 100, message: t('product.statementDescriptorMaxLength') },
                  ]}
                >
                  <Input 
                    placeholder={t('product.statementDescriptorPlaceholder')}
                    size="large"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
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
                    className="dark:bg-gray-600"
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
                                { required: true, message: t('product.marketingFeatureRequired') },
                                { max: 100, message: t('product.marketingFeatureMaxLength') },
                              ]}
                              className="flex-1 mb-0"
                            >
                              <Input 
                                placeholder={t('product.marketingFeaturePlaceholder')}
                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                              />
                            </Form.Item>
                            {fields.length > 1 && (
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                                className="text-red-500 cursor-pointer hover:text-red-700"
                              />
                            )}
                          </div>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<Save size={16} />}
                size="large"
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
              >
                {t('product.update')}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ProductEdit; 