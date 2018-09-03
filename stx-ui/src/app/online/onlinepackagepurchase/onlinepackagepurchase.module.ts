import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlinePackagePurchaseComponent } from './onlinepackagepurchase.component';
import { OnlinePackagePurchaseRoutingModule } from './onlinepackagepurchase.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        OnlinePackagePurchaseRoutingModule
    ],
    declarations: [
        OnlinePackagePurchaseComponent
    ]
})
export class OnlinePackagePurchaseModule {
}
