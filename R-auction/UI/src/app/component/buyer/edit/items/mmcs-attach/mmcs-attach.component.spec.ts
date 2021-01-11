import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmcsAttachComponent } from './mmcs-attach.component';

describe('MmcsAttachComponent', () => {
  let component: MmcsAttachComponent;
  let fixture: ComponentFixture<MmcsAttachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmcsAttachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmcsAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
