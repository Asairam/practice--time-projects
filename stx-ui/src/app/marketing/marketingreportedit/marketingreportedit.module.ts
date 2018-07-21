import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingReportEditComponent } from './marketingreportedit.component';
import { MarketingReportEditRoutingModule } from './marketingreportedit.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        MarketingReportEditRoutingModule,
        ShareModule
    ],
    declarations: [
        MarketingReportEditComponent
    ]
})
export class MarketingReportEditModule {
}
