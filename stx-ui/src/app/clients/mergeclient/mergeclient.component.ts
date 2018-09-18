import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MergeClientService } from './mergeclient.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-clients-popup',
    templateUrl: './mergeclient.html',
    providers: [MergeClientService]
})
export class MergeClientComponent implements OnInit {
    clientId1: any;
    clientId2: any;
    clientData1: any;
    clientData2: any;
    mergeClient: any = {};
    error: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private mergeclientService: MergeClientService,
        private toastr: ToastrService,
        private router: Router) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.clientId1 = activatedRoute.snapshot.params['sourceId'];
            this.clientId2 = activatedRoute.snapshot.params['targetId'];
        });
    }
    /*Method for page Load */
    ngOnInit() {
        this.getClients(this.clientId1, this.clientId2);
    }
    /**
     * Method to get Clients To merge
     * @param clientId1
     * @param clientId2
     */
    getClients(clientId1, clientId2) {
        this.mergeclientService.getClient(clientId1, clientId2)
            .subscribe(data => {
                this.clientData1 = data['result'][0][0];
                this.clientData2 = data['result'][1][0];
                this.mergeClient = Object.assign({}, data['result'][0][0]);
            }, error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                if (statuscode === '2085' || statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            });
    }
    /**
     * to Merge Clients
     */
    merge() {
        const dataObj = {
            mergeData: this.mergeClient,
            sourceClientId: this.clientId1,
            targetClientId: this.clientId2
        };
        this.mergeclientService.mergeClients(dataObj)
            .subscribe(data => {
                const dataStatus = data['result'];
                this.router.navigate(['/client/edit/' + this.clientId1]);
            }, error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                if (statuscode === '2085' || statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            });
    }
}
