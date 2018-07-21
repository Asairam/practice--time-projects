import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingEmailComponent } from './marketingemail.component';
import { MarketingEmailRoutingModule } from './marketingemail.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        MarketingEmailRoutingModule,
        ShareModule
    ],
    declarations: [
        MarketingEmailComponent
    ]
})
export class MarketingEmailModule {
}
