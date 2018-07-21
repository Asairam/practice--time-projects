import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeClockComponent } from './timeclock.component';
import { TimeClockRoutingModule } from './timeclock.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TimeClockRoutingModule,
        BsDatepickerModule.forRoot(),
        ShareModule,
    ],
    declarations: [
        TimeClockComponent
    ]
})
export class TimeClockModule {
}
