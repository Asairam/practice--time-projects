import { Component } from '@angular/core';
import { customer } from './customer';

@Component({
  selector: 'my-app',
  templateUrl: 'UI/loops_one.html'
})

export class AppComponent { 
  customerObj : customer = new customer();
  data = [10,20,30,40,50];
  data_one=["Hello_1","Hello_2","Hello_3","Hello_4","Hello_5"];
  data_two= {"records":[ {"Name":"Alfreds Futterkiste","City":"Berlin","Country":"Germany"}, {"Name":"Ana Trujillo Emparedados y helados","City":"México D.F.","Country":"Mexico"}, {"Name":"Antonio Moreno Taquería","City":"México D.F.","Country":"Mexico"}, {"Name":"Around the Horn","City":"London","Country":"UK"}, {"Name":"B's Beverages","City":"London","Country":"UK"}, {"Name":"Berglunds snabbköp","City":"Luleå","Country":"Sweden"}, {"Name":"Blauer See Delikatessen","City":"Mannheim","Country":"Germany"}, {"Name":"Blondel père et fils","City":"Strasbourg","Country":"France"}, {"Name":"Bólido Comidas preparadas","City":"Madrid","Country":"Spain"}, {"Name":"Bon app'","City":"Marseille","Country":"France"}, {"Name":"Bottom-Dollar Marketse","City":"Tsawassen","Country":"Canada"}, {"Name":"Cactus Comidas para llevar","City":"Buenos Aires","Country":"Argentina"}, {"Name":"Centro comercial Moctezuma","City":"México D.F.","Country":"Mexico"}, {"Name":"Chop-suey Chinese","City":"Bern","Country":"Switzerland"}, {"Name":"Comércio Mineiro","City":"São Paulo","Country":"Brazil"} ] };

  uname:string="";
  uage:string="";
  data_three:any[];
  
  my_fun(){
    this.data_three[0]=this.uname;
    this.data_three[1]=this.uage;
    alert(this.data_three.length);
 }


}
