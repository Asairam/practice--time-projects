import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TicketListComponent } from './ticketlist.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TicketListComponent,
                children: [
                    {
                        path: '',
                        component: TicketListComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TicketListRoutingModule {
}
