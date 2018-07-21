import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateTokenComponent } from './createtoken.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CreateTokenComponent,
                children: [
                    {
                        path: '',
                        component: CreateTokenComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CreateTokenRoutingModule {
}
