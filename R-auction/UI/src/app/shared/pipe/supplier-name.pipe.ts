import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'supplierName'
})
export class SupplierNamePipe implements PipeTransform {
    constructor() { }
    transform(value: any, field: any, type: any) {
        if (type === 'bidHis') {
            let supplierData = field.filter(x => x.supplierID == value)[0];
            return (supplierData) ? supplierData.supplierName1 : "";
        } else if (value && value.length > 0) {
            let supplierData = field.filter(x => x.supplierID == value[0].data.bidderID)[0];
            return (supplierData) ? supplierData.supplierName1 : "";
        } else {
            return null;
        }

    }
}