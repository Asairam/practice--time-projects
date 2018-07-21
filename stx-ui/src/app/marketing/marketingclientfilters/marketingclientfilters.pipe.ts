import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';
@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
    transform(value, args: string[]): any {
        const keys = [];
        Object.keys(value).map((key) => {
            if (key !== 'filterType' && key !== 'filterName') {
                if (!isNullOrUndefined(value[key]) && value[key] !== '') {
                    keys.push({ key: key, value: value[key] });
                }
            }
        });
        return keys;
    }
}
