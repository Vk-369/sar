import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-sign-up-detalils-entry',
  templateUrl: './sign-up-detalils-entry.component.html',
  styleUrls: ['./sign-up-detalils-entry.component.scss']
})
export class SignUpDetalilsEntryComponent {
  constructor(private router: Router) {
    
  }

  ngOnInit(): void {
    // ngOnInit logic here
    console.log('sign up Component initialized');
  }

enterDetails:boolean=true
pswrdEntered:boolean=false
generatePswrd:boolean=false

detailsEntered()
{
  this.enterDetails=false
  this.pswrdEntered=false
  
}
passWrdEntered()
{
  this.pswrdEntered=true
}
reEnterPswrd()
{
  this.generatePswrd=true

}
back()
{
  this.router.navigate(['/signUp']);

  console.log("baack")
}
modalEvent(e:any)
{
if(e)
{
  this.generatePswrd=false
}
}

}
