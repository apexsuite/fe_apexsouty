import { Card, Form, Input, Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const { t, i18n } = useTranslation();
    const lang = useSelector((state: RootState) => state.lang.language);
    useEffect(() => {
      if (i18n.language !== lang) i18n.changeLanguage(lang);
    }, [lang, i18n]);

    if (i18n.language !== lang) return null;

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                <Card style={{ width: '100%', maxWidth: 400, boxShadow: '0 2px 8px #f0f1f2' }}>
                    <div style={{ marginBottom: 16 }}>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1677ff', fontSize: 14 }}>
                            <ArrowLeftOutlined /> {t('forgot.back')}
                        </Link>
                    </div>
                    <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>{t('forgot.title')}</Typography.Title>
                    <Form layout="vertical">
                        <Form.Item label={t('forgot.email')} name="email" rules={[{ required: true, message: t('forgot.email') }]}> 
                            <Input
                                type="email"
                                placeholder={t('forgot.email')}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>{t('forgot.button')}</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    );
} 