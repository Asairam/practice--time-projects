import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineClientAddComponent } from './onlineclientadd.component';
import { OnlineClientAddRoutingModule } from './onlineclientadd.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        OnlineClientAddRoutingModule
    ],
    declarations: [
        OnlineClientAddComponent
    ]
})
export class OnlineClientAddModule {
}
