import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBidHistoryComponent } from './supplier-bid-history.component';

describe('SupplierBidHistoryComponent', () => {
  let component: SupplierBidHistoryComponent;
  let fixture: ComponentFixture<SupplierBidHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierBidHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierBidHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
