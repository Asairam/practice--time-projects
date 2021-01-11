import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotPopupComponent } from './lot-popup.component';

describe('LotPopupComponent', () => {
  let component: LotPopupComponent;
  let fixture: ComponentFixture<LotPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
