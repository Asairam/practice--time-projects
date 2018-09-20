import { Component, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as config from '../../app.config';

@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './marketingemail.html',
  styleUrls: ['./marketingemail.component.css']
})
export class MarketingEmailComponent implements OnInit {

  constructor(private hostElement: ElementRef, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    const iframe = this.hostElement.nativeElement.querySelector('iframe');
    iframe.src = config.SALONCLOUDS_PLUS;
  }

  // salonPlusURL(): SafeResourceUrl {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(config.SALONCLOUDS_PLUS);
  // }

}
