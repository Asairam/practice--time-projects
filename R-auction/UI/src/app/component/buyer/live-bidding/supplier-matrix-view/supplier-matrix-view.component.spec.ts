import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMatrixViewComponent } from './supplier-matrix-view.component';

describe('SupplierMatrixViewComponent', () => {
  let component: SupplierMatrixViewComponent;
  let fixture: ComponentFixture<SupplierMatrixViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierMatrixViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMatrixViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
