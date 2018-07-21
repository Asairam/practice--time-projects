/*
ngOnInit() : Method to loading athe page..
searchClients() : Method for searching clients
showData() : Method for loading All clients Data.
clearmessage() : Method for Clearing  error messages.
*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ClassDetailService } from './classdetail.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-appointments-popup',
    templateUrl: './classdetail.html',
    providers: [ClassDetailService]
})
export class ClassDetailComponent implements OnInit {

    constructor(
        private classDetailService: ClassDetailService,
        private toastr: ToastrService,
        private router: Router) {
    }
    /*Method for page Load */
    ngOnInit() {
    }
}
