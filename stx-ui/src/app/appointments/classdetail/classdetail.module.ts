import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassDetailComponent } from './classdetail.component';
import { ClassDetailRoutingModule } from './classdetail.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';


@NgModule({
    imports: [
        CommonModule,
        ClassDetailRoutingModule,
        FormsModule,
        TranslateModule,
        ShareModule

    ],
    declarations: [
        ClassDetailComponent,
    ]
})
export class ClassDetailModule {
}
