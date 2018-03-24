import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  constructor (
    private http: Http
  ) {}


  getUser() {
    return this.http.get(`http://localhost:8080/mysql`)
    .map((res:Response) => {
      const key = '_body';
      return JSON.parse(res[key]);
     
    });
  }
  Postuser(fd){
    return this.http.post('http://localhost:8080/appPost',fd)
    .map((res:Response)=>{
      const key = '_body';
      return JSON.parse(res[key]);
    })
  }
  getMongoData(){
    return this.http.get("http://localhost:8080/mongodb").map((res1:Response)=>res1.json());
  }

}