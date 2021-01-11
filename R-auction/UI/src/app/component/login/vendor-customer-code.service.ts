import { Injectable } from "@angular/core";

@Injectable()
export class VendorCustomerCode  {

    getCodeDetails(result) {
        let vendorDetailList = [];
        let customerDetailList = [];

        result[0].forEach(obj => {
            if(obj.state && obj.state == "rejected") {
              vendorDetailList.push({vendorcode:  obj.reason.vendorcode})
            }
            if(obj.state && obj.state == "fulfilled") {
              vendorDetailList.push(obj.value.data);
            }
          });
          result[1].forEach(obj => {
            if(obj.state == "rejected") {
              customerDetailList.push({customerCode:  obj.reason.customerCode})
            } 
            if(obj.state && obj.state == "fulfilled") {
              customerDetailList.push(obj.value.data);
            }
        });
        return {vendorDetailList,  customerDetailList};
    }

}