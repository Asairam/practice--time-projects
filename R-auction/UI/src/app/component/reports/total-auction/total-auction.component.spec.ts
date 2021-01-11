import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAuctionComponent } from './total-auction.component';

describe('TotalAuctionComponent', () => {
  let component: TotalAuctionComponent;
  let fixture: ComponentFixture<TotalAuctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalAuctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
