import { Component } from '@angular/core';
import {Userservice }from './service/service';
import { Http, Response } from '@angular/http';


@Component({
  selector: 'my-app',
  templateUrl: `./file.html`,
  providers:[Userservice]
})
export class AppComponent  {
  result="";
  constructor(private service:Userservice){
    service.getuser().subscribe(res=>this.result=res.description);
    
  }
  
  applist=
  [
    {
      'name':'hero',
       'url':'http://www.redfuel.in/wp-content/uploads/2016/05/Jazzy-B-HD-Images-150x150.jpg'
    },
    {
      'name':'durga',
      'url':'https://i.pinimg.com/170x/2b/18/aa/2b18aac1852201e14955d9c815787b7a--dussehra-images-stuff-to-buy.jpg'
    },
    {
      'name':'house',
      'url':'http://indiaopines.com/wp-content/uploads/2014/09/light-house-photo-150x150.jpg'
    }

  ]



 }
