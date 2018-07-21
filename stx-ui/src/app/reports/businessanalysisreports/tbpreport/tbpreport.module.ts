import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TbpReportReportComponent } from './tbpreport.component';
import { TbpReportRoutingModule } from './tbpreport.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TbpReportRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        TbpReportReportComponent
    ]
})
export class TbpReportModule {
}
