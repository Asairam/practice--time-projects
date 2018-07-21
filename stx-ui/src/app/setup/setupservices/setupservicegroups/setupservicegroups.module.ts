import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupServGroupsComponent } from './setupservicegroups.component';
import { SetupServGroupsRoutingModule } from './setupservicegroups.routing';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
    imports: [
        CommonModule,
        SetupServGroupsRoutingModule,
        ShareModule,
        TranslateModule,
        FormsModule,
        ColorPickerModule
    ],
    declarations: [
        SetupServGroupsComponent
    ]
})
export class SetupServiceGroupsModule {
}
