import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupOrLoginComponent } from './signup-or-login/signup-or-login.component';
import { SignUpPageComponent } from './signup-or-login/sign-up-page/sign-up-page.component';
import { SignUpDetalilsEntryComponent } from './signup-or-login/sign-up-detalils-entry/sign-up-detalils-entry.component';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { MusicPlayerMainComponent } from './music-player-main/music-player-main.component';
import { EmpProComponent } from './emp-pro/emp-pro.component';
import { ModalComponent } from './signup-or-login/modal/modal.component';
import { LoginScreenComponent } from './signup-or-login/login-screen/login-screen.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpComponent } from './signup-or-login/otp/otp.component';
import { SignupLoginService } from './signup-or-login/signup-login.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SignupOrLoginComponent,
    SignUpPageComponent,
    SignUpDetalilsEntryComponent,
    ChatScreenComponent,
    MusicPlayerMainComponent,
    EmpProComponent,
    ModalComponent,
    LoginScreenComponent,
    OtpComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule],
  providers: [SignupLoginService],
  bootstrap: [AppComponent],
})
export class AppModule {}
