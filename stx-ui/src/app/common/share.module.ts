import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RightBarComponent } from './rightbar.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';

@NgModule({
  imports: [
    TranslateModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HeaderComponent,
    RightBarComponent
  ],
  exports: [HeaderComponent, RightBarComponent]

})
export class ShareModule { }
