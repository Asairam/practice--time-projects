import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientLoginComponent } from './clientLogin.component';
import { ClientLoginRoutingModule } from './clientLogin.routing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ClientLoginRoutingModule
    ],
    declarations: [
        ClientLoginComponent
    ]
})
export class ClientLoginModule {
}
