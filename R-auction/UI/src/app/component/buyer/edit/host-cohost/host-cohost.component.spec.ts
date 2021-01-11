import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostCohostComponent } from './host-cohost.component';

describe('HostCohostComponent', () => {
  let component: HostCohostComponent;
  let fixture: ComponentFixture<HostCohostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostCohostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostCohostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
