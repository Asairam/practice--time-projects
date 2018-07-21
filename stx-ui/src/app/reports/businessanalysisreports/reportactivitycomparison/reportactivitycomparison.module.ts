import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportActivityComparisonComponent } from './reportactivitycomparison.component';
import { ReportActivityComparisonRoutingModule } from './reportactivitycomparison.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReportActivityComparisonRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        ReportActivityComparisonComponent
    ]
})
export class ReportActivityComparisonModule {
}
