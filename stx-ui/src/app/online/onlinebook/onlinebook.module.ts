import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineBookComponent } from './onlinebook.component';
import { OnlineBookRoutingModule } from './onlinebook.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        OnlineBookRoutingModule, ModalModule,
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        OnlineBookComponent
    ]
})
export class OnlineBookModule {
}
