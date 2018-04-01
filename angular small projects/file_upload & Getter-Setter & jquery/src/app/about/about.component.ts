import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {dataservice} from '../shared/ser/xyz.service';
import * as $ from 'jquery'; // npm install jquery save
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers:[dataservice]
})
export class AboutComponent implements OnInit {

  constructor(private router:Router,private dataservice:dataservice) { }

  ngOnInit() {
    $(document).ready(function(){
        $("#butani").click(function(){
            var div = $("#anidiv");  
            div.animate({left: '100px'}, "slow");
            div.animate({fontSize: '5em'}, "slow");
        });
    });
    
  }

 demo={id:1,name:'sairam'}
goTo(){
  console.log("hello");
  this.router.navigate(["Service/",this.demo.name,this.demo.id])
}
setterFun(sett){
  console.log(sett);
  dataservice.datagetter=sett;
  this.router.navigate(['product']);
}

}
