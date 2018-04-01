import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class XyzService {

  constructor(private http: Http) { }
 getDetails(){
   return this.http.get('http://staging.getion.in/index.php/request/get/contacts/contacts?user_id=180&username=ramesh&pwd=cmFtZXNo&encode=true&limitstart=0&limit=25&source=&withemail=&withphone=&age=&gender=&filtertag=&status=1')
      .map((responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    })
 }
}
export class dataservice{
  public static datagetter='';
}