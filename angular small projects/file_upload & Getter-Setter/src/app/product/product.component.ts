import { Component, OnInit,Input,Output,EventEmitter,ViewChild } from '@angular/core';
import {dataservice} from '../shared/ser/xyz.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[dataservice]
})
export class ProductComponent implements OnInit {
messageName:string='hello hyderabad !';
imagesrc=[];
chec=[];
all='';
viewchidname="sunday";
  constructor(private dataservice:dataservice,private http: Http) { }
 @Input() 
 shareProduct:string;
 @Output() message=new EventEmitter<string>();
 @ViewChild('fileinput')fileinput;
    getSetterValue:string;
  ngOnInit() {
      this.getSetterValue=dataservice.datagetter;
  }

fileup(){
  console.log(this.fileinput.nativeElement.files)
  let file=this.fileinput.nativeElement;
  for(let k=0;k<file.files.length;k++){
            let fd=new FormData();
            fd.append('file',file.files[k]),
            fd.append('userid', '180');
            fd.append('username','ramesh' );
            fd.append('password', 'cmFtZXNo');
            fd.append('encode', 'true');
            fd.append('auth_key', '178b5f7f049b32a8fc34d9116099cd706b7f9631');
            this.http.post('http://staging.getion.in/index.php/request?action=post&module=user&resource=upload',fd)
            .map((response:Response)=>response.json())
            .subscribe(data=>{
              //  console.log(data);
                for(let item of data.description){
                    this.imagesrc.push(item.url);
                }
                    console.log(this.imagesrc)
               });
      }
}
prod(){
     this.message.emit("how r u");
}
oncheck(event,i){
  if(event.target.checked){
            this.chec.push(i);            
        }else{
            var x=this.chec.indexOf(i);
            this.chec.splice(x,1);                        
        }
     console.log(this.chec);
}
subimg(){
  this.all='';
    this.chec.forEach(item=>{
        console.log(item)
       this.all+=item+",";
    });
    console.log(this.all)
}
}
