import { env } from 'src/assets/env';

const apiBaseUrl = env.apiUrl.replace(/\/+$/, '');

export class SignupLoginSettings {
  public static API = {
    CHECK_MAIL_EXISTS: apiBaseUrl + `/check/mail/exists`,
    SIGNUP_USER: apiBaseUrl + `/signup/user`,
    VERIFY_OTP_SIGNUP: apiBaseUrl + `/signup/verify/otp`,
    RESEND_OTP: apiBaseUrl + `/resend/otp`,
    RESET_PASSWORD: apiBaseUrl + `/change/password`,
    LOGIN_USER: apiBaseUrl + `/login/user`,
    // LOGIN_USER: env.apiUrl + `/test`,
    LOGIN_USER_DUMMY: apiBaseUrl + `/post/posting`,
    FETCH_RECOMMENDATIONS:apiBaseUrl + `/get/recommendations/previouslyPlayed/song`,
    FETCH_SELECTED_SONG:apiBaseUrl + `/get/selected/music/file`,
    FETCH_USER_DETAILS:apiBaseUrl+`/get/user/profile/details`,
    UPDATE_PROFILE:apiBaseUrl+`/update/user/profile`,
    CREATE_PLAYLIST:apiBaseUrl+`/create/playlist`,
    FETCH_PLAYLISTS:apiBaseUrl+`/fetch/playlist`,
    FETCH_SONGS_LINKED_TO_PLAYLIST:apiBaseUrl+`/fetch/playlist/linked/songs`,
    INSERT_SONG_INTO_PLAYLIST:apiBaseUrl+`/insert/song/playlist`,
  };
}

