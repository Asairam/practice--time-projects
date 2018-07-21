import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  MonthlyBussinessAnalysisComponent } from './monthlybussinessanalysis.component';
import {  MonthlyBussinessAnalysisRoutingModule } from './monthlybussinessanalysis.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        MonthlyBussinessAnalysisRoutingModule,
        ShareModule,
    ],
    declarations: [
        MonthlyBussinessAnalysisComponent
    ]
})
export class MonthlyBussinessAnalysisModule {
}
