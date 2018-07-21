import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportProductSalesComponent } from './reportproductsales.component';
import { ReportProductSalesRoutingModule } from './reportproductsales.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReportProductSalesRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        ReportProductSalesComponent
    ]
})
export class ReportProductSalesModule {
}
