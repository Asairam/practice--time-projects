import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierStatusDetailsComponent } from './supplier-status-details.component';

describe('SupplierStatusDetailsComponent', () => {
  let component: SupplierStatusDetailsComponent;
  let fixture: ComponentFixture<SupplierStatusDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierStatusDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierStatusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
