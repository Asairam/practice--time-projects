import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'preitem'
})
export class PreitemPipe implements PipeTransform {

  constructor() {
    
  }

  transform(value: any, args?: any): any {
    return null;
  }

}
