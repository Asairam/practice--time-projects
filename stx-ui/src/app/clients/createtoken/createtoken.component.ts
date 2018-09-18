import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateTokenService } from './createtoken.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import * as config from '../../app.config';
import { CommonService } from '../../common/common.service';
@Component({
    selector: 'app-create-token',
    templateUrl: './createtoken.html',
    providers: [CreateTokenService, CommonService],
    styleUrls: ['./createtoken.css']
})
export class CreateTokenComponent implements OnInit {
    clientId = '';
    checkboxFlag = false;
    clientName = '';
    mailStreet = '';
    mailCity = '';
    mailState = '';
    countriesList = [];
    mailCountry = '';
    mailZIP = '';
    cardNum = '';
    monthList = ['01 - January', '02 - February', '03 - March', '04 - April', '05 - May', '06 - June',
        '07 - July', '08 - August', '09 - September', '10 - October', '11 - November', '12 - December'];
    expMonth = 1;
    yearList = [];
    expYear = 0;
    cardCVV = '';
    swipePwd = '';
    clientInfo: any;
    clientObj: any;
    tokenbody: any;
    errorMsgAry = ['', '', '', '', '', '', '', ''];
    dummyClientName = 'STX';
    constructor(
        private activatedRoute: ActivatedRoute,
        private createTokenService: CreateTokenService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private router: Router,
        private http: HttpClient,
        private commonservice: CommonService) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.clientId = activatedRoute.snapshot.params['clientId'];
        });
    }

    ngOnInit() {
        this.getClientData();
        this.getCountriesList();
        this.createYearsList();
        // this.generateToken();
    }

    getClientData() {
        this.createTokenService.getClientData(this.clientId).subscribe(
            data => {
                this.clientInfo = data['result'].results[0];
                for (const key in this.clientInfo) {
                    if (this.clientInfo[key] === 'null' || this.clientInfo[key] === null || this.clientInfo[key] === 'undefined' || this.clientInfo[key] === undefined) {
                        this.clientInfo[key] = '';
                    }
                }
                this.clientName = this.clientInfo.FirstName + ' ' + this.clientInfo.LastName;
                // const displayName = document.getElementById('displayNameId');
                // displayName.innerHTML = 'Create Token - ' + this.clientName;
                this.mailStreet = this.clientInfo.MailingStreet;
                this.mailCity = this.clientInfo.MailingCity;
                this.mailCountry = this.clientInfo.MailingCountry;
                this.mailState = this.clientInfo.MailingState;
                this.mailZIP = this.clientInfo.MailingPostalCode;
            },
            error => {
                const errStatus = JSON.parse(error['_body'])['status'];
                if (errStatus === '2085' || errStatus === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            }
        );
    }

    getCountriesList() {
        this.createTokenService.getLookupsList('COUNTRIES').subscribe(
            data => {
                this.countriesList = data['result'];
            },
            error => {
                const errStatus = JSON.parse(error['_body'])['status'];
                if (errStatus === '2085' || errStatus === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            }
        );
    }

    createYearsList() {
        const curtYear = new Date().getFullYear();
        for (let i = 0; i < 10; i++) {
            this.yearList.push(curtYear + i);
        }
        this.expYear = this.yearList[0];
    }

    cancelCrtTkn() {
        this.router.navigate(['/client/edit/' + this.clientId]).then(() => { });
    }

    updateErrMsg(index: number) {
        this.errorMsgAry[index] = '';
    }

    saveCrtTkn() {
        const rtnVal = this.validateForm();
        if (rtnVal) {
            this.generateToken();
        }
    }

    validateForm() {
        let rtnVal = true;
        if (this.clientName === '') {
            const toastermessage: any = this.translateService.get('CREATE_TOKEN.VAL_MSG1');
            this.errorMsgAry[0] = toastermessage.value;
            rtnVal = false;
        }
        if (this.mailStreet === '') {
            const toastermessage: any = this.translateService.get('CREATE_TOKEN.VAL_MSG2');
            this.errorMsgAry[1] = toastermessage.value;
            rtnVal = false;
        }
        if (this.mailCity === '') {
            const toastermessage: any = this.translateService.get('CREATE_TOKEN.VAL_MSG3');
            this.errorMsgAry[2] = toastermessage.value;
            rtnVal = false;
        }
        if (this.mailCountry === '') {
            const toastermessage: any = this.translateService.get('CREATE_TOKEN.VAL_MSG4');
            this.errorMsgAry[3] = toastermessage.value;
            rtnVal = false;
        }
        if (this.mailState === '') {
            const toastermessage: any = this.translateService.get('CREATE_TOKEN.VAL_MSG5');
            this.errorMsgAry[4] = toastermessage.value;
            rtnVal = false;
        }
        if (this.mailZIP === '') {
            const toastermessage: any = this.translateService.get('CREATE_TOKEN.VAL_MSG6');
            this.errorMsgAry[5] = toastermessage.value;
            rtnVal = false;
        }
        if (this.cardNum === '') {
            const toastermessage: any = this.translateService.get('CREATE_TOKEN.VAL_MSG7');
            this.errorMsgAry[6] = toastermessage.value;
            rtnVal = false;
        } else if (!/^\+?(0|[1-9]\d*)$/.test(this.cardNum)) {
            const toastermessage: any = this.translateService.get('CREATE_TOKEN.VAL_MSG8');
            this.errorMsgAry[6] = toastermessage.value;
            rtnVal = false;
        }
        if (this.cardCVV === '') {
            const toastermessage: any = this.translateService.get('CREATE_TOKEN.VAL_MSG9');
            this.errorMsgAry[7] = toastermessage.value;
            rtnVal = false;
        } else if (!/^\+?(0|[1-9]\d*)$/.test(this.cardCVV)) {
            const toastermessage: any = this.translateService.get('CREATE_TOKEN.VAL_MSG10');
            this.errorMsgAry[7] = toastermessage.value;
            rtnVal = false;
        }
        if (!rtnVal) {
            const toastermessage: any = this.translateService.get('COMMON.ERROR_FORM_MSG');
            this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
        }
        return rtnVal;
    }

    generateToken() {
        let expmonth;
        if (this.expMonth.toString().length <= 1) {
            expmonth = '0' + this.expMonth;
        } else {
            expmonth = this.expMonth;
        }
        const d = new Date();
        const dateTime = ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2) + '-' +
            (d.getFullYear() + '').slice(-2) + ':' +
            ('00' + d.getHours()).slice(-2) + ':' +
            ('00' + d.getMinutes()).slice(-2) + ':' +
            ('00' + d.getSeconds()).slice(-2) + ':000';
        // calculate the MD5 hash format - TERMINALID+MERCHANTREF+DATETIME+CARDNUMBER+CARDEXPIRY+CARDTYPE+CARDHOLDERNAME+secret
        const hash = Md5.hashStr(config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID + this.clientId + dateTime + this.cardNum +
            expmonth + this.expYear.toString().substring(2) + this.determineCardType() + this.dummyClientName + config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_KEY);
        const clientData = {
            merchantref: this.clientId,
            terminalid: config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID,
            dateTime: dateTime,
            cardNum: this.cardNum,
            cardExp: expmonth + this.expYear.toString().substring(2),
            cardType: this.determineCardType(),
            cardHolName: this.dummyClientName,
            hash: hash,
            cvv: this.cardCVV
        };

        if (this.clientInfo.Credit_Card_Token__c === 'undefined' || this.clientInfo.Credit_Card_Token__c === null || this.clientInfo.Credit_Card_Token__c === '') {
            this.tokenbody = this.commonservice.createToken(clientData);
        } else if (this.clientInfo.Credit_Card_Token__c !== 'undefined' || this.clientInfo.Credit_Card_Token__c !== null || this.clientInfo.Credit_Card_Token__c !== '') {
            this.tokenbody = this.commonservice.updateToken(clientData);
        }
        const url = config.ANYWHERECOMMERCE_PAYMENT_API;
        const reqObj = {
            'url': url,
            'xml': this.tokenbody
        };
        this.createTokenService.xmlPayment(reqObj).subscribe(
            data => {
                let cardTokenId: any = '';
                const parseString = require('xml2js').parseString;
                parseString(data['result'], function (err, result) {
                    cardTokenId = result;
                });
                if (this.cardNum.toString().length < 12 && this.cardNum !== '' && this.cardNum.toString() !== '0') {
                    this.errorMsgAry[6] = 'Card number should allow 12 digits.';
                } else if ((cardTokenId.ERROR) && (!cardTokenId.SECURECARDUPDATERESPONSE || !cardTokenId.SECURECARDREGISTRATIONRESPONSE)) {
                    if ((cardTokenId.ERROR.ERRORSTRING[0].split(' ')[0] === cardTokenId.ERROR.ERRORSTRING[0].split(' ')[0] || this.cardNum.toString() === '0')
                        && (cardTokenId.ERROR.ERRORSTRING[0] !== 'INVALID CARDEXPIRY')) {
                        this.errorMsgAry[6] = 'INVALID CARDNUMBER';
                        this.errorMsgAry[8] = '';
                        this.toastr.error('INVALID CARDNUMBER', null, { timeOut: 3000 });
                    } else if (cardTokenId.ERROR.ERRORSTRING[0] === 'INVALID CARDEXPIRY') {
                        this.errorMsgAry[8] = 'INVALID CARDEXPIRY';
                        this.errorMsgAry[6] = '';
                        this.toastr.error('INVALID CARDEXPIRY', null, { timeOut: 3000 });
                    }
                } else if ((this.clientInfo.Credit_Card_Token__c === 'undefined' || this.clientInfo.Credit_Card_Token__c === null || this.clientInfo.Credit_Card_Token__c === '') &&
                    (!cardTokenId.ERROR)) {
                    parseString(data['result'], function (err, result) {
                        cardTokenId = result.SECURECARDREGISTRATIONRESPONSE.CARDREFERENCE[0];

                    });
                    this.insertToken(cardTokenId, expmonth);
                } else if ((this.clientInfo.Credit_Card_Token__c !== 'undefined' || this.clientInfo.Credit_Card_Token__c !== null || this.clientInfo.Credit_Card_Token__c !== '') &&
                    (!cardTokenId.ERROR)) {
                    parseString(data['result'], function (err, result) {
                        cardTokenId = result.SECURECARDUPDATERESPONSE.CARDREFERENCE[0];
                    });
                    this.insertToken(cardTokenId, expmonth);
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
                        } break;
                }
            }
        );



        // this.http.post(url, this.tokenbody, {
        //     headers: new HttpHeaders()
        //         .set('Content-Type', 'text/xml')
        //         .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
        //         .append('Access-Control-Allow-Origin', '*')
        //         .append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method')
        //     , responseType: 'text'
        // }).subscribe(data => {
        //     let cardTokenId: any = '';
        //     const parseString = require('xml2js').parseString;
        //     parseString(data, function (err, result) {
        //         cardTokenId = result;
        //     });
        //     if (this.cardNum.toString().length < 12 && this.cardNum !== '' && this.cardNum.toString() !== '0') {
        //         this.errorMsgAry[6] = 'Card number should allow 12 digits.';
        //     } else if ((cardTokenId.ERROR) && (!cardTokenId.SECURECARDUPDATERESPONSE || !cardTokenId.SECURECARDREGISTRATIONRESPONSE)) {
        //         if ((cardTokenId.ERROR.ERRORSTRING[0].split(' ')[0] === cardTokenId.ERROR.ERRORSTRING[0].split(' ')[0] || this.cardNum.toString() === '0')
        //             && (cardTokenId.ERROR.ERRORSTRING[0] !== 'INVALID CARDEXPIRY')) {
        //             this.errorMsgAry[6] = 'INVALID CARDNUMBER';
        //             this.errorMsgAry[8] = '';
        //         } else if (cardTokenId.ERROR.ERRORSTRING[0] === 'INVALID CARDEXPIRY') {
        //             this.errorMsgAry[8] = 'INVALID CARDEXPIRY';
        //             this.errorMsgAry[6] = '';
        //         }
        //     } else if ((this.clientInfo.Credit_Card_Token__c === 'undefined' || this.clientInfo.Credit_Card_Token__c === null || this.clientInfo.Credit_Card_Token__c === '') &&
        //         (!cardTokenId.ERROR)) {
        //         parseString(data, function (err, result) {
        //             cardTokenId = result.SECURECARDREGISTRATIONRESPONSE.CARDREFERENCE[0];

        //         });
        //         this.insertToken(cardTokenId, expmonth);
        //     } else if ((this.clientInfo.Credit_Card_Token__c !== 'undefined' || this.clientInfo.Credit_Card_Token__c !== null || this.clientInfo.Credit_Card_Token__c !== '') &&
        //         (!cardTokenId.ERROR)) {
        //         parseString(data, function (err, result) {
        //             cardTokenId = result.SECURECARDUPDATERESPONSE.CARDREFERENCE[0];
        //         });
        //         this.insertToken(cardTokenId, expmonth);
        //     }

        // }, (err: HttpErrorResponse) => {
        // });
    }
    insertToken(cardTokenId, expmonth) {
        this.clientObj = {
            'creditCardToken': cardTokenId,
            'tokenExpirationDate': expmonth + '/' + this.expYear.toString().substring(2) + ' (MM/YY)',
            'PaymentType': this.determineCardType(),
            'tokenPresent': 1
        };
        this.createTokenService.saveClient(this.clientId, this.clientObj).subscribe(
            res => {
                const clientInfoDetails = res['result'];
                this.router.navigate(['client/edit/' + this.clientId]).then(() => { });
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
    determineCardType() {
        let cardType = '';
        if (this.cardNum.toString().charAt(0) === '3') {
            cardType = 'AMEX';
        } else if (this.cardNum.toString().charAt(0) === '4') {
            cardType = 'VISA';
        } else if (this.cardNum.toString().charAt(0) === '5') {
            cardType = 'MASTERCARD';
        } else if (this.cardNum.toString().charAt(0) === '6') {
            cardType = 'DISCOVER';
        }
        return cardType;
    }
    getLocation() {
        if (this.mailZIP.length > 4) {
            this.http.get('https://ziptasticapi.com/' + this.mailZIP).subscribe(
                result => {
                    if (result['error']) {
                        const toastermessage: any = this.translateService.get('SETUPCOMPANY.ZIP_CODE_NOT_FOUND');
                        this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
                    } else {
                        if (result['country'] === 'US') {
                            this.mailCountry = 'United States';
                            config.states.forEach(state => {
                                if (state.abbrev === result['state']) {
                                    this.mailState = state.name;
                                }
                            });
                        }
                        const cityArray = result['city'].split(' ');
                        for (let i = 0; i < cityArray.length; i++) {
                            if (i === 0) {
                                this.mailCity = cityArray[i].charAt(0).toUpperCase() + cityArray[i].slice(1).toLowerCase() + ' ';
                            } else {
                                this.mailCity += cityArray[i].charAt(0).toUpperCase() + cityArray[i].slice(1).toLowerCase() + ' ';
                            }
                        }
                    }
                },
                error => {
                }
            );
        }
    }

    clearSwipe() {
        this.swipePwd = '';
        this.autofocusSwipe();
        this.toastr.info('Card data cleared', null, { timeOut: 3000 });
    }

    autofocusSwipe() {
        if (this.checkboxFlag) {
            setTimeout(() => {
                if (document.getElementById('swipeId')) {
                    const swipeField = <HTMLInputElement>document.getElementById('swipeId');
                    swipeField.focus();
                }
            }, 200);
        }
    }

    getCardDetails() {
        const details1 = this.swipePwd.split('^');
        // const card_number = details1[0];
        this.cardNum = details1[0].substring(2);
        // const names = details1[1].split('/');
        // const first_name = names[1];
        // const last_name = names[0];
        let details2 = details1[2].split(';');
        details2 = details2[1].split('=');
        const exp_date = details2[1];
        // exp_date = exp_date.substring(2, 4) + '/' + exp_date.substring(0, 2);
        this.expMonth = parseInt(exp_date.substring(2, 4), 10);
        this.expYear = parseInt('20' + exp_date.substring(0, 2), 10);
        this.cardCVV = '123';
        this.generateToken();
    }

}


// back up
// this.clientObj = {
//     'clientInfoActive': this.clientInfo.Active__c,
//     'clientInfoFirstName': this.clientInfo.FirstName,
//     'clientInfoMiddleName': this.clientInfo.MiddleName,
//     'clientInfoLastName': this.clientInfo.LastName,
//     'clientInfoMailingStreet': this.clientInfo.MailingStreet,
//     'clientInfoMailingCountry': this.clientInfo.MailingCountry,
//     'clientInfoPostalCode': this.clientInfo.MailingPostalCode,
//     'clientInfoMailingCity': this.clientInfo.MailingCity,
//     'clientInfoMailingState': this.clientInfo.MailingState,
//     'clientInfoPrimaryPhone': this.clientInfo.Phone,
//     'clientInfoMobilePhone': this.clientInfo.MobilePhone,
//     'clientInfoPrimaryMail': this.clientInfo.Email,
//     'clientInfoSecondaryEmail': this.clientInfo.Secondary_Email__c,
//     'clientInfoEmergName': this.clientInfo.Emergency_Name__c,
//     'clientInfoEmergPrimaryPhone': this.clientInfo.Emergency_Primary_Phone__c,
//     'clientInfoEmergSecondaryPhone': this.clientInfo.Emergency_Secondary_Phone__c,
//     'clientInfoNoEmail': this.clientInfo.No_Email__c,
//     'responsibleParty': this.clientInfo.Responsible_Party__c,
//     'gender': this.clientInfo.Gender__c,
//     'birthDay': this.clientInfo.BirthDateNumber__c,
//     'birthMonth': this.clientInfo.BirthMonthNumber__c,
//     'occupationvalue': this.clientInfo.Title,
//     'birthYear': this.clientInfo.BirthYearNumber__c,
//     'selectedFlags': this.clientInfo.Client_Flag__c,
//     'notes': this.clientInfo.Notes__c,
//     'referredBy': this.clientInfo.Referred_By__c,
//     'ReferedAFriendProspect': this.clientInfo.Refer_A_Friend_Prospect__c,
//     'referedOnDate': this.clientInfo.Referred_On_Date__c,
//     'marketingOptOut': this.clientInfo.Marketing_Opt_Out__c,
//     'marketingMobilePhone': this.clientInfo.Marketing_Mobile_Phone__c,
//     'marketingPrimaryEmail': this.clientInfo.Marketing_Primary_Email__c,
//     'marketingSecondaryEmail': this.clientInfo.Marketing_Secondary_Email__c,
//     'notificationMobilePhone': this.clientInfo.Notification_Mobile_Phone__c,
//     'notificationOptOut': this.clientInfo.Notification_Opt_Out__c,
//     'notificationPrimaryEmail': this.clientInfo.Notification_Primary_Email__c,
//     'notificationSecondaryEmail': this.clientInfo.Notification_Secondary_Email__c,
//     'reminderOptOut': this.clientInfo.Reminder_Opt_Out__c,
//     'reminderMobilePhone': this.clientInfo.Reminder_Mobile_Phone__c,
//     'reminderPrimaryEmail': this.clientInfo.Reminder_Primary_Email__c,
//     'reminderSecondaryEmail': this.clientInfo.Reminder_Secondary_Email__c,
//     'mobileCarrierName': this.clientInfo.Mobile_Carrier__c,
//     'clientImagePath': this.clientInfo.Client_Pic__c,
//     'noEmailAppt': this.clientInfo.BR_Reason_No_Email__c,
//     'accoutChargeBalance': this.clientInfo.BR_Reason_Account_Charge_Balance__c,
//     'depositRequired': this.clientInfo.BR_Reason_Deposit_Required__c,
//     'persistanceNoShow': this.clientInfo.BR_Reason_No_Show__c,
//     'other': this.clientInfo.BR_Reason_Other__c,
//     'otherReason': this.clientInfo.Booking_Restriction_Note__c,
//     'apptNotes': this.clientInfo.BR_Reason_Other_Note__c,
//     'bookingFrequency': this.clientInfo.Booking_Frequency__c,
//     'allowOnlineBooking': this.clientInfo.Allow_Online_Booking__c,
//     // 'hasStandingAppt': this.clientInfo.Has_Standing_Appts__c,
//     'pin': this.clientInfo.Pin__c,
//     'restrictionType': this.clientInfo.Booking_Restriction_Type__c,
//     'activeRewards': this.clientInfo.Active_Rewards__c,
//     'startingBalance': this.clientInfo.Starting_Balance__c,
//     'clientMemberShipId': this.clientInfo.Membership_ID__c,
//     'creditCardToken': cardTokenId,
//     'tokenExpirationDate': expmonth + '/' + this.expYear.toString().substring(2) + ' (MM/YY)',
//     'PaymentType': this.determineCardType(),
//     'tokenPresent': 1,
//     'CurrentBalance': this.clientInfo.Current_Balance__c,
//     'homePhone' : this.clientInfo.HomePhone
// };
