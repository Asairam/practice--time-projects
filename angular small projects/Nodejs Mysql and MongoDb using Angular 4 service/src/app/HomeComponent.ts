import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,FormArray } from '@angular/forms';
import { UserService } from './UserService';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'home-page',
  templateUrl:"UI/loops_one.html",
  providers:[UserService]
})
export class HomeComponent implements OnInit {
  profile:any[];
  profilesub:any[];
  mongo:any[];
 alert:string;
 filterdata:any[];
  frmsub:FormGroup=this.builder.group({
    name:new FormControl(''),
    salary:new FormControl('')
  })
  constructor(private userService: UserService,private builder: FormBuilder,private http:Http) {
    this.userService.getMongoData().subscribe(response=>this.mongo=response);
}
ngOnInit(){
    this.userService.getUser().subscribe((data:any) =>{ this.profile = data;console.log(this.profile)});

}
tablesub(){
  var datas={
    "ename":this.frmsub.value.name,
    "esalary":this.frmsub.value.salary
  }
  console.log(datas);
  this.userService.Postuser(datas).subscribe((data:any) =>{ 
    this.profilesub = data;
   this.frmsub.reset();
    console.log(this.profilesub)
  },(err)=>{
    console.log(err);
  },()=>{
 this.alert=this.profilesub.message;
  });
}
empfull(id){
  console.log(id);
  this.userService.Filterlist(id).subscribe((data:any) =>{ 
    this.filterdata = data.data;
    console.log(this.filterdata)
  },(err)=>{
    console.log(err);
  },()=>{
 
  });
}
}