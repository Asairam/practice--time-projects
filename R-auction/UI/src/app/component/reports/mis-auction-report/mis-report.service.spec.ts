import { TestBed } from '@angular/core/testing';

import { MisReportService } from './mis-report.service';

describe('MisReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MisReportService = TestBed.get(MisReportService);
    expect(service).toBeTruthy();
  });
});
