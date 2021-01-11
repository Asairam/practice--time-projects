import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminPanelRoutingModule } from './admin-panel.routing.module';
import { AdminPanelComponent } from './admin-panel.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../../shared/material/app-material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ResetPasswordComponent } from '../../reset-password/reset-password.component';
@NgModule({
  declarations: [AdminPanelComponent, ResetPasswordComponent],
  exports: [AdminPanelComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminPanelRoutingModule),
    ReactiveFormsModule,
    AppMaterialModule,
    NgxMatSelectSearchModule,
    FormsModule
  ]
})
export class AdminPanelModule { } 




