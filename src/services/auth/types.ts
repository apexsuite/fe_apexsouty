export interface IRegisterRequest {
    email: string;
    firstname: string;
    lastname: string;
    language: string;
    password: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IVerifyEmailRequest {
    id: string;
    token: string;
}

export interface IForgotPasswordRequest {
    email: string;
    language: string;
}