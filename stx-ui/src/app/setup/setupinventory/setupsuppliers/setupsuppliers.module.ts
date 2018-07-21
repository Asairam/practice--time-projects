import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupSuppliersComponent } from './setupsuppliers.component';
import { SetupSuppliersRoutingModule } from './setupsuppliers.routing';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SetupSuppliersRoutingModule,
        ShareModule,
        TranslateModule,
        FormsModule
    ],
    declarations: [
        SetupSuppliersComponent
    ]
})
export class SetupSuppliersModule {
}
