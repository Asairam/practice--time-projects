import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingReportsComponent } from './marketingreports.component';
import { MarketingReportsRoutingModule } from './marketingreports.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        MarketingReportsRoutingModule,
        ShareModule
    ],
    declarations: [
        MarketingReportsComponent
    ]
})
export class MarketingReportsModule {
}
