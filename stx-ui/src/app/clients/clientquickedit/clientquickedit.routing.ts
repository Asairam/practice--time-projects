import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientQuickEditComponent } from './clientquickedit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ClientQuickEditComponent,
                children: [
                    {
                        path: '',
                        component: ClientQuickEditComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ClientQuickEditRoutingModule {
}
