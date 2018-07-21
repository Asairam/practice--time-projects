import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupPromotionsComponent } from './setuppromotions.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupPromotionsComponent,
                children: [
                    {
                        path: '',
                        component: SetupPromotionsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupPromotionsRoutingModule {
}
