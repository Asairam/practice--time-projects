import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryusageReportComponent } from './inventoryusagereport.component';
import { InventoryusageReportRoutingModule } from './inventoryusagereport.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        InventoryusageReportRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        InventoryusageReportComponent
    ]
})
export class InventoryusageReportModule {
}
