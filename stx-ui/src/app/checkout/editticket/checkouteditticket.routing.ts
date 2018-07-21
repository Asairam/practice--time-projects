import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckOutEditTicketComponent } from './checkouteditticket.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CheckOutEditTicketComponent,
                children: [
                    {
                        path: '',
                        component: CheckOutEditTicketComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CheckOutEditTicketRoutingModule {
}
