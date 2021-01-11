import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliminarybidsComponent } from './preliminarybids.component';

describe('PreliminarybidsComponent', () => {
  let component: PreliminarybidsComponent;
  let fixture: ComponentFixture<PreliminarybidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreliminarybidsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreliminarybidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
