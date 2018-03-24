import { Component } from '@angular/core';
import { DataService } from './data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[DataService]
})
export class AppComponent {
  title = 'MongoDb Using Get The Data';
  users:any[];
  constructor(private DataService:DataService){
    this.DataService.getUsers()
        .subscribe(res => {this.users = res;console.log(this.users)});
  
  }
  
}
