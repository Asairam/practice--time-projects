import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupCompanyHoursComponent } from './setupcompanyhrs.component';
import { SetupCompanyHoursRoutingModule } from './setupcompanyhours.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../../common/share.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    imports: [
        CommonModule,
        SetupCompanyHoursRoutingModule,
        TranslateModule,
        ShareModule,
        FormsModule,
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        SetupCompanyHoursComponent
    ]
})
export class SetupCompanyHoursModule {
}
