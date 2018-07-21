import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitingListComponent } from './waitinglist.component';
import { WaitingListRoutingModule } from './waitinglist.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        WaitingListRoutingModule,
        FormsModule,
        TranslateModule,
        ShareModule,
        BsDatepickerModule.forRoot()

    ],
    declarations: [
        WaitingListComponent,
    ]
})
export class WaitingListModule {
}
