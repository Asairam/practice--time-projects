import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsetComponent } from './reportset.component';

describe('ReportsetComponent', () => {
  let component: ReportsetComponent;
  let fixture: ComponentFixture<ReportsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
