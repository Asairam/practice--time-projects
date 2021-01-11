import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { APMService } from '../services/apm.service';

@Injectable()
export class ApmInterceptor implements HttpInterceptor {
    environmentVariable: any;
    constructor(private router: Router, private apmService: APMService
    ) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.environmentVariable = this.apmService.getEnvironmentVariable();
        request = request.clone({ headers: request.headers.set('sessionId', this.getSessionId()) });
        if (this.environmentVariable == undefined || request.url == this.environmentVariable.geoApiUrl) {
            return next.handle(request);
        }
        else {
            let Current = this.router.url.split(';')[0];
            let apiConstants = this.apmService.getConstant();

            let urlKey = apiConstants != undefined ? apiConstants[Current] : undefined;
            var transaction;
            let apiTransactionName, apiCallName;
            if (urlKey != undefined) {
                apiTransactionName = urlKey.split(',')[0];
                apiCallName = urlKey.split(',')[1];
            }
            else {
                apiTransactionName = 'Non-Listed';
                apiCallName = 'UI-API';
            }
            if (urlKey != undefined) {
                transaction = this.apmService.getAPM().startTransaction(apiCallName, apiTransactionName, {
                    managed: true
                });

                let params, input;
                if (request.urlWithParams.split(';').length > 1) {
                    params = request.urlWithParams.split(';')[1];
                    transaction.addLabels({ 'queryParameters': JSON.stringify(params) });
                }
                else if (request.urlWithParams.split('?').length > 1) {
                    params = request.urlWithParams.split('?')[1];
                    transaction.addLabels({ 'queryParameters': JSON.stringify(params) });
                }
                if (request.body) {
                    input = request.body;
                    transaction.addLabels({ 'input': JSON.stringify(input) });
                }
                if (this.environmentVariable) {
                    transaction.addLabels({ application: this.environmentVariable.application });
                    transaction.addLabels({ component_name: this.environmentVariable.component_name });
                    transaction.addLabels({ platform: this.environmentVariable.platform });
                    transaction.addLabels({ sub_platform: this.environmentVariable.sub_platform });
                }
                transaction.addLabels({ 'sessionId': sessionStorage.sessionId });
                transaction.addLabels({ component_type: 'UI-API' });
                transaction.addLabels({ user_id: this.apmService.getUserName() });
            }

            return next.handle(request).pipe(
                tap(res => {
                    if (res instanceof HttpResponse) {
                        let response = res.body != null ? JSON.stringify(res.body) : 'N/A';
                        if (urlKey != undefined) {
                            transaction.addLabels({ log_type: 'INFO' });
                            transaction.addLabels({ is_error: 'false' });
                            transaction.addLabels({ 'output': response });
                            transaction.end();
                        }
                    }
                }),
                catchError(err => {
                    if (urlKey != undefined) {
                        transaction.addLabels({ log_type: 'ERROR' });
                        transaction.addLabels({ is_error: 'true' });
                        transaction.addLabels({ 'error_code': err.status });
                        transaction.addLabels({ 'error_message': err.message });
                        transaction.end();
                    }
                    throw err;
                })
            );
        }
    }

    getSessionId() {
        return sessionStorage.sessionId ? sessionStorage.sessionId.toString() : '';
    }
}