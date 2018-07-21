import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashBoardComponent } from './dashboard.component';
import { DashBoardRoutingModule } from './dashboard.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        DashBoardRoutingModule,
        ShareModule
    ],
    declarations: [
        DashBoardComponent
    ]
})
export class DashBoardModule {
}
