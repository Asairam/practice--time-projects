import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function validateInputValue(minValueControlName: string, minTypeControlName: string
    , bidCushionControlName: string, bidCushionTypeControlName: string
) {
    return (formGroup: FormGroup) => {
        const minValueControl = formGroup.controls[minValueControlName];
        const minTypeControl = formGroup.controls[minTypeControlName];
        let cushionValueControl;
        if (bidCushionControlName && bidCushionControlName === 'historicalCostDate') {
            cushionValueControl = formGroup.controls[bidCushionControlName];
            if (new Date(cushionValueControl.value) > new Date()) {
                cushionValueControl.setErrors({ error: true });
            }
        } else {
            cushionValueControl = formGroup.controls[bidCushionControlName];
        }
        const cushionTypeControl = formGroup.controls[bidCushionTypeControlName];


        //Start validation for percentage of minimum bid value
        // if (minValueControl.errors && !minValueControl.errors.error){
        //     return;
        // }
        let decimalValue = 2;
        let regx = "^\\s*((\\d+(\\.\\d{0," + decimalValue + "})?)|((\\d*(\\.\\d{1," + decimalValue + "}))))\\s*$";
        if(minValueControl.value && !minValueControl.value.toString().match(regx))  {
            minValueControl.setErrors({ onlyNumberAllowed: 'Only numeric value accepted' });
        } else if( minValueControl.value && typeof(minValueControl.value) === 'number') {
                if(minValueControl.value.toString().length > 14) {
                    return { maxLengthExceded: 'Max Length allowed is ' + 14 };
                }
        } else if (minValueControl.value > 100 && minTypeControl.value == "percentage") {
            minValueControl.setErrors({ error: true });

        } else {
            if (minValueControl.value) {
                minValueControl.setErrors(null);
            }
        }
        //End

        //Start validation for dependent value of cushion
        // if (cushionValueControl.errors && !cushionValueControl.errors.error) {
        //     return;
        // }
        if (cushionValueControl && bidCushionControlName !== 'historicalCostDate' && cushionValueControl.value) {
            if (cushionTypeControl.value == "") {
                cushionTypeControl.setErrors({ error: true });
            }
            else {
                if (cushionValueControl.value > 100 && cushionTypeControl.value == "percentage") {
                    cushionValueControl.setErrors({ error: true });

                }
                else {
                    cushionTypeControl.setErrors(null);
                }
            }
        }
        else {
            if (cushionValueControl && bidCushionControlName !== 'historicalCostDate') {
                cushionTypeControl.setErrors(null);
            }
        }

        // if (cushionTypeControl.value != "") {
        //     if (!cushionValueControl.value) {
        //         cushionValueControl.setErrors({ error: true });
        //     }
        //     else {
        //         cushionValueControl.setErrors(null);
        //     }
        // }
        // else{
        //     cushionValueControl.setErrors(null);
        // }
        //End


    }
}