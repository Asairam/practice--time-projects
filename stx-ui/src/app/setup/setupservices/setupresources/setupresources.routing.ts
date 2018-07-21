import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupResourcesComponent } from './setupresources.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupResourcesComponent,
                children: [
                    {
                        path: '',
                        component: SetupResourcesComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupResourcesRoutingModule {
}
