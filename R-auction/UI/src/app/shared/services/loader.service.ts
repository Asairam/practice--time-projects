import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    private loaderCount = 0;
    set loading(value) {
        if(value) this.loaderCount++;
        if(!value) this.loaderCount--;
        if(this.loaderCount < 0) console.log("Loader count below zero");
        console.log('loaderCount ::: ', this.loaderCount)
    }

    get loading() {
        return this.loaderCount == 0? false: true;
    }
}