import { Card } from "antd";
import { Input, Button, Form, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { loginUser, clearError, checkAuth } from "@/lib/authSlice";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Login() {
  const { t, i18n } = useTranslation();
  const lang = useSelector((state: RootState) => state.lang.language);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
  });
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [lang, i18n, isAuthenticated, navigate]);



  // Redux'tan gelen hataları dinle
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (i18n.language !== lang) return null;

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const loginData = {
        email: values.email,
        password: values.password
      };
      await dispatch(loginUser(loginData)).unwrap();
      toast.success(t('notification.success'));
      try {
        await dispatch(checkAuth()).unwrap();
        navigate("/dashboard");
        setIsAuthenticated(true);
      } catch (error) {
        console.error('CheckAuth failed after login:', error);
        navigate("/dashboard");
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error || "Login failed");
    }
  };

  return (
    <>
      {isAuthenticated ? <Navbar /> : <Navbar hideSearchAndMenu />}
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="bg-background text-foreground" style={{ width: '100%', maxWidth: 400, boxShadow: '0 2px 8px #f0f1f2' }}>
          <Typography.Title level={2} className="text-foreground" style={{ textAlign: 'center', marginBottom: 24 }}>{t('login.title')}</Typography.Title>
          <Form layout="vertical" onFinish={handleSubmit} className="text-foreground">
            <Form.Item label={t('login.email')} name="email" rules={[{ required: true, message: t('login.email') }]}> 
              <Input 
                placeholder={t('login.email')} 
                autoComplete="email"
                type="email"
              />
            </Form.Item>
            <Form.Item label={t('login.password')} name="password" rules={[{ required: true, message: t('login.password') }]}> 
              <Input.Password
                placeholder={t('login.password')}
                autoComplete="current-password"
                iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Link to="/register">{t('register.title')}</Link>
              <Link to="/forgot-password">{t('login.forgot')}</Link>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {loading ? "Logging in..." : t('login.button')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
} 