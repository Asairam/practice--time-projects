import {Directive,ElementRef,HostListener } from '@angular/core';

@Directive({
	selector:'[appHighlight]'
})
export class HighlightDirective{
	constructor(private el:ElementRef){
		el.nativeElement.style.backgroundColor='red';
		el.nativeElement.innerText="Text is changed by changeText Directive."
	}
	@HostListener('mousehover') onMouseHover(){
		this.highlight('yellow');
	}

	private highlight(color:string){
         this.el.nativeElement.style.backgroundColor=color;
	}
}