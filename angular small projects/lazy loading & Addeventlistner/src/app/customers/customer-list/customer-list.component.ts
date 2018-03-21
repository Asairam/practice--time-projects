import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,FormArray } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  constructor(private builder:FormBuilder) {
    document.addEventListener('click',this.offclickhandel.bind(this));
   }
   ngOnInit() {
  }
   @ViewChild('filtercontainer') filtercontainer; 
  isPopup:boolean=false;
  offclickhandel(){
    if (this.filtercontainer && !this.filtercontainer.nativeElement.contains(event.target)) {
         this.isPopup=false;
         this.sampleForm.patchValue({
           gender:'',
           hobby:''
         })
       }
  }
  getIds=[];
    myhobby=[
    {'hname':'Cricket','chec':false,'id':1},
    {'hname':'Football','chec':false,'id':2},
    {'hname':'Youtube','chec':false,'id':3},
    {'hname':'Facebook','chec':false,'id':4}
    ];
  hobbyCheck(event,id){
    console.log(event.target.checked)
   for(let item of this.myhobby){
     if(item.id === id){
        if(event.target.checked){
          item.chec=true;
          this.getIds.push(id);
        }
       else{
       item.chec=false;
      var x= this.getIds.indexOf(id)
       this.getIds.splice(x,1);
       }
     }
   }
   
    console.log(this.myhobby)
    console.log(this.getIds)
  }
  

  sampleForm:FormGroup=this.builder.group({
    gender:new FormControl(''),
    hobby:new FormControl('')
  });
}
