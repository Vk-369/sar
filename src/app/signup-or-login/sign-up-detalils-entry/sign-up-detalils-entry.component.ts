import { SarServiceService } from './../../sar-service.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common/common.service';
import { SignupLoginService } from '../signup-login.service';

@Component({
  selector: 'app-sign-up-detalils-entry',
  templateUrl: './sign-up-detalils-entry.component.html',
  styleUrls: ['./sign-up-detalils-entry.component.scss'],
})
export class SignUpDetalilsEntryComponent {
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  incorrectMatch: boolean = false;

  fragment: any = {};
  signupForm!: FormGroup;
  blurControls: any = {};
  passwordStrength: any = {
    charLength: false,
    specialChar: false,
    digit: false,
    capitalChar: false,
  };
  existingUser: boolean = false;
  modalText: string = '';

  constructor(
    private _router: Router,
    private _sarService: SarServiceService,
    public commonService: CommonService,
    private _route: ActivatedRoute,
    private _signupLoginService: SignupLoginService
  ) {}

  ngOnInit(): void {
    this._route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.fragment = this._sarService.decodeParams(fragment);
      }
    });
    this.initForm();
  }

  initForm() {
    this.signupForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(60),
      ]),
      mail_id: new FormControl('', [Validators.required, Validators.email]),
      phone_no: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern('^\\d{1,10}$'),
      ]),
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

  resetValue(control: string) {
    this.blurControls[control] = false;
    this.signupForm.get(control)?.reset();
    this.signupForm.get(control)?.updateValueAndValidity();
  }

  onBlur(control: string) {
    this.blurControls[control] = true;
  }

  passwordComplexity(event: Event) {
    this.passwordStrength.charLength =
      this.signupForm.get('password')?.value.length > 7;
    this.passwordStrength.capitalChar = /[A-Z]/.test(
      this.signupForm.get('password')?.value
    );
    this.passwordStrength.digit = /[0-9]/.test(
      this.signupForm.get('password')?.value
    );
    this.passwordStrength.specialChar = /[#@$!%*?&]/.test(
      this.signupForm.get('password')?.value
    );
  }

  gotoStep2() {
    if (
      this.signupForm.get('username')?.invalid ||
      this.signupForm.get('mail_id')?.invalid ||
      this.signupForm.get('phone_no')?.invalid
    ) {
      this.signupForm.get('username')?.markAsTouched();
      this.onBlur('username');
      this.signupForm.get('mail_id')?.markAsTouched();
      this.onBlur('mail_id');
      this.signupForm.get('phone_no')?.markAsTouched();
      this.onBlur('phone_no');
      return;
    }
    console.log(this.signupForm.get('mail_id')?.value);
    this._signupLoginService
      .checkMailExists({ mail_id: this.signupForm.get('mail_id')?.value })
      .subscribe((response) => {
        console.log(response);
        response = this._sarService.decrypt(response.edc);
        console.log(response);
        if (response.success) {
          if (response.verify === 'no') {
            this.step1 = false;
            this.step2 = true;
            this.step3 = false;
          } else if (response.verify === 'yes') {
            this.step4 = true;
            this.modalText = response.message;
          } else {
            this.existingUser = true;
          }
        }
      });
  }

  gotoStep3() {
    if (this.signupForm.get('password')?.invalid) {
      this.signupForm.get('password')?.markAsTouched();
      return;
    }
    this.step1 = false;
    this.step2 = false;
    this.step3 = true;
  }

  gotoStep4() {
    this.incorrectMatch = false;
    this.incorrectMatch = !(
      this.signupForm.get('password')?.value ===
      this.signupForm.get('repassword')?.value
    );
    if (this.incorrectMatch) {
      console.log(this.incorrectMatch, this.step4);
      this.resetValue('repassword');
      return;
    }
    const body = {
      user_id: null,
      mail_id: this.signupForm.value.mail_id,
      password: this.signupForm.value.password,
      username: this.signupForm.value.username,
      gender: this.fragment.gender,
      phone_no: this.signupForm.value.phone_no,
    };
    console.log(body);
    this._signupLoginService.signupNewUser(body).subscribe((response) => {
      console.log(response);
      response = this._sarService.decrypt(response.edc);
      console.log(response);
      if (response.success) {
        if (response.verify === 'yes') {
          this.step4 = true;
          this.modalText = response.message;
        } else if (response.verify === 'no') {
          this.step4 = true;
          this.modalText = response.message;
        } else {
          this.existingUser = true;
        }
      }
    });
  }

  back() {
    if (this.step3) {
      this.resetValue('repassword');
      this.step3 = false;
      this.step2 = true;
    } else if (this.step2) {
      this.resetValue('password');
      this.step2 = false;
      this.step1 = true;
    } else {
      this._router.navigate(['/signUp']);
      console.log('baack');
    }
  }

  confirmEvent(event: boolean) {
    this.step4 = false;
    const mail = this._sarService.encodeParams({
      mail_id: this.signupForm.get('mail_id')?.value,
    });
    console.log(mail, this.signupForm.get('mail_id')?.value);
    this._router.navigate(['/verify'], { fragment: mail });
  }

  modalEvent(e: any) {
    this.step4 = false;
    if (this.incorrectMatch) {
      console.log(this.incorrectMatch);
      this.incorrectMatch = false;
      return;
    }
    console.log('navigate');
    this._router.navigate(['']);
  }

  loginEvent(event: boolean) {
    this._router.navigate(['./login']);
  }
}
