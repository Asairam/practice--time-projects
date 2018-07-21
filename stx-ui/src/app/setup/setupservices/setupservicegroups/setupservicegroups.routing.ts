import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupServGroupsComponent } from './setupservicegroups.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupServGroupsComponent,
                children: [
                    {
                        path: '',
                        component: SetupServGroupsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupServGroupsRoutingModule {
}
