import { Card } from "antd";
import { Input, Button, Form, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { login } from "@/lib/authSlice";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

// Test kullanıcıları
const TEST_USERS = {
  "1": {
    password: "1",
    userData: {
      id: "6",
      name: "Mücahit Ali",
      username: "mucahitali",
      email: "mucahit.ali@example.com",
      role: "Developer",
      avatar: "/avatars/06.png",
      status: "active",
      permissions: ["Create", "Read", "Update", "Delete"]
    }
  },
  "2": {
    password: "2",
    userData: {
      id: "7",
      name: "Read Only User",
      username: "",
      email: "readonly@example.com",
      role: "Viewer",
      avatar: "/avatars/07.png",
      status: "active",
      permissions: ["Read", "Update"]
    }
  },
  "3": {
    password: "3",
    userData: {
      id: "8",
      name: "Editor User",
      username: "editor",
      email: "editor@example.com",
      role: "Editor",
      avatar: "/avatars/08.png",
      status: "active",
      permissions: ["Read", "Update"]
    }
  },
  "4": {
    password: "4",
    userData: {
      id: "9",
      name: "Creator User",
      username: "creator",
      email: "creator@example.com",
      role: "Creator",
      avatar: "/avatars/09.png",
      status: "active",
      permissions: ["Create", "Read"]
    }
  }
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = useSelector((state: RootState) => state.lang.language);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  // Eğer kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (i18n.language !== lang) return null;

  const handleSubmit = async (values: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const { username, password } = values;
      const testUser = TEST_USERS[username as keyof typeof TEST_USERS];
      if (testUser && testUser.password === password) {
        dispatch(login(testUser.userData));
        toast.success(t("login.success"));
        navigate("/dashboard");
      } else {
        toast.error("Kullanıcı adı veya şifre hatalı!");
      }
    } catch (error) {
      toast.error("Giriş yapılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <Card style={{ width: '100%', maxWidth: 400, boxShadow: '0 2px 8px #f0f1f2' }}>
          <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>{t('login.title')}</Typography.Title>
          <Form layout="vertical" onFinish={handleSubmit} initialValues={{ username, password }}>
            <Form.Item label={t('login.username')} name="username" rules={[{ required: true, message: t('login.username') }]}> 
              <Input 
                placeholder={t('login.username')} 
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </Form.Item>
            <Form.Item label={t('login.password')} name="password" rules={[{ required: true, message: t('login.password') }]}> 
              <Input.Password
                placeholder={t('login.password')}
                autoComplete="current-password"
                iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Link to="/register">{t('register.title')}</Link>
              <Link to="/forgot-password">{t('login.forgot')}</Link>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isLoading}>
                {isLoading ? "Giriş yapılıyor..." : t('login.button')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
} 