import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientQuickEditComponent } from './clientquickedit.component';
import { ClientQuickEditRoutingModule } from './clientquickedit.routing';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '../../../custommodules/primeng/primeng';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';

@NgModule({
    imports: [
        CommonModule,
        ClientQuickEditRoutingModule,
        FormsModule,
        DataTableModule,
        TranslateModule,
        ShareModule
    ],
    declarations: [
        ClientQuickEditComponent,
    ]
})
export class ClientQuickEditModule {
}
