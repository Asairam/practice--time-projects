import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicinfoPopupComponent } from './basicinfo-popup.component';

describe('BasicinfoComponent', () => {
  let component: BasicinfoPopupComponent;
  let fixture: ComponentFixture<BasicinfoPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicinfoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicinfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
