import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportServiceSalesComponent } from './reportservicesales.component';
import { ReportServiceSalesRoutingModule } from './reportservicesales.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReportServiceSalesRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        ReportServiceSalesComponent
    ]
})
export class ReportServiceSalesModule {
}
