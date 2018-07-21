import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftBalancesComponent } from './giftbalances.component';
import { GiftBalancesRoutingModule } from './giftbalances.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../common/share.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        GiftBalancesRoutingModule,
        ShareModule
    ],
    declarations: [
        GiftBalancesComponent
    ]
})
export class GiftBalancesModule {
}
