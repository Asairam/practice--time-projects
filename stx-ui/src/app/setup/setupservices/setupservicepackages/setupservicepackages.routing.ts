import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupServicePackagesComponent } from './setupservicepackages.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupServicePackagesComponent,
                children: [
                    {
                        path: '',
                        component: SetupServicePackagesComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupServicePackageRoutingModule {
}
