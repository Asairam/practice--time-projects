import { TestBed } from '@angular/core/testing';

import { BuyerStatusService } from './buyer-status.service';

describe('BuyerStatus.ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuyerStatusService = TestBed.get(BuyerStatusService);
    expect(service).toBeTruthy();
  });
});
