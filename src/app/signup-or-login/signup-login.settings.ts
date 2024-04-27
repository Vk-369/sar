import { env } from 'src/assets/env';

export class SignupLoginSettings {
  public static API = {
    CHECK_MAIL_EXISTS: env.apiUrl + `/check/mail/exists`,
    SIGNUP_USER: env.apiUrl + `/signup/user`,
    VERIFY_OTP_SIGNUP: env.apiUrl + `/signup/verify/otp`,
    RESEND_OTP: env.apiUrl + `/resend/otp`,
    RESET_PASSWORD: env.apiUrl + `/change/password`,
    LOGIN_USER: env.apiUrl + `/login/user`,
    FETCH_RECOMMENDATIONS:env.apiUrl + `/get/recommendations/previouslyPlayed/song`,
    FETCH_SELECTED_SONG:env.apiUrl + `/get/selected/music/file`,
  };
}

