import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OnlineBookComponent } from './onlinebook.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: OnlineBookComponent,
                children: [
                    {
                        path: '',
                        component: OnlineBookComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class OnlineBookRoutingModule {
}
