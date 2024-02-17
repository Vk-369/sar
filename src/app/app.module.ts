import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupOrLoginComponent } from './signup-or-login/signup-or-login.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { SignUpDetalilsEntryComponent } from './sign-up-detalils-entry/sign-up-detalils-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupOrLoginComponent,
    SignUpPageComponent,
    SignUpDetalilsEntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
