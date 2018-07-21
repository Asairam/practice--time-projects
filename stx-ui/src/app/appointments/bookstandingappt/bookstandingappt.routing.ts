import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookStandingApptComponent } from './bookstandingappt.component';
import { BookStandingApptModule } from './bookstandingappt.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: BookStandingApptComponent,
                children: [
                    {
                        path: '',
                        component: BookStandingApptComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class BookStandingApptRoutingModule {
}
