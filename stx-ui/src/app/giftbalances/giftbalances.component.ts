import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { GiftBalancesService } from './giftbalances.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './giftbalances.html',
  styleUrls: ['./giftbalances.css'],
  providers: [GiftBalancesService],
})
export class GiftBalancesComponent implements OnInit {
  giftNumber: any = '';
  error: any = '';
  giftData: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private giftBalancesService: GiftBalancesService) {

  }
  ngOnInit() {
  }
  giftSearch() {
    if (this.giftNumber === '' || this.giftNumber === undefined) {
      this.error = 'Number is required';
    } else if (this.giftNumber && (this.giftNumber).toString().length < 3) {
      this.error = 'Number must be at least 3 characters long';
    } else {
      this.giftBalancesService.getGiftData(this.giftNumber)
        .subscribe(data => {
          this.giftData = data['result'];
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
  clearErrMsg() {
    this.error = '';
  }
}
