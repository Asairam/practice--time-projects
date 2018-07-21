import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupCompMethodComponent } from './setupcompmethod.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupCompMethodComponent,
                children: [
                    {
                        path: '',
                        component: SetupCompMethodComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupCompensationMethodsRoutingModule {
}
