import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'lotName'
})
export class LotNamePipe implements PipeTransform {
    constructor() { }
    transform(value: any, field: any) {
        if (value && field && field.length > 0) {
            let val = null;
            val = field.filter((obj) => {
                return obj.lotID === value;
            });
            if (val && val.length > 0) {
                return val[0]['lotName'];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}