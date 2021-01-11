import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachDocumentComponent } from './attach-document.component';

describe('AttachDocumentComponent', () => {
  let component: AttachDocumentComponent;
  let fixture: ComponentFixture<AttachDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
