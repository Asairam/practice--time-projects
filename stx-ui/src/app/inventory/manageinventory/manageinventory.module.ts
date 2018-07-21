import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageInventoryComponent } from './manageinventory.component';
import { ManageInventoryRoutingModule } from './manageinventory.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        ManageInventoryRoutingModule,
        TranslateModule,
        FormsModule,
        ShareModule
    ],
    declarations: [
        ManageInventoryComponent
    ]
})
export class ManageInventoryModule {
}
