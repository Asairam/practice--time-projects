import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupPaymentTypesComponent } from './setuppaymenttypes.component';
import { SetupPaymentTypesRoutingModule } from './setuppaymenttypes.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../../common/share.module';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        SetupPaymentTypesRoutingModule,
        TranslateModule,
        ShareModule,
        FormsModule
    ],
    declarations: [
        SetupPaymentTypesComponent
    ]
})
export class SetupPaymentTypesModule {
}
