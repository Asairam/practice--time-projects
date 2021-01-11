import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { APMService } from '../services/apm.service';
import { Router } from '@angular/router';

@Directive({
    selector: '[matInput], [mat-raised-button],button,[mat-icon-button],mat-select,input,mat-radio-button'
})

export class APMLogDirective {
    @Input('logData') extraData: string;
    @Input('placeholder') placeholder;
    timeOutConst = 2;
    constructor(private el: ElementRef, private logService: APMService, private route: Router) { }
    @HostListener('click', ['$event']) onClick(evt) {
        let label = this.getLabel(this.el);
        this.logService.logClick({ label: label, type: this.el.nativeElement.tagName, value: this.el.nativeElement.value });
    }

    timer;

    @HostListener('mouseenter', ['$event']) onmousein(evt) {
        let label = this.getLabel(this.el);
        this.timer = Date.now();
    }

    @HostListener('mouseleave', ['$event']) onmouseleave(evt) {
        let label = this.getLabel(this.el);
        if (((Date.now() - this.timer) / 1000) > this.timeOutConst)
            this.logService.logHover({ route: this.route.url, hoverTime: ((Date.now() - this.timer) / 1000), label: label, type: this.el.nativeElement.tagName })
    }

    ngAfterViewInit() {
        let label = this.getLabel(this.el);
        this.logService.logClick({ label: label, nocount: true });
    }
    getLabel(el) {
        if (this.placeholder)
            return this.placeholder;

        switch (el.nativeElement.tagName) {
            case 'INPUT':
                if (el.nativeElement.labels && el.nativeElement.labels[0])
                    return el.nativeElement.labels[0].innerText;
                else if (el.nativeElement.attributes['ng-reflect-placeholder'])
                    return el.nativeElement.attributes['ng-reflect-placeholder'].nodeValue;
                else if (el.nativeElement.defaultValue) {
                    return el.nativeElement.defaultValue
                }
                return 'unknown';
                break;
            case 'NGX-SELECT':
            case 'BUTTON':
            case 'A':
                if (el.nativeElement.outerHTML.indexOf('mattooltip') != -1) {
                    return el.nativeElement.outerHTML.split('mattooltip')[1].trim().replace('=', '').replace(/"/g, '').trim();
                }
                return el.nativeElement.textContent.trim();
                break;
            case 'TEXTAREA':
            case 'MAT-SELECT':
                if (el.nativeElement.attributes['ng-reflect-name'])
                    return el.nativeElement.attributes['ng-reflect-name'].nodeValue;

        }
    }
}