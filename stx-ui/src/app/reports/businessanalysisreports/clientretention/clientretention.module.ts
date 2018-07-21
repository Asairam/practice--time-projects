import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRetentionComponent } from './clientretention.component';
import { ClientRetentionRoutingModule } from './clientretention.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ClientRetentionRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        ClientRetentionComponent
    ]
})
export class ClientRetentionModule {
}
