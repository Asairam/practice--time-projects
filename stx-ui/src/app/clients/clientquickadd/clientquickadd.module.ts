import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientQuickAddComponent } from './clientquickadd.component';
import { ClientQuickAddRoutingModule } from './clientquickadd.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';

@NgModule({
    imports: [
        CommonModule,
        ClientQuickAddRoutingModule,
        FormsModule,
        TranslateModule,
        ShareModule

    ],
    declarations: [
        ClientQuickAddComponent,
    ]
})
export class ClientQuickAddModule {
}
