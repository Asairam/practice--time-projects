import { Component, OnInit } from '@angular/core';
import { OnlineBookService } from '../onlinebook/onlinebook.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../common/common.service';
import * as config from '../../app.config';

@Component({
  selector: 'app-onlinebooksucess',
  templateUrl: './onlinebooksucess.component.html',
  styleUrls: ['./onlinebooksucess.component.css'],
  providers: [OnlineBookService, CommonService]
})
export class OnlineBookSucessComponent implements OnInit {
  apptId: any;
  companyName = '';
  clientBookingInfo = [];
  companyLogo = 'assets/images/logo.png';
  apiEndPoints = config['API_END_POINT'];
  constructor(private onlineBookService: OnlineBookService,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private route: ActivatedRoute) {
    if (localStorage.getItem('clienttoken')) {
      const clientInfo = localStorage.getItem('clienttoken');
      this.companyName = localStorage.getItem('compname');
      this.companyLogo = localStorage.getItem('complogo');
    } else {
      this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
    }
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((param) => {
      this.apptId = param.get('apptId');
    });
    this.getClientOnlineData(this.apptId);
  }

  getClientOnlineData(apptId) {
    this.onlineBookService.getOnlineBookingClientData(apptId).subscribe(
      data => {
        this.clientBookingInfo = data['result'];
        for (let i = 0; i < this.clientBookingInfo.length; i++) {
          this.clientBookingInfo[i].apptTime = this.commonService.getUsrDtStrFrmDBStr(this.clientBookingInfo[i].Appt_Date_Time__c);
          this.clientBookingInfo[i]['srvcName'] =  (this.clientBookingInfo[i]['Client_Facing_Name__c'] &&
          this.clientBookingInfo[i]['Client_Facing_Name__c'] !== 'null') ?
          this.clientBookingInfo[i]['Client_Facing_Name__c'] :  this.clientBookingInfo[i]['srvcName'];
        }
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
              }
            }
            break;
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('clienttoken');
    localStorage.removeItem('fname');
    localStorage.removeItem('lname');
    this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
  }

}
