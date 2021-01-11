import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmcsComponent } from './mmcs.component';

describe('MmcsComponent', () => {
  let component: MmcsComponent;
  let fixture: ComponentFixture<MmcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
