import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAuctionDetailsComponent } from './live-auction-details.component';

describe('LiveAuctionDetailsComponent', () => {
  let component: LiveAuctionDetailsComponent;
  let fixture: ComponentFixture<LiveAuctionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveAuctionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveAuctionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
