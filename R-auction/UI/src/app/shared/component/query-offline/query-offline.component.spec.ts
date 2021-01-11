import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryOfflineComponent } from './query-offline.component';

describe('QueryOfflineComponent', () => {
  let component: QueryOfflineComponent;
  let fixture: ComponentFixture<QueryOfflineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryOfflineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
