import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderComponent } from './purchaseorders.component';
import { PurchaseOrderRoutingModule } from './purchaseorders.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    imports: [
        CommonModule,
        PurchaseOrderRoutingModule,
        TranslateModule,
        FormsModule,
        ShareModule,
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        PurchaseOrderComponent
    ]
})
export class PurchaseOrderModule {
}
