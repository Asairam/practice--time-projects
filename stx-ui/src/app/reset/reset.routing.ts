import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResetComponent } from './reset.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ResetComponent,
                children: [
                    {
                        path: '',
                        component: ResetComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ResetRoutingModule {
}
