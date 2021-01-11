import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCurrencyComponent } from './supplier-currency.component';

describe('SupplierCurrencyComponent', () => {
  let component: SupplierCurrencyComponent;
  let fixture: ComponentFixture<SupplierCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
