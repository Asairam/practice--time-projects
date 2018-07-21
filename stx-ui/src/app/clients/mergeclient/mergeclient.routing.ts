import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MergeClientComponent } from './mergeclient.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MergeClientComponent,
                children: [
                    {
                        path: '',
                        component: MergeClientComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MergeClientRoutingModule {
}
