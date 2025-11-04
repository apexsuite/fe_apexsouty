import { requestAmazonConsentCallback } from "@/lib/consentSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useErrorHandler } from "@/lib/useErrorHandler";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const useQueryParamHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { handleError } = useErrorHandler();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        // Senaryo 1: Amazon ürün yetkilendirme başlatma
        // Query params: amazon_callback_uri, amazon_state, selling_partner_id
        const amazonCallbackUri = params.get('amazon_callback_uri');
        const amazonState = params.get('amazon_state');
        const sellingPartnerId = params.get('selling_partner_id');

        // Senaryo 2: Amazon callback validate
        // Query params: state, selling_partner_id, spapi_oauth_code
        const state = params.get('state');
        const spapiOauthCode = params.get('spapi_oauth_code');
        const validateSellingPartnerId = params.get('selling_partner_id');

        // Senaryo 1 kontrolü
        if (amazonCallbackUri && amazonState && sellingPartnerId) {
            if (isAuth) {
                // Senaryo 1.1: Kullanıcı zaten login olmuş
                dispatch(requestAmazonConsentCallback({
                    amazonCallbackUri,
                    amazonState,
                    sellingPartnerId,
                }))
                    .unwrap()
                    .then((response: any) => {
                        const redirectUrl = response?.url || response?.data?.url || response?.redirectUrl || response?.data?.redirectUrl || response;
                        if (redirectUrl && typeof redirectUrl === 'string') {
                            window.location.href = redirectUrl;
                        } else {
                            handleError({ message: 'Authorization URL not found in response' });
                        }
                    })
                    .catch((error: any) => {
                        handleError(error);
                    });
            } else {
                // Senaryo 1.2: Kullanıcı login olmamış - query param'ları kaydet
                localStorage.setItem(
                    'pendingAmazonCallbackParams',
                    JSON.stringify({ amazonCallbackUri, amazonState, sellingPartnerId })
                );
                navigate('/login', { replace: true });
            }
            return; // Senaryo 1 işlendi, diğer kontrollere geçme
        }

        // Senaryo 2 kontrolü
        if (state && validateSellingPartnerId && spapiOauthCode) {
            if (isAuth) {
                // Senaryo 2.1: Kullanıcı zaten login olmuş - login sayfasına yönlendir, oradan dashboard'a geçer
                // Query param'ları kaydet, dashboard'da validate edilecek
                localStorage.setItem(
                    'pendingAmazonValidateParams',
                    JSON.stringify({ state, selling_partner_id: validateSellingPartnerId, spapi_oauth_code: spapiOauthCode })
                );
                navigate('/login', { replace: true });
            } else {
                // Senaryo 2.2: Kullanıcı login olmamış - query param'ları kaydet
                localStorage.setItem(
                    'pendingAmazonValidateParams',
                    JSON.stringify({ state, selling_partner_id: validateSellingPartnerId, spapi_oauth_code: spapiOauthCode })
                );
                navigate('/login', { replace: true });
            }
        }
    }, [location.search, isAuth, navigate, dispatch, handleError]);
};

export default useQueryParamHandler;