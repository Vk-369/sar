import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private router: Router) {
    
  }


  resetPassword() {
    this.isResetClicked = true;
    this.isGmailIdEntered = false;
    console.log('this is into the reset password component');
  }
  gmailEnter() {
    this.isGmailIdEntered = true;
  }
  verifyOtp() {
    this.openModal = true;
    this.text = 'qwertyuiop';
    setTimeout(() => {
      this.text = 'this is  the altered text bro';
    }, 5000);
  }
  fromModal(e: any) {
    if (e) {
      console.log(e, 'this is the event getting emitted from modal component');
      this.openModal = false;
    }
  }
  authenticate() {
    console.log('into the authentication');
  }
  navigation()
  {
this.router.navigate(['/musicPlayer'])

  }
}
