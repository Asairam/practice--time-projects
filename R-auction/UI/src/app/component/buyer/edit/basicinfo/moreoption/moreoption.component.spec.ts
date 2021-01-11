import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreoptionComponent } from './moreoption.component';

describe('MoreoptionComponent', () => {
  let component: MoreoptionComponent;
  let fixture: ComponentFixture<MoreoptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreoptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreoptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
