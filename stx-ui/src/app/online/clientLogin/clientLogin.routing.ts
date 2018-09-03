import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientLoginComponent } from './clientLogin.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ClientLoginComponent,
                children: [
                    {
                        path: '',
                        component: ClientLoginComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ClientLoginRoutingModule {
}
