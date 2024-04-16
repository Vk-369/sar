import { Injectable } from '@angular/core';

import { Mail, NewSignup } from './signup-login.interface';
import { SignupLoginSettings } from './signup-login.settings';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root',
})
export class SignupLoginService {
  constructor(private _commonService: CommonService) {}

  checkMailExists(body: Mail) {
    const url = SignupLoginSettings.API.CHECK_MAIL_EXISTS;
    return this._commonService.callApi({ url, method: 'LOGIN', body });
  }

  signupNewUser(body: NewSignup) {
    const url = SignupLoginSettings.API.SIGNUP_USER;
    return this._commonService.callApi({ url, method: 'LOGIN', body });
  }
}
