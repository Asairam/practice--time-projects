import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupServicePackagesComponent } from './setupservicepackages.component';
import { SetupServicePackageRoutingModule } from './setupservicepackages.routing';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
    imports: [
        CommonModule,
        SetupServicePackageRoutingModule,
        ShareModule,
        TranslateModule,
        FormsModule,
        ColorPickerModule
    ],
    declarations: [
        SetupServicePackagesComponent
    ]
})
export class SetupServicePackagesModule {
}
