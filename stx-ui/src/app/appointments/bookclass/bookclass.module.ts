import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookClassComponent } from './bookclass.component';
import { BookClassRoutingModule } from './bookclass.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        BookClassRoutingModule,
        FormsModule,
        TranslateModule,
        ShareModule,
        BsDatepickerModule.forRoot()

    ],
    declarations: [
        BookClassComponent,
    ]
})
export class BookClassModule {
}
