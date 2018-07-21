import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupCompanyInfoComponent } from './setupcompanyinfo.component';
import { SetupCompanyInfoRoutingModule } from './setupcompanyinfo.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../../common/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ColorPickerModule } from 'ngx-color-picker';
import { AgmCoreModule } from '@agm/core';

@NgModule({
    imports: [
        CommonModule,
        SetupCompanyInfoRoutingModule,
        TranslateModule,
        ShareModule,
        FormsModule,
        ReactiveFormsModule,
        // FormControl,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDAqXuGte7ivJsIb_25SV-hqa4WNPueCAs',
            libraries: ['places'],
        }),
        ColorPickerModule,
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        SetupCompanyInfoComponent
    ]
})
export class SetupCompanyInfoModule {
}
