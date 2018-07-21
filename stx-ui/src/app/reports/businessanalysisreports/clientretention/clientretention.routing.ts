import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientRetentionComponent } from './clientretention.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ClientRetentionComponent,
                children: [
                    {
                        path: '',
                        component: ClientRetentionComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ClientRetentionRoutingModule {
}
