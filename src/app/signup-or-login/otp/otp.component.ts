import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SarServiceService } from 'src/app/sar-service.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent {
  otpForm!: FormGroup;
  verifySuccess: boolean = false;
  fragment: any = {};

  modalButton = 'Login';

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _sarService: SarServiceService
  ) {}

  ngOnInit() {
    this._route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.fragment = this._sarService.decodeParams(fragment);
        if (this.fragment.type === 'reset password') {
          this.modalButton = 'Set password';
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
    this.verifySuccess = true;
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
    this.otpForm.reset();
  }

  confirmModal(event: boolean) {
    const frag = this._sarService.encodeParams({ ...this.fragment });
    this._router.navigate(['/login'], { fragment: frag });
  }

  back() {
    this._router.navigate(['']);
  }
}
