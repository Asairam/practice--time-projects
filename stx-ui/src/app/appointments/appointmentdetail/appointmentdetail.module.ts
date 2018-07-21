import { NgModule } from '@angular/core';
import { CommonModule, DeprecatedI18NPipesModule } from '@angular/common';
import { ApptDetailComponent } from './appointmentdetail.component';
import { ApptDetailRoutingModule } from './appointmentdetail.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ShareModule } from '../../common/share.module';

@NgModule({
    imports: [
        CommonModule,
        DeprecatedI18NPipesModule,
        ApptDetailRoutingModule,
        FormsModule,
        TranslateModule,
        ShareModule,
        ModalModule.forRoot()

    ],
    declarations: [
        ApptDetailComponent,
    ]
})
export class ApptDetailModule {
}
