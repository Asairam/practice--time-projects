import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryUsageComponent } from './inventoryusage.component';
import { InventoryUsageRoutingModule } from './inventoryusage.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        InventoryUsageRoutingModule,
        TranslateModule,
        FormsModule,
        ShareModule
    ],
    declarations: [
        InventoryUsageComponent
    ]
})
export class InventoryUsageModule {
}
