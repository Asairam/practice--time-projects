import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAuctionComponent } from './template-auction.component';

describe('TemplateAuctionComponent', () => {
  let component: TemplateAuctionComponent;
  let fixture: ComponentFixture<TemplateAuctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateAuctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
