import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '@/lib/store';
import i18n from '@/lib/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Form, Input, Button, Typography } from 'antd';
import { toast } from 'react-toastify';
import { registerUser, clearError } from '@/lib/authSlice';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const lang = useSelector((state: RootState) => state.lang.language);
  const { error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { t } = useTranslation();
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (i18n.language !== lang) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <span className="text-muted-foreground text-lg">Loading...</span>
      </div>
    );
  }

  const handleSubmit = async (values: any) => {
    // setForm(values); // This line was removed as per the edit hint

    if (
      !values.firstname ||
      !values.lastname ||
      !values.email ||
      !values.password
    ) {
      return;
    }

    const registerData = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      language: lang,
      password: values.password,
    };

    try {
      const result = await dispatch(registerUser(registerData)).unwrap();
      if (result.success) {
        toast.success('Successfully registered!');
        setSuccess(t('register.success'));
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error || 'Registration failed');
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
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{}}
            className="text-foreground"
          >
            <Typography.Title
              level={2}
              className="text-foreground"
              style={{ textAlign: 'center', marginBottom: 24 }}
            >
              {t('register.title')}
            </Typography.Title>
            <Form.Item
              label={t('register.firstname')}
              name="firstname"
              rules={[{ required: true, message: t('register.fillAllFields') }]}
            >
              <Input placeholder={t('register.firstname')} />
            </Form.Item>
            <Form.Item
              label={t('register.lastname')}
              name="lastname"
              rules={[{ required: true, message: t('register.fillAllFields') }]}
            >
              <Input placeholder={t('register.lastname')} />
            </Form.Item>
            <Form.Item
              label={t('register.email')}
              name="email"
              rules={[{ required: true, message: t('register.fillAllFields') }]}
            >
              <Input placeholder={t('register.email')} />
            </Form.Item>
            <Form.Item
              label={t('register.password')}
              name="password"
              rules={[{ required: true, message: t('register.fillAllFields') }]}
            >
              <Input.Password placeholder={t('register.password')} />
            </Form.Item>

            {error && (
              <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
            )}
            {success && (
              <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t('register.submit')}
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center', fontSize: 14 }}>
              {t('register.haveAccount')}{' '}
              <Link to="/" style={{ color: '#1677ff' }}>
                {t('register.login')}
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
}
