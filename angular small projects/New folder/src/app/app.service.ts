import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class appService{
	constructor(private http:Http){}

	getLeadsListService(){
		return this.http.get('http://staging.getion.in/index.php/request/get/contacts/contacts?user_id=180&username=ramesh&pwd=cmFtZXNo&encode=true&limitstart=0&limit=25&source=&withemail=&withphone&age=&gender=&filtertag=&status=1')
		.map((Response)=>{
			console.log(Response); //get the response
			console.log(Response.json()); // response convert to json format
            return Response.json(); //return the responce json data

		});
	}
	
}
export class DataService{
      public static myData='Getting Getter';
}