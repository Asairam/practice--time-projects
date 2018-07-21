import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerGoalComponent } from './workergoals.component';
import { WorkerGoalRoutingModule } from './workergoals.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        WorkerGoalRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        WorkerGoalComponent
    ]
})
export class WorkerGoalModule {
}
