import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
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
            <div className="min-h-screen flex items-center justify-center bg-muted/50S">
                <Card className="w-full max-w-md p-8 shadow-lg">
                    <div className="mb-4">
                        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline text-sm">
                            <ArrowLeft size={18} /> {t('forgot.back')}
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold mb-6 text-center">{t('forgot.title')}</h1>
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="email">{t('forgot.email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('forgot.email')}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                        {/* 
                        <div>
                            <Label htmlFor="language">{t('forgot.language')}</Label>
                            <select
                                id="language"
                                className="w-full border rounded-md px-3 py-2 mt-1 bg-background"
                                value={lang}
                                disabled
                            >
                                {lang === "en" ? (
                                    <>
                                        <option value="en">English</option>
                                        <option value="tr">Turkish</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="en">İngilizce</option>
                                        <option value="tr">Türkçe</option>
                                    </>
                                )}
                            </select>
                        </div>
                        */}
                        <Button type="submit" className="w-full mt-2">{t('forgot.button')}</Button>
                    </form>
                </Card>
            </div>
        </>
    );
} 