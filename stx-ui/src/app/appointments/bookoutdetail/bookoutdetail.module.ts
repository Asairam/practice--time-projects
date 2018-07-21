import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookOutDetailComponent } from './bookoutdetail.component';
import { BookOutDetailRoutingModule } from './bookoutdetail.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        BookOutDetailRoutingModule,
        FormsModule,
        TranslateModule,
        ShareModule,
        BsDatepickerModule.forRoot()

    ],
    declarations: [
        BookOutDetailComponent,
    ]
})
export class BookOutDetailModule {
}
