import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupPermissionsComponent } from './setuppermissions.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupPermissionsComponent,
                children: [
                    {
                        path: '',
                        component: SetupPermissionsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupPermissionsRoutingModule {
}
