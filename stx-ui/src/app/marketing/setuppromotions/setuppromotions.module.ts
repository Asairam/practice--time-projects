import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupPromotionsComponent } from './setuppromotions.component';
import { SetupPromotionsRoutingModule } from './setuppromotions.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        SetupPromotionsRoutingModule,
        BsDatepickerModule.forRoot(),
        ShareModule
    ],
    declarations: [
        SetupPromotionsComponent
    ]
})
export class SetupPromotionsModule {
}
