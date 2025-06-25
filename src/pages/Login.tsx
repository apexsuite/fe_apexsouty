import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
      <div className="min-h-screen overflow-hidden flex items-center justify-center bg-muted/50">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <h1 className="text-2xl font-bold  text-center">{t('login.title')}</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username" className="text-sm mb-2">{t('login.username')}</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder={t('login.username')} 
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm mb-2">{t('login.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('login.password')}
                  autoComplete="current-password"
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-1 flex justify-between mt-4">
                <Link to="/register" className="text-xs text-green-700 hover:underline">{t('register.title')}</Link>
                <Link to="/forgot-password" className="text-xs text-green-700 hover:underline">{t('login.forgot')}</Link>
              </div>
            </div>
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Giriş yapılıyor..." : t('login.button')}
            </Button>
            
            {/* Test Kullanıcıları Bilgisi */}
           
          </form>
        </Card>
      </div>
    </>
  );
} 