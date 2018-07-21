import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailActivityComponent } from './emailactivity.component';
import { EmailActivityRoutingModule } from './emailactivity.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        EmailActivityRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        EmailActivityComponent
    ]
})
export class EmailActivityModule {
}
