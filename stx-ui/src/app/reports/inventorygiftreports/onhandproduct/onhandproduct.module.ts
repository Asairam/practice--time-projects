import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnHandProductComponent } from './onhandproduct.component';
import { OnHandProductRoutingModule } from './onhandproduct.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        OnHandProductRoutingModule,
        ShareModule,
    ],
    declarations: [
        OnHandProductComponent
    ]
})
export class OnHandProductModule {
}
