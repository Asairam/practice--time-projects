import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CommonService } from '../commonService/common.service';
import { AuthService } from '../authService/auth.service';
@Injectable()
export class ServerErrorInterceptorService implements HttpInterceptor {
  constructor(private common: CommonService, private authService: AuthService) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.common.error('Internal server error.');
        } else if (error.status === 504) {
          this.common.error('Unable to connect server.');
        } else if (error.status === 502) {
          this.common.error('Bad gateway.');
        } else if (error.status === 404) {
          this.common.error('Page not found.');
        } else if (error.status === 401) {
          this.authService.logout();
          this.common.error('Unauthorized');
        }  else {
          return throwError(error);
        }
      })
    );
  }
}
