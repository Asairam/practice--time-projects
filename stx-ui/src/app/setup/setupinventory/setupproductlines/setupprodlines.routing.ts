import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupProductLinesComponent } from './setupprodlines.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupProductLinesComponent,
                children: [
                    {
                        path: '',
                        component: SetupProductLinesComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupProductLinesRoutingModule {
}
