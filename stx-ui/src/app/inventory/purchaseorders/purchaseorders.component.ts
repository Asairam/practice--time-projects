import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { PurchaseOrderService } from './purchaseorders.service';
import { parse } from 'querystring';
import { CommonService } from '../../common/common.service';
import { Tooltip } from '../../../custommodules/primeng/primeng';
@Component({
    selector: 'app-home-popup',
    templateUrl: './purchaseorders.html',
    styleUrls: ['./purchaseorders.css'],
    providers: [PurchaseOrderService, CommonService]
})
export class PurchaseOrderComponent implements OnInit {
    public bsValue: any = Date();
    public receivedDate: any = new Date();
    recievedEnable = false;
    recievedBy: any;
    addDiv: any = false;
    editDiv: any = false;
    closedDiv: any = false;
    disableDiv = true;
    purchaseOrdersList: any;
    suppliersData: any;
    supplierName: any;
    note: any;
    productsList: any = [];
    resultDiv: any = false;
    searchKeyWord: any;
    disableSelect = false;
    productsListForSelect: any;
    selectSearchKeyWord: any;
    message: any;
    totalEstimatedOrderCost: any = 0;
    totalActualOrderCost: any = 0;
    showInactiveData: any;
    supplierId: any;
    updateId: any;
    editDataObj: any;
    showReceiveOrderedButton = false;
    error: any;
    error1: any;
    error2: any;
    ordrQtyErr: any;
    cosstErr: any;
    editOrdrQtyErr: any;
    editCostError: any;
    editCostEachCondErr: any;
    datePickerConfig: any;
    closedSupplierName: any;
    closedNote: any;
    closedOrederDate: any;
    closedRecievedDate = ['', ''];
    closedRecievedBy: any;
    closedestimatedCost: any;
    totalOrderCost: any;
    noResult: any;
    supId: any;
    orderDate: any;
    totalOrderCostEstimated = 0;
    prdListMdl = '';
    disabledClass = '';
    showCheck = false;
    selSupl = '';
    toastermessage: any;
    purchaseOrderId: any;
    estimateCost: any;
    searchError: any;
    trigger = true;
    constructor(private purchaseOrderService: PurchaseOrderService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private commonService: CommonService) {
        this.datePickerConfig = Object.assign({},
            {
                showWeekNumbers: false,
                containerClass: 'theme-blue',
            });
    }

    ngOnInit() {
        this.getPurchaseOrderListing();
        // this.getProductsList();
    }
    /*Method which is used to save purchase order data */
    saveOrders() {
        for (let i = 0; i < this.productsList.length; i++) {
            if (this.productsList[i]['orderQty'] < 0 || this.productsList[i]['orderQty'] === '' || this.productsList[i]['orderQty'] === undefined) {
                this.ordrQtyErr = 'PURCHASE_ORDERS.INAVLID_ORDER_QTY';
            } else if (this.productsList[i]['Standard_Cost__c'] < 0) {
                this.cosstErr = 'PURCHASE_ORDERS.INVALID_COST_EACH';
            }
        }
        if ((this.error === '' || this.error !== undefined || this.error !== 'undefined')
            && (this.ordrQtyErr === '' || this.ordrQtyErr === undefined) &&
            (this.cosstErr === '' || this.cosstErr === undefined)) {
            const dataObj = {
                'supplierId': this.supId,
                'notes': this.note,
                'orderDate': this.commonService.getDBDatTmStr(this.bsValue),
                'purchaseOrderDetailData': this.productsList,
                'totalEstimatedOrderCost': this.totalEstimatedOrderCost
            };
            if (this.trigger) {
                this.trigger = false;
                this.purchaseOrderService.saveData(dataObj).subscribe(
                    data => {
                        const purchaseOrdersData = data['result'];
                        this.addDiv = false;
                        this.editDiv = false;
                        this.closedDiv = false;
                        this.disableDiv = true;
                        this.disabledClass = '';
                        this.trigger = true;
                        this.getPurchaseOrderListing();
                    },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        this.trigger = true;
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
    }
    /*Method which is used to hide list table*/
    showList() {
        this.showInactiveData = !this.showInactiveData;
        this.showCheck = !this.showCheck;
    }
    /*Method which is used to display purchase order listing */
    getPurchaseOrderListing() {
        this.purchaseOrderService.getOrdersData().subscribe(
            data => {
                this.purchaseOrdersList = data['result'];
                this.disableDiv = true;
                this.addDiv = false;
                this.editDiv = false;
                this.closedDiv = false;
                this.disabledClass = '';
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
    /*Method which is used to show recieve enable button true*/
    recieveOrderdItems() {
        if (this.recievedEnable === false || this.recievedEnable === undefined) {
            this.recievedEnable = true;
            this.receivedDate = new Date();
            for (let j = 0; j < this.productsList.length; j++) {
                this.productsList[j]['Received_Quantity__c'] = this.productsList[j]['orderQty'];
            }
        } else if (this.recievedEnable === true && this.receivedDate !== '' && this.receivedDate !== undefined) {
            for (let j = 0; j < this.productsList.length; j++) {
                this.productsList[j]['Received_Quantity__c'] = this.productsList[j]['orderQty'];
            }
        }
    }
    /*Method which is used to update purchase order data */
    editData() {
        let date = this.commonService.getUTCDatTmStr(this.receivedDate);
        if (this.recievedEnable === false) {
            date = '';
            this.recievedBy = '';
            this.totalActualOrderCost = '';
        } else {
            date = this.commonService.getUTCDatTmStr(this.receivedDate);
        }
        if (this.receivedDate && this.recievedBy !== null) {
            this.recievedEnable = true;
        }
        for (let i = 0; i < this.productsList.length; i++) {
            if (!this.productsList[i]['action']) {
                this.productsList[i]['action'] = 'new';
            } else {
                delete this.productsList[i]['action'];
            }
            if (this.productsList[i]['orderQty'] < 0 || this.productsList[i]['orderQty'] === '' || this.productsList[i]['orderQty'] === undefined) {
                this.editOrdrQtyErr = 'PURCHASE_ORDERS.INAVLID_ORDER_QTY';
            } else if (this.productsList[i]['Standard_Cost__c'] < 0) {
                this.editCostError = 'PURCHASE_ORDERS.INVALID_COST_EACH';
            } else if (this.productsList[i]['Standard_Cost__c'] >= 999999.99) {
                this.editCostEachCondErr = 'PURCHASE_ORDERS.NO_VALID_COST_EACH';
            }
        }
        if (this.recievedEnable === true) {
            if (this.receivedDate === null || this.receivedDate === '' || this.receivedDate === undefined || this.receivedDate === 'undefined') {
                this.error2 = 'PURCHASE_ORDERS.NO_BLANK_RECIEVED_DATE';
                window.scrollTo(0, 0);
            } else if (date < this.orderDate) {
                this.error2 = 'PURCHASE_ORDERS.INVALID_RECIEVED_DATE';
                window.scrollTo(0, 0);
            } else if (this.recievedBy === null || this.recievedBy === '' || this.recievedBy === 'undefined' || this.recievedBy === undefined) {
                this.error1 = 'PURCHASE_ORDERS.NO_BLANK_RECIEVED_BY';
                window.scrollTo(0, 0);
            }
        }
        if ((this.editOrdrQtyErr === '' || this.editOrdrQtyErr === undefined) &&
            (this.editCostError === '' || this.editCostError === undefined) &&
            (this.editCostEachCondErr === '' || this.editCostEachCondErr === undefined) &&
            (this.error2 === '' || this.error2 === undefined) &&
            (this.error1 === '' || this.error1 === undefined)) {
            this.editDataObj = {
                'receivedDate': date,
                'receivedBy': this.recievedBy,
                'totalEstimatedOrderCost': this.totalEstimatedOrderCost,
                'totalActualOrderCost': this.totalActualOrderCost,
                'supplierId': this.supId,
                'notes': this.note,
                'purchaseOrderDetailData': this.productsList,
                'orderDate': this.orderDate,
            };
            this.purchaseOrderService.editPurchaseOrderData(this.updateId, this.editDataObj).subscribe(
                data => {
                    const receivedData = data['result'];
                    this.disableSelect = false;
                    this.getPurchaseOrderListing();
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
    /*Method which is used to display suppliers list */
    getSuppliers() {
        this.purchaseOrderService.getSuppliersData().subscribe(
            data => {
                this.suppliersData = data['result'].filter(
                    filterList => filterList.Active__c === 1);
                this.supplierName = this.suppliersData[0].Name;
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
    /*Method which is used to check unique data for supplier and order date */
    uniqnessWithSupplierAndOrderDate() {
        if (this.selSupl && this.selSupl !== '') {
            this.purchaseOrderService.checkIfSupplierAndOrderDateisExist(this.selSupl, this.commonService.getDBDatTmStr(this.bsValue)).subscribe(
                data => {
                    this.productsList = data.result;
                    const showDesc = [];
                    if (this.productsList.length > 0) {
                        this.productsList[0]['purchaseDesc'] = this.productsList[0]['supplierName'] + ';' + this.productsList[0]['Order_Date__c'];
                        showDesc.push(this.productsList[0]);
                    }
                    data.result.splice(0, 1);
                    data.result.forEach(element => {
                        const index = showDesc.findIndex((obj) => obj.Id === element.Id);
                        if (index === -1) {
                            element.purchaseDesc = element.supplierName + ' ; ' + element.Order_Date__c;
                            showDesc.push(element);
                        } else {
                            showDesc[index].purchaseDesc = showDesc[index].purchaseDesc + ', ' + element.supplierName + ' ; ' + element.Order_Date__c;
                        }
                    });
                    this.productsList = showDesc;
                    for (let i = 0; i < this.productsList.length; i++) {
                        if (this.productsList[i]['Order_Date__c'] !== null) {
                            this.productsList[i]['purchaseDesc'] = 'This item is being ordered on purchase order for' + ' ' + this.productsList[i]['purchaseDesc'];
                        }
                    }
                    this.updateTotOrdCst();
                    this.resultDiv = true;
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
                            this.error = 'PURCHASE_ORDERS.DUPLICATE_PRODUCT_DATA';
                            this.resultDiv = false;
                            this.productsList = [];
                            break;
                    }
                }
            );
        }
    }
    /*Method which is used to display purchase order data */
    showData(purchaseData) {
        // console.log(purchaseData)
        this.disabledClass = 'disabled';
        this.disableSelect = false;
        /* this.orderdate is used to send order date in getProductsSupplier() method to data based on order date*/
        this.updateId = purchaseData.Id;
        this.orderDate = purchaseData.Order_Date__c;
        // this.supplierId = purchaseData.Supplier__c;
        this.supId = purchaseData.Supplier__c;
        if (purchaseData.Status__c === 'Open') {
            this.addDiv = false;
            this.editDiv = true;
            this.disableDiv = false;
            this.resultDiv = true;
            this.showReceiveOrderedButton = true;
            this.supplierId = purchaseData.Supplier__c;
            this.supplierName = purchaseData.supplierName;
            this.note = purchaseData.Note__c;
            const tempDtAry = purchaseData.Order_Date__c.split('-');
            this.bsValue = new Date(tempDtAry[0], parseInt(tempDtAry[1], 10) - 1, tempDtAry[2]);
            this.recievedBy = purchaseData.Received_By__c;
            this.receivedDate = purchaseData.Received_Date__c;
            if (purchaseData.Estimated_Cost__c === null) {
                this.totalEstimatedOrderCost = 0;
            } else {
                this.totalEstimatedOrderCost = purchaseData.Estimated_Cost__c;
                this.estimateCost = this.totalEstimatedOrderCost;
            }
            if (purchaseData.Total_Cost__c === null) {
                this.totalActualOrderCost = 0;
            } else {
                this.totalActualOrderCost = purchaseData.Total_Cost__c;
            }
        } else if (purchaseData.Status__c === 'Closed') {
            this.closedSupplierName = purchaseData.supplierName;
            this.closedNote = purchaseData.Note__c;
            this.closedOrederDate = purchaseData.Order_Date__c;
            // this.closedRecievedDate = purchaseData.Received_Date__c;
            this.closedRecievedDate = this.commonService.getUsrDtStrFrmDBStr(purchaseData.Received_Date__c);
            this.closedRecievedBy = purchaseData.Received_By__c;
            this.closedestimatedCost = purchaseData.Estimated_Cost__c;
            if (purchaseData.Total_Cost__c === 0) {
                this.totalOrderCost = '';
            } else {
                this.totalOrderCost = purchaseData.Total_Cost__c;
            }
            this.supplierId = purchaseData.Supplier__c;
            this.closedDiv = true;
            this.addDiv = false;
            this.resultDiv = false;
            this.disableDiv = false;
            this.editDiv = false;
            this.showReceiveOrderedButton = false;
        } else {
            this.showReceiveOrderedButton = true;
        }
        this.getPurchaseOrderListBasedOnSupplier(this.updateId);
    }
    /*Method which is used to display purchase order list based on supplier */
    getPurchaseOrderListBasedOnSupplier(purchageOrderId) {
        this.purchaseOrderService.getProductsSupplier(purchageOrderId).subscribe(
            data => {
                this.productsList = data['result'];
                for (let i = 0; i < this.productsList.length; i++) {
                    this.productsList[i]['action'] = 'edit';
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
    /*Method which is used to display data by using Product SKU */
    getProductsBySupplier() {
        if (this.searchKeyWord === '' || this.searchKeyWord === undefined || this.searchKeyWord === 'undefined') {
            // this.disableSelect = true;
            // this.getProductsList();
            this.searchError = 'PURCHASE_ORDERS.NOBLANK_SEARCH_FIELD';
        } else {
            this.purchaseOrderService.getProductsBySKU(this.searchKeyWord, this.supId).subscribe(
                data => {
                    if (data.result.length === 0) {
                        this.disableSelect = false;
                        this.searchKeyWord = '';
                        this.message = 'PURCHASE_ORDERS.NO_VALID_PRODUCT';
                    } else if (data.result.length === 1) {
                        this.searchKeyWord = '';
                        this.disableSelect = false;
                        const duplicate = this.checkProduct(this.productsList, data['result'][0]);
                        if (!duplicate) {
                            this.productsList.push(data['result'][0]);
                        } else {
                            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.DUPLICATE_RECORD');
                            this.toastr.warning(this.toastermessage.value, null, { timeOut: 1500 });
                        }
                    } else {
                        this.disableSelect = true;
                        this.productsListForSelect = data.result;
                        this.prdListMdl = this.productsListForSelect[0]['Product_Code__c'];
                    }
                    this.updateTotOrdCst();
                },
                error => {
                    this.disableSelect = false;
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
    searchOnSelect() {
        const test = this.prdListMdl;
        const temp = this.productsListForSelect.filter(function (a) { return a['Product_Code__c'] === test; });
        const duplicate = this.checkProduct(this.productsList, temp[0]);
        if (!duplicate) {
            this.productsList.push(temp[0]);
            this.searchKeyWord = '';
            this.updateTotOrdCst();
        } else {
            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.DUPLICATE_RECORD');
            this.toastr.warning(this.toastermessage.value, null, { timeOut: 1500 });
        }
    }
    /*Method which is used to remove product list*/
    removeOne(index) {
        this.productsList.splice(index, 1);
        this.updateTotOrdCst();
    }
    /*Method which is used to remove  all product list */
    removeAll() {
        this.productsList = [];
        this.clearErrMsg();
        this.totalEstimatedOrderCost = '';
    }
    productOnChange(value) {
        this.selectSearchKeyWord = value;
        // this.supplierName = '';
    }
    /*Method which is used display all product list */
    getProductsList() {
        this.purchaseOrderService.getProducts(this.supId).subscribe(
            data => {
                this.productsListForSelect = data['result'];
                // this.selectSearchKeyWord = this.productsListForSelect[0].Product_Code__c;
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
    /*Method which is used to change suppliers list */
    onChangeSuppliers(value) {
        if (value !== '-') {
            this.supId = value;
            this.resultDiv = true;
        } else {
            this.resultDiv = false;
        }
    }
    /*Method which is used to  dispaly add div */
    addNew() {
        this.addDiv = true;
        this.editDiv = false;
        this.disableDiv = false;
        this.closedDiv = false;
        this.getSuppliers();
        this.bsValue = new Date();
        this.productsList = [];
        this.disabledClass = 'disabled';
        this.clearErrMsg();
        this.selSupl = '';
        this.note = '';
    }
    /*Method which is used to changes  */
    cancel() {
        this.disableDiv = true;
        this.addDiv = false;
        this.editDiv = false;
        this.closedDiv = false;
        this.clear();
        this.disabledClass = '';
        this.disableSelect = false;
        this.searchKeyWord = '';
        this.clearErrMsg();

    }
    /*Method which is used to clear error msgs */
    clearErrMsg() {
        this.error = '';
        this.error1 = '';
        this.error2 = '';
        this.message = '';
        this.ordrQtyErr = '';
        this.cosstErr = '';
        this.editOrdrQtyErr = '';
        this.editCostError = '';
        this.editCostEachCondErr = '';
        this.searchError = '';
    }
    /*Method which is used to clear data */
    clear() {
        this.note = '';
        this.bsValue = '';
        this.receivedDate = '';
        this.totalEstimatedOrderCost = 0;
        this.productsList = [];
        this.resultDiv = false;
        this.recievedEnable = false;
    }
    /*Method which is used to change order date */
    orderDateChange() {
        setTimeout(() => this.uniqnessWithSupplierAndOrderDate(), 200);
    }
    /*Method which is used to check products ar unique or not */
    checkProduct(prdAry, prdObj) {
        for (let i = 0; i < prdAry.length; i++) {
            if (prdAry[i]['Id'] === prdObj['Id']) {
                return true;
            }
        }
        return false;
    }
    /*Method which is used to calculate estimated cost */
    updateTotOrdCst() {
        this.totalEstimatedOrderCost = 0;
        // productData.Standard_Cost__c * productData.orderQty
        for (let i = 0; i < this.productsList.length; i++) {
            this.totalEstimatedOrderCost += (this.productsList[i]['Standard_Cost__c'] * this.productsList[i]['orderQty']);
        }
    }
    /* method to restrict charecters  */
    keyPress(event: any) {
        const pattern = /^[0-9A-Za-z]*$/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
}
