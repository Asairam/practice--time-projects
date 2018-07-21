import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundnoclientComponent } from './refundnoclient.component';

describe('RefundnoclientComponent', () => {
  let component: RefundnoclientComponent;
  let fixture: ComponentFixture<RefundnoclientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundnoclientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundnoclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
