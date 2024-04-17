import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common/common.service';
import { SarServiceService } from 'src/app/sar-service.service';
import { SignupLoginService } from '../signup-login.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss'],
})
export class LoginScreenComponent {
  isResetClicked: boolean = false;
  isGmailIdEntered: boolean = false;
  openModal: boolean = false;
  text: any = '';

  loginForm!: FormGroup;
  blurControls: any = { mail_id: false, password: false, repassword: false };
  fragment: any = {};
  resetMode: boolean = false;
  resetForm!: FormGroup;
  inReset: boolean = false;
  incorrectMatch: boolean = false;
  passwordStrength: any = {
    charLength: false,
    specialChar: false,
    digit: false,
    capitalChar: false,
  };
  wrongCreds: string = '';
  verify: boolean = false;
  otpType: string = '';

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    public commonService: CommonService,
    private _sarService: SarServiceService,
    private _signupLoginService: SignupLoginService
  ) {}

  ngOnInit() {
    this._route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.fragment = this._sarService.decodeParams(fragment);
        if (this.fragment.type === 'reset password') {
          this.resetMode = true;
          this.initResetForm();
        }
      }
      console.log(this.fragment);
    });
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      mail_id: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  initResetForm() {
    this.resetForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(60),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#@$!%*?&]).{4,}$'
        ),
      ]),
      repassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(60),
      ]),
    });
  }

  passwordComplexity(event: Event) {
    this.passwordStrength.charLength =
      this.resetForm.get('password')?.value.length > 7;
    this.passwordStrength.capitalChar = /[A-Z]/.test(
      this.resetForm.get('password')?.value
    );
    this.passwordStrength.digit = /[0-9]/.test(
      this.resetForm.get('password')?.value
    );
    this.passwordStrength.specialChar = /[#@$!%*?&]/.test(
      this.resetForm.get('password')?.value
    );
  }

  onBlur(control: string) {
    this.blurControls[control] = true;
    this.wrongCreds = '';
  }

  gotoConfirm() {
    if (this.resetForm.get('password')?.invalid) {
      this.resetForm.get('password')?.markAsTouched();
      return;
    }
    this.inReset = true;
  }

  resetConfirm() {
    this.incorrectMatch = false;
    if (this.resetForm.get('repassword')?.invalid) {
      this.blurControls.repassword = true;
      this.resetForm.markAllAsTouched();
      return;
    }
    this.incorrectMatch = !(
      this.resetForm.get('password')?.value ===
      this.resetForm.get('repassword')?.value
    );
    if (this.incorrectMatch) {
      this.blurControls['repassword'] = false;
      this.resetForm.get('repassword')?.reset();
      this.resetForm.get('repassword')?.updateValueAndValidity();
      return;
    }
    const body = {
      mail_id: this.fragment.mail_id,
      password: this.resetForm.value.password,
    };
    this._signupLoginService.changePassword(body).subscribe((response) => {
      response = this._sarService.encrypt(response.edc);
      if (response.success) {
        this.openModal = true;
      }
    });
  }

  resetPassword() {
    this.isResetClicked = true;
    this.blurControls.mail_id = false;
    this.otpType = 'reset password';
  }

  authenticate() {
    console.log(this.loginForm.invalid);
    if (this.loginForm.invalid) {
      this.onBlur('mail_id');
      this.onBlur('password');
      this.loginForm.markAllAsTouched();
      return;
    }
    const body = {
      mail_id: this.loginForm.value.mail_id,
      password: this.loginForm.value.password,
    };
    this._signupLoginService.loginUser(body).subscribe((response) => {
      response = this._sarService.decrypt(response.edc);
      console.log(response);
      if (response.success) {
        if (response.login === 'success') {
          sessionStorage.setItem('token', response.token);
          this._router.navigate(['/musicPlayer']);
        } else if (response.login === 'verify') {
          this.verify = true;
        } else {
          this.wrongCreds = response.message;
          this.loginForm.get('password')?.reset();
        }
      }
    });
    console.log('into the authentication');
  }

  sendOtp() {
    if (this.loginForm.get('mail_id')?.invalid) {
      this.onBlur('mail_id');
      return;
    }
    this._signupLoginService
      .resendOTP({ mail_id: this.loginForm.value.mail_id })
      .subscribe((response) => {
        response = this._sarService.decrypt(response.edc);
        console.log(response);
        if (response.success) {
          const mail = this._sarService.encodeParams({
            mail_id: this.loginForm.get('mail_id')?.value,
            type: this.otpType,
          });
          this._router.navigate(['/verify'], { fragment: mail });
        }
      });
  }

  // verifyMail() {
  //   this.otpType = 'verify';
  //   if (this.loginForm.get('mail_id')?.invalid) {
  //     this.onBlur('mail_id');
  //     return;
  //   }
  //   const mail = this._sarService.encodeParams({
  //     mail_id: this.loginForm.get('mail_id')?.value,
  //     type: this.otpType,
  //   });
  //   this._router.navigate(['/verify'], { fragment: mail });
  // }

  back() {
    if (this.inReset) {
      this.inReset = false;
      return;
    }
    if (this.isResetClicked) {
      this.loginForm.reset();
      this.isResetClicked = false;
      return;
    }
    this._router.navigate(['']);
  }

  modalEvent(e: any) {
    if (this.incorrectMatch) {
      console.log(this.incorrectMatch);
      this.incorrectMatch = false;
      return;
    }
    console.log('navigate');
    this._router.navigate(['']);
  }

  confirmEvent(event: boolean) {
    this.resetMode = false;
    this.resetForm.reset();
    this._router.navigate(['/login']);
  }
}
