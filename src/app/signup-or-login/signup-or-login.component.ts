import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-signup-or-login',
  templateUrl: './signup-or-login.component.html',
  styleUrls: ['./signup-or-login.component.scss']
})
export class SignupOrLoginComponent {
  constructor(private router: Router) {}
  picLoaded:any=false
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
  songPicLoaded()
  {
  this.picLoaded=false
    setTimeout(()=>
    {
      this.picLoaded=true
    },1000)
    console.log("image loaded from the src")
    //! there should be a shimmer untill the images gets loaded from the assets folder
  }
}
