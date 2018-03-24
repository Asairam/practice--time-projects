import { Component,OnInit } from '@angular/core';

import { UserService } from './UserService';

@Component({
  selector: 'home-page',
  templateUrl:"UI/loops_one.html",
  providers:[UserService]
})
export class HomeComponent implements OnInit {
  profile=[];
  mongo = {};
  constructor(private userService: UserService) {
    this.userService.getMongoData().subscribe(response=>this.mongo=response);
}
ngOnInit(){
    this.userService.getUser().subscribe((data:any) =>{ this.profile = data;console.log(this.profile)});

}
}