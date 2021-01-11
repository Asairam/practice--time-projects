import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[numberDecimal]'
})
export class NumberDecimalDirective implements OnInit {
  @Input() decimalValue: string
  decimal: any;
  @Input() numberFlag = false;
  @Input() mobileFlag = false;
  private regex: RegExp = new RegExp(this.decimal);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'v'];

  constructor(private el: ElementRef) {
  }

  ngOnInit() {

    if (this.numberFlag || this.decimalValue == "0") {
      this.decimal = "^[0-9]*$";
    }
    else {
      this.decimal = "^\\s*((\\d+(\\.\\d{0," + this.decimalValue + "})?)|((\\d*(\\.\\d{1," + this.decimalValue + "}))))\\s*$";
    }

    this.regex = this.decimal;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);

    if (this.specialKeys.indexOf(event.key) !== -1) {
      if (event.key == "v") {
        if (event.ctrlKey) {
          return;
        }
        else {
          event.preventDefault();
        }
      }
      return;
    }



    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }


  }
}
