import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisColumnSelectComponent } from './mis-column-select.component';

describe('MisColumnSelectComponent', () => {
  let component: MisColumnSelectComponent;
  let fixture: ComponentFixture<MisColumnSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisColumnSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisColumnSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
