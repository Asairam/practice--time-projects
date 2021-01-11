import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendormodificationComponent } from './vendormodification.component';

describe('VendormodificationComponent', () => {
  let component: VendormodificationComponent;
  let fixture: ComponentFixture<VendormodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendormodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendormodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
