import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { validateInputValue } from '../_helpers/commonvalidation.validator';

interface ValidatorFn {
    (control: FormControl): ValidationErrors | null
}

@Injectable()
export class ItemsformService {

    constructor(private formBuilder: FormBuilder) { }

    static validateNumber(control: FormControl): ValidationErrors {
        let decimalValue = 2;
        let regx = "^\\s*((\\d+(\\.\\d{0," + decimalValue + "})?)|((\\d*(\\.\\d{1," + decimalValue + "}))))\\s*$";
        if (!control.value) return null;
        if (control.value && !control.value.toString().match(regx)) {
            return { onlyNumberAllowed: 'Only numeric value with max decimal size ' + decimalValue };
        }
        return null;
    }


    static maxLength(maxLength): ValidatorFn {
        return (control: FormControl): ValidationErrors | null => {
            if (control.value && !isNaN(control.value)) {
                if (control.value.toString().length > maxLength) {
                    return { maxLengthExceded: 'Max Length allowed is ' + maxLength };
                }
            }
            return null;
        }
    }


    getBlankForm(customFieldList, obj?) {
        if (customFieldList)
            customFieldList = customFieldList.filter(ele => ele.displayLevel == "item");
        if(obj && obj.itemCode) {
            obj.itemCode = Number(obj.itemCode);
        }
        let formJson = {
            itemName: [obj ? obj.nvchabbrevdesc || obj.itemName : '', Validators.required],
            description: [obj ? obj.longdesc || obj.description : ''],
            revision: [obj && obj.revision ? obj.revision : ''],
            specification: [obj && obj.specification ? obj.specification : ''],
            specificationUrl: [obj && obj.specificationUrl ? obj.specificationUrl : ''],
            auctionID: [obj && obj.auctionID ? obj.auctionID : ''],
            minimumDesiredQuantity: [obj && obj.minimumDesiredQuantity ? obj.minimumDesiredQuantity : '', [Validators.required, ItemsformService.maxLength(13), ItemsformService.validateNumber]],
            unitOfMeasure: [obj && obj.unitOfMeasure ? obj.unitOfMeasure : (obj && obj.uomDesc ? obj.uomDesc : ''), [Validators.required]],
            reservedPrice: [obj && obj.reservedPrice ? obj.reservedPrice : null],
            reservedPriceDate: [obj && obj.reservedPriceDate ? obj.reservedPriceDate : null],
            historicalCost: [obj && obj.historicalCost ? obj.historicalCost : null, [ItemsformService.maxLength(14), ItemsformService.validateNumber]],
            historicalCostDate: [obj && obj.historicalCostDate ? obj.historicalCostDate : ''],
            lotType: [obj && obj.lotType ? obj.lotType : ''],
            lotID: [obj && obj.lotID ? obj.lotID : '', Validators.required],
            categoryID: [obj && obj.categoryID ? obj.categoryID : ''],
            startPrice: [obj && obj.startPrice ? obj.startPrice : null, [ItemsformService.validateNumber, ItemsformService.maxLength(14)]],
            minChangeType: [obj && obj.minChangeType ? obj.minChangeType : 'amount'],
            minimumChangeValue: [obj && obj.minimumChangeValue ? obj.minimumChangeValue : null, [ItemsformService.validateNumber, ItemsformService.maxLength(14)]],
            itemCode: [obj ? obj.itemCode || obj.sapcode : ''],
            remarks: [obj && obj.remarks ? obj.remarks : ''],
            fromMMCS: [obj && obj.fromMMCS ? true : false]
        }
        let custMap = new Map();
        if (obj && obj.customFieldData && obj.customFieldData.length > 0) {
            obj.customFieldData.forEach(field => {
                custMap.set(field.name, field.value);
            });
        }
        if (customFieldList && customFieldList.length > 0) {
            for (let x = 0; x < customFieldList.length; x++) {
                let { fieldName } = customFieldList[x]
                formJson[fieldName] = [custMap.get(fieldName), this.getcustfieldValidator(customFieldList[x])];
            }
        }
        return this.formBuilder.group(formJson, { validator: validateInputValue('minimumChangeValue', 'minChangeType', 'historicalCostDate', null) });
    }

    private getcustfieldValidator(customFieldObj) {
        if (customFieldObj.isMandatory && customFieldObj.dataType == 'number') {
            return [Validators.required, ItemsformService.validateNumber];
        }
        if (customFieldObj.isMandatory && customFieldObj.dataType == 'string') {
            return [Validators.required];
        }
        if (customFieldObj.dataType == 'number') {
            return [ItemsformService.validateNumber];
        }
        return [];
    }

    validateItemDetails(itemDetailObj, customFieldList) {
        let form = this.getBlankForm(customFieldList, itemDetailObj);
        if (form.invalid) {
            itemDetailObj.error = true;
        }
        if (form.valid) {
            delete itemDetailObj.error;
        }
        return form.value;
    }

    diableForm(createItemForm, customFieldData) {
        createItemForm.get('itemName').disable();
        createItemForm.get('description').disable();
        createItemForm.get('revision').disable();
        createItemForm.get('specification').disable();
        createItemForm.get('specificationUrl').disable();
        createItemForm.get('auctionID').disable();
        createItemForm.get('minimumDesiredQuantity').disable();
        createItemForm.get('unitOfMeasure').disable();
        createItemForm.get('reservedPrice').disable();
        createItemForm.get('reservedPriceDate').disable();
        createItemForm.get('lotType').disable();
        createItemForm.get('categoryID').disable();
        createItemForm.get('lotID').disable();
        createItemForm.get('startPrice').disable();
        createItemForm.get('minChangeType').disable();
        createItemForm.get('minimumChangeValue').disable();
        createItemForm.get('historicalCost').disable();
        createItemForm.get('historicalCostDate').disable();
        createItemForm.get('itemCode').disable();
        createItemForm.get('remarks').disable();
        if (customFieldData && customFieldData.length > 0) {
            for (let x = 0; x < customFieldData.length; x++) {
                if (createItemForm.get(customFieldData[x].name)) {
                    createItemForm.get(customFieldData[x].name).disable();
                }
            }
        }
    }

    makeFieldNull(formValue) {
        if (!formValue.historicalCost) formValue.historicalCost = null;
        if (!formValue.historicalCostDate) formValue.historicalCostDate = null;
        if (!formValue.itemCode) formValue.itemCode = null;
        if (!formValue.minimumChangeValue) formValue.minimumChangeValue = null;
        if (!formValue.startPrice) formValue.startPrice = null;
    }

    uomSearch(uomList, searchWord) {
        let uom = uomList.find(uomObj => {
            return uomObj.description.toLowerCase() == searchWord.toLowerCase() || uomObj.name.toLowerCase() == searchWord.toLowerCase();
        });
        return uom;
    }

    filterUomList(UomList_Master, filterWord) {
        filterWord = filterWord.toLowerCase();
        if (filterWord == 'kg') filterWord = 'kilogram';
        if (filterWord == 'mt') filterWord = 'ton';
        let tmpList = UomList_Master;
        if (filterWord) {
            tmpList = UomList_Master.filter(obj => {
                return obj.description.toLowerCase().indexOf(filterWord) > -1
            });
            let tmpList2 = []
            tmpList.forEach(ele => {
                let sortIndex = ele.description.toLowerCase().indexOf(filterWord)
                tmpList2.push({
                    ...ele,
                    sortIndex
                })
            })
            tmpList2.sort(
                function (a, b) {
                    if (a.sortIndex < b.sortIndex) {
                        return -1;
                    } else if (a.sortIndex > b.sortIndex) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            );
            tmpList = tmpList2;
        }

        return tmpList;
    }
}