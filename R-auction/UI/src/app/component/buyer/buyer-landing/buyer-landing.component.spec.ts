import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { BuyerLandingComponent } from './buyer-landing.component';
import { HttpClientModule } from '@angular/common/http';

describe('BuyerLandingComponent', () => {
  let component: BuyerLandingComponent;
  let fixture: ComponentFixture<BuyerLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyerLandingComponent],
      imports: [HttpClientModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
