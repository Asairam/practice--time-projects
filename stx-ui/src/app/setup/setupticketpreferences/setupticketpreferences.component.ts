/*
ngOnInit(): method for pageload
getPos() : Method to get POS data
keyPress(event: any): Method to restrict special charecters
getDiviceType(): Method to get local Browser Data
getPosDevicesData(): Method to POSDEVICES data
addNew(): Method to ADD new line for cashdrawers
checkIfDrawerNumberExists(rows): Method to check Duplicate Data in POSDEVICES
commonCancel(): Method to cancel changes
clearmessage(): Method to clear error messages
commonSave(): Method to save POS and POSDEVICES data
*/
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment/moment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SetupTicketPreferencesService } from './setupticketpreferences.service';
import { count } from 'rxjs/operators/count';
import { Ng2DeviceService } from 'ng2-device-detector';
import { Local } from 'protractor/built/driverProviders';
import { locale } from 'moment/moment';
import { TabsetComponent } from 'ngx-bootstrap';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
    selector: 'app-ticketpreferences-popup',
    templateUrl: './setupticketpreferences.html',
    providers: [SetupTicketPreferencesService],
    styleUrls: ['./setupticketpreferences.css']
})
export class SetupTicketPreferencesComponent implements OnInit {
    isClassVisible: any = false;
    activeTab: any;
    pos = true;
    posDevice = false;
    favorites = false;
    // pos variables
    addServiceTax: any;
    addRetailTax: any;
    addPaymentType: any;
    addStoreTerminalID: any;
    addSharedSecret1: any;
    addTest1: any;
    addOnlineTerminalID: any;
    addSharedSecret2: any;
    addTest2: any;
    unamePattern: any;
    taxPattern: any;
    posDataObjList: any;
    posDataObj: any = {};
    posData: any;
    favouritError: any;
    error: any;
    error1: any;
    error2: any;
    error3: any;
    error5: any;
    error6: any;
    error7: any;
    toastermessage: any;
    // Pos Device variables
    readOnly: any;
    drawerName: any;
    drawerNumber: any;
    rows = [];
    rows1 = [];
    cashDraw = [];
    cashDrawRow = [];
    addReceiptMemo: any;
    addCreditCardDevice: any;
    addCashDrawer: any;
    addReceiptPrinter: any;
    posDevicesDataObj: any;
    deviceInfo: any;
    CreditCardDevice: any;
    CashDrawer: any;
    ReceiptPrinter: any;
    browserObject: any;
    deviceObject: any;
    getArray: any;
    obj: any;
    // obj1: any;
    // Favorites variables
    promotionColor = '#ffffff';
    promotionId: any;
    favoritesList: any;
    ticketPreferencesTypes: any;
    type: any;
    default = true;
    serviceGroupsList: any;
    productCategoryList: any;
    typeName: any;
    productsList: any;
    serviceList: any;
    productList: any;
    serviceName: any;
    productLineId: any;
    productLineColor: any;
    productLine: any;
    favortiesData: any;
    order: any;
    favoritesObj: any;
    favoriteId = '';
    add: any;
    skuString: any;
    sku: any;
    searchProductsList: any;
    search: any;
    searchProduct: any;
    product: any;
    productLength: any;
    searchProductId: any;
    searchProductObj: any;
    singleProduct: any;
    selectedProduct: any;
    selectedProductObj: any;
    productSku: any;
    serviceGroupColor: any;
    serviceGroupName: any;
    color: any;
    typeValue: any;
    colorValue: any;
    selectedProductColor: any;
    addToButton: any = false;
    activeTab2 = [false, false, false];
    ticketPreTypes: any;
    ticketPreCate = '';
    ticketPreProCate = '';
    ticketPrePromotionCate = '';
    activeTabClass = ['active', '', ''];
    @ViewChild('favoriteModal') public favoriteModal: ModalDirective;
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    selectTab(tab_id: number) {
        this.staticTabs.tabs[tab_id].active = true;
    }
    disableEnable() {
        this.staticTabs.tabs[0].disabled = !this.staticTabs.tabs[0].disabled;
        this.staticTabs.tabs[0].active = true;
    }
    constructor(private setupTicketPreferencesService: SetupTicketPreferencesService,
        @Inject('apiEndPoint') public apiEndPoint: string,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private router: Router,
        private deviceService: Ng2DeviceService,
        private sanitizer: DomSanitizer) {
    }
    ngOnInit() {
        // this.addNew();
        // pos
        this.getPos();
        // pos device
        this.getPosDevicesData();
        this.getDiviceType();
        // if (this.deviceInfo.device === 'unknown') {
        //     this.obj = localStorage.getItem('browserObject');
        //     if (this.obj === null) {
        //         this.addCreditCardDevice = '';
        //         this.addCashDrawer = '';
        //         this.addReceiptPrinter = '';
        //     } else if (this.obj !== undefined || this.obj !== '') {
        //         this.obj = JSON.parse(this.obj);
        //         this.addCreditCardDevice = this.obj.CreditCardDevice;
        //         this.addCashDrawer = this.obj.CashDrawer;
        //         this.addReceiptPrinter = this.obj.ReceiptPrinter;
        //     }
        // }
        // if (this.deviceInfo.device === 'android' || this.deviceInfo.device === 'iphone' ||
        //     this.deviceInfo.device === 'ipad' || this.deviceInfo.device === 'windows-phone') {
        //     this.obj1 = localStorage.getItem('deviceObject');
        //     if (this.obj1 === null) {
        //         this.addCreditCardDevice = '';
        //         this.addCashDrawer = '';
        //         this.addReceiptPrinter = '';
        //     } else if (this.obj1 !== undefined || this.obj1 !== '') {
        //         this.obj1 = JSON.parse(this.obj1);
        //         this.addCreditCardDevice = this.obj1.CreditCardDevice;
        //         this.addCashDrawer = this.obj1.CashDrawer;
        //         this.addReceiptPrinter = this.obj1.ReceiptPrinter;
        //     }
        // }
        this.obj = localStorage.getItem('browserObject');
        if (this.obj === null) {
            this.addCreditCardDevice = '';
            this.addCashDrawer = '';
            this.addReceiptPrinter = '';
        } else if (this.obj !== undefined || this.obj !== '') {
            this.obj = JSON.parse(this.obj);
            this.addCreditCardDevice = this.obj.CreditCardDevice;
            this.addCashDrawer = this.obj.CashDrawer;
            this.addReceiptPrinter = this.obj.ReceiptPrinter;
        }
        // favorites
        this.getFavouritesData();
        this.updateTabs(0);
    }
    /*---
      Pos related Methods starts
    ---*/
    /*method for getting Data from database */
    getPos() {
        this.setupTicketPreferencesService.getPos().subscribe(data => {
            this.posDataObjList = data['result'];
            const salesData = this.posDataObjList[3];
            const salesdata1 = JSON.parse(salesData.JSON__c);
            this.addServiceTax = salesdata1.serviceTax;
            this.addRetailTax = salesdata1.retailTax;
            if (this.posDataObjList[0].JSON__c) {
                const merchantData = JSON.parse(this.posDataObjList[0].JSON__c);
                this.addStoreTerminalID = merchantData.storeTerminalID;
                this.addSharedSecret1 = merchantData.sharedSecret;
                this.addTest1 = merchantData.test;
            }
            if (this.posDataObjList[1].JSON__c) {
                const merchantData1 = JSON.parse(this.posDataObjList[1].JSON__c);
                this.addOnlineTerminalID = merchantData1.onlineTerminalID;
                this.addSharedSecret2 = merchantData1.sharedSecret;
                this.addTest2 = merchantData1.test;
            }
            if (this.posDataObjList[2].JSON__c) {
                const merchantData3 = JSON.parse(this.posDataObjList[2].JSON__c);
                this.addPaymentType = merchantData3.paymentType;
            }
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
    /* method to restrict specialcharecters  */
    keyPress(event: any) {
        const pattern = /[a-zA-Z0-9\+g]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    numberOnly(event: any) {
        const pattern = /[0-9.]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    /*---
      Pos related methods  ends
    ---*/
    /*---
    Pos device related methods starts
    ---*/
    /* method to Getting  local browser data for desktop and device view */
    getDiviceType() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        // if (this.deviceInfo.device === 'unknown') {
        //     this.setupTicketPreferencesService.
        //         deviceData().subscribe(data => {
        //             this.browserObject = data['browserObject'];
        //             this.CreditCardDevice = this.browserObject.CreditCardDevice;
        //             this.CashDrawer = this.browserObject.CashDrawer;
        //             this.ReceiptPrinter = this.browserObject.ReceiptPrinter;
        //         },
        //             error => {
        //                 const errStatus = JSON.parse(error['_body'])['status'];
        //                 if (errStatus === '2085' || errStatus === '2071') {
        //                     this.router.navigate(['/']).then(() => { });
        //                 }
        //             });
        // } else if (this.deviceInfo.device === 'android' || this.deviceInfo.device === 'iphone' ||
        //     this.deviceInfo.device === 'ipad' || this.deviceInfo.device === 'windows-phone') {
        //     this.setupTicketPreferencesService.
        //         deviceData().subscribe(data => {
        //             this.deviceObject = data['deviceObject'];
        //             this.CreditCardDevice = this.deviceObject.CreditCardDevice;
        //             this.CashDrawer = this.deviceObject.CashDrawer;
        //             this.ReceiptPrinter = this.deviceObject.ReceiptPrinter;
        //         },
        //             error => {
        //                 const errStatus = JSON.parse(error['_body'])['status'];
        //                 if (errStatus === '2085' || errStatus === '2071') {
        //                     this.router.navigate(['/']).then(() => { });
        //                 }
        //             });
        // }
        this.setupTicketPreferencesService.
            deviceData().subscribe(data => {
                this.browserObject = data['browserObject'];
                this.CreditCardDevice = this.browserObject.CreditCardDevice;
                this.CashDrawer = this.browserObject.CashDrawer;
                this.ReceiptPrinter = this.browserObject.ReceiptPrinter;
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
        this.addCreditCardDevice = localStorage.getItem(this.addCreditCardDevice);
        this.addCashDrawer = localStorage.getItem(this.addCashDrawer);
        this.addReceiptPrinter = localStorage.getItem(this.addReceiptPrinter);
    }
    /*Method for Getting data from database */
    getPosDevicesData() {
        this.setupTicketPreferencesService.
            getPosdevices().subscribe(data => {
                if (data['result'][0].JSON__c) {
                    this.rows1 = JSON.parse(data['result'][0].JSON__c);
                    JSON.parse(data['result'][0].JSON__c).forEach(element => {
                        if (element.readOnly === true) {
                            this.cashDraw.push(element);
                        }
                    });
                } else {
                    this.rows1 = [];
                }
                if (this.rows1.length === 0) {
                    this.rows.push({ 'readOnly': '', 'drawerNumber': '', 'drawerName': '' });
                }
                this.addReceiptMemo = data['result'][1].JSON__c;
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
    /*method for adding new line dynamically */
    addNew() {
        let allowPush = true;
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].drawerNumber === '' || this.rows[i].drawerName === '') {
                allowPush = false;
            }
        }
        if (this.rows1.length >= 0 && allowPush === true) {
            this.rows.push({ 'readOnly': '', 'drawerNumber': '', 'drawerName': '' });
        } else if (this.rows.length === 0 && allowPush === true) {
            this.rows.push({ 'readOnly': '', 'drawerNumber': '', 'drawerName': '' });
        }
    }
    ActiveCashDraw(e) {
        if (e.readOnly === true) {
            this.cashDrawRow.push(e);
        } else {
            this.cashDrawRow.splice(e, 1);
        }
    }
    ActiveDraw() {
        this.cashDraw = [];
        this.rows1.forEach(element => {
            if (element.readOnly === true) {
                this.cashDraw.push(element);
            }
        });
    }
    /*Method for duplicate data */
    checkIfDrawerNumberExists(rows) {
        const valueArr = this.rows.map(function (item) {
            return item.drawerNumber;
        });
        const isDuplicate = valueArr.some(function (item, idx) {
            return valueArr.indexOf(item) !== idx;
        });
        if (isDuplicate === true) {
            this.error5 = 'POS_DEVICES.VALID_NO_DUPLICATE_DRAWER_FIELD';
            this.updateTabs(1);
        }
    }
    /*---
      Pos Device related methods ends
    ---*/
    /*---
      Favorites related methods starts
    ---*/
    showFavoriteModal(favoriteslist) {
        this.ticketPreCate = '';
        this.ticketPrePromotionCate = '';
        this.ticketPreProCate = '';
        this.favoriteModal.show();
        this.ticketPreTypes = favoriteslist.type;
        this.types(this.ticketPreTypes);
        if (favoriteslist.type === 'Service') {
            this.ticketPreCate = favoriteslist.category + '$' + favoriteslist.color;
            this.categoryOfService(this.ticketPreCate);
        } else if (favoriteslist.type === 'Product') {
            this.ticketPreProCate = favoriteslist.category + '$' + favoriteslist.color;
            this.categoryOfProduct(this.ticketPreProCate);
        } else {
            this.ticketPrePromotionCate = favoriteslist.id;
            this.categoryOfPromotion(this.ticketPrePromotionCate);
        }
        if (favoriteslist.name === '') {
            this.add = 'Add';
            this.addToButton = true;
        } else {
            this.add = 'Update-' + favoriteslist.name;
            this.addToButton = false;
        }
        this.order = favoriteslist.order;
        this.setupTicketPreferencesService.ticketPreferencesTypes().subscribe(data => {
            this.ticketPreferencesTypes = data['ticketPreferenceTypes'];
        },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (JSON.parse(error['_body']).status) {
                    case '2033':
                        break;
                }
                if (statuscode === '2085' || statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            });
        this.serviceGroupsList = [];
        this.serviceList = [];
        this.productList = [];
        this.type = '';
        this.search = '';
        this.default = true;
        this.promotionColor = '#ffffff';
        this.favoriteId = favoriteslist.id;
    }
    getFavouritesData() {
        this.setupTicketPreferencesService.getFavourites()
            .subscribe(data => {
                this.favoritesList = data['result'];
            },
                error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (JSON.parse(error['_body']).status) {
                        case '2033':
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
    types(value) {
        this.typeValue = value;
        switch (value) {
            case 'Service':
                this.setupTicketPreferencesService.getServiceGroups('Service').subscribe(data => {
                    this.serviceGroupsList = data['result']
                        .filter(filterList => filterList.active && !filterList.isSystem);
                    this.type = 'Service';
                    this.default = false;
                },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
                                break;
                        }
                        if (statuscode === '2085' || statuscode === '2071') {
                            if (this.router.url !== '/') {
                                localStorage.setItem('page', this.router.url);
                                this.router.navigate(['/']).then(() => { });
                            }
                        }
                    });
                break;
            case 'Product':
                this.setupTicketPreferencesService.getProductLines('Product').subscribe(data => {
                    this.serviceGroupsList = data['result'];
                    this.type = 'Product';
                    this.default = false;
                },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
                                break;
                        }
                        if (statuscode === '2085' || statuscode === '2071') {
                            if (this.router.url !== '/') {
                                localStorage.setItem('page', this.router.url);
                                this.router.navigate(['/']).then(() => { });
                            }
                        }
                    });
                break;
            case 'Promotion':
                this.setupTicketPreferencesService.getProductLines('Promotion').subscribe(data => {
                    this.serviceGroupsList = data['result'];
                    this.type = 'Promotion';
                    this.default = false;
                },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
                                break;
                        }
                        if (statuscode === '2085' || statuscode === '2071') {
                            if (this.router.url !== '/') {
                                localStorage.setItem('page', this.router.url);
                                this.router.navigate(['/']).then(() => { });
                            }
                        }
                    });
                break;
        }
    }
    categoryOfService(value) {
        this.serviceName = value.split('$');
        this.serviceGroupName = this.serviceName[0];
        this.serviceGroupColor = this.serviceName[1];
        this.setupTicketPreferencesService.getServices(this.serviceGroupName).subscribe(data => {
            this.serviceList = data['result'];
            // this.favoriteId = this.serviceList[0].Id;
            this.type = 'Service';
            this.default = false;
        },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (JSON.parse(error['_body']).status) {
                    case '2033':
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
    onChangeServices(value) {
        this.favoriteId = value;
    }
    onChangeProducts(value) {
        this.favoriteId = value;
    }
    categoryOfProduct(value) {
        this.productLine = value.split('$');
        this.productLineId = this.productLine[0];
        this.productLineColor = this.productLine[1];
        this.setupTicketPreferencesService.getProducts(this.productLineId).subscribe(data => {
            this.productList = data['result'];
            this.type = 'Product';
            this.default = false;
        },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (JSON.parse(error['_body']).status) {
                    case '2033':
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
    categoryOfPromotion(value) {
        this.favoriteId = value;
    }
    addToFavorites() {
        if (this.type === 'Service') {
            this.color = this.serviceGroupColor;
            //   this.favoriteId = th
        } else if (this.type === 'Product') {
            this.color = this.productLineColor;
        } else if (this.type === 'Promotion') {
            this.color = this.promotionColor;
        }
        this.favoritesObj = {
            'favoriteId': this.favoriteId,
            'color': this.color,
            'type': this.typeValue
        },
            this.setupTicketPreferencesService.addToFavorites(this.order, this.favoritesObj)
                .subscribe(data => {
                    this.favortiesData = data['result'];
                    this.serviceGroupsList = [];
                    this.serviceList = [];
                    this.productList = [];
                    this.favoriteId = '';
                    this.color = '';
                    this.typeValue = '';
                    this.clearErrorMsg();
                    this.favoriteModal.hide();
                    this.getFavouritesData();
                },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
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
    getSearchList() {
        this.sku = this.skuString;
        this.setupTicketPreferencesService.getSearchProducts(this.sku).subscribe(data => {
            this.type = 'Product';
            this.search = 'Search';
            this.default = false;
            if (data.result.length === 1) {
                this.searchProductId = data['result'][0].Id;
                this.product = data['result'][0].Name;
                this.colorValue = data['result'][0].Color__c;
                this.searchProductObj = {
                    'favoriteId': this.searchProductId,
                    'color': this.colorValue,
                    'type': this.typeValue
                },
                    this.setupTicketPreferencesService.addToFavorites(this.order, this.searchProductObj)
                        .subscribe(data1 => {
                            this.favortiesData = data['result'];
                            this.serviceGroupsList = [];
                            this.serviceList = [];
                            this.productList = [];
                            this.clearErrorMsg();
                            this.favoriteModal.hide();
                            this.getFavouritesData();
                            this.singleProduct = true;
                            this.productSku = true;
                        },
                            error => {
                                const status = JSON.parse(error['status']);
                                const statuscode = JSON.parse(error['_body']).status;
                                switch (JSON.parse(error['_body']).status) {
                                    case '2033':
                                        break;
                                }
                                if (statuscode === '2085' || statuscode === '2071') {
                                    if (this.router.url !== '/') {
                                        localStorage.setItem('page', this.router.url);
                                        this.router.navigate(['/']).then(() => { });
                                    }
                                }
                            });
            } else {
                this.searchProductsList = data['result'];
                if (this.searchProductsList.length === 0) {
                    this.favouritError = 'No records found';
                }
                this.singleProduct = false;
            }
        },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (JSON.parse(error['_body']).status) {
                    case '2033':
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
    getSelectedProduct(value) {
        const products = value.split('$');
        this.selectedProduct = products[0];
        this.selectedProductColor = products[1];
    }
    select() {
        this.selectedProductObj = {
            'favoriteId': this.selectedProduct,
            'color': this.selectedProductColor,
            'type': this.typeValue
        },
            this.setupTicketPreferencesService.addToFavorites(this.order, this.selectedProductObj)
                .subscribe(data1 => {
                    this.favortiesData = data1['result'];
                    this.serviceGroupsList = [];
                    this.serviceList = [];
                    this.productList = [];
                    this.clearErrorMsg();
                    this.favoriteModal.hide();
                    this.getFavouritesData();
                    this.singleProduct = true;
                    this.productSku = true;
                },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
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
    closeModel() {
        this.favoriteModal.hide();
        this.favouritError = '';
    }
    cancelModel() {
        this.favoriteModal.hide();
        this.default = true;
        this.skuString = '';
        this.favouritError = '';
    }
    favoritesCancel() {
        this.favoriteModal.hide();
        this.router.navigate(['/setup']);
        // window.localStorage.setItem('title', 'Setup');
    }
    clearErrorMsg() {
        this.favouritError = '';
        // this.skuString = '';
        // this.serviceGroupsList = '';
    }
    /* method for routing  */
    commonCancel() {
        this.router.navigate(['/setup']);
        //    window.localStorage.setItem('title', 'Setup');
    }
    /*method for clearing error messages */
    clearmessage() {
        this.error = '';
        this.error1 = '';
        this.error2 = '';
        this.error3 = '';
        this.error5 = '';
        this.error6 = '';
        this.error7 = '';
    }
    /*method to save pos, pos device */
    commonSave() {
        // const ALPHA_REGEXP = /^[^\w\d]*(([0-9]+.*[A-Za-z]+.*)|[A-Za-z]+.*([0-9]+.*))$/;
        if (this.rows1) {
            this.rows = this.rows.concat(this.rows1);
        }
        this.rows1 = [];
        this.checkIfDrawerNumberExists(this.rows);
        for (let i = 0; i < this.rows.length; i++) {
            if (this.addServiceTax === undefined || this.addServiceTax === '') {
                this.addServiceTax = 0;
            } if (this.addRetailTax === undefined || this.addRetailTax === '') {
                this.addRetailTax = 0;
            }
            if (this.rows[i].drawerNumber === undefined || this.rows[i].drawerNumber === '') {
                this.error5 = 'POS_DEVICES.VALID_NOBLANK_DRAWER_FIELD';
                this.updateTabs(1);
            } if (this.rows[i].drawerNumber < 0 || this.rows[i].drawerNumber > 99) {
                this.error5 = 'POS_DEVICES.VALID_DRAWER_LIMIT';
                this.updateTabs(1);
            } if (this.rows[i].drawerName === undefined || this.rows[i].drawerName === '') {
                this.error6 = 'POS_DEVICES.VALID_NOBLANK_DRAWER_NAME';
                this.updateTabs(1);
            }
        }
        if (this.addServiceTax < 0 || this.addServiceTax > 99) {
            this.error = 'POS.DECIMAL_LIMIT';
            this.updateTabs(0);
        } else if (this.addRetailTax < 0 || this.addRetailTax > 99) {
            this.error1 = 'POS.DECIMAL_LIMIT';
            this.updateTabs(0);
            // } else if (this.addStoreTerminalID === undefined || this.addStoreTerminalID === '') {
            //     this.error2 = 'POS.VALID_NOBLANK_STORE_TERMINAL_ID';
            //     this.updateTabs(0);
            // } else if (this.addStoreTerminalID !== '' && !ALPHA_REGEXP.test(this.addStoreTerminalID)) {
            //     this.error2 = 'POS.VALID_STORE_TERMINAL_ID_NOT_VALID';
        } else if (this.addPaymentType === 'AnywhereCommerce' && this.addStoreTerminalID === '') {
            this.error2 = 'POS.VALID_NOBLANK_STORE_TERMINAL_ID';
            this.updateTabs(0);
        } else if (this.addStoreTerminalID !== '' && this.addStoreTerminalID.length < 7 || this.addStoreTerminalID.length > 8) {
            this.error2 = 'POS.VALID_STORAGE_TERMINAL_ID_LIMIT';
            this.updateTabs(0);
        } else if (this.addPaymentType === '---None---' && (this.addStoreTerminalID !== '' || this.addOnlineTerminalID !== '')) {
            this.error2 = 'POS.REQUIRED_PAYMENT_GATEWAY_POPULATEDBY_TERMINALID';
            this.updateTabs(0);
            // } else if (this.addOnlineTerminalID !== '' && (this.addPaymentType === '' || this.addPaymentType === undefined ||
            //     this.addPaymentType === '---None---')) {
            //     this.error3 = 'Payment Gateway is required if the Terminal ID is populated';
            // } else if (this.addOnlineTerminalID === undefined || this.addOnlineTerminalID === '') {
            //     this.error3 = 'POS.VALID_NOBLANK_ONLINE_TERMINAL_ID';
            //     this.updateTabs(0);
            // } else if (this.addOnlineTerminalID !== '' && !ALPHA_REGEXP.test(this.addOnlineTerminalID)) {
            //     this.error3 = 'POS.VALID_ONLINE_TERMINAL_ID_NOT_VALID';
        } else if (this.addOnlineTerminalID !== '' && this.addOnlineTerminalID.length < 7 || this.addOnlineTerminalID.length > 8) {
            this.error3 = 'POS.VALID_ONLINE_TERMINAL_ID_LIMIT';
            this.updateTabs(0);

            // } else if (this.addOnlineTerminalID !== '' && (this.addPaymentType === '' || this.addPaymentType === undefined ||
            // this.addPaymentType === '---None---'  )) {
            //     this.error3 = 'Payment Gateway is required if the Terminal ID is populated';
        } else if ((this.error5 === '' || this.error5 === 'undefined' || this.error5 === undefined) &&
            (this.error6 === '' || this.error6 === undefined || this.error6 === 'undefined')) {

            this.posDataObj = {
                'salesTax': {
                    'serviceTax': this.addServiceTax,
                    'retailTax': this.addRetailTax
                },
                'paymentGateway': {
                    'paymentType': this.addPaymentType,
                },
                'merchantInStore': {
                    'storeTerminalID': this.addStoreTerminalID,
                    'sharedSecret': this.addSharedSecret1,
                    'test': this.addTest1
                },
                'merchantOnline': {
                    'onlineTerminalID': this.addOnlineTerminalID,
                    'sharedSecret': this.addSharedSecret2,
                    'test': this.addTest2
                }
            };
            this.setupTicketPreferencesService.createPos(this.posDataObj)
                .subscribe(data => {
                    this.posData = data['result'];
                    this.router.navigate(['/setup']);
                }, error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (JSON.parse(error['_body']).status) {
                        case '2033':
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
            this.posDevicesDataObj = {
                'receiptMemo': this.addReceiptMemo,
                'cashDrawers': this.rows
            };
            this.setupTicketPreferencesService.createPosdevices(this.posDevicesDataObj)
                .subscribe(data => {
                    this.posDevicesDataObj = data['result'];
                    this.router.navigate(['/setup']);
                    this.rows = [];
                    this.getPosDevicesData();
                }, error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (JSON.parse(error['_body']).status) {
                        case '2033':
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

            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_SUCCESS');
            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
        } /* else if end here */
        // POS DEVICES
        /*storing data into local browser for desktop view */
        if (this.deviceInfo.device === 'unknown') {
            this.browserObject = {
                'CreditCardDevice': this.addCreditCardDevice,
                'CashDrawer': this.addCashDrawer,
                'ReceiptPrinter': this.addReceiptPrinter
            };
            window.localStorage.setItem('browserObject', JSON.stringify(this.browserObject));
        }
        const obj = localStorage.getItem('browserObject');

        /*storing data into local browser for device view */
        // if (this.deviceInfo.device === 'android' || this.deviceInfo.device === 'iphone' ||
        //     this.deviceInfo.device === 'ipad' || this.deviceInfo.device === 'windows-phone') {
        //     this.deviceObject = {
        //         'CreditCardDevice': this.addCreditCardDevice,
        //         'CashDrawer': this.addCashDrawer,
        //         'ReceiptPrinter': this.addReceiptPrinter
        //     };
        //     window.localStorage.setItem('deviceObject', JSON.stringify(this.deviceObject));
        // }
        // const obj1 = localStorage.getItem('deviceObject');
    }
    /* common save validations end here */
    getTab(param: String) {
        if (param === 'pos') {
            this.pos = true;
            this.posDevice = false;
            this.favorites = false;
        } else if (param === 'posdevice') {
            this.pos = false;
            this.posDevice = true;
            this.favorites = false;
        } else if (param === 'favorites') {
            this.pos = false;
            this.posDevice = false;
            this.favorites = true;
        }
    }
    updateTabs(order: number) {
        for (let i = 0; i < this.activeTab2.length; i++) {
            if (i === order) {
                this.activeTab2[i] = true;
                this.activeTabClass[i] = 'active';
            } else {
                this.activeTab2[i] = false;
                this.activeTabClass[i] = '';
            }
        }
    }
    alphaOnly(e) {
        const specialKeys = new Array();
        specialKeys.push(8); // Backspace
        specialKeys.push(9); // Tab
        specialKeys.push(46); // Delete
        specialKeys.push(36); // Home
        specialKeys.push(35); // End
        specialKeys.push(37); // Left
        specialKeys.push(39); // Right
        const keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
        const ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) ||
            (specialKeys.indexOf(e.keyCode) !== -1 && e.charCode !== e.keyCode));
        return ret;
    }
}

