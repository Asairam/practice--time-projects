import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-remark',
  templateUrl: './remark.component.html',
  styleUrls: ['./remark.component.css']
})
export class RemarkComponent implements OnInit {

  @Input() showRemark=false;
  @Input() viewData=null;
  @Input() allRemarks=[];
  @Input() supplier=false;
  remark="";
  constructor() { }

  ngOnInit() {
    if(this.viewData){
      this.remark=this.viewData.remark;
      this.allRemarks=this.viewData.allRemarks;
    }
    if(this.allRemarks.length>0){
      this.allRemarks.sort((a,b)=> new Date(b.updatedAt).getTime()-new Date(a.updatedAt).getTime());
    }
  }

}
