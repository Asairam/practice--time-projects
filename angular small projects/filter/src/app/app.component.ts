import { Component,ViewChild,OnInit } from '@angular/core';
import {AppComponent1} from './app1.component';
import {appService,DataService} from './app.service';
@Component({
  selector: 'my-app',
  template: `{{views}}
  <input [(ngModel)]="searchText" placeholder="search text goes here">
  <select [(ngModel)]="selectedValue">
        <option value="">Select Id</option>
        <option *ngFor="let item of characters" [value]="item.id">{{item.id}}</option>
  </select>
  <ul>
  <li *ngFor="let c of characters | fullTextSearch :searchText || selectedValue">
   {{c.id}} {{c.name}}  {{c.age}}
  </li>
</ul>
   <h1>Select a speciality Name:- {{reciveName}}</h1>
  <my-app1 [message]="message" [characters1]="characters1" (mesEvent)='recive($event)'></my-app1>

  <span appHighlight ></span>
<div>
  <select (change) = "changemonths($event)">
          <option *ngFor="let item of months">{{item}}</option>
  </select>
  <button (click)="myClickFunction($event)">Click Me</button>
  <div>
   <span *ngIf = "isavailable; then condition1 else condition2">
      Condition is valid.
   </span>
   <ng-template #condition1>Condition is valid</ng-template>
   <ng-template #condition2>Condition is invalid</ng-template>
</div>
</div>

<b>Getter/Setter Ex</b>:-
<input type="text" [(ngModel)]="my"><button (click)="setter(my)">Setter</button>
  `,
   providers:[appService,DataService]
})
export class AppComponent implements OnInit{  
	message='hello MDSk'; 
    views:string;
    selectedValue:string;
    reciveName:string;
    isavailable = true;
    months = ["January", "Feburary", "March", "April",
            "May", "June", "July", "August", "September",
            "October", "November", "December"];
    characters = [
   { 'id':'1','name':'Finn the human','age':'25'},
   {'id':'2','name': 'Jake the dog','age':'85'},
    {'id':'3','name':'Princess,bubblegum','age':'95'},
    {'id':'4','name':'bubblegum','age':'22'},
    {'id':'5','name':'Princess','age':'99'},
    {'id':'6','name':'gggincessfghfg','age':'88'},
    {'id':'7','name':'43543543','age':'85'}
    
  ]
    characters1 = [
   { 'id':'1','name':'Finn the human','age':'25'},
   {'id':'2','name': 'Jake the dog','age':'85'},
    {'id':'3','name':'Princess,bubblegum','age':'95'},
    {'id':'4','name':'bubblegum','age':'22'},
    {'id':'5','name':'Princess','age':'99'},
    {'id':'6','name':'gggincessfghfg','age':'88'},
    {'id':'7','name':'43543543','age':'85'}
    
  ]
  // myClickFunction(event) { 
  //     console.log(event);
  //  }
  //  changemonths(event) {
  //     console.log(event);
  //  }

 // @ViewChild(AppComponent1) child;
 constructor(private appservice:appService,private DataService:DataService){  }

ngOnInit(){
  console.log(this.selectedValue)
  // this.views=this.child.personitem;
}
	// recive(ngamgh){
 //    this.reciveName=ngamgh;
 //  }

//  setter(my){
//    console.log(my);
//     DataService.myData=my; // setter var
//  }

 
}

