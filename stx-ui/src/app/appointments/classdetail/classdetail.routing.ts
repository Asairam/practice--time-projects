import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClassDetailComponent } from './classdetail.component';
import { ClassDetailModule } from './classdetail.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ClassDetailComponent,
                children: [
                    {
                        path: '',
                        component: ClassDetailComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ClassDetailRoutingModule {
}
