import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../../../commonService/common.service';
import { environment } from '../../../../../../environments/environment';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';

@Component({
  selector: 'app-moreoption',
  templateUrl: './moreoption.component.html',
  styleUrls: ['./moreoption.component.css']
})
export class MoreoptionComponent implements OnInit {
  file: string;
  imageURL = environment.rauction;
  imageSrc: any;
  profilePicture: { docId: any; fileName: any; isInternal: boolean; isExternal: boolean; docFileId: any; };
  docId: number = 0;
  tabActive = false;
  translateSer: any;
  @Input() remarks = [];
  @Input() currency = [];
  currentDate = new Date();
  selectedIndex = 0;

  constructor(private common: CommonService, public buyerService: BuyerEditService) {

    this.common.translateSer('BASIC_DETAILS').subscribe(async (text: string) => {
      this.translateSer = text;
    });
  }
  ngOnInit() {
    //  this.selectedIndex = this.remarks.length>0 ? 0 : 1;
  }

  selectTab(event) {
    this.selectedIndex = event.index;
  }


  closeClick() {
    let sendData = {
      flag: 'closeAttach',
      pageFrom: 'basic'
    }
    this.common.toggleDiv.emit(sendData);
    this.selectedIndex = 0;
  }

}
