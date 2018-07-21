import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

@Injectable()
export class HttpClient {

    constructor(private router: Router, private http: Http) { }

    createAuthorizationHeader(headers: Headers, url: string) {
        const token = localStorage.getItem('token');
        if (token && token !== '') {
            try {
                if (url !== '/assets/staticjsonfiles/common.json') {
                    headers.append('token', token);
                }
            } catch (error) {
                this.router.navigate(['/']).then(() => { });
            }
        } else if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
        }
    }

    get(url) {
        const headers = new Headers();
        this.createAuthorizationHeader(headers, url);
        return this.http.get(url, {
            headers: headers
        });
    }

    getHeader(url, headers) {
        this.createAuthorizationHeader(headers, url);
        return this.http.get(url, {
            headers: headers
        });
    }

    post(url, data) {
        const headers = new Headers();
        this.createAuthorizationHeader(headers, url);
        return this.http.post(url, data, {
            headers: headers
        });
    }

    put(url, data) {
        const headers = new Headers();
        this.createAuthorizationHeader(headers, url);
        return this.http.put(url, data, {
            headers: headers
        });
    }

    delete(url) {
        const headers = new Headers();
        this.createAuthorizationHeader(headers, url);
        return this.http.delete(url, {
            headers: headers
        });
    }

}
