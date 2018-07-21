import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientEditComponent } from './clientedit.component';
import { ClientEditRoutingModule } from './clientedit.routing';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '../../../custommodules/primeng/primeng';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        TabsModule.forRoot(),
        ClientEditRoutingModule,
        FormsModule,
        DataTableModule,
        TranslateModule,
        ShareModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        ClientEditComponent,
    ]
})
export class ClientEditModule {
}
