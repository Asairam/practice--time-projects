import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupTicketPreferencesComponent } from './setupticketpreferences.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupTicketPreferencesComponent,
                children: [
                    {
                        path: '',
                        component: SetupTicketPreferencesComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupTicketPreferencesRoutingModule {
}
