import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupMembershipsComponent } from './setupmemberships.component';
import { SetupMembershipsRoutingModule } from './setupmemberships.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        SetupMembershipsRoutingModule,
        TranslateModule,
        FormsModule,
        ShareModule
    ],
    declarations: [
        SetupMembershipsComponent
    ]
})
export class SetupMembershipsModule {
}
