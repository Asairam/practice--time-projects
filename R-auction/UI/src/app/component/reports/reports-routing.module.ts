import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { AdminReportComponent } from '../reports/admin/admin-report.component';

const routes: Routes = [
  {
    path: 'reportset',
    component: ReportsComponent,
  },
  {
    path: 'summary',
    component: AdminReportComponent,
  },
  { path: '',
    redirectTo: '/reportset',
    pathMatch: 'full'
  }
];

@NgModule({
    // declarations: [ReportsComponent],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }