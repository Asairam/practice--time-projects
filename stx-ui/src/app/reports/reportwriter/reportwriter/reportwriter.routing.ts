import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportWriterComponent } from './reportwriter.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ReportWriterComponent,
                children: [
                    {
                        path: '',
                        component: ReportWriterComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ReportWriterRoutingModule {
}
