import { apiRequest } from "../api";
import { IRegisterRequest, ILoginRequest, IVerifyEmailRequest } from "./types";

export const register = async (request: IRegisterRequest) => {
    const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(request),
    });
    return response;
};

export const login = async (request: ILoginRequest) => {
    const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(request),
    });
    return response;
};

export const verifyEmail = async (request: IVerifyEmailRequest) => {
    const response = await apiRequest('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify(request),
    });
    return response;
};