import { env } from 'src/assets/env';

export class SignupLoginSettings {
  public static API = {
    CHECK_MAIL_EXISTS: env.apiUrl + `/check/mail/exists`,
    SIGNUP_USER: env.apiUrl + `/signup/user`,
    VERIFY_OTP_SIGNUP: env.apiUrl + `/signup/verify/otp`,
    RESEND_OTP: env.apiUrl + `/resend/otp`,
  };
}
