import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierItemViewComponent } from './supplier-item-view.component';

describe('SupplierItemViewComponent', () => {
  let component: SupplierItemViewComponent;
  let fixture: ComponentFixture<SupplierItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierItemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
