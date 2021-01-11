import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidviewPopupComponent } from './bidview-popup.component';

describe('BidviewPopupComponent', () => {
  let component: BidviewPopupComponent;
  let fixture: ComponentFixture<BidviewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidviewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
