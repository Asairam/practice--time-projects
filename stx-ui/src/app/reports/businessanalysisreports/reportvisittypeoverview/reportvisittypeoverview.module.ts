import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportVisitTypeOverviewComponent } from './reportvisittypeoverview.component';
import { ReportVisitTypeOverviewRoutingModule } from './reportvisittypeoverview.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReportVisitTypeOverviewRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        ReportVisitTypeOverviewComponent
    ]
})
export class ReportVisitTypeOverviewModule {
}
