import { TestBed } from '@angular/core/testing';

import { SarServiceService } from './sar-service.service';

describe('SarServiceService', () => {
  let service: SarServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SarServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
