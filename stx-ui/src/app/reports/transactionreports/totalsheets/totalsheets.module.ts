import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalSheetsComponent } from './totalsheets.component';
import { TotalSheetsRoutingModule } from './totalsheets.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TotalSheetsRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        TotalSheetsComponent
    ]
})
export class TotalSheetsModule {
}
