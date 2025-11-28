import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "@/services/auth";
import { IVerifyEmailRequest } from "@/services/auth/types";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const REDIRECT_DELAY = 2000;

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const id = searchParams.get('id');
  const token = searchParams.get('token');

  const verifyEmailMutation = useMutation({
    mutationFn: (data: IVerifyEmailRequest) => verifyEmail(data),
    onSuccess: (response) => {
      if (response && !response.error) {
        toast.success(t('verifyEmail.success'));
        setTimeout(() => {
          navigate('/login');
        }, REDIRECT_DELAY);
      } else {
        const errorMessage =
          response?.error?.message ||
          response?.message ||
          t('verifyEmail.failed');
        toast.error(errorMessage);
        setTimeout(() => {
          navigate('/login');
        }, REDIRECT_DELAY);
      }
    },
    onError: (error: any) => {
      if (error?.status >= 200 && error?.status < 300) {
        toast.success(t('verifyEmail.success'));
        setTimeout(() => {
          navigate('/login');
        }, REDIRECT_DELAY);
      } else {
        const errorMessage =
          error?.data?.error?.message ||
          error?.data?.message ||
          error?.message ||
          t('verifyEmail.failed');
        toast.error(errorMessage);
        setTimeout(() => {
          navigate('/login');
        }, REDIRECT_DELAY);
      }
    },
  });

  useEffect(() => {
    if (!id || !token) {
      toast.error(t('verifyEmail.invalidLink'));
      setTimeout(() => {
        navigate('/login');
      }, REDIRECT_DELAY);
      return;
    }

    verifyEmailMutation.mutate({ id, token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const isVerifying = verifyEmailMutation.isPending;
  const isSuccess = verifyEmailMutation.isSuccess && verifyEmailMutation.data && !verifyEmailMutation.data.error;
  const isError = verifyEmailMutation.isError || (verifyEmailMutation.isSuccess && verifyEmailMutation.data?.error);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center"
      style={{ backgroundColor: '#f0f4f8' }}
    >
      <div className="absolute right-4 top-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md px-4">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gray-800 shadow-md">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <span className="text-3xl font-bold leading-tight tracking-tight text-gray-800">
            ApexScouty
          </span>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {isVerifying && (
                <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
              )}
              {isSuccess && (
                <div className="flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              )}
              {isError && (
                <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
              )}
              {!isVerifying && !isSuccess && !isError && (
                <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                  <Mail className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>

            <CardTitle className="text-2xl font-semibold">
              {isVerifying && t('verifyEmail.verifying')}
              {isSuccess && t('verifyEmail.completed')}
              {isError && t('verifyEmail.failed')}
              {!isVerifying && !isSuccess && !isError && t('verifyEmail.verifying')}
            </CardTitle>

            <CardDescription className="text-base mt-2">
              {isVerifying && t('verifyEmail.verifying')}
              {isSuccess && t('verifyEmail.redirecting')}
              {isError && (
                verifyEmailMutation.error?.data?.error?.message ||
                verifyEmailMutation.error?.data?.message ||
                verifyEmailMutation.error?.message ||
                ''
              )}
              {!isVerifying && !isSuccess && !isError && t('verifyEmail.verifying')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {isSuccess && (
              <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {t('verifyEmail.success')}
                  </p>
                </div>
              </div>
            )}

            {isError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      {t('verifyEmail.failed')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isVerifying && (
              <div className="space-y-2">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {t('verifyEmail.verifying')}
                </p>
              </div>
            )}

            {!isVerifying && (
              <Button
                onClick={handleGoToLogin}
                className="w-full"
                size="lg"
                variant={isSuccess ? "default" : "outline"}
              >
                {t('verifyEmail.goToLogin')}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
