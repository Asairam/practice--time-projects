import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProcessCompensationComponent } from './processcompensation.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ProcessCompensationComponent,
                children: [
                    {
                        path: '',
                        component: ProcessCompensationComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ProcessCompensationRoutingModule {
}
