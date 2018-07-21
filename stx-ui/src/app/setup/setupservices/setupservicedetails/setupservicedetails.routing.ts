import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupServiceDetailsComponent } from './setupservicedetails.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupServiceDetailsComponent,
                children: [
                    {
                        path: '',
                        component: SetupServiceDetailsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupServiceDetailsRoutingModule {
}
