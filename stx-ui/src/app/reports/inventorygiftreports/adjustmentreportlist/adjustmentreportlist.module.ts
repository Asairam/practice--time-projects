import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdjustmentReportListComponent } from './adjustmentreportlist.component';
import { AdjustmentReportListRoutingModule } from './adjustmentreportlist.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        AdjustmentReportListRoutingModule,
        ShareModule,
    ],
    declarations: [
        AdjustmentReportListComponent
    ]
})
export class AdjustmentReportListModule {
}
