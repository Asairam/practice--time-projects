import { Component } from '@angular/core';
import { IProduct } from './service/product';
import { ProductService } from './service/products.service';
import { Http , Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
@Component({
  selector: 'my-app',
   templateUrl: './product.html',
   providers: [ProductService]
})
export class AppComponent  { 
   iproducts: IProduct[];
   all:number;
   male:number;
  female:number;
  DisMale:number;
  DisFemale:number;
  
   constructor(private _product: ProductService,private http:Http) {
      this._product.getproducts()
      .subscribe(iproducts =>{ 
        this.iproducts = iproducts;
        this.all=this.iproducts.length;
        this.male=this.iproducts.filter(e=>e.gender==='male').length;
        this.DisMale=this.iproducts.filter(e=>e.gender==='male');
        this.DisFemale=this.iproducts.filter(e=>e.gender==='female');
        this.female=this.iproducts.filter(e=>e.gender==='female').length;
        console.log(this.DisMale);
        
       
      });
   }
onChange(gender){
   console.log(gender);
  //  console.log(this.iproducts =this.DisMale);

  //  if(gender == 'male'){
  //    this.iproducts =this.DisMale;
  //  }
  //  else if(gender == 'female'){
  //      this.iproducts =this.DisFemale;
  //  }
}
   
   
 
  
  

 }
