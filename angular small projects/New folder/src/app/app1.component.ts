import { Component ,Input,OnInit,Output,EventEmitter } from '@angular/core';
import {appService,DataService} from './app.service';
import { Http } from '@angular/http';
@Component({
  selector: 'my-app1',
  template: `<h1>{{name}}</h1>
       <select  (change)="getperson(categeryID.value)" #categeryID>
        <option [selected]="true" value="">Select a speciality</option>
        <ng-container  *ngFor="let item of characters1">
         <option [value]="item.name" *ngIf="xname || item.id !== '2'">{{item.name}}</option>
         </ng-container>
       </select>

       <input type="checkbox"   (change)="xname = !xname">
       
     Getter:-
     {{getter}}
     <br/>
  `,
  providers:[appService,DataService]
})
export class AppComponent1 implements OnInit {  
	@Input() 
	message:string;
  @Input()
  characters1:any[]
  @Output() mesEvent=new EventEmitter();
	name:string;
	listdata:any[];
	result:any=[];
  personitem='views';
  getter:string;
	viewChild="hello view";
	constructor(private appservice:appService,private http:Http,private DataService:DataService){
		//console.log(this.mes);

	}
   ngOnInit(){
    this.getter=DataService.myData; //getter var
  	this.name = this.message; 
  	this.appservice.getLeadsListService().subscribe((response: any)=>{
  		this.listdata=response.description;
  		console.log(this.listdata)
  	})
  	this.http.get('http://staging.getion.in/index.php/request/get/contacts/contacts?user_id=180&username=ramesh&pwd=cmFtZXNo&encode=true&limitstart=0&limit=25&source=&withemail=&withphone&age=&gender=&filtertag=&status=1')
     .subscribe(result => {this.result =result.json().description ;console.log( this.result);}); //with out map using 
   }
   // getperson(x){
   // console.log(x);
   //   //this.personitem=x;
   //   this.mesEvent.emit(x);
   // }
}
