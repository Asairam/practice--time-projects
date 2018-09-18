import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as config from '../../app.config';

@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './marketingemail.html',
  styleUrls: ['./marketingemail.component.css']
})
export class MarketingEmailComponent {

  constructor(private sanitizer: DomSanitizer) { }

  salonPlusURL(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(config.SALONCLOUDS_PLUS);
  }

}
