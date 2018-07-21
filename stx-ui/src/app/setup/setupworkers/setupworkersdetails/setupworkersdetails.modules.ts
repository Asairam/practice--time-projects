import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupWorkersDetailsComponent } from './setupworkersdetails.component';
import { SetupWorkerDetailsRoutingModule } from './setupworkersdetails.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../../common/share.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { CalendarModule } from '../../../../custommodules/primeng/primeng';
@NgModule({
    imports: [
        CommonModule,
        SetupWorkerDetailsRoutingModule,
        TranslateModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        ShareModule,
        // CalendarModule
    ],
    declarations: [
        SetupWorkersDetailsComponent
    ]
})
export class SetupWorkersDetailsModule {
}
