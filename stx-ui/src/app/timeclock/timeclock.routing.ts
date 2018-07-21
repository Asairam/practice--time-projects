import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimeClockComponent } from './timeclock.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TimeClockComponent,
                children: [
                    {
                        path: '',
                        component: TimeClockComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TimeClockRoutingModule {
}
