import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ProductSalesByRankComponent } from './productsalesbyrank.component';
import {  ProductSalesByRankRoutingModule } from './productsalesbyrank.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ProductSalesByRankRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        ProductSalesByRankComponent
    ]
})
export class ProductSalesByRankModule {
}
