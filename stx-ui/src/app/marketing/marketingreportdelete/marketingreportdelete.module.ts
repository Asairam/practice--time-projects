import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingReportDeleteComponent } from './marketingreportdelete.component';
import { MarketingReportDeleteRoutingModule } from './marketingreportdelete.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        MarketingReportDeleteRoutingModule,
        ShareModule
    ],
    declarations: [
        MarketingReportDeleteComponent
    ]
})
export class MarketingReportDeleteModule {
}
