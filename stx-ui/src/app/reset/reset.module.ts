import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetComponent } from './reset.component';
import { ResetRoutingModule } from './reset.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ResetRoutingModule
    ],
    declarations: [
        ResetComponent
    ]
})
export class ResetModule {
}
