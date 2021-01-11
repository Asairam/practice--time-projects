import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { CommonLoaderService } from './loader.service';
import { environment } from '../../../../environments/environment';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];
    apiUrl = environment.geoApiUrl;
    constructor(private loaderService: CommonLoaderService) { }
  
    removeRequest(req: HttpRequest<any>) {
      const i = this.requests.indexOf(req);
      if (i >= 0) {
        this.requests.splice(i, 1);
  
      }
      this.loaderService.isLoading.next(this.requests.length > 0);
    }
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if(this.apiUrl !== req.url) {
        this.loaderService.isLoading.next(true);
      }
      this.requests.push(req);
      return Observable.create(observer => {
        const subscription = next.handle(req)
          .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
            }
          },
          err => { this.removeRequest(req); observer.error(err); },
          () => { this.removeRequest(req); observer.complete(); });
        // teardown logic in case of cancelled requests
        return () => {
          this.removeRequest(req);
          subscription.unsubscribe();
        };
      });
    }
}