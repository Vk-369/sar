import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent {
  itemSelected: any = 'men';
  selectedCard(value: any){
    console.log('into the selected card')
    this.itemSelected = value;
  }
}
