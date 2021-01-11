import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'displayCol'
})
export class AucDisColPipe implements PipeTransform {
    transform(items: any[], args: any): any {
        if (args) {
            return items.filter(item => item.item_text.toLowerCase().includes(args.toLowerCase()));
        } else {
            return items;
        }
    }
}