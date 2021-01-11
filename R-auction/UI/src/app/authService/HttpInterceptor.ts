
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as config from '../appConfig/app.config';
@Injectable()

export class TokenInterceptor implements HttpInterceptor {

    constructor(public auth: AuthService) { }

    role() {
        let userRole = JSON.parse(localStorage.getItem('userdata'));
        let roleName = '';
        if (userRole && userRole.roles.length > 0) {
            let suppRole = userRole.roles.filter((obj) => {
                return obj.role.toLowerCase() === config.ROLE_ACCESS_CONTROL.supplier;
            });
            let custRole = userRole.roles.filter((obj) => {
                return obj.role.toLowerCase() === config.ROLE_ACCESS_CONTROL.customer;
            });
            let buyerRole = userRole.roles.filter((obj) => {
                return obj.role.toLowerCase() === config.ROLE_ACCESS_CONTROL.buyer;
            });
            let restrictedbuyerRole = userRole.roles.filter((obj) => {
                return obj.role.toLowerCase() === config.ROLE_ACCESS_CONTROL.restricted_buyer;
            });
            if (suppRole.length > 0) {
                roleName = config.ROLE_ACCESS_CONTROL.supplier;
            } else if (custRole.length > 0) {
                roleName = config.ROLE_ACCESS_CONTROL.customer;
            }  
            else if (buyerRole.length > 0) {
                roleName = config.ROLE_ACCESS_CONTROL.buyer;
            } else if (restrictedbuyerRole.length > 0) {
                roleName = config.ROLE_ACCESS_CONTROL.restricted_buyer;
            }
        }
        return roleName;
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let userObj = this.auth.getUserData();
        let vendorCodeSelected = (userObj && userObj.roles.length > 0 && userObj.settings && userObj.roles.filter(obj => config.ROLE_ACCESS_CONTROL.both_supplier.includes(obj.role.toLowerCase()))) ? userObj.settings.ril.vendorcodeSelected : "";

        const httpOptions = request.clone({
            setHeaders: {
                'Authorization': 'Bearer ' + this.auth.getTokenValue()
            }
        });
        const vendorCodehttpOptions = request.clone({
            setHeaders: {
                'Authorization': 'Bearer ' + this.auth.getTokenValue(),
                'vendorcode': vendorCodeSelected
            }
        });
        if (config.ROLE_ACCESS_CONTROL.both.includes(this.role().toLowerCase())) {
            request = httpOptions;
        } else if (config.ROLE_ACCESS_CONTROL.both_supplier.includes(this.role().toLowerCase())) {
            request = vendorCodehttpOptions;
        } else {
            request = httpOptions;
        }
        return next.handle(request);
    }
}

