import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookOutApptComponent } from './bookoutappointment.component';
import { BookOutApptModule } from './bookoutappointment.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: BookOutApptComponent,
                children: [
                    {
                        path: '',
                        component: BookOutApptComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class BookOutApptRoutingModule {
}
