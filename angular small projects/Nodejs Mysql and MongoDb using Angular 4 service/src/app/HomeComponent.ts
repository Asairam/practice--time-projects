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
  console.log(this.frmsub.value);
  this.userService.Postuser(datas).subscribe((data:any) =>{ this.profilesub = data;console.log(this.profilesub)});
}
}