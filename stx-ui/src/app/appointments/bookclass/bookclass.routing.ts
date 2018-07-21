import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookClassComponent } from './bookclass.component';
import { BookClassModule } from './bookclass.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: BookClassComponent,
                children: [
                    {
                        path: '',
                        component: BookClassComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class BookClassRoutingModule {
}
