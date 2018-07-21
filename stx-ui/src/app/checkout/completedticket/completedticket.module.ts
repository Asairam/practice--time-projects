import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompletedTicketComponent } from './completedticket.component';
import { CompletedTicketRoutingModule } from './completedticket.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        CompletedTicketRoutingModule,
        BsDatepickerModule.forRoot(),
        ShareModule,
        ModalModule.forRoot()
    ],
    declarations: [
        CompletedTicketComponent
    ]
})
export class CompletedTicketModule {
}
