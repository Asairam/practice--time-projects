import { Component, OnInit } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'app-rightbar',
    templateUrl: './rightbar.html',
})
export class RightBarComponent implements OnInit {
    decodedToken: any;
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
    }
}
