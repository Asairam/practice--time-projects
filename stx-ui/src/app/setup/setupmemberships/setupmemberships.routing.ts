import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupMembershipsComponent } from './setupmemberships.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupMembershipsComponent,
                children: [
                    {
                        path: '',
                        component: SetupMembershipsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupMembershipsRoutingModule {
}
