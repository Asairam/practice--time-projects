import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupcompansationscalesComponent } from './setupcompansationscales.component';
import { SetupCompensationScalesRoutingModule } from './setupcompensationscales.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../../common/share.module';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        SetupCompensationScalesRoutingModule,
        TranslateModule,
        FormsModule,
        ShareModule
    ],
    declarations: [
        SetupcompansationscalesComponent
    ]
})
export class SetupCompensationScalesModule {
}
