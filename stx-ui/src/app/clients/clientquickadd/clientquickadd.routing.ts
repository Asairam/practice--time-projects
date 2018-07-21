import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientQuickAddComponent } from './clientquickadd.component';
import { ClientQuickAddModule } from './clientquickadd.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ClientQuickAddComponent,
                children: [
                    {
                        path: '',
                        component: ClientQuickAddComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ClientQuickAddRoutingModule {
}
