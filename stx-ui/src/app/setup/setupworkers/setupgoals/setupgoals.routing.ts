import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupGoalsComponent } from './setupgoals.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupGoalsComponent,
                children: [
                    {
                        path: '',
                        component: SetupGoalsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupGoalsRoutingModule {
}
