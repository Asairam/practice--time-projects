import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDailyCashDrawerComponent } from './reportdailycashdrawer.component';
import { ReportDailyCashDrawerRoutingModule } from './reportdailycashdrawer.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReportDailyCashDrawerRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        ReportDailyCashDrawerComponent
    ]
})
export class ReportDailyCashDrawerModule {
}
