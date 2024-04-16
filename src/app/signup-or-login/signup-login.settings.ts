import { env } from 'src/assets/env';

export class SignupLoginSettings {
  public static API = {
    CHECK_MAIL_EXISTS: env.apiUrl + `/check/mail/exists`,
    SIGNUP_USER: env.apiUrl + `/signup/user`,
  };
}
