import { Card, Form, Input, Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/store';
import { forgotPassword, clearError } from '@/lib/authSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export default function ForgotPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const { t, i18n } = useTranslation();
  const lang = useSelector((state: RootState) => state.lang.language);
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (i18n.language !== lang) return null;

  const handleSubmit = async (values: { email: string; language: string }) => {
    try {
      const result = await dispatch(forgotPassword(values)).unwrap();

      if (result.success) {
        toast.success('Password reset email sent successfully!');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error: any) {
      console.error('Forgot password failed:', error);
      toast.error(error || 'Failed to send password reset email');
    }
  };

  return (
    <>
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Card
          className="bg-background text-foreground"
          style={{
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 2px 8px #f0f1f2',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: '#1677ff',
                fontSize: 14,
              }}
            >
              <ArrowLeftOutlined /> {t('forgot.back')}
            </Link>
          </div>
          <Typography.Title
            level={2}
            className="text-foreground"
            style={{ textAlign: 'center', marginBottom: 24 }}
          >
            {t('forgot.title')}
          </Typography.Title>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ language: lang }}
            className="text-foreground"
          >
            <Form.Item
              label={t('forgot.email')}
              name="email"
              rules={[{ required: true, message: t('forgot.email') }]}
            >
              <Input
                type="email"
                placeholder={t('forgot.email')}
                autoComplete="email"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {loading ? t('forgot.sending') : t('forgot.button')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}
