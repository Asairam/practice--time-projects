import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SignupService } from './signup.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService]
})
export class SignupComponent implements OnInit {
  @ViewChild('miscModal') public miscModal: ModalDirective;
  constructor(private signupService: SignupService, private router: Router) { }
  country = '';
  MailingState = '';
  errorMessage: any;
  statesList: any;
  allCountry: any;
  ngOnInit() {
    this.getCountry();
  }
  getStates(coun) {
    this.signupService.getStates(coun)
      .subscribe(statesValues => {
        this.statesList = statesValues['result'];
      },
        error => {
          this.errorMessage = <any>error;
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
  }
  getCountry() {
    this.signupService.getCountry('COUNTRIES')
      .subscribe(data => {
        this.allCountry = data['result'];
      }, error => {
        this.errorMessage = <any>error;
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
