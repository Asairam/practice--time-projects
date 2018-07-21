import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookStandingApptComponent } from './bookstandingappt.component';
import { BookStandingApptRoutingModule } from './bookstandingappt.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
    imports: [
        CommonModule,
        BookStandingApptRoutingModule,
        FormsModule,
        TranslateModule,
        ShareModule,
        ModalModule,
        BsDatepickerModule.forRoot()

    ],
    declarations: [
        BookStandingApptComponent,
    ]
})
export class BookStandingApptModule {
}
