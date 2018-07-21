import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupServiceDetailsComponent } from './setupservicedetails.component';
import { SetupServiceDetailsRoutingModule } from './setupservicedetails.routing';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
    imports: [
        CommonModule,
        SetupServiceDetailsRoutingModule,
        ShareModule,
        TranslateModule,
        FormsModule,
        ColorPickerModule
    ],
    declarations: [
        SetupServiceDetailsComponent
    ]
})
export class SetupServiceDetailsModule {
}
