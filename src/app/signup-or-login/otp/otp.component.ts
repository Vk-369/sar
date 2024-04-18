import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SarServiceService } from 'src/app/sar-service.service';
import { SignupLoginService } from '../signup-login.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent {
  otpForm!: FormGroup;
  verifySuccess: boolean = false;
  fragment: any = {};

  modalButton: string = 'Login';
  modalText: string = '';

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _sarService: SarServiceService,
    private _signupLoginService: SignupLoginService
  ) {}

  ngOnInit() {
    this._route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.fragment = this._sarService.decodeParams(fragment);
        if (this.fragment.type === 'reset password') {
          // this.resendOtp();
          this.modalButton = 'Set password';
        } else if (this.fragment.type === 'verify') {
          this.modalButton = 'Login';
          // this.resendOtp();
        }
      }
    });
    this.initForm();
  }

  initForm() {
    this.otpForm = new FormGroup({
      digit1: new FormControl(null, Validators.required),
      digit2: new FormControl(null, Validators.required),
      digit3: new FormControl(null, Validators.required),
      digit4: new FormControl(null, Validators.required),
    });
  }

  onVerifyOtp() {
    if (this.otpForm.invalid) {
      return;
    }
    const value = this.otpForm.value;
    const otp = value.digit1 + value.digit2 + value.digit3 + value.digit4;
    const body = {
      mail_id: this.fragment.mail_id,
      otp,
    };
    this._signupLoginService.verifySignupOtp(body).subscribe((response) => {
      console.log(response);
      response = this._sarService.decrypt(response.edc);
      console.log(response);
      if (response.success) {
        this.modalText = response.message;
        this.verifySuccess = true;
        if (response.status === 2) {
          this.modalButton = 'Reset password';
          return;
        } else if (response.status === 1) {
          this.modalButton = 'Retry';
        } else {
          this.modalButton = 'Signup';
        }
      }
    });
  }

  singleDigit(control: string) {
    if (this.otpForm.get(control)?.value.length >= 2) {
      console.log(this.otpForm.get(control)?.value.slice(0, 1));
      this.otpForm
        .get(control)
        ?.setValue(this.otpForm.get(control)?.value.slice(0, 1));
      this.otpForm.get(control)?.updateValueAndValidity();
    }
  }

  resendOtp() {
    this._signupLoginService
      .resendOTP({ mail_id: this.fragment.mail_id })
      .subscribe((response) => {
        response = this._sarService.decrypt(response.edc);
        console.log(response);
        if (response.success) {
          this.otpForm.reset();
        }
      });
  }

  confirmModal(event: boolean) {
    this.verifySuccess = false;
    if (this.modalButton === 'Login' || this.modalButton === 'Reset password') {
      const frag = this._sarService.encodeParams({ ...this.fragment });
      this._router.navigate(['/login'], { fragment: frag });
    } else if (this.modalButton === 'Retry') {
      this.otpForm.reset();
    } else {
      this._router.navigate(['/signUp']);
    }
  }

  back() {
    this._router.navigate(['']);
  }
}
