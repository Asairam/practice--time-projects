import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OnlinePackagePurchaseComponent } from './onlinepackagepurchase.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: OnlinePackagePurchaseComponent,
                children: [
                    {
                        path: '',
                        component: OnlinePackagePurchaseComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class OnlinePackagePurchaseRoutingModule {
}
