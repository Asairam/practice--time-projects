import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OnlineClientAddComponent } from './onlineclientadd.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: OnlineClientAddComponent,
                children: [
                    {
                        path: '',
                        component: OnlineClientAddComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class OnlineClientAddRoutingModule {
}
