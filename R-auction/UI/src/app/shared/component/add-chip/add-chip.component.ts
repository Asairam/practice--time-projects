import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonService } from '../../../commonService/common.service';
@Component({
  selector: 'app-add-chip',
  templateUrl: './add-chip.component.html',
  styleUrls: ['./add-chip.component.css']
})
export class AddChipComponent implements OnInit {

  @Input() disabled;
  public separatorKeysCodes = [ENTER, COMMA];
  @Input() emailList = [];
  removable = true;
  rulesForm: FormGroup;
  fb: FormBuilder = new FormBuilder();
  constructor(public common: CommonService) { }


  ngOnInit() {
    this.rulesForm = this.fb.group({
      emails: this.fb.array([], [this.validateArrayNotEmpty]),
    });
  }

  private validateArrayNotEmpty(c: FormControl) {
    if (c.value && c.value.length === 0) {
      return {
        validateArrayNotEmpty: { valid: false }
      };
    }
    return null;
  }

  add(event): void {
    if (event.value) {
      if (this.validateEmail(event.value)) {
        this.emailList.push({ value: event.value, invalid: false });
      } else {
        this.emailList.push({ value: event.value, invalid: true });
        this.rulesForm.controls['emails'].setErrors({ 'incorrectEmail': true });
      }
    }
    if (event.input) {
      event.input.value = '';
    }
  }


  removeEmail(data: any): void {
    if (this.emailList.indexOf(data) >= 0) {
      this.emailList.splice(this.emailList.indexOf(data), 1);
      this.rulesForm.controls['emails'].setErrors(null);
    }
  }

  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }




}
