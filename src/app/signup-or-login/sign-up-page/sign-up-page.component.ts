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
  picLoaded:any=false

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
    this.songPicLoaded()
  }

  selectedCard(value: any){
    if(this.itemSelected!=value)
    {
      this.itemSelected = value;
      console.log(this.itemSelected,'into the selected card',value)
    }
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
