import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckOutComponent } from './checkout.component';
import { CheckOutRoutingModule } from './checkout.routing';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '../../../custommodules/primeng/primeng';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { ModalModule } from 'ngx-bootstrap/modal';

// import { TypeaheadModule } from 'ngx-bootstrap';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataTableModule,
        TranslateModule,
        CheckOutRoutingModule,
        ModalModule.forRoot(),
        
        // TypeaheadModule.forRoot(),
        ShareModule
    ],
    declarations: [
        CheckOutComponent
    ]
})
export class CheckOutModule {
}
