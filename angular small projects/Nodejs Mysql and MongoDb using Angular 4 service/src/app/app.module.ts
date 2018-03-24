import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { FormsModule,ReactiveFormsModule }  from '@angular/forms';
import {HomeComponent} from'./HomeComponent';
import {HttpModule} from '@angular/http';

@NgModule({
  imports:      [ BrowserModule,FormsModule,HttpModule,ReactiveFormsModule],
  declarations: [ AppComponent,HomeComponent],
  bootstrap:    [ HomeComponent ]
})
export class AppModule { 

}
