import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkerTipsComponent } from './workertips.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: WorkerTipsComponent,
                children: [
                    {
                        path: '',
                        component: WorkerTipsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class WorkerTipsRoutingModule {
}
