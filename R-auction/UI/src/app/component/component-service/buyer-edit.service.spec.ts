import { TestBed } from '@angular/core/testing';

import { BuyerEditService } from './buyer-edit.service';

describe('BuyerEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuyerEditService = TestBed.get(BuyerEditService);
    expect(service).toBeTruthy();
  });
});
