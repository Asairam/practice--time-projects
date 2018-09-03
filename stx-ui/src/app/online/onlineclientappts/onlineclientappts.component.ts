import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as config from '../../app.config';
import { OnlineClientApptsService } from './onlineclientappts.service';
import { CommonService } from '../../common/common.service';
import { ClientAppointmentsService } from '../../setup/setupclientappointments/clientappointments.service';

@Component({
  selector: 'app-onlineclientappts',
  templateUrl: './onlineclientappts.component.html',
  styleUrls: ['./onlineclientappts.component.css'],
  providers: [OnlineClientApptsService, CommonService]
})
export class OnlineClientApptsComponent implements OnInit {
  companyName = '';
  companyLogo = '';
  companyPhone = '';
  apiEndPoints = config['API_END_POINT'];
  clientName: any;
  // clientName = localStorage.getItem('fname') + ' ' + localStorage.getItem('lname');
  apptType = 'future';
  pastApptsList = [];
  futureApptsList = [];
  displayList = [];
  clientid: any;
  allowApptChange: any;
  allowCancelChange: any;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private apiService: OnlineClientApptsService,
    private commonService: CommonService) {
  }

  ngOnInit() {
    this.clientid = localStorage.getItem('clientid');
    this.listClientFields();
    if (localStorage.getItem('clienttoken')) {
      this.companyName = localStorage.getItem('compname');
      this.companyLogo = localStorage.getItem('complogo');
      this.companyPhone = localStorage.getItem('compphone');
      this.apiService.getAppointments(this.clientid).subscribe(
        data => {
          if (data['result']['clientData']) {
            this.clientName = data['result']['clientData'].clientName;
          } else if (data['result']['apptData']) {
            this.clientName = data['result']['apptData'][0].clientName;
          }
          const tempDatObj = new Date();
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);
          if (data['result']['apptData']) {
            for (let i = 0; i < data['result']['apptData'].length; i++) {
              const tempAry = this.commonService.getAMPM(data['result']['apptData'][i]['Service_Date_Time__c']);
              const temp2 = tempAry.split('$');
              data['result']['apptData'][i]['apptDt'] = temp2[0];
              data['result']['apptData'][i]['apptTime'] = temp2[1];
              data['result']['apptData'][i]['past'] = this.validateDate(data['result']['apptData'][i]['Service_Date_Time__c'], tempDatObj);
              data['result']['apptData'][i]['checked'] = false;
              for (let j = i + 1; j < data['result']['apptData'].length; j++) {
                if (data['result']['apptData'][i]['Id'] && data['result']['apptData'][j]['Id']
                  && data['result']['apptData'][i]['Id'] === data['result']['apptData'][j]['Id']) {
                  data['result']['apptData'][j]['Id'] = null;
                  data['result']['apptData'][i]['past'] = this.validateDate(data['result']['apptData'][j]['Service_Date_Time__c'], tempDatObj);
                }
              }
              data['result']['apptData'][i]['rebookAllowed'] =
                this.isReebookAllowed(this.commonService.getDateTmFrmDBDateStr(data['result']['apptData'][i]['Appt_Date_Time__c']), todayDate, data['result']['apptData'][i]['Status__c'])
            }
            this.pastApptsList = data['result']['apptData'].filter(item => item['past']);
            this.futureApptsList = data['result']['apptData'].filter(item => !item['past']);
            this.updateDisplayList();
          }
        },
        error => {
          const statuscode = JSON.parse(error['_body']).status;
          if (statuscode === '2085' || statuscode === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
            }
          }
        }
      );
    } else {
      this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
    }
  }

  validateDate(dbDtStr: string, curDtTmObj: Date) {
    const dtObj = this.commonService.getDateTmFrmDBDateStr(dbDtStr);
    return (curDtTmObj > dtObj);
  }

  updateDisplayList() {
    if (this.apptType === 'future') {
      this.displayList = this.futureApptsList;
    } else {
      this.displayList = this.pastApptsList;
    }
    for (let i = 0; i < this.displayList.length; i++) {
      this.displayList[i]['serviceName'] = this.displayList[i]['Client_Facing_Name__c'] &&
        this.displayList[i]['Client_Facing_Name__c'] !== 'null' ?
        this.displayList[i]['Client_Facing_Name__c'] : this.displayList[i]['serviceName'];
    }
  }

  cancelAppts() {
    const chkItms = this.futureApptsList.filter(item => item['checked']);
    if (chkItms.length > 0) {
      const dataObj = {
        'apptIds': chkItms
      };
      this.apiService.cancelAppts(dataObj).subscribe(
        data => {
          if (chkItms.length === 1) {
            this.toastr.success('Selected Appointment canceled successfully', null, { timeOut: 3000 });
          } else {
            this.toastr.success('Selected Appointments canceled successfully', null, { timeOut: 3000 });
          }
          this.ngOnInit();
        },
        error => {
          const statuscode = JSON.parse(error['_body']).status;
          if (statuscode === '2085' || statuscode === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
            }
          }
        }
      );
    } else {
      this.toastr.error('You didn\'t select any Appointment', null, { timeOut: 3000 });
    }
  }

  isReebookAllowed(apptDate: Date, todayDate: Date, status: string) {
    apptDate.setHours(0, 0, 0, 0);
    return (apptDate.getTime() === todayDate.getTime() && (status === 'Checked In' || status === 'Complete'));
  }
  listClientFields() {
    this.apiService.getOnlineData().subscribe(
      data => {
        this.allowCancelChange = data['result'].allowApptCancellations;
        this.allowApptChange = data['result'].allowApptChanges;
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
                this.router.navigate(['/']).then(() => { });
              }
            }
            break;
        }
      }
    );
  }
}
