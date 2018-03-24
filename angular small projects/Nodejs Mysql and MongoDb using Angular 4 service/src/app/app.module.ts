import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { FormsModule }  from '@angular/forms';
import {HomeComponent} from'./HomeComponent';
import {HttpModule} from '@angular/http';

@NgModule({
  imports:      [ BrowserModule,FormsModule,HttpModule],
  declarations: [ AppComponent,HomeComponent],
  bootstrap:    [ HomeComponent ]
})
export class AppModule { 

}
