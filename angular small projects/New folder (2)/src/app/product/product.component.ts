import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import {dataservice} from '../shared/ser/xyz.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[dataservice]
})
export class ProductComponent implements OnInit {
messageName:string='hello hyderabad !';

viewchidname="sunday";
  constructor(private dataservice:dataservice) { }
 @Input() 
 shareProduct:string;
 @Output() message=new EventEmitter<string>();
    
    getSetterValue:string;
  ngOnInit() {
      this.getSetterValue=dataservice.datagetter;
  }


prod(){
     this.message.emit("how r u");
}
}
