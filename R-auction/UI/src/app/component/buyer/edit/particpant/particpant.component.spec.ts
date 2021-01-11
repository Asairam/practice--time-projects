import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticpantComponent } from './particpant.component';

describe('ParticpantComponent', () => {
  let component: ParticpantComponent;
  let fixture: ComponentFixture<ParticpantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticpantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticpantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
