import { Card, Form, Input, Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/store';
import { resetPassword, clearError } from '@/lib/authSlice';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
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

  const handleSubmit = async (values: { password: string; email: string }) => {
    const id = searchParams.get('id');
    const token = searchParams.get('token');
    if (!id || !token) {
      toast.error('Invalid reset link');
      navigate('/');
      return;
    }
    try {
      const resetData = {
        id,
        token,
        password: values.password,
        email: values.email,
      };

      const result = await dispatch(resetPassword(resetData)).unwrap();
      if (result.success) {
        toast.success('Password reset successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Reset password failed:', error);
      toast.error(error || 'Failed to reset password');
    }
  };

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
        }}
      >
        <Card
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
              <ArrowLeftOutlined /> {t('reset.back')}
            </Link>
          </div>
          <Typography.Title
            level={2}
            style={{ textAlign: 'center', marginBottom: 24 }}
          >
            {t('reset.title')}
          </Typography.Title>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label={t('reset.email')}
              name="email"
              rules={[
                { required: true, message: t('reset.emailRequired') },
                { type: 'email', message: t('reset.emailInvalid') },
              ]}
            >
              <Input
                placeholder={t('reset.email')}
                autoComplete="email"
                type="email"
              />
            </Form.Item>
            <Form.Item
              label={t('reset.password')}
              name="password"
              rules={[{ required: true, message: t('reset.password') }]}
            >
              <Input.Password
                placeholder={t('reset.password')}
                autoComplete="new-password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {loading ? 'Resetting password...' : t('reset.button')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}
