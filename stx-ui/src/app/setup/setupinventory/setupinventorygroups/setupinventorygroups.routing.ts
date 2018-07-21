import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupInventGroupsComponent } from './setupinventgroups.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupInventGroupsComponent,
                children: [
                    {
                        path: '',
                        component: SetupInventGroupsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupInventoryGroupsRoutingModule {
}
