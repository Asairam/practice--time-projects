import { TestBed, inject } from '@angular/core/testing';

import { XyzService } from './xyz.service';

describe('XyzService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XyzService]
    });
  });

  it('should be created', inject([XyzService], (service: XyzService) => {
    expect(service).toBeTruthy();
  }));
});
