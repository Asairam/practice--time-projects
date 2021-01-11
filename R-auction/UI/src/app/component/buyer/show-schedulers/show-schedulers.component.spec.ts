import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSchedulersComponent } from './show-schedulers.component';

describe('ShowSchedulersComponent', () => {
  let component: ShowSchedulersComponent;
  let fixture: ComponentFixture<ShowSchedulersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSchedulersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSchedulersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
