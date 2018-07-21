import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupCompMethodComponent } from './setupcompmethod.component';
import { SetupCompensationMethodsRoutingModule } from './setupcompensationmethods.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../../common/share.module';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        SetupCompensationMethodsRoutingModule,
        TranslateModule,
        FormsModule,
        ShareModule
    ],
    declarations: [
        SetupCompMethodComponent
    ]
})
export class SetupCompensationMethodsModule {
}
