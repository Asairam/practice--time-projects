import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupResourcesComponent } from './setupresources.component';
import { SetupResourcesRoutingModule } from './setupresources.routing';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
    imports: [
        CommonModule,
        SetupResourcesRoutingModule,
        ShareModule,
        TranslateModule,
        FormsModule,
        ColorPickerModule
    ],
    declarations: [
        SetupResourcesComponent
    ]
})
export class SetupResourcesModule {
}
