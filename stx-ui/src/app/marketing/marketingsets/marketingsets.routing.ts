import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarketingSetsComponent } from './marketingsets.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MarketingSetsComponent,
                children: [
                    {
                        path: '',
                        component: MarketingSetsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MarketingSetsRoutingModule {
}
