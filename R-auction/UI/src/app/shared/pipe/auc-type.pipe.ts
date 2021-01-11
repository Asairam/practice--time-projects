import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'aucType'
})
export class AucTypePipe implements PipeTransform {
    transform(value: any) {
        let type = null;
        switch (value) {
            case 'reverse': type = 'R'
                break;
            case 'forward': type = 'F'
                break;
            default: type = null
        }
        return type;
    }
}