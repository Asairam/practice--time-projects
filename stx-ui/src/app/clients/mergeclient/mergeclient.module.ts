import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MergeClientComponent } from './mergeclient.component';
import { MergeClientRoutingModule } from './mergeclient.routing';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '../../../custommodules/primeng/primeng';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';

@NgModule({
    imports: [
        CommonModule,
        MergeClientRoutingModule,
        FormsModule,
        DataTableModule,
        TranslateModule,
        ShareModule
    ],
    declarations: [
        MergeClientComponent,
    ]
})
export class MergeClientModule {
}
