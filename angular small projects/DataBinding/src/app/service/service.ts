import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Userservice{
    constructor(private http:Http){}
    getuser(){
        return this.http.get("http://staging.getion.in/index.php/request?action=clientwisequeryreport&module=ionize&resource=posts&userid=370&groupid=22")
        .map((res:Response)=>res.json());
    }
}