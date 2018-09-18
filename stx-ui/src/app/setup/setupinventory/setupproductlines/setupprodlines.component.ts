/*
    Setup Product Line component has the following methods.
    * ngOnInit(): This method is used to load methods on page load
    * getProductLine(): This method is used to get product lines
    * getInventoryGroups(): This method is used to get inventory groups
    * getInactiveProductLine(value): This method is used to get inactive or active inventory product lines
    * createProductLine(): This method is used to create product line
    * showData(productlinelist): This method is used to show data
    * editInventoryProductLines(): This method is used to edit inventory product line
    * addNew(): This method is used to add new inventory product line
    * deleteProductLine(): This method is used to delete product line
    * cancel(): This method is used to cancel changes
    * clear(); This method is used to clear data
    * clearmessage(): This method is used to clear error message
*/
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SetupProductLinesService } from './setupprodlines.service';
@Component({
    selector: 'app-setupprodlines-popup',
    templateUrl: './setupprodlines.html',
    styleUrls: ['./setupprodlines.css'],
    providers: [SetupProductLinesService]
})
export class SetupProductLinesComponent implements OnInit {
    toastermessage: any;
    disableDiv = true;
    addDiv = false;
    hideTable = false;
    editDiv = false;
    active: any;
    Pname: any;
    inActive: any;
    productLineName: any;
    productColor = this.defaultColor;
    color = this.defaultColor;
    rows = [];
    measures = [];
    updaterows = [];
    updatemeasures = [];
    inventoryGroups: any;
    unitOfMeasures: any;
    productLineList: any;
    productLineObj: {};
    productLineData: any;
    error: any;
    updateId: any;
    updateActive: any;
    updateProductLineName: any;
    updateProductColor: any;
    updateInventoryGroups: any;
    updateUnitOfMeasures: any;
    inventoryGroupList: any;
    updateInventoryGroupsList: any;
    updateProductLineObj: any;
    updateProductLine: any;
    statuscode: any;
    removeName: any;
    updatedefaultcolor: any;
    constructor(private toastr: ToastrService,
        private productLinesService: SetupProductLinesService,
        private router: Router,
        private translateService: TranslateService,
        @Inject('defaultColor') public defaultColor: string,
        @Inject('defaultType') public defaultType: string,
        @Inject('defaultActive') public defaultActive: string,
        @Inject('defaultInActive') public defaultInActive: string
    ) {
    }
    /*-- Method used to add inventory groups,
     units of measure and removing them --*/
    addRows() {
        this.rows.push({ inventoryGroups:  this.inventoryGroupList[0].inventoryGroupName });
    }
    addUpdateRows() {
        this.updaterows.push({ inventoryGroups: this.inventoryGroupList[0].inventoryGroupName });
    }
    addMeasures() {
        this.measures.push({ unitOfMeasures: '' });
    }
    addUpdateMeasures() {
        this.updatemeasures.push({ unitOfMeasures: '' });
    }
    deleteFieldValue(index) {
        this.rows.splice(index, 1);
    }
    deleteFieldValue1(index) {
        this.updaterows.splice(index, 1);
    }

    deleteFieldValue3(index) {
        this.updatemeasures.splice(index, 1);
    }
    deleteFieldValue2(inventorygrouplist, index) {
        this.removeName = inventorygrouplist.inventoryGroups;
        this.productLinesService.removeInventoryGroup(this.removeName).subscribe(data => {
            this.updateInventoryGroupsList.splice(index, 1);
        }, error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
                case '2040':
                    this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                    window.scrollTo(0, 0);
                    break;
            }
            if (statuscode === '2085' || statuscode === '2071') {
                if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                }
            }
        });
    }
    /*-- On load method --*/
    ngOnInit() {
        this.getProductLine();
        this.getInventoryGroups();
    }
    /*-- Method to get product lines list(active) --*/
    getProductLine() {
        if (this.inActive === 'undefined' ||
            this.inActive === undefined ||
            this.inActive === this.defaultInActive || this.inActive === '0' || this.inActive === '') {
            this.inActive = this.defaultActive;
        }
        this.productLinesService.getProductLineDetails(this.inActive)
            .subscribe(data => {
                this.productLineList = data['result'];
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
    /*-- Method to get inventory groups --*/
    getInventoryGroups() {
        this.productLinesService.getInventoryGroups()
            .subscribe(data => {
                this.inventoryGroupList = data['result'];
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
    /*-- Method to get product lines all --*/
    getInactiveProductLine(value) {
        if (value.target.checked === true || value.target.checked === 'true') {
            this.inActive = this.defaultInActive;
        } else {
            this.inActive = this.defaultActive;
        }
        this.productLinesService.getProductLineDetails(this.inActive)
            .subscribe(data => {
                this.productLineList = data['result'];
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
    /*-- Method to create product line --*/
    createProductLine() {
        if (this.productLineName === undefined || this.productLineName === 'undefined' || this.productLineName === '') {
            this.error = 'SETUP_INVENTORY_PRODUCT_LINE.VALID_NOBLANK_PRODUCT_LINE_NAME';
        } else if (this.rows === undefined || this.rows.length === 0) {
            this.error = 'SETUP_INVENTORY_PRODUCT_LINE.VALID_NOBLANK_INVENTORY_GROUP_NAME';
        } else {
            if (this.active === undefined || this.active === false) {
                this.active = this.defaultInActive;
            } else {
                this.active = this.defaultActive;
            }
            this.productLineObj = {
                'active': this.active,
                'productLineName': this.productLineName,
                'productColor': this.productColor === '' ? '#ffffff' : this.productColor,
                'inventoryGroups': this.rows,
                'unitOfMeasures': this.measures.filter(filterList => filterList.unitOfMeasures)
            };
                this.productLinesService.createProductLine(this.productLineObj)
                    .subscribe(data => {
                        this.productLineData = data['result'];
                        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
                        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                        this.getProductLine();
                        this.disableDiv = true;
                        this.hideTable = false;
                        this.addDiv = false;
                        this.clear();
                    }, error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                window.scrollTo(0, 0);
                                break;
                            case '2042':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                window.scrollTo(0, 0);
                                break;
                        }
                        if (statuscode === '2085' || statuscode === '2071') {
                            if (this.router.url !== '/') {
                                localStorage.setItem('page', this.router.url);
                                this.router.navigate(['/']).then(() => { });
                            }
                        }
                    });
        }
    }
    showData(productlinelist) {
        this.updatedefaultcolor = productlinelist.Color__c;
        const type = this.defaultType;
        this.updateId = productlinelist.Id;
        this.Pname = productlinelist.Name;
        this.productLinesService.getDeleteResponse(this.updateId, type, this.Pname).subscribe(data => {
            this.statuscode = JSON.parse(data['status']);
        }, error => {
            const status = JSON.parse(error['status']);
            this.statuscode = JSON.parse(error['_body']).status;
            if (this.statuscode === '2085' || this.statuscode === '2071') {
                if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                }
            }
        });
        this.productColor = this.defaultColor;
        this.rows = [];
        this.measures = [];
        this.addDiv = false;
        this.editDiv = true;
        this.disableDiv = false;
        this.hideTable = true;
        this.getProductLine();
        this.updateId = productlinelist.Id;
        this.updateActive = productlinelist.Active__c;
        this.updateProductLineName = productlinelist.Name;
        this.updateProductColor = productlinelist.Color__c;
        this.updateInventoryGroups = productlinelist.Groups__c;
        this.updateInventoryGroupsList = JSON.parse(productlinelist.Groups__c);
        this.updateUnitOfMeasures = JSON.parse(productlinelist.Units_of_Measure__c);
        this.productLinesService.productDependencyToDisableInvGrp(this.updateId).subscribe(data => {
            const dataObj = data['result'];
            for (let i = 0; i < this.updateInventoryGroupsList.length; i++) {
                for (let j = 0; j < dataObj.length; j++) {
                    if (this.updateInventoryGroupsList[i]['inventoryGroups'] === dataObj[j]['Inventory_Group__c']) {
                        this.updateInventoryGroupsList[i].isDependency = true;
                    }
                }
            }
        }, error => {
            const status = JSON.parse(error['status']);
            this.statuscode = JSON.parse(error['_body']).status;
            if (this.statuscode === '2085' || this.statuscode === '2071') {
                if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                }
            }
        });
    }
    /*-- Method to edit product line --*/
    editInventoryProductLines() {
        let inventoryGroup;
        inventoryGroup = this.updateInventoryGroupsList;
        this.inventoryGroups = inventoryGroup.concat(this.updaterows);
        let unitOfMeasure;
        unitOfMeasure = this.updateUnitOfMeasures;
        this.unitOfMeasures = unitOfMeasure.concat(this.updatemeasures);
        if (this.updateProductLineName === undefined || this.updateProductLineName === 'undefined' || this.updateProductLineName === '') {
            this.error = 'SETUP_INVENTORY_PRODUCT_LINE.VALID_NOBLANK_PRODUCT_LINE_NAME';
        } else if (this.inventoryGroups === undefined || this.inventoryGroups.length === 0) {
            this.error = 'SETUP_INVENTORY_PRODUCT_LINE.VALID_NOBLANK_INVENTORY_GROUP_NAME';
        } else {
            this.updateActive = this.updateActive ? this.defaultActive : this.defaultInActive;
            this.updateProductLineObj = {
                'updateActive': this.updateActive,
                'updateProductLineName': this.updateProductLineName,
                'updateProductColor': this.updateProductColor === '' ? '#ffffff' : this.updateProductColor,
                'updateInventoryGroups': this.inventoryGroups,
                'updateUnitOfMeasures': this.unitOfMeasures.filter(filterList => filterList.unitOfMeasures)
            };
            this.productLinesService.updateInventoryProductLine(this.updateProductLineObj, this.updateId)
                .subscribe(data => {
                    this.updateProductLine = data['result'];
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EDIT_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.disableDiv = true;
                    this.hideTable = false;
                    this.addDiv = false;
                    this.editDiv = false;
                    this.getProductLine();
                    this.clear();
                    this.updaterows = [];
                    this.updatemeasures = [];
                }, error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (JSON.parse(error['_body']).status) {
                        case '2033':
                            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                            window.scrollTo(0, 0);
                            break;
                        case '2042':
                            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                            window.scrollTo(0, 0);
                            break;
                    }
                    if (statuscode === '2085' || statuscode === '2071') {
                        if (this.router.url !== '/') {
                            localStorage.setItem('page', this.router.url);
                            this.router.navigate(['/']).then(() => { });
                        }
                    }
                });
        }
    }
    /*--- Method to add div ---*/
    addNew() {
        this.active = true;
        this.error = '';
       // this.productColor = this.defaultColor;
        this.rows = [];
        this.measures = [];
        this.disableDiv = false;
        this.addDiv = true;
        this.hideTable = true;
        this.editDiv = false;
        if (this.inActive === 0) {
            this.inActive = 1;
        }
        this.productLinesService.getProductLineDetails(this.inActive)
            .subscribe(data => {
                this.productLineList = data['result'];
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
    /* method is used to set default color for the field when field is empty */
    colorCheck() {
        this.productColor = this.defaultColor;
    }
    updatecolorCheck() {
        this.updateProductColor =  this.updatedefaultcolor;
    }
    /*-- Method to delete product line --*/
    deleteProductLine() {
        this.productLinesService.deleteProductLine(this.updateId, this.Pname)
            .subscribe(data => {
                this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
                this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                this.disableDiv = true;
                this.hideTable = false;
                this.addDiv = false;
                this.editDiv = false;
                this.getProductLine();
                this.clear();
            }, error => {
                const status = JSON.parse(error['status']);
                this.statuscode = JSON.parse(error['_body']).status;
                if (this.statuscode === '2085' || this.statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            });

    }
    /*--- Method used to cancel changes ---*/
    cancel() {
        this.productColor = this.defaultColor;
        this.disableDiv = true;
        this.addDiv = false;
        this.hideTable = false;
        this.editDiv = false;
        this.getProductLine();
        this.clear();
    }
    /*-- Method to clear product line --*/
    clear() {
        this.active = '';
        this.productLineName = '';
        this.color = this.defaultColor;
        this.error = '';
    }
    /*-- Method to create error --*/
    clearmessage() {
        this.error = '';
    }
}
