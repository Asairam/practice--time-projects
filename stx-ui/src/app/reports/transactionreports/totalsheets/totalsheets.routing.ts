import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TotalSheetsComponent } from './totalsheets.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TotalSheetsComponent,
                children: [
                    {
                        path: '',
                        component: TotalSheetsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TotalSheetsRoutingModule {
}
