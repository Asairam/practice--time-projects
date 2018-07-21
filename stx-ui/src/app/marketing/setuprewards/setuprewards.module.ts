import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupRewardsComponent } from './setuprewards.component';
import { SetupRewardsRoutingModule } from './setuprewards.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        SetupRewardsRoutingModule,
        ShareModule, ReactiveFormsModule, BsDatepickerModule.forRoot()
    ],
    declarations: [
        SetupRewardsComponent
    ]
})
export class SetupRewardsModule {
}
