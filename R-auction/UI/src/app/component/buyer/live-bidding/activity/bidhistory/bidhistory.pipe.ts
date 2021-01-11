import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'bidHisFilterPipe'
})
export class BidhistoryPipe implements PipeTransform {

  transform(items: any[], filter: string): any {
    if (filter == 'active_par') {
      return items.filter(item =>  !item.isDeleted);
    } else {
      return items.filter(item => item.suspendedBidder);
    }
  }

}