import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerTipsComponent } from './workertips.component';
import { WorkerTipsRoutingModule } from './workertips.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        WorkerTipsRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        WorkerTipsComponent
    ]
})
export class WorkerTipsModule {
}
