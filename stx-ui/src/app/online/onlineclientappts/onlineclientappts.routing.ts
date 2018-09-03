import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OnlineClientApptsComponent } from './onlineclientappts.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: OnlineClientApptsComponent,
                children: [
                    {
                        path: '',
                        component: OnlineClientApptsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class OnlineClientApptsRoutingModule {
}
