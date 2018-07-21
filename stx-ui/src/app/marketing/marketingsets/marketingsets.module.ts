import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingSetsComponent } from './marketingsets.component';
import { MarketingSetsRoutingModule } from './marketingsets.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        MarketingSetsRoutingModule,
        BsDatepickerModule.forRoot(),
        ShareModule
    ],
    declarations: [
        MarketingSetsComponent
    ]
})
export class MarketingSetsModule {
}
