import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModifyApptComponent } from './modifyappt.component';
import { ModifyApptModule } from './modifyappt.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ModifyApptComponent,
                children: [
                    {
                        path: '',
                        component: ModifyApptComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ModifyApptRoutingModule {
}
