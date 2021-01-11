import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-po-history',
  templateUrl: './po-history.component.html',
  styleUrls: ['./po-history.component.css']
})
export class PoHistoryComponent implements OnInit {
  public poHistoryList = [];
  constructor(private buyerService: BuyerEditService, public fb:FormBuilder) { }
  @Input() itemCode:any;
  @Output() selectedReport = new EventEmitter<any>();
  public poHistoryAllList:any;
  public sortType = "desc";
  public filter:any = {};
  public filterForm:any;
public StartDate:any; public EndDate:any;
  ngOnInit() {
   console.log("history--000000002000000011");
   if(this.itemCode != "" && this.itemCode != undefined) {
    this.getPoHistoryReport(this.itemCode);
   }
    this.filterForm = this.fb.group({
      startDate:["", [Validators.required]],
      endDate:["", [Validators.required]]
    })
  }
  

  getPoHistoryReport(id) {
    
			this.buyerService.getPoHistory(id).subscribe((res: any) => {
        var data = res.data;
        data.forEach(element => {
          element.createdAtString = element.createdAt;
          element.createdAtString = element.createdAtString.substr(0,4)  + "-" + element.createdAtString.substr(4,2)+ "-" + element.createdAtString.substr(6,2) ; 
          element.createdAt =  element.createdAt.substr(4,2) +  "-" + element.createdAt.substr(6,2) + "-" + element.createdAt.substr(0,4) 
        });
        this.poHistoryList = data;
        this.poHistoryAllList = data;
        this.sortByColumn("desc");
			}, (err) => {
				console.log(new Error(err));
			});
  } 

  filterPoHistory(data) {
    event.preventDefault();
    this.poHistoryList = this.poHistoryAllList.filter(item => {
           
      return new Date(item.createdAtString+" 00:00")>=new Date(data.startDate) &&  new Date(item.createdAtString+" 00:00") <= new Date(data.endDate);
    });
  }

  sortByColumn(type) { 
    this.sortType = type;

    this.poHistoryList.sort((a, b) => {
      if(type == "asc") {
        return new Date(a["createdAt"]) > new Date(b["createdAt"])?1: (new Date(a["createdAt"]) < new Date(b["createdAt"])?-1:0);
      } else {
        return new Date(a["createdAt"]) < new Date(b["createdAt"])?1: (new Date(a["createdAt"]) > new Date(b["createdAt"])?-1:0);
      }
      
    }) 
    
  }

  resetForm()
  {
    this.filterForm.reset();
    this.poHistoryList = this.poHistoryAllList;
  }

  selectPoReport(report) {
    console.log("emit report----", report);
    this.selectedReport.emit(report);
  }

}
