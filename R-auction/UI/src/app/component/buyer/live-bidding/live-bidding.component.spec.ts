import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveBiddingComponent } from './live-bidding.component';

describe('LiveBiddingComponent', () => {
  let component: LiveBiddingComponent;
  let fixture: ComponentFixture<LiveBiddingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveBiddingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveBiddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
