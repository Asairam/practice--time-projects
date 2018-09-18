import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {

  navURL = '';
  decodedToken: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService) { }

  ngOnInit() {
    // ---Start of code for Permissions Implementation--- //
        try {
            this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('rights'));
        } catch (error) {
            this.decodedToken = {};
        }
        if (this.decodedToken.data && this.decodedToken.data.permissions) {
            this.decodedToken = JSON.parse(this.decodedToken.data.permissions);
        } else {
            this.decodedToken = {};
        }
        // ---End of code for permissions Implementation--- //
    this.navURL = window.location.href.replace(window.location.origin, '').substring(3);
  }
}
