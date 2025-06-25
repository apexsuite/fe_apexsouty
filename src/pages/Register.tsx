import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import { RootState } from "@/lib/store";
import i18n from "@/lib/i18n";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="bg-transparent p-0 shadow-none border-none">
            <h2 className="text-2xl font-bold mb-6 text-center">{t("register.title")}</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">{t("register.name")}</label>
              <Input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("register.name")}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">{t("register.email")}</label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("register.email")}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">{t("register.username")}</label>
              <Input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder={t("register.username")}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">{t("register.password")}</label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={t("register.password")}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">{t("register.password2")}</label>
              <Input
                type="password"
                name="password2"
                value={form.password2}
                onChange={handleChange}
                placeholder={t("register.password2")}
              />
            </div>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded transition-colors"
            >
              {t("register.submit")}
            </button>
            <div className="mt-4 text-center text-sm">
              {t("register.haveAccount")} {" "}
              <Link to="/" className="text-green-700 hover:underline">{t("register.login")}</Link>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
} 