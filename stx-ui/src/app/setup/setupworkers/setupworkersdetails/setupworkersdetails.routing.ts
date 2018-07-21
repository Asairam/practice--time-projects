import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupWorkersDetailsComponent } from './setupworkersdetails.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupWorkersDetailsComponent,
                children: [
                    {
                        path: '',
                        component: SetupWorkersDetailsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupWorkerDetailsRoutingModule {
}
