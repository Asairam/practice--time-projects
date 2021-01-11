import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TokenInterceptor } from '../../../app/authService/HttpInterceptor';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AppMaterialModule } from '../material/app-material.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AucTypePipe } from '../../shared/pipe/auc-type.pipe';
import { LotNamePipe } from '../../shared/pipe/lot-name.pipe';
import { SupplierNamePipe } from '../../shared/pipe/supplier-name.pipe';
import { baselineSavingsPipe } from '../pipe/baseline-savings.pipe';
import { ClockComponent } from '../component/clock/clock.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { FilterPipe } from '../pipe/filter.pipe';
import { NumberDecimalDirective } from '../../shared/directive/number-decimal.directive';
import { ChatBotComponent } from '../../shared/component/chat-bot/chat-bot.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ItemsformService } from '../services/itemsform.service';
import { PopupService } from '../services/popup.services';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { APMLogDirective } from '../../shared/apm-rum/directives/apm-logger.directive';
import { ApmInterceptor } from '../../shared/apm-rum/interceptor/apm-rum.interceptor';
import { AucDisColPipe } from '../../shared/pipe/display-columns.pipe';
import { CustomDisColumnsComponent } from '../../shared/component/custom-dis-columns/custom-dis-columns.component';
import { RemarkComponent } from '../component/remark/remark.component';
import { ReportGenerateStatus } from '../component/report-generate-status/report-generate-status.component';
import { ReportsService } from '../../component/reports/reports.service';


@NgModule({
  declarations: [
    AucTypePipe,
    LotNamePipe,
    baselineSavingsPipe,
    ClockComponent,
    FilterPipe,
    NumberDecimalDirective,
    ChatBotComponent,
    SupplierNamePipe,
    APMLogDirective,
    AucDisColPipe,
    CustomDisColumnsComponent,
    RemarkComponent,
    ReportGenerateStatus
  ],
  imports: [
    CommonModule,
    HttpClientModule, AppMaterialModule, FileUploadModule, NgxMasonryModule, AngularEditorModule,
    NgImageSliderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }), FormsModule, ReactiveFormsModule, NgbModule, InfiniteScrollModule, NgxMatSelectSearchModule,
    OwlDateTimeModule, OwlNativeDateTimeModule
  ],
  exports: [CommonModule, HttpClientModule, TranslateModule, AppMaterialModule, FileUploadModule, FormsModule, ReactiveFormsModule, NgbModule, InfiniteScrollModule, NgxMatSelectSearchModule, AucTypePipe, LotNamePipe, baselineSavingsPipe, ClockComponent, NgxMasonryModule, FilterPipe, NumberDecimalDirective, ChatBotComponent,
    NgImageSliderModule, AngularEditorModule, SupplierNamePipe, OwlDateTimeModule, OwlNativeDateTimeModule, APMLogDirective, AucDisColPipe, CustomDisColumnsComponent, RemarkComponent, ReportGenerateStatus],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }, { provide: HTTP_INTERCEPTORS, useClass: ApmInterceptor, multi: true }, ItemsformService, PopupService, DatePipe, ReportsService]
})
export class SharedModule { }
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
