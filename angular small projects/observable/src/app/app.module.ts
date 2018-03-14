import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { HttpModule } from '@angular/http';
import{ProductPipe} from './custom_pipe/product_pipe';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports:      [ BrowserModule,HttpModule,FormsModule ],
  declarations: [ AppComponent,ProductPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
