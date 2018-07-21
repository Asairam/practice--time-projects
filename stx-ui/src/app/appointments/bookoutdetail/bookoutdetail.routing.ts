import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookOutDetailComponent } from './bookoutdetail.component';
import { BookOutDetailModule } from './bookoutdetail.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: BookOutDetailComponent,
                children: [
                    {
                        path: '',
                        component: BookOutDetailComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class BookOutDetailRoutingModule {
}
