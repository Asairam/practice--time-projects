import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneAuctionComponent } from './clone-auction.component';

describe('CloneAuctionComponent', () => {
  let component: CloneAuctionComponent;
  let fixture: ComponentFixture<CloneAuctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloneAuctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
