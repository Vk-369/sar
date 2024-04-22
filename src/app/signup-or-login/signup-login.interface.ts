export interface Mail {
  mail_id: string;
}

export interface NewSignup {
  mail_id: string;
  password: string;
  username: string;
}

export interface OtpVerify {
  mail_id: string;
  otp: string;
}

export interface Login {
  mail_id: string;
  password: string;
}
