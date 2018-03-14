import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule  } from '@angular/forms';
import { AppComponent1 }  from './app1.component';
import { AppComponent }  from './app.component';
import { FilterPipe} from './filter.pipe';
import { HttpModule } from '@angular/http';
import {HighlightDirective } from './new.directive';
@NgModule({
  imports:      [ BrowserModule ,FormsModule,HttpModule ],
  declarations: [ AppComponent1,AppComponent,FilterPipe,HighlightDirective  ],
  bootstrap:    [ AppComponent1,AppComponent ]
})
export class AppModule { }
