import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineClientApptsComponent } from './onlineclientappts.component';
import { OnlineClientApptsRoutingModule } from './onlineclientappts.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        OnlineClientApptsRoutingModule
    ],
    declarations: [
        OnlineClientApptsComponent
    ]
})
export class OnlineClientApptsModule {
}
