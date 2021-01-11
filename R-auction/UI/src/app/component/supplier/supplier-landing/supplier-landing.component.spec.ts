import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierLandingComponent } from './supplier-landing.component';

describe('SupplierLandingComponent', () => {
  let component: SupplierLandingComponent;
  let fixture: ComponentFixture<SupplierLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
