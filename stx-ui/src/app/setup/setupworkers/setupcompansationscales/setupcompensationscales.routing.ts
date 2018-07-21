import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupcompansationscalesComponent } from './setupcompansationscales.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupcompansationscalesComponent,
                children: [
                    {
                        path: '',
                        component: SetupcompansationscalesComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupCompensationScalesRoutingModule {
}
