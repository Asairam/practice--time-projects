/**
 ngOnInit(): method used on page loading
 usedByData(): Mehtod used to get workers data
 removeOne(data, i): Method is used remove product line
 removeAll(): Method which is used remove all
 getProductsList(): method used to get all product lists
 productOnChange(value): Method which is used to select the product by selecting
 searchProduct(): Method which is used to get product by sku Based search
 searchOnSelect(): Method is used to get all products by partial search
 saveInventoryUsage(): Method which is used to save inventory
 onChangeUsedBy(value, i): Method which is used to change worker and company
 checkProduct(prdAry, prdObj):  method for checking duplicates products in list
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { InventoryUsageService } from './inventoryusage.service';
import { JwtHelper } from 'angular2-jwt';
@Component({
    selector: 'app-home-popup',
    templateUrl: './inventoryusage.html',
    styleUrls: ['./inventoryusage.css'],
    providers: [InventoryUsageService]
})
export class InventoryUsageComponent implements OnInit {
    searchKeyWord: any;
    productsList = [];
    usedByDataList: any;
    userList = [];
    productsListForSelect: any;
    selectSearchKeyWord: any;
    disableSelect: any = false;
    resultDiv = false;
    usedType: any;
    createdDate = new Date();
    error: any;
    decodedToken: any;
    firstName: any;
    lastName: any;
    showNoDataMsg: any;
    removedPrdct = [];
    showButtons: any = true;
    prdListMdl = '';
    toastermessage: any;
    constructor(private inventoryUsageService: InventoryUsageService,
        private translateService: TranslateService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router) {
    }
    /* method which is used onload page time */
    ngOnInit() {
        this.usedByData();
        // this.getProductsList();

        try {
            this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('token'));
            this.firstName = this.decodedToken.data.firstName;
            this.lastName = this.decodedToken.data.lastName;
        } catch (error) {
            this.decodedToken = {};
        }

    }
    /* method Which is used to get the worker list */
    usedByData() {
        this.inventoryUsageService.getUsedByDataValues().subscribe(
            data => {
                this.usedByDataList = data['usedBy'];
            },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (status) {
                    case 500:
                        break;
                    case 400:
                        if (statuscode === '2085' || statuscode === '2071') {
                            if (this.router.url !== '/') {
                                localStorage.setItem('page', this.router.url);
                                this.router.navigate(['/']).then(() => { });
                            }
                        }
                        break;
                }
            }
        );
    }
    /* Method which is used remove the product line */
    removeOne(data, i) {
        this.removedPrdct.push(data);
        this.productsList.splice(i, 1);
        if (this.productsList.length === 0) {
            this.showButtons = false;
            this.resultDiv = false;
        }
        /* method used here because of every time while click on remove button qty defaluted to 1 */
        this.getProductsList();
    }
    /* Method which is used to remove all listings */
    removeAll() {
        this.productsList = [];
        this.resultDiv = false;
        this.showButtons = false;
        this.disableSelect = false;
    }
    /* Method is used to get the product list */
    getProductsList() {
        this.inventoryUsageService.getProductsBySelect().subscribe(
            data => {
                for (let i = 0; i < data['result'].length; i++) {
                    data['result'][i]['Quantity_On_Hand__c'] = 1;
                }
                this.productsListForSelect = data['result'];
                this.prdListMdl = this.productsListForSelect[0].Product_Code__c;
            },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (status) {
                    case 500:
                        break;
                    case 400:
                        if (statuscode === '2085' || statuscode === '2071') {
                            if (this.router.url !== '/') {
                                localStorage.setItem('page', this.router.url);
                                this.router.navigate(['/']).then(() => { });
                            }
                        }
                        break;
                }
            }
        );
    }
    /* Method which is used to select the product by selecting */
    productOnChange(value) {
        this.selectSearchKeyWord = value;
    }
    /* Method which is used to get product by sku Based search */
    searchProduct() {
        if (this.searchKeyWord === '' || this.searchKeyWord === undefined || this.searchKeyWord === 'undefined') {
            this.disableSelect = true;
            this.getProductsList();
        } else {
            this.inventoryUsageService.getProductsBySKU(this.searchKeyWord).subscribe(
                data => {
                    for (let i = 0; i < data['result'].length; i++) {
                        data['result'][i]['Quantity_On_Hand__c'] = 1;
                    }
                    if (data.result.length === 0) {
                        this.disableSelect = false;
                        this.showNoDataMsg = '** No Results found **';
                    } else if (data.result.length === 1) {
                        this.searchKeyWord = '';
                        this.showNoDataMsg = '';
                        this.disableSelect = false;
                        this.resultDiv = true;
                        const duplicate = this.checkProduct(this.productsList, data['result'][0]);
                        if (!duplicate[0]) {
                            this.productsList.push(data['result'][0]);
                        } else {
                            const index: any = duplicate[1];
                            this.productsList[index]['Quantity_On_Hand__c'] += 1;
                        }
                    } else {
                        this.resultDiv = true;
                        this.disableSelect = true;
                        this.productsListForSelect = data.result;
                        this.prdListMdl = this.productsListForSelect[0]['Product_Code__c'];
                    }
                },
                error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (status) {
                        case 500:
                            break;
                        case 400:
                            if (statuscode === '2085' || statuscode === '2071') {
                                if (this.router.url !== '/') {
                                    localStorage.setItem('page', this.router.url);
                                    this.router.navigate(['/']).then(() => { });
                                }
                            }
                            break;
                    }
                }

            );
        }
    }
    /* Method is used to get all products by partial search */
    searchOnSelect() {
        this.resultDiv = true;
        const test = this.prdListMdl;
        const temp = this.productsListForSelect.filter(function (a) { return a['Product_Code__c'] === test; });
        const duplicate = this.checkProduct(this.productsList, temp[0]);
        if (!duplicate[0]) {
            this.productsList.push(temp[0]);
        } else {
            const index: any = duplicate[1];
            this.productsList[index]['Quantity_On_Hand__c'] += 1;
        }
    }
    /* Method which is used to save inventory */
    saveInventoryUsage() {
        for (let i = 0; i < this.productsList.length; i++) {
            if (this.productsList[i].Quantity_On_Hand__c === 0 || this.productsList[i].Quantity_On_Hand__c === '0' ||
                this.productsList[i].Quantity_On_Hand__c === '' || this.productsList[i].Quantity_On_Hand__c === null) {
                this.error = 'INVENTORY_USAGE.VALID_QUANTITY_CANNOT_BE_ZERO_OR_EMPTY';
            }
        }
        if (!this.error) {
            this.inventoryUsageService.saveUsageData(this.productsList).subscribe(
                data => {
                    const productData = data['result'];
                    this.router.navigate(['/inventory']);
                },
                error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (status) {
                        case 500:
                            break;
                        case 400:
                            if (statuscode === '2085' || statuscode === '2071') {
                                if (this.router.url !== '/') {
                                    localStorage.setItem('page', this.router.url);
                                    this.router.navigate(['/']).then(() => { });
                                }
                            }
                            break;
                    }
                }
            );
        }
    }
    /* Method which is used to change worker and company  */
    onChangeUsedBy(value, i) {
        if (value === 'Worker') {
            this.inventoryUsageService.getUserList()
                .subscribe(data => {
                    this.userList[i] = data['result'];
                    this.productsList[i].userId = data['result'][0].Id;
                },
                    error => {
                        const errStatus = JSON.parse(error['_body'])['status'];
                        if (errStatus === '2085' || errStatus === '2071') {
                            if (this.router.url !== '/') {
                                localStorage.setItem('page', this.router.url);
                                this.router.navigate(['/']).then(() => { });
                            }
                        }
                    });
        } else if (value === 'Company') {
            this.userList[i] = [];
        }
    }
    /* Method to change worker */
    onChangeUser(value, i) {
        this.productsList[i].userId = value;

    }
    /* method to clear error msgs */
    clearErrMsg() {
        this.error = '';
    }
    /* method to clear error msgs */
    clearErrMsg1() {
        this.showNoDataMsg = '';
    }
    /* method for cancel changes */
    cancel() {
        this.productsList = [];
    }
    /* method for checking duplicates products in list*/
    checkProduct(prdAry, prdObj) {
        for (let i = 0; i < prdAry.length; i++) {
            if (prdAry[i]['Id'] === prdObj['Id']) {
                return [true, i];
            }
        }
        return [false, 0];
    }
    /* method to restrict charecters  */
    keyPress(event: any) {
        const pattern = /^[a-zA-Z0-9-]*$/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    /* method to restrict charecters  */
    keyPress1(event: any) {
        const pattern = /^[-0-9]*$/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
}
