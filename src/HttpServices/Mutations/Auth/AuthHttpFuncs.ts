import { authRoutes } from "@/src/BackendRoutes/AuthRoutes";
import {
  IUserCreateVerificationCode,
  IUserLogin,
  IUserLoginResponse,
  IUserRegistration,
  IUserRegistrationResponse,
  IUserResetPassword,
  IUserVerificationData,
} from "@/src/GlobalTypes/User";
import axios from "axios";

export const loginHttpFunc = (userLoginData: IUserLogin) => {
  return axios.post<{ response: IUserLoginResponse }>(
    authRoutes.login,
    userLoginData,
  );
};

export const registerHttpFunc = (userRegistrationData: IUserRegistration) => {
  return axios.post<IUserRegistrationResponse>(
    authRoutes.registration,
    userRegistrationData,
  );
};

export const resetPasswordHttpFunc = (
  userResetPasswordData: IUserResetPassword,
) => {
  return axios.post<{ response: string }>(
    authRoutes.resetPassword,
    userResetPasswordData,
  );
};

export const resendVerificationCodeHttpFunc = (userId: number) => {
  return axios.get<{ response: string }>(
    `${authRoutes.resendVerificationCode}/${userId}`,
  );
};

export const verifyCodeForUserRegistrationHttpFunc = (
  verificationDetails: IUserVerificationData,
) => {
  return axios.post<{ response: string }>(
    authRoutes.userRegistrationCodeVerification,
    verificationDetails,
  );
};

export const createVerificationCodeForSecurityHttpFunc = (
  email: IUserCreateVerificationCode,
) => {
  return axios.post<{ userId: number }>(
    authRoutes.createVerificationCodeForSecurity,
    email,
  );
};

export const verificationCodeForSecurityHttpFunc = (
  verificationData: IUserVerificationData,
) => {
  return axios.post<{ userId: number }>(
    authRoutes.verifyCodeForSecurity,
    verificationData,
  );
};
