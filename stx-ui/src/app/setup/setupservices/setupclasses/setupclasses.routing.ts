import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupClassesComponent } from './setupclasses.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupClassesComponent,
                children: [
                    {
                        path: '',
                        component: SetupClassesComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupClassesRoutingModule {
}
