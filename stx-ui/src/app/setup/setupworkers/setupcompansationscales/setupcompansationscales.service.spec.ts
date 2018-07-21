

/* SetupProductLineService spec file is used to test the SetupProductLineService.
* SetupProductLineService have below functionality:
* extractData(): To extract the data.
* handleError(): To handle error messages.
*/
import { Injectable } from '@angular/core';
import { Http, BaseRequestOptions, RequestMethod, Response, ResponseOptions } from '@angular/http';
// Test related module imports
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { SetupcompansationscalesService } from './setupcompansationscales.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as config from '../../../app.config';

/*---- We initialise the components and services we are using ----*/
/*---- TestBed is used to create angular testing module ----*/
describe('SetupcompansationscalesService', () => {
    let subject: SetupcompansationscalesService;
    let backend: MockBackend;
    /*---- Jasmine runs beforeEach() before each of the tests ----*/
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SetupcompansationscalesService,
                BaseRequestOptions,
                MockBackend,
                {
                    provide: Http,
                    useFactory: (backend1: MockBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend1, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions],
                },
                {
                    provide: 'apiEndPoint',
                    useValue: config.API_END_POINT
                },
            ],
        });
    });
    /*---- Jasmine runs beforeEach() before each of the tests ----*/
    beforeEach(inject([SetupcompansationscalesService, MockBackend], (Enterpriseservice, mockBackend) => {
        subject = Enterpriseservice;
        backend = mockBackend;
    }));
           /*---- Get selected Enterprise Details ----*/
    it('should be called with proper arguments for getProductLineDetails', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url)
                .toEqual(config.API_END_POINT + '/api/setupworkers/setupcompensation');
            expect(connection.request.method).toEqual(RequestMethod.Get);
            expect(connection.request.headers.get('Content-Type')).toEqual(null);
            const options = new ResponseOptions({
                body: JSON.stringify({})
            });
            connection.mockRespond(new Response(options));
        });
        subject.getscales().subscribe((data) => {
            expect(data).toEqual({});
        });
    });
         /*---- Test to verify the handle error with null response ----*/
    it('should extract mocked data with null response', async () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({
            });
            connection.mockRespond(new Response(options));
        });
        const reqOptions = new BaseRequestOptions();
        subject.getscales().subscribe(r => {
            const out: any = r;
            expect(out).toEqual({});
        });
    });
    /*---- Test to verify the handle error with empty response ----*/
    it('should log an error to the console with empty response', async () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options: any = new ResponseOptions({
                body: {},
                status: 404
            });
            const response: any = new Response(options);
            connection.mockError(response);
        });
        subject.getscales().subscribe(res => {
            expect(res).toHaveBeenCalledWith('404 - {}');
        });
    });
});
