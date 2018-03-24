import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductComponent } from './product/product.component';
import { DirDirective } from './shared/dir/app.dir.directive';
import { PipePipe } from './shared/pipe/pipe.pipe';
import {RouterModule,Routes,Params} from '@angular/router';
import { OurSerComponent } from './home/our-ser/our-ser.component';
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';


const appRoutes:Routes=[
  {path:'home',component:HomeComponent},
  {path:'about',component:AboutComponent},
  {path:'product',component:ProductComponent},
  {path:'Service',component:OurSerComponent},
  {path:'Service/:view/:id',component:OurSerComponent},
  // { path: '**', component: PageNotFoundComponentComponent },
  {path:'',redirectTo:'/about',pathMatch:'full'}
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,AboutComponent,ProductComponent,
    DirDirective,
    PipePipe,
    OurSerComponent,
    PageNotFoundComponentComponent
  ],
  imports: [
    BrowserModule,RouterModule.forRoot(appRoutes),FormsModule,HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
