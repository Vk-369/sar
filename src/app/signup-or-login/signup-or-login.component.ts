import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-signup-or-login',
  templateUrl: './signup-or-login.component.html',
  styleUrls: ['./signup-or-login.component.scss']
})
export class SignupOrLoginComponent {
  constructor(private router: Router) {}
  ngOnInit(): void {
    // ngOnInit logic here
    console.log('Component initialized');
  }

  signUpPage()
  {
    
      this.router.navigate(['/signUp']);
  
  }
  login()
  {
    this.router.navigate(['/login']);

  }
}
