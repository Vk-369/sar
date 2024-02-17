import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpDetalilsEntryComponent } from './sign-up-detalils-entry.component';

describe('SignUpDetalilsEntryComponent', () => {
  let component: SignUpDetalilsEntryComponent;
  let fixture: ComponentFixture<SignUpDetalilsEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpDetalilsEntryComponent]
    });
    fixture = TestBed.createComponent(SignUpDetalilsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
