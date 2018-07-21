import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbcReportComponent } from './abcreport.component';
import { AbcReportRoutingModule } from './abcreport.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        AbcReportRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        AbcReportComponent
    ]
})
export class AbcReportModule {
}
