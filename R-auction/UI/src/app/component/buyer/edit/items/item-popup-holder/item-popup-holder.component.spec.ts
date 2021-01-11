import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPopupHolderComponent } from './item-popup-holder.component';

describe('ItemPopupHolderComponent', () => {
  let component: ItemPopupHolderComponent;
  let fixture: ComponentFixture<ItemPopupHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPopupHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPopupHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
