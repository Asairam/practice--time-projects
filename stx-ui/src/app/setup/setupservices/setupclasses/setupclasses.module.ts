import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupClassesComponent } from './setupclasses.component';
import { SetupClassesRoutingModule } from './setupclasses.routing';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
    imports: [
        CommonModule,
        SetupClassesRoutingModule,
        ShareModule,
        TranslateModule,
        FormsModule,
        ColorPickerModule
    ],
    declarations: [
        SetupClassesComponent
    ]
})
export class SetupClassesModule {
}
