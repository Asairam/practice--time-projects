import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompletedTicketComponent } from './completedticket.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CompletedTicketComponent,
                children: [
                    {
                        path: '',
                        component: CompletedTicketComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CompletedTicketRoutingModule {
}
