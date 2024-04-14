import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpPageComponent } from './signup-or-login/sign-up-page/sign-up-page.component';
import { SignupOrLoginComponent } from './signup-or-login/signup-or-login.component';
import { SignUpDetalilsEntryComponent } from './signup-or-login/sign-up-detalils-entry/sign-up-detalils-entry.component';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { MusicPlayerMainComponent } from './music-player-main/music-player-main.component';
import { LoginScreenComponent } from './signup-or-login/login-screen/login-screen.component';

const routes: Routes = [
  {path:'',component:SignupOrLoginComponent},
  {path:'signUp',component:SignUpPageComponent},
  {path:'enterDetails',component:SignUpDetalilsEntryComponent},
  {path:'login',component:LoginScreenComponent},
  {path:'musicPlayer',component:MusicPlayerMainComponent},
  // {path:'',component:ChatScreenComponent},

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// { path: 'home', component: HomeComponent },