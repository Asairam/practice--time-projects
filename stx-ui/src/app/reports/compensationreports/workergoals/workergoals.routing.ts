import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkerGoalComponent } from './workergoals.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: WorkerGoalComponent,
                children: [
                    {
                        path: '',
                        component: WorkerGoalComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class WorkerGoalRoutingModule {
}
