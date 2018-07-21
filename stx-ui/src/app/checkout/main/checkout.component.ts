import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, FormGroup } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { CheckOutService } from './checkout.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './checkout.html',
  providers: [CheckOutService],
  styleUrls: ['./checkout.css']
})
export class CheckOutComponent implements OnInit {
  searchKey: any;
  DataObj: any;
  error: any;
  checkOutList: any;
  rowsPerPage: any;
  autoList = [];
  apptId: any;
  @ViewChild('membershipsModal') public membershipsModal: ModalDirective;
  @ViewChild('refundsModal') public refundsModal: ModalDirective;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private checkOutService: CheckOutService) {
    this.route.queryParams.subscribe(params => {
      this.apptId = route.snapshot.params['Id'];
    });

  }
  ngOnInit() {
    this.getCheckOutList();
  }
  /* Method to get checkout list */
  getCheckOutList() {
    this.checkOutService.getCheckOutList()
      .subscribe(data => {
        this.checkOutList = data['result'];
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
      this.error = 'CLIENTS.VALID_NOBLANK_SEARCH_FIELD';
    } else {
      this.checkOutService.getData(this.searchKey)
        .subscribe(data => {
          this.DataObj = data['result'];
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
  }
  /**
   * Memberships modal code starts
   */
  showMembershipsModal() {
    this.membershipsModal.show();
  }
  cancelMembershipsModal() {
    this.membershipsModal.hide();
  }
  /**
   * Memberships modal code ends
   */
  /**
  * Memberships modal code starts
  */
  showRefundsModal() {
    this.refundsModal.show();
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
}
