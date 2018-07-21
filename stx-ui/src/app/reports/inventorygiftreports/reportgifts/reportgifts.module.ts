import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportGiftsComponent } from './reportgifts.component';
import { ReportGiftsRoutingModule } from './reportgifts.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReportGiftsRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        ReportGiftsComponent
    ]
})
export class ReportGiftsModule {
}
