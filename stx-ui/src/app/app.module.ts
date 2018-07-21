import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import * as config from './app.config';
import { ToastrModule } from 'ngx-toastr';
import { ColorPickerModule } from 'ngx-color-picker';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClient } from './common/http-client';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    ColorPickerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 1500,
    }),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: 'apiEndPoint',
      useValue: config.API_END_POINT
    },
    {
      provide: 'staticJsonFilesEndPoint',
      useValue: config.STATIC_JSONFILES_END_POINT
    },
    {
      provide: 'defaultCountry',
      useValue: config.DEFAULT_COUNTRY
    },
    {
      provide: 'defaultColor',
      useValue: config.DEFAULT_COLOR
    },
    {
      provide: 'defaultType',
      useValue: config.DEFAULT_TYPE
    },
    {
      provide: 'defaultPrice',
      useValue: config.DEFAULT_PRICE
    },
    {
      provide: 'defaultActive',
      useValue: config.DEFAULT_ACTIVE
    },
    {
      provide: 'defaultInActive',
      useValue: config.DEFAULT_INACTIVE
    },
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
