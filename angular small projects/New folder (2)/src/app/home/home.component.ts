import { Component, OnInit ,ViewChild,AfterViewInit} from '@angular/core';
import {ProductComponent} from '../product/product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
mess='home page';
shareProduct="";
viewMes:string;
@ViewChild(ProductComponent) child;
my:string;
  constructor() { }
  ngOnInit() {
 this.viewMes=this.child.viewchidname;
  }
recive($event){
  this.my=$event;
}
numberCli(num){
    console.log(num);
    console.log(num.split(",")); 
}

}
