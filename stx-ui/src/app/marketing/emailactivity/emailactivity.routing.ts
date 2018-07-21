import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmailActivityComponent } from './emailactivity.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: EmailActivityComponent,
                children: [
                    {
                        path: '',
                        component: EmailActivityComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class EmailActivityRoutingModule {
}
