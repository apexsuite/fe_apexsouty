import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import { RootState } from "@/lib/store";
import i18n from "@/lib/i18n";
import { useSelector } from "react-redux";
import { Card, Form, Input, Button, Typography } from "antd";

export default function RegisterPage() {
  const lang = useSelector((state: RootState) => state.lang.language);
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang]);

  if (i18n.language !== lang) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground text-lg">Loading...</span>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.username || !form.password || !form.password2) {
      setError(t("register.fillAllFields"));
      return;
    }
    if (form.password !== form.password2) {
      setError(t("register.passwordsNotMatch"));
      return;
    }
    // Burada backend'e kayıt isteği gönderilebilir
    setSuccess(t("register.success"));
    setForm({ name: "", email: "", username: "", password: "", password2: "" });
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <Card style={{ width: '100%', maxWidth: 400, boxShadow: '0 2px 8px #f0f1f2' }}>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>{t("register.title")}</Typography.Title>
            <Form.Item label={t("register.name")} name="name" rules={[{ required: true, message: t("register.fillAllFields") }]}> 
              <Input name="name" value={form.name} onChange={handleChange} placeholder={t("register.name")} />
            </Form.Item>
            <Form.Item label={t("register.email")} name="email" rules={[{ required: true, message: t("register.fillAllFields") }]}> 
              <Input name="email" value={form.email} onChange={handleChange} placeholder={t("register.email")} />
            </Form.Item>
            <Form.Item label={t("register.username")} name="username" rules={[{ required: true, message: t("register.fillAllFields") }]}> 
              <Input name="username" value={form.username} onChange={handleChange} placeholder={t("register.username")} />
            </Form.Item>
            <Form.Item label={t("register.password")} name="password" rules={[{ required: true, message: t("register.fillAllFields") }]}> 
              <Input.Password name="password" value={form.password} onChange={handleChange} placeholder={t("register.password")} />
            </Form.Item>
            <Form.Item label={t("register.password2")} name="password2" rules={[{ required: true, message: t("register.fillAllFields") }]}> 
              <Input.Password name="password2" value={form.password2} onChange={handleChange} placeholder={t("register.password2")} />
            </Form.Item>
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t("register.submit")}
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center', fontSize: 14 }}>
              {t("register.haveAccount")} <Link to="/" style={{ color: '#1677ff' }}>{t("register.login")}</Link>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
} 