import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientEditComponent } from './clientedit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ClientEditComponent,
                children: [
                    {
                        path: '',
                        component: ClientEditComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ClientEditRoutingModule {
}
