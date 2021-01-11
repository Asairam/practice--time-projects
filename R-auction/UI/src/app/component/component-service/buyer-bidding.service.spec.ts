import { TestBed } from '@angular/core/testing';

import { BuyerBiddingService } from './buyer-bidding.service';

describe('BuyerBiddingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuyerBiddingService = TestBed.get(BuyerBiddingService);
    expect(service).toBeTruthy();
  });
});
