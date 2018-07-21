/*
ngOnInit(): Method used for getting onload data.
getProductLines():Method used to get productline data.
onServiceGroupChange(value): Method to change inventory group value.
onProductLineChange(value): Method to change product line values.
InventorySortOptions(): Method for getting sort options.
getProductsBySearch(): Method for searching product data.
updateProducts(): Method to update the product data.
getInventoryGroups(): Method to get inventory group data.
getviewOption(): Method to get view options
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ManageInventoryService } from './manageinventory.service';
@Component({
    selector: 'app-home-popup',
    templateUrl: './manageinventory.html',
    styleUrls: ['./manageinventory.css'],
    providers: [ManageInventoryService]
})
export class ManageInventoryComponent implements OnInit {
    inventoryGroupsData: any;
    productLinesData: any;
    inventorySortingdata: any;
    productsList = [];
    inventoryGroup = 'All';
    productLine = 'All';
    sortOption: any;
    viewOption = 'All';
    inActive = false;
    viewOptionData: any = [];
    error: any;
    noResultMsg: any;
    noResult: any = false;
    skuError: any;
    prodNameError: any;
    miniQty: any;
    stndrdCostError: any;
    priceError: any;
    sizeError: any;
    constructor(private manageInventoryService: ManageInventoryService,
        private route: ActivatedRoute,
        private router: Router) {
    }
    /*method to get onload data */
    ngOnInit() {
        this.getInventoryGroups();
        this.getProductLines();
        this.InventorySortOptions();
        this.getviewOption();
    }
    /*Method used to get productline data */
    getProductLines() {
        this.manageInventoryService.getProductLinesData().subscribe(
            data => {
                this.productLinesData = data['result'];
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
    /*Method to change inventorygroup value */
    onServiceGroupChange(value) {
        this.inventoryGroup = value;
    }
    /*Method to change product line value */
    onProductLineChange(value) {
        this.productLine = value;
    }
    /*Method to get sort options */
    InventorySortOptions() {
        this.manageInventoryService.getInventorySortOptions().subscribe(
            data => {
                this.inventorySortingdata = data['inventorySortOptions'];
                this.sortOption = this.inventorySortingdata[0].type;
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
    /* Mehtod to search product data */
    getProductsBySearch() {
        const searchObj = {
            'inventoryGroup': this.inventoryGroup,
            'productLine': this.productLine,
            'viewOption': this.viewOption,
            'sortOption': this.sortOption,
            'inActive': this.inActive
        };
        this.manageInventoryService.productsSearch(searchObj).subscribe(
            data => {
                if (data.result.length === 0) {
                    this.noResultMsg = '** No Results **';
                    this.noResult = true;
                } else {
                    this.noResult = false;
                }
                this.productsList = data['result'];
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
    }/*Method to update product data */
    updateProducts() {
        for (let i = 0; i < this.productsList.length; i++) {
            if (this.productsList[i]['Product_Code__c'] === '') {
                this.skuError = 'SKU# is Required';
            } else if (this.productsList[i]['Name'] === '') {
                this.prodNameError = 'Product Name is Required';
            } else if (this.productsList[i]['Size__c'] === '' || this.productsList[i]['Size__c'] <= 0) {
                this.sizeError = 'Size: Only a positive number can be allowed';
            } else if (this.productsList[i]['Minimum_Quantity__c'] < 0) {
                this.miniQty = 'Minimum Quantity: Only zero or a positive number is allowed';
            } else if (this.productsList[i]['Standard_Cost__c'] < 0) {
                this.stndrdCostError = 'Standard Cost: Only zero or a positive number is allowed';
            } else if (this.productsList[i]['Price__c'] < 0) {
                this.priceError = 'Price: Only zero or a positive number is allowed';
            }
        }
        if ((this.skuError === '' || this.skuError === undefined) && (this.prodNameError === '' || this.prodNameError === undefined)
            && (this.sizeError === '' || this.sizeError === undefined) && (this.miniQty === '' || this.miniQty === undefined)
            && (this.stndrdCostError === '' || this.stndrdCostError === undefined) && (this.priceError === '' || this.priceError === undefined)) {
            const updateProducts = this.productsList;
            this.manageInventoryService.saveProductData(updateProducts).subscribe(
                data => {
                    const saveproducts = data['result'];
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
                        /* Case:400 error is for checking sku */
                            this.error = 'MANAGE_INVENTORY.ERROR';
                            break;
                    }
                }
            );
        }

    }/* Method to get inventory groups data */
    getInventoryGroups() {
        this.manageInventoryService.getInventoryGroupsData().subscribe(
            data => {
                this.inventoryGroupsData = data['result'];
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
                        this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                        break;
                }
            }
        );
    }
    /* Method is used to getting the view options */
    getviewOption() {
        this.manageInventoryService.getViewOptions().subscribe(
            data => {
                this.viewOptionData = data['viewOptions'];

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
    }
    /* method to restrict charecters  */
    keyPress(event: any) {
        const pattern = /^[a-zA_Z0-9]*$/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    keyPress1(event: any) {
        const pattern = /^[0-9-]*$/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    clearErrorMsgs() {
        this.error = '';
        this.skuError = '';
        this.prodNameError = '';
        this.sizeError = '';
        this.miniQty = '';
        this.stndrdCostError = '';
        this.priceError = '';
    }
    cancel() {
        this.clearErrorMsgs();
    }
}
