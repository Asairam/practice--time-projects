import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WaitingListComponent } from './waitinglist.component';
import { WaitingListModule } from './waitinglist.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: WaitingListComponent,
                children: [
                    {
                        path: '',
                        component: WaitingListComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class WaitingListRoutingModule {
}
