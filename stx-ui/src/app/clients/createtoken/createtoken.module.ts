import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTokenComponent } from './createtoken.component';
import { CreateTokenRoutingModule } from './createtoken.routing';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '../../../custommodules/primeng/primeng';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';

@NgModule({
    imports: [
        CommonModule,
        CreateTokenRoutingModule,
        FormsModule,
        DataTableModule,
        TranslateModule,
        ShareModule
    ],
    declarations: [
        CreateTokenComponent,
    ]
})
export class CreateTokenModule {
}
