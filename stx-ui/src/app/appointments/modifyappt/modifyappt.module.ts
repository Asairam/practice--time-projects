import { NgModule } from '@angular/core';
import { CommonModule, DeprecatedI18NPipesModule } from '@angular/common';
import { ModifyApptComponent } from './modifyappt.component';
import { ModifyApptRoutingModule } from './modifyappt.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
    imports: [
        CommonModule,
        DeprecatedI18NPipesModule,
        ModifyApptRoutingModule,
        FormsModule,
        TranslateModule,
        ShareModule,
        BsDatepickerModule.forRoot()

    ],
    declarations: [
        ModifyApptComponent,
    ]
})
export class ModifyApptModule {
}
