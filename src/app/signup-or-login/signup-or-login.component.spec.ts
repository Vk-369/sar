import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupOrLoginComponent } from './signup-or-login.component';

describe('SignupOrLoginComponent', () => {
  let component: SignupOrLoginComponent;
  let fixture: ComponentFixture<SignupOrLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupOrLoginComponent]
    });
    fixture = TestBed.createComponent(SignupOrLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
