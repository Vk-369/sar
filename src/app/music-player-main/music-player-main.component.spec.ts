import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicPlayerMainComponent } from './music-player-main.component';

describe('MusicPlayerMainComponent', () => {
  let component: MusicPlayerMainComponent;
  let fixture: ComponentFixture<MusicPlayerMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MusicPlayerMainComponent]
    });
    fixture = TestBed.createComponent(MusicPlayerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
