import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintpreviewComponent } from './printpreview.component';

describe('PrintpreviewComponent', () => {
  let component: PrintpreviewComponent;
  let fixture: ComponentFixture<PrintpreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintpreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintpreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
