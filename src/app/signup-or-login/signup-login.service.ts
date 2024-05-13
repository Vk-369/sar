import { Injectable } from '@angular/core';

import { Login, Mail, NewSignup, OtpVerify } from './signup-login.interface';
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

  verifySignupOtp(body: OtpVerify) {
    const url = SignupLoginSettings.API.VERIFY_OTP_SIGNUP;
    return this._commonService.callApi({ url, method: 'LOGIN', body });
  }

  resendOTP(body: Mail) {
    const url = SignupLoginSettings.API.RESEND_OTP;
    return this._commonService.callApi({ url, method: 'LOGIN', body });
  }

  loginUser(body: Login) {
    const url = SignupLoginSettings.API.LOGIN_USER;
    return this._commonService.callApi({ url, method: 'LOGIN', body });
  }

  changePassword(body: Login) {
    const url = SignupLoginSettings.API.RESET_PASSWORD;
    return this._commonService.callApi({ url, method: 'LOGIN', body });
  }

  fetchRecommendations(body:any)
  {
    const url = SignupLoginSettings.API.FETCH_RECOMMENDATIONS;
    return this._commonService.callApi({ url, method: 'POST',body });
  }

  getSelectedSong(body:any)  {
    const url = SignupLoginSettings.API.FETCH_SELECTED_SONG;
    return this._commonService.callApi({ url, method: 'POST',body });
  }
  userDetails(body:any)  {
    const url = SignupLoginSettings.API.FETCH_USER_DETAILS;
    return this._commonService.callApi({ url, method: 'POST',body });
  }
  updateProfile(body:any)  {
    const url = SignupLoginSettings.API.UPDATE_PROFILE;
    return this._commonService.callApi({ url, method: 'POST',body });
  }
  createPlayList(body:any)  {
    const url = SignupLoginSettings.API.CREATE_PLAYLIST;
    return this._commonService.callApi({ url, method: 'POST',body });
  }
  fetchPlayLists(body:any)  {
    const url = SignupLoginSettings.API.FETCH_PLAYLISTS;
    return this._commonService.callApi({ url, method: 'POST',body });
  }
  fetchPlayListLinkedSongs(body:any)  {
    const url = SignupLoginSettings.API.FETCH_SONGS_LINKED_TO_PLAYLIST;
    return this._commonService.callApi({ url, method: 'POST',body });
  }
  insertSongIntoPlayList(body:any)  {
    const url = SignupLoginSettings.API.INSERT_SONG_INTO_PLAYLIST;
    return this._commonService.callApi({ url, method: 'POST',body });
  }
}
