import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Http, Response } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate';
import {enableProdMode} from '@angular/core';
import { environment } from '../environments/environment';
/* using for search */
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
// import { distinctUntilChanged, switchMap, debounceTime } from 'rxjs/operators';
if (environment.production) {
  enableProdMode();
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private direction: string;
  constructor(private translate: TranslateService,
    private http: Http, private router: Router, private activatedRoute: ActivatedRoute) {
  }
  ngOnInit() {
    this.translate.addLangs(['en']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en/) ? browserLang : 'en');
    if (this.translate.getBrowserLang() === 'ar') {
      this.direction = 'rtl';
    } else {
      this.direction = 'ltr';
    }
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
