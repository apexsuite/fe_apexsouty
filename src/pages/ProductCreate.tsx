import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/lib/store';
import { createProduct } from '@/lib/productSlice';
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
  theme
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ProductCreate: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // API'ye gönderilecek veriyi hazırla
      const productData = {
        name: values.name,
        description: values.description || '',
        isActive: values.isActive !== false, // default true
        marketingFeatures: values.marketingFeatures || [],
        statementDescriptor: values.statementDescriptor || '',
        unitLabel: values.unitLabel || '',
      };

      await dispatch(createProduct(productData)).unwrap();
      message.success(t('product.createSuccess'));
      navigate('/products');
    } catch (error: any) {
      message.error(error.message || t('product.createError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div 
      className="p-6 min-h-screen" 
      style={{ 
        backgroundColor: currentTheme === 'dark' ? '#141414' : token.colorBgContainer,
        color: token.colorText
      }}
    >
      <div className="mb-6">
        <Button
          icon={<ArrowLeft size={16} />}
          onClick={handleCancel}
          className="mb-4"
          style={{
            backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
            borderColor: token.colorBorder,
            color: token.colorText
          }}
        >
          {t('common.back')}
        </Button>
        <Title level={2} style={{ color: token.colorText }}>{t('product.create')}</Title>
        <Paragraph style={{ color: token.colorTextSecondary }}>
          {t('product.createDescription')}
        </Paragraph>
      </div>

      <Card 
        className="max-w-4xl"
        style={{ 
          backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated,
          borderColor: token.colorBorder
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isActive: true,
            marketingFeatures: [''],
          }}
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
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
                    borderColor: token.colorBorder,
                    color: token.colorText
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
                    backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
                    borderColor: token.colorBorder,
                    color: token.colorText
                  }}
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
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
                    borderColor: token.colorBorder,
                    color: token.colorText
                  }}
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
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
                    borderColor: token.colorBorder,
                    color: token.colorText
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
                              style={{
                                backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
                                borderColor: token.colorBorder,
                                color: token.colorText
                              }}
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
                         style={{
                           backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
                           borderColor: token.colorBorder,
                           color: token.colorText
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
                backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
                borderColor: token.colorBorder,
                color: token.colorText
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