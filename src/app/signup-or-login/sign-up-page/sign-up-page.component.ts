import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SarServiceService } from '../../sar-service.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})


export class SignUpPageComponent {

  itemSelected: string = 'men';

  constructor(
    private router: Router,
    private _sarService:SarServiceService,
    private _activatedRoute:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._activatedRoute.fragment.subscribe((params:any)=>
    {
     if(params)
     {
      const frag=this._sarService.decodeParams(params)
      frag.gender=='men' ?( this.itemSelected='men'):this.itemSelected='women'
    }
    })
    this.encode() 
  }

  selectedCard(value: any){
    if(this.itemSelected!=value)
    {
      this.itemSelected = value;
      console.log(this.itemSelected,'into the selected card',value)
    }
  }

  backToSplash()
  {
    this.router.navigate(['/']);
  }

  detailsScreen()
  {
    const gender=this._sarService.encodeParams({gender:this.itemSelected})
    this.router.navigate(['/enterDetails'], {fragment:gender});
  }

  encode()
  {
    const gender=this._sarService.encodeParams({gender:this.itemSelected})
    this.router.navigate(['/signUp'], {fragment:gender});
  }
}
