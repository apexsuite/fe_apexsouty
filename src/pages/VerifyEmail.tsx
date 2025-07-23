import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useTranslation();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const id = searchParams.get('id');
        const token = searchParams.get('token');

        if (!id || !token) {
          toast.error('Invalid verification link');
          navigate('/');
          return;
        }

        const response = await authService.verifyEmail({ id, token });
        
        if (response.success) {
          toast.success('Email verified successfully!');
          // Başarılı verification sonrası login sayfasına yönlendir
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          toast.error(response.message || 'Email verification failed');
          navigate('/');
        }
      } catch (error: any) {
        toast.error(error || 'Email verification failed');
        navigate('/');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {isVerifying ? 'Verifying your email...' : 'Email verification completed'}
        </h2>
        <p className="text-muted-foreground">
          {isVerifying ? 'Please wait while we verify your email address.' : 'Redirecting to login page...'}
        </p>
      </div>
    </div>
  );
} 