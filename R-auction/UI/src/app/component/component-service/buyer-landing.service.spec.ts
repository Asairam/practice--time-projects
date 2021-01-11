import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BuyerLandingService } from '../component-service/buyer-landing.service';

describe('BuyerLandingService', () => {
  let service = BuyerLandingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuyerLandingService]
    });
    service = TestBed.get(BuyerLandingService);
  });

  it('should be created', () => {
    const service: BuyerLandingService = TestBed.get(BuyerLandingService);
    expect(service).toBeTruthy();
  });
});
