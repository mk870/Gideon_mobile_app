import { backEndUrl } from "../Utils/Constants";

const baseRouteName = "/auth";

export const authRoutes = {
  login: `${backEndUrl}${baseRouteName}/login`,
  registration: `${backEndUrl}${baseRouteName}/register`,
  resetPassword: `${backEndUrl}${baseRouteName}/reset-password`,
  resendVerificationCode: `${backEndUrl}${baseRouteName}/resend-verification-code`,
  userRegistrationCodeVerification: `${backEndUrl}${baseRouteName}/verify-code/registration`,
  createVerificationCodeForSecurity: `${backEndUrl}${baseRouteName}/verification-code`,
  verifyCodeForSecurity: `${backEndUrl}${baseRouteName}/verify-code/security`,
};
