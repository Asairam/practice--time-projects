import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportWriterComponent } from './reportwriter.component';
import { ReportWriterRoutingModule } from './reportwriter.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReportWriterRoutingModule,
        ShareModule,
    ],
    declarations: [
        ReportWriterComponent
    ]
})
export class ReportWriterModule {
}
