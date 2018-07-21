import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { ClientsRoutingModule } from './clients.routing';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '../../../custommodules/primeng/primeng';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';

@NgModule({
    imports: [
        CommonModule,
        ClientsRoutingModule,
        FormsModule,
        DataTableModule,
        TranslateModule,
        ShareModule
    ],
    declarations: [
        ClientsComponent,
    ]
})
export class ClientsModule {
}
