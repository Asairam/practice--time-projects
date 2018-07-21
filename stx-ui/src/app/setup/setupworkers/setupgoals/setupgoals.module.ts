import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupGoalsComponent } from './setupgoals.component';
import { SetupGoalsRoutingModule } from './setupgoals.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../../common/share.module';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        SetupGoalsRoutingModule,
        TranslateModule,
        FormsModule,
        ShareModule
    ],
    declarations: [
        SetupGoalsComponent
    ]
})
export class SetupGoalsModule {
}
