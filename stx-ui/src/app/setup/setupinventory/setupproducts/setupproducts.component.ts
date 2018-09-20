/*---
    Setup product component having following methods:
    * ngOnInit(): This method is used for on page load
    * saveProducts(): This method is used to save products
    * getProductDetails(): This method is used to get product details
    * getProductLineDetails(): This method is used to get product line details
    * getSuppliersData(): This method is used to get suppliers data
    * showData(productListvalues): This method is used to show data
    * editProductData(): This method is used to update product data
    * selectSuppliers(): This method is used to select suppliers
    * deleteFieldValue(index): This method is used to delete fields with index
    * deleteFieldValue2(index): This method is used to delete fields with index
    * getInactiveRecords(value): This method is used to get inactive records
    * addNew(): This method is used to add new product
    * cancel(): This method is used to cancel previous changes
    * clear(): This method is used to clear fields
    * clearErrMsg(): This method is used to clear error messages
---*/
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SetupProductsService } from './setupproducts.service';
@Component({
    selector: 'app-setupproducts-popup',
    templateUrl: './setupproducts.html',
    styleUrls: ['./setupproducts.css'],
    providers: [SetupProductsService]
})
export class SetupProductsComponent implements OnInit {
    inActive: any;
    addDiv = false;
    editDiv = false;
    hideTable = true;
    disableDiv = true;
    toastermessage: any;
    productActive: any;
    productName: any;
    productSKU: any;
    size: any;
    productPic: File;
    fileName: any = 'No File Choosen';
    productPicToShow = '';
    productUnitOfMeasure: any;
    productLine: any;
    inventoryGroup: any;
    taxable: any;
    professional: any;
    price: any;
    standardCost: any;
    averageCostQuantityOnHand: any;
    supplierMinimum: any;
    minimumQuantity: any;
    supplier: any;
    updatedId: any;
    updatedProductActive: any;
    updatedProductName: any;
    updatedProductSKU: any;
    updatedSize: any;
    updatedProductUnitOfMeasure: any;
    updatedProductLine: any;
    updatedInventoryGroup: any;
    updatedTaxable: any;
    updatedProfessional: any;
    updatedPrice: any;
    updatedStandardCost: any = 0;
    averageCost: any;
    updatedAverageCostQuantityOnHand: any;
    updatedSupplierMinimum: any;
    updatedMinimumQuantity: any;
    productData: any = {};
    productEditData: any = {};
    productDetails: any;
    productDataListing: any;
    productLineDataListing: any;
    error: any;
    errorMinimum: any;
    suppliers = [];
    inventoryGroups: any;
    groupValue: any;
    groupName: any;
    changeGrpTax: any = [];
    supplierData: any;
    unitOfMeasure: any;
    unitOfMeasureValue: any;
    productLineValue: any;
    productSupplierData: any;
    updatedSuppliers: any;
    productLineId: any;
    inventoryGroupName: any;
    storeProdLineId: any;
    storeInventoryGroupName: any;
    editStoreprodlineId: any;
    editStoreInventoryGrpName: any;
    groupTaxable = 0;
    deleteSuppliers = [];
    statuscode: any;
    type = '';
    activeFalse: any;
    constructor(private setupProductsService: SetupProductsService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private router: Router,
        @Inject('defaultType') public defaultType: string,
        @Inject('apiEndPoint') private apiEndPoint: string) {
    }
    /*--- Method used for on page load ---*/
    ngOnInit() {
        this.supplierMinimum = 1;
        this.addDiv = true;
        this.editDiv = false;
        this.disableDiv = false;
        this.getProductLineDetails(1);
        this.getSuppliersData();
    }
    averageVal() {
        this.averageCost = 0;
        if (this.updatedStandardCost && this.updatedStandardCost !== '') {
            this.averageCost = parseInt(this.updatedStandardCost, 10);
        } else {
            this.averageCost = parseFloat(this.standardCost);
            // this.averageCost = parseInt(this.standardCost, 10);
        }
    }
    selectFile(fileEvent) {
        this.productPic = fileEvent.target.files[0];
        this.fileName = this.productPic.name;
        // this.clientPictureFileView = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.clientPictureFile));
    }
    /*--- Method used to save products ---*/
    saveProducts() {
        if (this.productName === '' || this.productName === undefined || this.productName === 'undefined') {
            this.error = 'SETUP_INVENTORY_PRODUCTS.VALID_NOBLANK_PRODUCT_NAME';
        } else if (this.productSKU === '' || this.productSKU === undefined || this.productSKU === 'undefined') {
            this.error = 'SETUP_INVENTORY_PRODUCTS.VALID_NOBLANK_SKU';
        } else if (this.size === '' || this.size === undefined || this.size === 'undefined') {
            this.error = 'SETUP_INVENTORY_PRODUCTS.VALID_NOBLANK_SIZE';
        } else if (this.size < 0 || this.price < 0 || this.standardCost < 0) {
            this.error = 'SETUP_INVENTORY_PRODUCTS.SIZE_PRICE_STANDARD_COST_POSITIVE';
        } else if (this.supplierMinimum === 0) {
            this.errorMinimum = 'SETUP_INVENTORY_PRODUCTS.SUPPLIER_MINIMUM_NOT_ZERO';
        } else if (this.supplierMinimum === '' || this.supplierMinimum === null || this.supplierMinimum === undefined) {
            // this.errorMinimum = 'SETUP_INVENTORY_PRODUCTS.SUPPLIER_MINIMUM_EMPTY';
            this.supplierMinimum = 1;
        } else {
            if (this.productActive === true) {
                this.productActive = 1;
            }
            if (this.productActive === false) {
                this.productActive = 0;
            }
            if (this.productActive === undefined) {
                this.productActive = 0;
            }
            if (this.taxable === true) {
                this.groupTaxable = 1;
            }
            if (this.taxable === false) {
                this.groupTaxable = 0;
            }
            // if (this.taxable === undefined) {
            //     this.taxable = 1;
            // }
            if (this.professional === true) {
                this.professional = 1;
            }
            if (this.professional === false) {
                this.professional = 0;
            }
            if (this.professional === undefined) {
                this.professional = 1;
            }
            if (this.inventoryGroup === undefined) {
                this.inventoryGroup = this.groupName[0].inventoryGroups;
            }
            if (this.productUnitOfMeasure === undefined) {
                this.productUnitOfMeasure = '';
            }
            if (this.productLine === undefined) {
                this.productLine = this.productLineDataListing[0].Id;
            }
            this.productData.productActive = this.productActive;
            this.productData.productName = this.productName;
            this.productData.productSKU = this.productSKU;
            this.productData.size = this.size;
            this.productData.productUnitOfMeasure = this.productUnitOfMeasure;
            this.productData.productLine = this.productLineId;
            this.productData.inventoryGroup = this.inventoryGroupName;
            this.productData.taxable = this.groupTaxable;
            this.productData.professional = this.professional;
            this.productData.price = this.price;
            this.productData.standardCost = this.standardCost;
            this.productData.averageCostQuantityOnHand = this.averageCostQuantityOnHand;
            this.productData.supplierMinimum = this.supplierMinimum;
            this.productData.minimumQuantity = this.minimumQuantity;
            // this.productData.fileName = this.productPic;
            this.productData.suppliers = this.suppliers;
            this.productData.suppliers = this.productData.suppliers.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.supId === thing.supId
                ))
            );
            this.setupProductsService.saveProductData(this.productData, this.productPic)
                .subscribe(
                    data => {
                        this.productDetails = data['data'];
                        const toastermessage: any = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_PRODUCT_SUCCESS');
                        this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
                        this.productLineId = this.storeProdLineId;
                        this.inventoryGroupName = this.storeInventoryGroupName;
                        this.getProductDetails();
                        this.disableDiv = true;
                        this.hideTable = true;
                        this.addDiv = false;
                        this.editDiv = false;
                        this.errorMinimum = '';
                        this.clear();
                    },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;

                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2043':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
    /*---  Method used to get product details ---*/
    getProductDetails() {
        this.addDiv = false;
        this.editDiv = false;
        this.disableDiv = true;
        this.setupProductsService.getProducts(this.inActive, this.productLineId,
            this.inventoryGroupName)
            .subscribe(data => {
                this.productDataListing = data['result'];
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
    /*--- Method used to get product line details ---*/
    getProductLineDetails(type) {
        this.setupProductsService.getProductlines(type)
            .subscribe(data => {
                this.productLineDataListing = data['result'];
                if (!this.productLineId) {
                    this.productLineId = this.productLineDataListing[0].Id;
                }
                this.setupProductsService.getInventoryGroups(this.productLineId)
                    .subscribe(data2 => {
                        this.inventoryGroups = data2['result'];
                        this.unitOfMeasure = this.inventoryGroups[0].Units_of_Measure__c;
                        this.unitOfMeasureValue = JSON.parse(this.unitOfMeasure);
                        this.productUnitOfMeasure = this.unitOfMeasureValue[0]['unitOfMeasures'];
                        this.groupValue = this.inventoryGroups[0].Groups__c;
                        this.groupName = JSON.parse(this.groupValue);
                        if (!this.inventoryGroupName) {
                            this.inventoryGroupName = this.groupName[0].inventoryGroups;
                        }
                        this.setupProductsService.getTaxableByInventoryGroups(this.inventoryGroupName)
                            .subscribe(taxableData => {
                                const taxable = taxableData['result'];
                                this.changeGrpTax = taxableData['result'];
                                const temp = taxable.filter(
                                    filterList => filterList.inventoryGroupName === this.inventoryGroupName);
                                if (temp && temp.length > 0) {
                                    this.groupTaxable = temp[0].taxable;
                                }
                            },
                                error1 => {
                                    const errStatus = JSON.parse(error1['_body'])['status'];
                                    if (errStatus === '2085' || errStatus === '2071') {
                                        if (this.router.url !== '/') {
                                            localStorage.setItem('page', this.router.url);
                                            this.router.navigate(['/']).then(() => { });
                                        }
                                    }
                                });
                        this.getProductDetails();
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
            });
    }
    /* below method is used to change inventory group from left table and to get taxable of that grp */
    onChangeGrpTax() {
        const temp = this.changeGrpTax;
        for (let i = 0; i < temp.length; i++) {
            if (this.inventoryGroupName === temp[i]['inventoryGroupName']) {
                this.groupTaxable = temp[i]['taxable'];
            }
        }
    }
    /*--- Method used to get suppliers data ---*/
    getSuppliersData() {
        const type = false;
        this.setupProductsService.getSuppliers(type)
            .subscribe(data => {
                this.supplierData = data['result'].filter(
                    filterList => filterList.Active__c === 1);
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
    /*--- Method used to get group fields for listing ---*/
    getGroupFieldsForListing(value) {
        this.productLine = value;
        this.updatedProductLine = value;
        this.setupProductsService.getInventoryGroups(value)
            .subscribe(data => {
                this.inventoryGroups = data['result'];
                this.inventoryGroupName = this.inventoryGroups[0].Id;
                this.unitOfMeasure = this.inventoryGroups[0].Units_of_Measure__c;
                this.unitOfMeasureValue = JSON.parse(this.unitOfMeasure);
                this.groupValue = this.inventoryGroups[0].Groups__c;
                this.groupName = JSON.parse(this.groupValue);
                this.inventoryGroupName = this.groupName[0].inventoryGroups;
                const groupNameTax = this.groupName[0].inventoryGroups;
                this.setupProductsService.getTaxableByInventoryGroups(groupNameTax)
                    .subscribe(taxableData => {
                        const taxable = taxableData['result'];
                        this.groupTaxable = taxable.filter(
                            filterList => filterList.inventoryGroupName === groupNameTax)[0].taxable;
                    },
                        error1 => {
                            const errStatus = JSON.parse(error1['_body'])['status'];
                            if (errStatus === '2085' || errStatus === '2071') {
                                if (this.router.url !== '/') {
                                    localStorage.setItem('page', this.router.url);
                                    this.router.navigate(['/']).then(() => { });
                                }
                            }
                        });
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
    /*--- Method to get line fields for listing ---*/
    getLineFieldsForListing(value) {
        this.inventoryGroup = value;
        this.updatedInventoryGroup = value;
        this.setupProductsService.getTaxableByInventoryGroups(value)
            .subscribe(data => {
                const taxable = data['result'];
                this.groupTaxable = taxable[0].taxable;
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
    /*--- Method to get unit of measures ---*/
    getunitOfMeasure(value) {
        this.productUnitOfMeasure = value;
        this.updatedProductUnitOfMeasure = value;
    }
    /*--- Method to get product line for listing ---*/
    getProductLineForListing(value) {
        this.productLineId = value;
        // this.productLineId = '';
        // this.inventoryGroupName = '';
        this.productLineId = value;
        this.setupProductsService.getInventoryGroups(this.productLineId)
            .subscribe(data2 => {
                this.inventoryGroups = data2['result'];
                this.unitOfMeasure = this.inventoryGroups[0].Units_of_Measure__c;
                this.unitOfMeasureValue = JSON.parse(this.unitOfMeasure);
                this.groupValue = this.inventoryGroups[0].Groups__c;
                this.groupName = JSON.parse(this.groupValue);
                this.inventoryGroupName = this.groupName[0].inventoryGroups;
                this.getProductDetails();
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
    /*--- Method to get group name for listing ---*/
    getGroupNameForListing(value) {
        this.inventoryGroupName = value;
        this.setupProductsService.getProducts(this.inActive, this.productLineId,
            value)
            .subscribe(data => {
                this.productDataListing = data['result'];
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
    /*--- Method to save and get add new record ---*/
    saveAndNew() {
        this.activeFalse = this.productActive;
        if (this.productName === '' || this.productName === undefined || this.productName === 'undefined') {
            this.error = 'SETUP_INVENTORY_PRODUCTS.VALID_NOBLANK_PRODUCT_NAME';
        } else if (this.productSKU === '' || this.productSKU === undefined || this.productSKU === 'undefined') {
            this.error = 'SETUP_INVENTORY_PRODUCTS.VALID_NOBLANK_SKU';
        } else if (this.size === '' || this.size === undefined || this.size === 'undefined') {
            this.error = 'SETUP_INVENTORY_PRODUCTS.VALID_NOBLANK_SIZE';
        } else if (this.size < 0 || this.price < 0 || this.standardCost < 0) {
            this.error = 'SETUP_INVENTORY_PRODUCTS.SIZE_PRICE_STANDARD_COST_POSITIVE';
        } else if (this.supplierMinimum === 0) {
            this.errorMinimum = 'SETUP_INVENTORY_PRODUCTS.SUPPLIER_MINIMUM_NOT_ZERO';
        } else if (this.supplierMinimum === '' || this.supplierMinimum === null || this.supplierMinimum === undefined) {
            this.errorMinimum = 'SETUP_INVENTORY_PRODUCTS.SUPPLIER_MINIMUM_EMPTY';
        } else {
            if (this.productActive === true) {
                this.productActive = 1;
            }
            if (this.productActive === false) {
                this.productActive = 0;
            }
            if (this.productActive === undefined) {
                this.productActive = 0;
            }
            if (this.taxable === true) {
                this.groupTaxable = 1;
            }
            if (this.taxable === false) {
                this.groupTaxable = 0;
            }
            // if (this.taxable === undefined) {
            //     this.taxable = 1;
            // }
            if (this.professional === true) {
                this.professional = 1;
            }
            if (this.professional === false) {
                this.professional = 0;
            }
            if (this.professional === undefined) {
                this.professional = 1;
            }
            if (this.inventoryGroup === undefined) {
                this.inventoryGroup = this.groupName[0].inventoryGroups;
            }
            if (this.productUnitOfMeasure === undefined) {
                this.productUnitOfMeasure = '';
            }
            if (this.productLine === undefined) {
                this.productLine = this.productLineDataListing[0].Id;
            }
            this.productData.productActive = this.productActive;
            this.productData.productName = this.productName;
            this.productData.productSKU = this.productSKU;
            this.productData.size = this.size;
            this.productData.productUnitOfMeasure = this.productUnitOfMeasure;
            this.productData.productLine = this.productLineId;
            this.productData.inventoryGroup = this.inventoryGroupName;
            this.productData.taxable = this.groupTaxable;
            this.productData.professional = this.professional;
            this.productData.price = this.price;
            this.productData.standardCost = this.standardCost;
            this.productData.averageCostQuantityOnHand = this.averageCostQuantityOnHand;
            this.productData.supplierMinimum = this.supplierMinimum;
            this.productData.minimumQuantity = this.minimumQuantity;
            this.productData.suppliers = this.suppliers;
            this.productData.suppliers = this.productData.suppliers.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.supId === thing.supId
                ))
            );
            this.setupProductsService.saveProductData(this.productData, this.productPic)
                .subscribe(
                    data => {
                        this.productDetails = data['data'];
                        const toastermessage: any = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_PRODUCT_SUCCESS');
                        this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
                        this.productLineId = this.storeProdLineId;
                        this.inventoryGroupName = this.storeInventoryGroupName;
                        this.getProductDetails();
                        this.disableDiv = false;
                        this.hideTable = false;
                        this.editDiv = false;
                        this.addDiv = true;
                        this.errorMinimum = '';
                        this.clear();
                        this.productActive = this.activeFalse;
                        this.supplierMinimum = 1;
                        this.suppliers = [];
                    },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;

                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2043':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
    /*--- Method to show data ---*/
    showData(productListvalues) {
        this.setupProductsService.getProductlines(this.inActive)
            .subscribe(data => {
                this.productLineDataListing = data['result'];
                // this.productLineId = this.productLineDataListing[0].Id;
                this.setupProductsService.getInventoryGroups(this.productLineId)
                    .subscribe(data2 => {
                        this.inventoryGroups = data2['result'];
                        this.unitOfMeasure = this.inventoryGroups[0].Units_of_Measure__c;
                        this.unitOfMeasureValue = JSON.parse(this.unitOfMeasure);
                        this.updatedProductUnitOfMeasure =  this.unitOfMeasureValue[0]['unitOfMeasures'];
                        this.groupValue = this.inventoryGroups[0].Groups__c;
                        this.groupName = JSON.parse(this.groupValue);
                        // this.inventoryGroupName = this.groupName[0].inventoryGroups;
                    },
                        error1 => {
                            const errStatus = JSON.parse(error1['_body'])['status'];
                            if (errStatus === '2085' || errStatus === '2071') {
                                if (this.router.url !== '/') {
                                    localStorage.setItem('page', this.router.url);
                                    this.router.navigate(['/']).then(() => { });
                                }
                            }
                        });
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
        this.productLineValue = this.productLineDataListing[0].Id;
        this.setupProductsService.getInventoryGroups(this.productLineValue)
            .subscribe(data => {
                this.inventoryGroups = data['result'];
                this.unitOfMeasure = this.inventoryGroups[0].Units_of_Measure__c;
                this.unitOfMeasureValue = JSON.parse(this.unitOfMeasure);
                this.groupValue = this.inventoryGroups[0].Groups__c;
                this.groupName = JSON.parse(this.groupValue);
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
        this.type = 'edit';
        this.updatedId = productListvalues.Id;
        this.updatedProductActive = productListvalues.Active__c;
        this.updatedProductName = productListvalues.Name;
        this.updatedProductSKU = productListvalues.Product_Code__c;
        if (productListvalues.Size__c) {
            this.updatedSize = productListvalues.Size__c.toFixed(2);
        }
        this.updatedProductUnitOfMeasure = productListvalues.Unit_of_Measure__c;
        this.updatedProductLine = productListvalues.Product_Line__c;
        this.updatedInventoryGroup = productListvalues.Inventory_Group__c;
        this.updatedTaxable = productListvalues.Taxable__c;
        this.updatedProfessional = productListvalues.Professional__c;
        if (productListvalues.Price__c) {
            this.updatedPrice = productListvalues.Price__c.toFixed(2);
        }
        if (productListvalues.Standard_Cost__c) {
            this.updatedStandardCost = productListvalues.Standard_Cost__c.toFixed(2);
        }
        this.averageCost = productListvalues.Average_Cost__c;
        this.updatedAverageCostQuantityOnHand = productListvalues.Quantity_On_Hand__c;
        this.updatedSupplierMinimum = productListvalues.Supplier_Minimum__c;
        this.updatedMinimumQuantity = productListvalues.Minimum_Quantity__c;
        if (productListvalues.Product_Pic__c) {
            this.productPicToShow = this.apiEndPoint + '/' + productListvalues.Product_Pic__c + '?time=' + new Date().getTime();
        } else {
            this.productPicToShow = 'assets/images/side-icon4.png';
        }
        this.setupProductsService.getProductSuppliersData(this.updatedId)
            .subscribe(
                data => {
                    this.suppliers = data['result'];
                    this.suppliers = this.suppliers.filter((thing, index, self) =>
                        index === self.findIndex((t) => (
                            t.supId === thing.supId
                        ))
                    );
                },
                error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;

                    switch (JSON.parse(error['_body']).status) {
                        case '2033':
                            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                            break;
                        case '2038':
                            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                            break;
                    }
                    if (statuscode === '2085' || statuscode === '2071') {
                        if (this.router.url !== '/') {
                            localStorage.setItem('page', this.router.url);
                            this.router.navigate(['/']).then(() => { });
                        }
                    }
                });
        this.editStoreprodlineId = this.productLineId;
        this.editStoreInventoryGrpName = this.inventoryGroupName;
        this.addDiv = false;
        this.editDiv = true;
        this.disableDiv = false;
        this.hideTable = false;
        this.setupProductsService.deleteProduct(this.updatedId, this.type, this.updatedProductName).subscribe(data => {
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
    }
    deleteProductLine() {
        this.type = 'delete';
        this.setupProductsService.deleteProduct(this.updatedId, this.type, this.updatedProductName)
            .subscribe(data => {
                this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
                this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                this.disableDiv = true;
                this.hideTable = true;
                this.addDiv = false;
                this.editDiv = false;
                this.getProductDetails();
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
    /*--- Method to edit product data ---*/
    editProductData() {
        // let temp;
        // temp = this.productSupplierData;
        // this.updatedSuppliers = temp.concat(this.suppliers);
        if (this.updatedProductName === '' || this.updatedProductName === undefined || this.updatedProductName === 'undefined') {
            this.error = 'SETUP_INVENTORY_PRODUCTS.VALID_NOBLANK_PRODUCT_NAME';
        } else if (this.updatedProductSKU === '' || this.updatedProductSKU === undefined || this.updatedProductSKU === 'undefined') {
            this.error = 'SETUP_INVENTORY_PRODUCTS.VALID_NOBLANK_SKU';
        } else if (this.updatedSize === '' || this.updatedSize === undefined || this.updatedSize === 'undefined') {
            this.error = 'SETUP_INVENTORY_PRODUCTS.VALID_NOBLANK_SIZE';
        } else if (this.updatedSize < 0 || this.updatedPrice < 0 || this.updatedStandardCost < 0) {
            this.error = 'SETUP_INVENTORY_PRODUCTS.SIZE_PRICE_STANDARD_COST_POSITIVE';
        } else if (this.updatedSupplierMinimum === 0) {
            this.errorMinimum = 'SETUP_INVENTORY_PRODUCTS.SUPPLIER_MINIMUM_NOT_ZERO';
        } else if (this.updatedSupplierMinimum === '' || this.updatedSupplierMinimum === null || this.updatedSupplierMinimum === undefined) {
            this.errorMinimum = 'SETUP_INVENTORY_PRODUCTS.SUPPLIER_MINIMUM_EMPTY';
        } else {
            if (this.updatedProductActive === true) {
                this.updatedProductActive = 1;
            }
            if (this.updatedProductActive === false) {
                this.updatedProductActive = 0;
            }
            if (this.updatedProductActive === undefined) {
                this.updatedProductActive = 1;
            }
            if (this.updatedTaxable === true) {
                this.updatedTaxable = 1;
            }
            if (this.updatedTaxable === false) {
                this.updatedTaxable = 0;
            }
            if (this.updatedTaxable === undefined) {
                this.updatedTaxable = 1;
            }
            if (this.updatedProfessional === true) {
                this.updatedProfessional = 1;
            }
            if (this.updatedProfessional === false) {
                this.updatedProfessional = 0;
            }
            if (this.updatedProfessional === undefined) {
                this.updatedProfessional = 1;
            }
            this.productEditData.productActive = this.updatedProductActive;
            this.productEditData.productName = this.updatedProductName;
            this.productEditData.productSKU = this.updatedProductSKU;
            this.productEditData.size = this.updatedSize;
            this.productEditData.productUnitOfMeasure = this.updatedProductUnitOfMeasure;
            this.productEditData.productLine = this.updatedProductLine;
            this.productEditData.inventoryGroup = this.inventoryGroupName;
            this.productEditData.taxable = this.updatedTaxable;
            this.productEditData.professional = this.updatedProfessional;
            this.productEditData.price = this.updatedPrice;
            this.productEditData.standardCost = this.updatedStandardCost;
            this.productEditData.averageCostQuantityOnHand = this.updatedAverageCostQuantityOnHand;
            this.productEditData.supplierMinimum = this.updatedSupplierMinimum;
            this.productEditData.minimumQuantity = this.updatedMinimumQuantity;
            this.productEditData.suppliers = this.suppliers;
            this.productEditData.deleteSuppliers = this.deleteSuppliers;
            this.productEditData.suppliers = this.suppliers;
            this.productEditData.suppliers = this.productEditData.suppliers.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.supId === thing.supId
                ))
            );
            this.setupProductsService.editProductData(this.updatedId, this.productEditData, this.productPic)
                .subscribe(
                    data => {
                        this.productDetails = data['data'];
                        const toastermessage: any = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_PRODUCT_UPDATE_SUCCESS');
                        this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
                        this.disableDiv = true;
                        this.hideTable = true;
                        this.addDiv = false;
                        this.editDiv = false;
                        this.supplierData = '';
                        this.productSupplierData = '';
                        // this.ngOnInit();
                        this.getSuppliersData();
                        this.errorMinimum = '';
                        this.clear();
                        this.productLineId = this.editStoreprodlineId;
                        this.inventoryGroupName = this.editStoreInventoryGrpName;
                        this.getProductLineDetails(this.inActive);
                    },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;

                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2043':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
    /*--- Method to select suppliers ---*/
    selectSuppliers() {
        this.suppliers.push({ psId: '', supId: this.supplierData[0].Id });
    }

    /*--- Method to assign suppliers on change of suppliers ---*/
    onChangeSuppliers(value, i) {
        this.suppliers[i]['supId'] = value;
    }
    /*--- Method to delete field values with index ---*/
    // deleteFieldValue(productSupplierdata, index) {
    deleteFieldValue(supplier, index) {
        this.deleteSuppliers.push(supplier);
        this.suppliers.splice(index, 1);
    }
    /*--- Method to delete field values with index ---**/
    // deleteFieldValue2(index) {
    //     this.setupProductsService.deleteSuppliers(index)
    //         .subscribe(data => {
    //             this.productSupplierData.splice(index, 1);
    //             this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
    //             this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
    //         }, error => {
    //             // const status = JSON.parse(error['status']);
    //             // this.statuscode = JSON.parse(error['_body']).status;
    //         });
    // }
    /*--- Method to get inactive records ---*/
    getInactiveRecords(value) {
        if (value.target.checked === true) {
            this.inActive = 0;
            this.getProductLineDetails(this.inActive);
            this.getProductLineForListing(this.productLineDataListing[0].Id);
        } else {
            this.inActive = 1;
            this.getProductLineDetails(this.inActive);
            this.getProductLineForListing(this.productLineDataListing[0].Id);
        }
        this.setupProductsService.getProducts(this.inActive, this.productLineId,
            this.inventoryGroupName)
            .subscribe(data => {
                this.productDataListing = data['result'];
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
    /*--- Method to add new record ---*/
    addNew() {
        this.productActive = true;
        this.suppliers = [];
        this.supplierMinimum = 1;
        // this.productLineValue = this.productLineDataListing[0].Id;
        /**
         * Commented for Temporarly by ramesh, i think it is not required here
         */
        // this.setupProductsService.getInventoryGroups(this.productLineValue)
        //     .subscribe(data => {
        //         this.inventoryGroups = data['result'];
        //         this.unitOfMeasure = this.inventoryGroups[0].Units_of_Measure__c;
        //         this.unitOfMeasureValue = JSON.parse(this.unitOfMeasure);
        //         this.groupValue = this.inventoryGroups[0].Groups__c;
        //         this.groupName = JSON.parse(this.groupValue);
        //     });
        this.storeProdLineId = this.productLineId;
        this.storeInventoryGroupName = this.inventoryGroupName;
        this.hideTable = false;
        this.addDiv = true;
        this.disableDiv = false;
    }
    /*--- Method to cancel previous changes ---*/
    cancel() {
        this.addDiv = false;
        this.editDiv = false;
        this.hideTable = true;
        this.disableDiv = true;
        this.error = '';
        this.errorMinimum = '';
        this.suppliers = [];
        this.averageCost = '';
        this.standardCost = '';
        this.updatedPrice = '';
        this.updatedStandardCost = '';
        this.groupTaxable = 0;
        this.fileName = 'No File Choosen';
    }
    /*--- Method to clear fields ---*/
    clear() {
        this.productActive = '';
        this.productName = '';
        this.productSKU = '';
        this.size = '';
        this.productUnitOfMeasure = '';
        this.productLine = '';
        this.inventoryGroup = '';
        this.taxable = '';
        this.professional = '';
        this.price = '';
        this.standardCost = '';
        this.averageCostQuantityOnHand = '';
        this.supplierMinimum = '';
        this.error = '';
        this.errorMinimum = '';
        this.averageCost = 0;
        this.productPic = undefined;
        this.fileName = 'No File Choosen';
        this.productPicToShow = '';
        this.minimumQuantity = '';
        this.updatedPrice = '';
        this.updatedStandardCost = '';
    }
    /*--- Method to clear error message ---*/
    clearErrMsg() {
        this.error = '';
        this.errorMinimum = '';
    }
}
