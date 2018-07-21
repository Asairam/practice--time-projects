import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CashInOutComponent } from './cashinout.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CashInOutComponent,
                children: [
                    {
                        path: '',
                        component: CashInOutComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CashInOutRoutingModule {
}
