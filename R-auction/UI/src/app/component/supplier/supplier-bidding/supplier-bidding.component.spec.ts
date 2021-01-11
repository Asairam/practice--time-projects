import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBiddingComponent } from './supplier-bidding.component';

describe('SupplierBiddingComponent', () => {
  let component: SupplierBiddingComponent;
  let fixture: ComponentFixture<SupplierBiddingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierBiddingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierBiddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
