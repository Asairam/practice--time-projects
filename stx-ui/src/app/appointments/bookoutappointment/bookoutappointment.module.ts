import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookOutApptComponent } from './bookoutappointment.component';
import { BookOutApptRoutingModule } from './bookoutappointment.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        BookOutApptRoutingModule,
        FormsModule,
        TranslateModule,
        ShareModule,
        BsDatepickerModule.forRoot()

    ],
    declarations: [
        BookOutApptComponent,
    ]
})
export class BookOutApptModule {
}
