import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { CheckOutService } from './checkout.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as config from '../../app.config';
import { CommonService } from '../../common/common.service';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './checkout.html',
  providers: [CheckOutService, CommonService],
  styleUrls: ['./checkout.css']
})
export class CheckOutComponent implements OnInit {
  searchKey: any;
  DataObj: any;
  error: any;
  checkOutList: any;
  rowsPerPage: any;
  autoList = [];
  apiEndPoints = config.API_END_POINT;
  apptId: any;
  decodeUserToken: any;
  hideClientInfo: any;
  decodedToken: any;
  noResult: any;
  public searchField = new FormControl();
  @ViewChild('membershipsModal') public membershipsModal: ModalDirective;
  @ViewChild('refundsModal') public refundsModal: ModalDirective;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private checkOutService: CheckOutService) {
    this.route.queryParams.subscribe(params => {
      this.apptId = route.snapshot.params['Id'];
    });

  }
  ngOnInit() {
    // ---Start of code for Permissions Implementation--- //
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('rights'));
      this.decodeUserToken = new JwtHelper().decodeToken(localStorage.getItem('token'));
    } catch (error) {
      this.decodedToken = {};
      this.decodeUserToken = {};
    }
    if (this.decodedToken.data && this.decodedToken.data.permissions) {
      this.decodedToken = JSON.parse(this.decodedToken.data.permissions);
    } else {
      this.decodedToken = {};
    }
    // ---End of code for permissions Implementation--- //
    this.searchField.valueChanges
      .debounceTime(400)
      // .distinctUntilChanged()
      .switchMap(term => this.checkOutService.getData(term)
      ).subscribe(
        data => {
          this.DataObj = data['result'];
          if (this.searchKey) {
            if (this.searchKey.length !== 0 && this.DataObj.length === 0) {
              this.noResult = 'No Results';
            } else {
              this.noResult = '';
            }
          } else {
            this.DataObj = [];
          }
        },
        error => {
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
    this.getCheckOutList();
    this.getHideClientContactInfo();
  }
  /* Method to get checkout list */
  getCheckOutList() {
    this.checkOutService.getCheckOutList()
      .subscribe(data => {
        this.checkOutList = data['result'];
        for (let i = 0; i < this.checkOutList.length; i++) {
          this.checkOutList[i].disaplayDate = this.commonService.getUsrDtStrFrmDBStr(this.checkOutList[i].Date);
        }
        if (this.apptId) {
          for (let i = 0; i < this.checkOutList.length; i++) {
            this.checkOutList[i]['include'] = false;
            // this.checkOutList[i]['balancedue'] = undefined;
          }
        }
      }, error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
            window.scrollTo(0, 0);
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /*client search data */
  searchClients() {
    if (this.searchKey === '' || this.searchKey === undefined || (this.searchKey.trim()).length <= 1) {
      this.DataObj = [];
      this.noResult = '';
    }
  }
  /**
   * Memberships modal code starts
   */
  showMembershipsModal() {
    this.membershipsModal.show();
    this.getHideClientContactInfo();
  }
  cancelMembershipsModal() {
    this.membershipsModal.hide();
    this.searchKey = '';
    this.DataObj = [];
  }
  cancelIncludeTicket() {
    this.router.navigate(['/checkout/' + this.apptId]);
  }
  /**
   * Memberships modal code ends
   */
  /**
  * Memberships modal code starts
  */
  showRefundsModal() {
    this.refundsModal.show();
    this.getHideClientContactInfo();
  }
  cancelRefundsModal() {
    this.refundsModal.hide();
  }
  /**
   * Memberships modal code ends
   */
  lookupCloseModal() {

  }

  addTickets() {
    const includedTicketList = this.checkOutList.filter((ticket) => ticket['include']);
    const addTicket = {
      includeTickets: includedTicketList,
      apptId: this.apptId
    };
    this.checkOutService.addTickets(addTicket).subscribe((result) => {
      this.router.navigate(['/checkout/' + this.apptId]);
    }, (error) => {
      const status = JSON.parse(error['status']);
      const statuscode = JSON.parse(error['_body']).status;
      switch (JSON.parse(error['_body']).status) {
        case '2033':
          break;
      }
      if (statuscode === '2085' || statuscode === '2071') {
        if (this.router.url !== '/') {
          localStorage.setItem('page', this.router.url);
          this.router.navigate(['/']).then(() => { });
        }
      }
    });
  }
  cancelModal() {
    this.refundsModal.hide();
    this.DataObj = [];
    this.searchKey = '';
  }
  getHideClientContactInfo() {
    this.checkOutService.getHideCliContactInfo(this.decodeUserToken.data.id).subscribe(data => {
      this.hideClientInfo = data['result'][0].Hide_Client_Contact_Info__c;
    }, error => {
      const errStatus = JSON.parse(error['_body'])['status'];
      if (errStatus === '2085' || errStatus === '2071') {
        if (this.router.url !== '/') {
          localStorage.setItem('page', this.router.url);
          this.router.navigate(['/']).then(() => { });
        }
      }
    });
  }
}
