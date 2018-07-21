import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupPermissionsComponent } from './setuppermissions.component';
import { SetupPermissionsRoutingModule } from './setuppermissions.routing';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';

@NgModule({
    imports: [
        CommonModule,
        SetupPermissionsRoutingModule,
        TranslateModule,
        FormsModule,
        ShareModule
    ],
    declarations: [
        SetupPermissionsComponent
    ]
})
export class SetupPermissionsModule {
}
