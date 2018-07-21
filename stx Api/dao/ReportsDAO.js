/**
 * Importing required modules
 */
var logger = require('../lib/logger');
var config = require('config');
var uniqid = require('uniqid');
var moment = require('moment');
var execute = require('../db_connection/db');
var sequential = require("sequential-ids");
var dateFns = require('./../common/dateFunctions');

module.exports = {
    getTicketReports: function (req, done) {
        try {
            var searchData = req.body;
            if (searchData.search === 'betweenDate') {
                var sqlQuery = 'SELECT a.*, CONCAT(c.FirstName, " ", c.LastName)as FullName, pt.Name as paymentType ,ts.Net_Price__c as servicePrice, tp.Net_Price__c as productPrice, tto.Amount__c as otherAmount, '
                    + '(ts.Net_Price__c + tp.Net_Price__c + tto.Amount__c) as Total '
                    + ' FROM `Appt_Ticket__c` as a JOIN Contact__c as c on c.Id = a.`Client__c` '
                    + ' JOIN Ticket_Service__c as ts on ts.Appt_Ticket__c = a.Id '
                    + ' JOIN Ticket_Product__c as tp on tp.Appt_Ticket__c = a.Id '
                    + ' JOIN Ticket_Other__c as tto on tto.Ticket__c = a.Id '
                    + 'JOIN Ticket_Payment__c as tpt on tpt.Appt_Ticket__c = a.Id '
                    + ' JOIN Payment_Types__c as pt on pt.Id = tpt.Payment_Type__c WHERE `Appt_Date_Time__c` BETWEEN "' + searchData.startDate.split(' ')[0] + '" AND "' + searchData.endDate.split(' ')[0] + '" GROUP BY a.Id';
            } else if (searchData.search === 'todayDate') {
                var sqlQuery = 'SELECT a.*, CONCAT(c.FirstName, " ", c.LastName)as FullName, pt.Name as paymentType ,ts.Net_Price__c as servicePrice, tp.Net_Price__c as productPrice, tto.Amount__c as otherAmount, '
                    + '(ts.Net_Price__c + tp.Net_Price__c + tto.Amount__c) as Total '
                    + ' FROM `Appt_Ticket__c` as a JOIN Contact__c as c on c.Id = a.`Client__c` '
                    + ' JOIN Ticket_Service__c as ts on ts.Appt_Ticket__c = a.Id '
                    + ' JOIN Ticket_Product__c as tp on tp.Appt_Ticket__c = a.Id '
                    + ' JOIN Ticket_Other__c as tto on tto.Ticket__c = a.Id '
                    + 'JOIN Ticket_Payment__c as tpt on tpt.Appt_Ticket__c = a.Id '
                    + ' JOIN Payment_Types__c as pt on pt.Id = tpt.Payment_Type__c WHERE `Appt_Date_Time__c` = "' + searchData.todayDate.split(' ')[0] + '" GROUP BY a.Id';
            }
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in reports dao - getreportsData:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in reports dao - getreportsData:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getCashInOutRecords: function (req, done) {
        try {
            var searchData = req.body;
            if (searchData.search === 'betweenDate') {
                var sqlQuery = 'SELECT * FROM `Cash_In_Out__c` WHERE `CreatedDate` BETWEEN "' + searchData.startDate.split(' ')[0] + '" AND "' + searchData.endDate.split(' ')[0] + '"';
            } else if (searchData.search === 'todayDate') {
                var sqlQuery = 'SELECT * FROM `Cash_In_Out__c` WHERE `CreatedDate` = "' + searchData.todayDate.split(' ')[0] + '"';
            }
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in reports dao - getCashInOutRecords:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in reports dao - getCashInOutRecords:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getDailyCashDrawerRecords: function (req, done) {
        try {
            var sqlQuery = 'SELECT Cash_Drawer_Number__c as Drawer, Cash_Drawer__c as DrawerName, Opening_Cash__c as OpeningCash, Closing_Cash__c as ClosingCash, Cash_Over_Under__c as CashOverUnder, Date__c as date,Status__c as Status  FROM `Daily_Cash__c` WHERE `Date__c`= "' + req.params.seledate + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in reports dao - getDailyCashDrawerRecords:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in reports dao - getDailyCashDrawerRecords:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getServiceSalesRecords: function (req, done) {
        var serviceSalesObj = [];
        try {
            if (req.body.type === 'Company') {
                getServicesCountAndSalesByDateRange(req.body.begindate, req.body.enddate, req.body.worker, function (err, data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i]['serviceCount'] > 0) {
                            var averageSales = data[i]['serviceTotal'] / data[i]['serviceCount'];
                        } else {
                            averageSales = 0;
                        }
                        serviceSalesObj.push({
                            'serviceCount': data[i]['serviceCount'],
                            'totalSales': data[i]['serviceTotal'],
                            'guestCharge': data[i]['guestCharge'],
                            'serviceGroup': data[i]['serviceGroup'],
                            'serviceName': data[i]['serviceName'],
                            'averageSales': averageSales
                        });
                    }
                });
            } else {
                getServicesCountAndSalesByDateRange(req.body.begindate, req.body.enddate, req.body.worker, function (err, data) {
                    for (var i = 0; i < data.length; i++) {
                        var averageSales = data[i]['serviceTotal'] / data[i]['serviceCount'];
                        serviceSalesObj.push({
                            'serviceCount': data[i]['serviceCount'],
                            'totalSales': data[i]['serviceTotal'],
                            'guestCharge': data[i]['guestCharge'],
                            'serviceGroup': data[i]['serviceGroup'],
                            'serviceName': data[i]['serviceName'],
                            'averageSales': averageSales
                        });
                    }
                });
            }
        } catch (err) {
            logger.error('Unknown error in reports dao - getDailyCashDrawerRecords:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getDailyTotalSheetRecords: function (req, done) {
        var index1 = 0;
        var index2 = 0;
        var workerSalesObj = [];
        var companySalesObj = [];
        var salesType = ['Service Sales', 'Service Refunds', 'Product Sales', 'Product Refunds', 'Gift Sales'
            , 'Gift Sales Online', 'Gift Redemption', 'Membership Sales', 'Package Sales', 'Prepaid Package Usage'
            , 'Misc Sales', 'Totals'];
        for (var i = 0; i < salesType.length; i++) {
            companySalesObj.push({
                'salesType': salesType[i],
                'fullPrice': 0,
                'discounts': 0,
                'discountedSales': 0,
                'taxTotal': 0
            });
        }
        prdData = [];
        tipsData = [];
        getServiceSales(req.params.begindate, req.params.enddate, function (err, data) {
            for (var i = 0; i < data.length; i++) {
                var duplicate = checkWorker(workerSalesObj, data[i]['workerId']);
                if (duplicate[0]) {
                    workerSalesObj[duplicate[1]]['serviceSales'] += data[i]['servicesales'];
                    workerSalesObj[duplicate[1]]['guestCharge'] += data[i]['guestCharge'];
                    workerSalesObj[duplicate[1]]['serviceTax'] += data[i]['servicetax'];
                    workerSalesObj[duplicate[1]]['totalSales'] += data[i]['totalSales'];
                } else {
                    workerSalesObj.push({
                        'workerName': data[i]['workerName'],
                        'serviceSales': data[i]['servicesales'],
                        'guestCharge': data[i]['guestCharge'],
                        'serviceTax': data[i]['servicetax'],
                        'displayOrder': data[i]['Display_Order__c'],
                        'workerId': data[i]['workerId'],
                        'productSales': 0,
                        'totalSales': data[i]['servicesales'],
                        'tipLeftInDrawer': 0,
                        'tipPaidOut': 0,
                        'totalTips': 0
                    });
                }
                if (data[i]['isRefund']) {
                    companySalesObj[1]['fullPrice'] += data[i]['servicesales'];
                } else {
                    companySalesObj[0]['fullPrice'] += data[i]['servicesales'];
                    console.log('else --------', data[i]['isRefund']);
                }
            }
            index1++
            addProductSales(index1, workerSalesObj, prdData, tipsData, companySalesObj, index2, done)
        });
        getProductSales(req.params.begindate, req.params.enddate, function (err, data) {
            prdData = data;
            index1++;
            addProductSales(index1, workerSalesObj, prdData, tipsData, companySalesObj, index2, done);
        });
        getTips(req.params.begindate, req.params.enddate, function (err, data) {
            tipsData = data;
            index1++;
            addProductSales(index1, workerSalesObj, prdData, tipsData, companySalesObj, index2, done);
        });



        // try {
        //     var serviceSales = 0.00;
        //     var servicePrice = 0.00;
        //     var serviceTax = 0.00;
        //     var guestCharge = 0.00;
        //     var discountedSales = 0.00;
        //     var fullPrice = 0.00;
        //     var taxTotal = 0.00;
        //     var workerSalesDTO = {};
        //     var companySalesDTO = {};
        //     var workerDisplayOrderMap = {};
        //     var accountBalanceDTO = {};
        //     var paymentLine = {};
        //     var grandTotalLine = {};
        //     var workerSalesObj = [];
        //     query = 'SELECT FirstName, id, Display_Order__c from User__c order by case when Display_Order__c is null then 1 else 0 end, Display_Order__c,CONCAT(FirstName, "  ",LastName), CreatedDate asc';
        //     execute.query(query, function (error, userResults) {
        //         if (error) {
        //             logger.error('Error in getting getWorkerDetail: ', error);
        //             done(error, userResults);
        //         } else {
        //             getServiceSales(req.params.begindate, req.params.enddate, function (err, data) {
        //                 for(var i=0; i<data.length; i++) {
        //                     workerSalesObj.push({
        //                         'workerName': data[i]['workerName'],
        //                         'serviceSales': data[i]['servicesales'],
        //                         'guestCharge': data[i]['guestCharge'],
        //                         'serviceTax': data[i]['servicetax'],
        //                         'displayOrder': data[i]['Display_Order__c']
        //                     });
        //                 }
        //                 console.log(workerSalesObj);
        //                 for (var i = 0; i < data.length; i++) {
        //                     if (data[i].servicetax === null) {
        //                         serviceTax = 0;
        //                     } else {
        //                         serviceTax = data[i].servicetax;
        //                     }
        //                     workerSalesDTO.serviceSales += data[i].servicesales;
        //                     workerSalesDTO.workerName += data[i].workerName;
        //                     if (data[i].Display_Order__c === null)
        //                         workerSalesDTO.displayOrder = 0;
        //                     else
        //                         workerSalesDTO.displayOrder = data[i].Display_Order__c;

        //                     workerSalesDTO.totalSales = workerSalesDTO.serviceSales;

        //                     companySalesDTO.discountedSales += data[i].servicesales;
        //                     companySalesDTO.fullPrice += data[i].serviceprice;
        //                     companySalesDTO.taxTotal += serviceTax;
        //                     if (data[i].isRefund) {
        //                         companySalesDTO.salesType = 'Service Refunds';
        //                         companySalesDTO.displaySalesType = 'Service Refunds';
        //                         companySalesDTO.fullPrice = data[i].servicesales;
        //                     }
        //                     else {
        //                         companySalesDTO.salesType = 'Service Sales';
        //                         companySalesDTO.displaySalesType = 'Service Sales';
        //                         companySalesDTO.fullPrice = data[i].serviceprice;
        //                     }
        //                     companySalesDTO.discountedSales = data[i].servicesales;
        //                     companySalesDTO.taxTotal = serviceTax;
        //                     companySalesDTO.discounts = companySalesDTO.fullPrice - companySalesDTO.discountedSales;

        //                 }
        //                 var productSales = 0.00;
        //                 var productPrice = 0.00;
        //                 var productTax = 0.00;
        //                 var quantitySold = 0;
        //                 var workerProductSales = 0.00;
        //                 var lineProductPrice = 0.00;
        //                 var lineQtySold = 0;
        //                 getProductSales(req.params.begindate, req.params.enddate, function (err, data) {
        //                     for (var i = 0; i < data.length; i++) {
        //                         productSales = data[i].productsales;
        //                         productPrice = data[i].productprice;
        //                         productTax = data[i].producttax;
        //                         quantitySold = data[i].qtySold;
        //                         if (productSales == null)
        //                             productSales = 0.00;
        //                         if (productPrice == null)
        //                             productPrice = 0.00;
        //                         if (productTax == null)
        //                             productTax = 0.00;
        //                         if (quantitySold == null)
        //                             quantitySold = 0;
        //                         workerProductSales = productSales;
        //                         workerSalesDTO.productSales += productSales;
        //                         workerSalesDTO.totalSales = workerSalesDTO.totalSales + workerProductSales;
        //                         workerSalesDTO.workerName += data[i].workerName;
        //                         if (data[i].Display_Order__c === null)
        //                             workerSalesDTO.displayOrder = 0;
        //                         else
        //                             workerSalesDTO.displayOrder = data[i].Display_Order__c;
        //                         lineQtySold = quantitySold;

        //                         companySalesDTO.discountedSales += productSales;
        //                         lineProductPrice = productPrice;
        //                         var sumFullPrice = lineProductPrice * lineQtySold;
        //                         companySalesDTO.fullPrice += sumFullPrice;
        //                         companySalesDTO.taxTotal += productTax;

        //                         if (data[i].isRefund) {
        //                             companySalesDTO.salesType = 'Product Refunds';
        //                             companySalesDTO.displaySalesType = 'Product Refunds';
        //                             lineProductPrice = productSales;
        //                         } else {
        //                             companySalesDTO.salesType = 'Product Sales';
        //                             companySalesDTO.displaySalesType = 'Product Sales';
        //                             lineProductPrice = productPrice;
        //                         }
        //                         companySalesDTO.discountedSales = productSales;
        //                         var sumFullPrice = lineProductPrice * lineQtySold;
        //                         companySalesDTO.fullPrice = sumFullPrice;
        //                         companySalesDTO.taxTotal = productTax;
        //                         companySalesDTO.discounts = companySalesDTO.fullPrice - companySalesDTO.discountedSales;

        //                     }
        //                     tips = 0.00;
        //                     totalWorkerTips = 0.00;
        //                     totalWorkerTipsPaidOut = 0.00;
        //                     totalWorkerTipsPaidOutRecordCount = 0;
        //                     totalWorkerTipsLeftInDrawer = 0.00;
        //                     getTips(req.params.begindate, req.params.enddate, function (err, tipsdata) {
        //                         for (var i = 0; i < tipsdata.length; i++) {
        //                             tips = tipsdata[i].tips;
        //                             if (tips === null) {
        //                                 tips = 0.00;
        //                             }
        //                             if (tipsdata[i].tipOption == 'Tip Paid Out') {
        //                                 workerSalesDTO.totalWorkerTipsPaidOut += tips;
        //                                 workerSalesDTO.totalWorkerTipsPaidOutRecordCount = 1;
        //                             } else if (tipsdata[i].tipOption == 'Tip Left in Drawer') {
        //                                 workerSalesDTO.totalWorkerTipsLeftInDrawer += tips;
        //                             }
        //                             workerSalesDTO.totalWorkerTips += tips;
        //                             workerSalesDTO.workerName += data[i].workerName;
        //                             if (data[i].Display_Order__c === null)
        //                                 workerSalesDTO.displayOrder = 0;
        //                             else
        //                                 workerSalesDTO.displayOrder = data[i].Display_Order__c;
        //                         }
        //                         getOtherSales(req.params.begindate, req.params.enddate, function (err, data) {
        //                             for (var i = 0; i < data.length; i++) {
        //                                 transactionType = data[i].transType;
        //                                 isOnline = data[i].onlineField;
        //                                 if (isOnline == null)
        //                                     isOnline = 0;
        //                                 packagePrice = data[i].packageprice;
        //                                 amount = data[i].amount;
        //                                 serviceTax = data[i].servicetax;
        //                                 if (packagePrice == null)
        //                                     packagePrice = 0.00;
        //                                 if (amount == null)
        //                                     amount = 0.00;
        //                                 if (serviceTax == null)
        //                                     serviceTax = 0.00;
        //                                 // Deposits, Recvd On Acct, and Prepayments are accounted for in Account Balances section so exclude them here

        //                                 if (transactionType == 'Deposit' || transactionType == 'Received On Account' || transactionType == 'Pre Payment')
        //                                     continue;

        //                                 //	make a separate line for gift sales online
        //                                 if (isOnline && transactionType == 'Gift')
        //                                     transactionType = 'Gift Online';
        //                                 if (transactionType == 'Package') {
        //                                     companySalesDTO.discountedSales += packagePrice;
        //                                     companySalesDTO.fullPrice += packagePrice;
        //                                 } else {
        //                                     companySalesDTO.discountedSales += amount;
        //                                     companySalesDTO.fullPrice += amount;
        //                                 }
        //                                 companySalesDTO.taxTotal += serviceTax;

        //                                 companySalesDTO.salesType = transactionType;
        //                                 if (companySalesDTO.salesType == 'Package')
        //                                     companySalesDTO.displaySalesType = 'Package Sales';
        //                                 if (companySalesDTO.salesType == 'Membership')
        //                                     companySalesDTO.displaySalesType = 'Membership Sales';
        //                                 if (companySalesDTO.salesType == 'Gift')
        //                                     companySalesDTO.displaySalesType = 'Gift Sales';
        //                                 if (companySalesDTO.salesType == 'Gift Sales Online')
        //                                     companySalesDTO.displaySalesType = 'Gift Sales Online';
        //                                 if (companySalesDTO.salesType == 'Misc Sales')
        //                                     companySalesDTO.displaySalesType = 'Misc Sales';
        //                                 // if (companySalesDTO.salesType == STXConstants.SYSTEM_CLASS)
        //                                 //     companySalesDTO.displaySalesType = System.Label.Label_Class_Sales;

        //                                 if (transactionType == 'Package') {
        //                                     companySalesDTO.discountedSales = packagePrice;
        //                                     companySalesDTO.fullPrice = packagePrice;
        //                                 } else {
        //                                     companySalesDTO.discountedSales = amount;
        //                                     companySalesDTO.fullPrice = amount;
        //                                 }

        //                                 companySalesDTO.taxTotal = serviceTax;
        //                                 companySalesDTO.discounts = companySalesDTO.fullPrice - companySalesDTO.discountedSales;

        //                             }
        //                             getAccountBalances(req.params.begindate, req.params.enddate, function (err, data) {
        //                                 for (var i = 0; i < data.length; i++) {
        //                                     isOnline = data[i].onlineField;
        //                                     theType = data[i].transType;
        //                                     amount = data[i].amount;
        //                                     if (amount == null)
        //                                         amount = 0.00;
        //                                     if (isOnline && theType == 'Deposit')
        //                                         theType = 'Deposit Online';
        //                                     accountBalanceDTO.transactionType = theType;
        //                                     accountBalanceDTO.amount = amount;
        //                                 }
        //                                 // if a transaction type had no records, use this to always display static list with 0 amounts
        //                                 accountBalanceDTO.transactionType = 'Deposit';
        //                                 accountBalanceDTO.amount = 0.00;
        //                                 accountBalanceDTO.transactionType = 'Received on Account';
        //                                 accountBalanceDTO.amount = 0.00;
        //                                 accountBalanceDTO.transactionType = 'Deposit Online';
        //                                 accountBalanceDTO.amount = 0.00;
        //                                 accountBalanceDTO.transactionType = 'Prepayment';
        //                                 accountBalanceDTO.amount = 0.00;
        //                                 getPayments(req.params.begindate, req.params.enddate, function (err, data) {
        //                                     for (var i = 0; i < data.length; i++) {
        //                                         theType = data[i].paymentType;
        //                                         amount = data[i].amount;
        //                                         recordCount = data[i].countId;
        //                                         if (amount == null)
        //                                             amount = 0.00;
        //                                         if (recordCount == null)
        //                                             recordCount = 0;
        //                                         if (theType == 'Prepaid Package') {
        //                                             // cs = companySalesMap.get(STXConstants.PREPAID_PACKAGE_USAGE);
        //                                             companySalesDTO.discountedSales = companySalesDTO.discountedSales;
        //                                             companySalesDTO.fullPrice = companySalesDTO.fullPrice;
        //                                             companySalesDTO.taxTotal = companySalesDTO.taxTotal;
        //                                             companySalesDTO.discounts = companySalesDTO.fullPrice - companySalesDTO.discountedSales;
        //                                         } else if (theType == 'Gift Redemption') {
        //                                             companySalesDTO.salesType = 'Gift Redemption';
        //                                             companySalesDTO.displaySalesType = 'Gift Redemption';
        //                                             companySalesDTO.discountedSales = amount * -1;
        //                                             companySalesDTO.fullPrice = amount * -1;
        //                                             //cs.taxTotal = serviceTax;
        //                                             companySalesDTO.discounts = companySalesDTO.fullPrice - companySalesDTO.discountedSales;
        //                                         } else {
        //                                             paymentLine.paymentType = theType;
        //                                             paymentLine.amount = amount;
        //                                             paymentLine.recordCount = recordCount;
        //                                             if (data[i].Process_Electronically__c)
        //                                                 paymentLine.electronic = 'Y';
        //                                             else
        //                                                 paymentLine.electronic = '';
        //                                             // if (tipPaidOut == null)
        //                                             paymentLine.tipPaidOut = amount;

        //                                             paymentLine.isTotalLine = false;
        //                                         }
        //                                     }
        //                                     totalAllPaymentOverchargeRefunds = 0.00;
        //                                     totalPaymentOverchargeRefundRecordCount = 0;
        //                                     getPaymentOverchargeRefundPayments(req.params.begindate, req.params.enddate, function (err, data) {
        //                                         for (var i = 0; i < data.length; i++) {
        //                                             amount = data[i].amount;
        //                                             recordCount = data[i].countId;
        //                                             if (amount == null)
        //                                                 amount = 0.00;
        //                                             if (recordCount == null)
        //                                                 recordCount = 0;
        //                                             totalAllPaymentOverchargeRefunds += amount.toFixed(2);
        //                                             totalPaymentOverchargeRefundRecordCount += recordCount.toFixed(0);
        //                                             paymentLine.paymentType = data[i].paymentType;
        //                                             paymentLine.amount = 0.00;
        //                                             paymentLine.tipPaidOut = 0.00;
        //                                             paymentLine.recordCount = 0;
        //                                             if (data[i].Process_Electronically__c)
        //                                                 paymentLine.electronic = 'Y';
        //                                             else
        //                                                 paymentLine.electronic = '';
        //                                             paymentLine.isTotalLine = false;
        //                                             getTips(req.params.begindate, req.params.enddate, function (err, tipsdata) {
        //                                                 for (var i = 0; i < data.length; i++) {
        //                                                     if (tipsdata[i].tipOption == 'Tip Paid Out') {
        //                                                         paymentLine.tipPaidOut -= tipsdata[i].tips;
        //                                                     }
        //                                                 }
        //                                                 //	ACCOUNT BALANCES TOTALS
        //                                                 totalAccountBalanceAmount = 0.00;
        //                                                 totalAccountBalanceAmount += accountBalanceDTO.amount.toFixed(2);
        //                                                 // if a company sales type had no records, use this to always display static list with 0 amounts
        //                                                 //	WORKER SALES TOTALS
        //                                                 totalWorkerSalesAllServices = 0.00;
        //                                                 totalWorkerSalesAllProducts = 0.00;
        //                                                 totalWorkerSalesAllBoth = 0.00;
        //                                                 totalWorkerSalesAllTips = 0.00;
        //                                                 totalWorkerSalesAllTipsPaidOut = 0.00;
        //                                                 totalWorkerSalesAllTipsPaidOutRecordCount = 0;
        //                                                 totalWorkerSalesAllTipsLeftInDrawer = 0.00;
        //                                                 totalWorkerGuestCharge = 0.00;
        //                                                 totalWorkerSalesAllBalanceDue = 0.00;
        //                                                 totalWorkerSalesAllServices += workerSalesDTO.serviceSales.toFixed(2);
        //                                                 totalWorkerSalesAllProducts += workerSalesDTO.productSales.toFixed(2);
        //                                                 totalWorkerSalesAllBoth += workerSalesDTO.totalSales.toFixed(2);
        //                                                 totalWorkerSalesAllTips += workerSalesDTO.totalWorkerTips.toFixed(2);
        //                                                 totalWorkerSalesAllTipsPaidOut += workerSalesDTO.totalWorkerTipsPaidOut.toFixed(2);
        //                                                 totalWorkerSalesAllTipsPaidOutRecordCount += workerSalesDTO.totalWorkerTipsPaidOutRecordCount;
        //                                                 totalWorkerSalesAllTipsLeftInDrawer += workerSalesDTO.totalWorkerTipsLeftInDrawer;
        //                                                 // totalWorkerGuestCharge += guestCharge.toFixed(2);
        //                                                 //	COMPANY SALES TOTALS
        //                                                 totalCompanySalesAllFullPrices = 0.00;
        //                                                 totalCompanySalesAllDiscounts = 0.00;
        //                                                 totalCompanySalesAllDiscountedSales = 0.00;
        //                                                 totalCompanySalesAllTaxTotals = 0.00;
        //                                                 totalCompanySalesAllServiceTax = 0.00;
        //                                                 totalCompanySalesAllProductTax = 0.00;

        //                                                 totalCompanySalesAllGifts = 0.00;
        //                                                 totalCompanySalesAllMemberships = 0.00;
        //                                                 totalCompanySalesAllPackages = 0.00;
        //                                                 totalCompanyRedemptions = 0.00;
        //                                                 totalCompanySalesAllMisc = 0.00;

        //                                                 totalCompanySalesAllFullPrices += companySalesDTO.fullPrice.toFixed(2);
        //                                                 totalCompanySalesAllDiscounts += companySalesDTO.discounts.toFixed(2);
        //                                                 totalCompanySalesAllDiscountedSales += companySalesDTO.discountedSales.toFixed(2);
        //                                                 totalCompanySalesAllTaxTotals += companySalesDTO.taxTotal.toFixed(2);
        //                                                 if (companySalesDTO.salesType == 'Service Sales' || companySalesDTO.salesType == 'Service Refunds')
        //                                                     totalCompanySalesAllServiceTax += companySalesDTO.taxTotal.toFixed(2);
        //                                                 if (companySalesDTO.salesType == 'Product Sales' || companySalesDTO.salesType == 'Product Refunds')
        //                                                     totalCompanySalesAllProductTax += companySalesDTO.taxTotal.toFixed(2);
        //                                                 if (companySalesDTO.salesType == 'Service Sales')
        //                                                     companySalesDTO.sortOrder = 1;
        //                                                 if (companySalesDTO.salesType == 'Service Refunds')
        //                                                     companySalesDTO.sortOrder = 2;
        //                                                 if (companySalesDTO.salesType == 'Product Sales')
        //                                                     companySalesDTO.sortOrder = 3;
        //                                                 if (companySalesDTO.salesType == 'Product Credit')
        //                                                     companySalesDTO.sortOrder = 4;
        //                                                 if (companySalesDTO.salesType == 'Product Refunds')
        //                                                     companySalesDTO.sortOrder = 5;
        //                                                 if (companySalesDTO.salesType == 'System Class')
        //                                                     companySalesDTO.sortOrder = 6;
        //                                                 if (companySalesDTO.salesType == 'Gift') {
        //                                                     totalCompanySalesAllGifts += companySalesDTO.fullPrice.toFixed(2);
        //                                                     companySalesDTO.sortOrder = 7;
        //                                                 }
        //                                                 if (companySalesDTO.salesType == 'Gift Sales') {
        //                                                     totalCompanySalesAllGifts += companySalesDTO.fullPrice.toFixed(2);
        //                                                     companySalesDTO.sortOrder = 8;
        //                                                 }
        //                                                 if (companySalesDTO.salesType == 'Gift Redemption') {
        //                                                     totalCompanyRedemptions += companySalesDTO.discountedSales.toFixed(2);
        //                                                     companySalesDTO.sortOrder = 9;
        //                                                 }
        //                                                 if (companySalesDTO.salesType == 'Membership') {
        //                                                     totalCompanySalesAllMemberships += companySalesDTO.fullPrice.toFixed(2);
        //                                                     companySalesDTO.sortOrder = 10;
        //                                                 }
        //                                                 if (companySalesDTO.salesType == 'Package') {
        //                                                     totalCompanySalesAllPackages += companySalesDTO.fullPrice.toFixed(2);
        //                                                     companySalesDTO.sortOrder = 11;
        //                                                 }
        //                                                 if (companySalesDTO.salesType == 'Prepaid Package Usage') {
        //                                                     totalCompanyRedemptions += companySalesDTO.discountedSales.toFixed(2);
        //                                                     companySalesDTO.sortOrder = 12;
        //                                                 }
        //                                                 if (companySalesDTO.salesType == 'Misc Sales') {
        //                                                     totalCompanySalesAllMisc += companySalesDTO.fullPrice.toFixed(2);
        //                                                     companySalesDTO.sortOrder = 13;
        //                                                 }
        //                                                 //	PAYMENT TOTALS
        //                                                 totalPaymentAmounts = 0.00;
        //                                                 totalPaymentRecordCount = 0.00;
        //                                                 totalTipsPaidOut = 0.00;
        //                                                 totalPaymentAmounts += paymentLine.amount.toFixed(2);
        //                                                 totalPaymentRecordCount += paymentLine.recordCount.toFixed(0);
        //                                                 totalTipsPaidOut += paymentLine.tipPaidOut.toFixed(2);
        //                                                 paymentLine.paymentType = 'Electronic Payment Refunds';
        //                                                 paymentLine.amount = totalAllPaymentOverchargeRefunds;
        //                                                 paymentLine.recordCount = totalPaymentOverchargeRefundRecordCount;
        //                                                 paymentLine.isTotalLine = false;
        //                                                 paymentLine.paymentType = 'Payment Total';
        //                                                 paymentLine.amount = totalPaymentAmounts + totalAllPaymentOverchargeRefunds;
        //                                                 paymentLine.recordCount = totalPaymentRecordCount + totalPaymentOverchargeRefundRecordCount;
        //                                                 paymentLine.isTotalLine = true;
        //                                                 paymentLine.totalPaymentAmounts += totalAllPaymentOverchargeRefunds;
        //                                                 paymentLine.paymentType = 'Change Back';
        //                                                 getBalanceDueApptTicketsByReportDate(req.params.begindate, req.params.enddate, function (err, data) {
        //                                                     recordCount = 0;
        //                                                     for (var i = 0; i < data.length; i++) {
        //                                                         recordCount = data[i].countId;
        //                                                         balanceDue = data[i].balancedue;
        //                                                         if (balanceDue == null)
        //                                                             balanceDue = 0;
        //                                                         totalWorkerSalesAllBalanceDue += balanceDue;
        //                                                     }
        //                                                     if (totalWorkerSalesAllBalanceDue == null)
        //                                                         totalWorkerSalesAllBalanceDue = 0;
        //                                                     paymentLine.amount = totalWorkerSalesAllBalanceDue + totalWorkerSalesAllTips;
        //                                                     paymentLine.recordCount = recordCount;
        //                                                     paymentLine.isTotalLine = true;
        //                                                     totalPaymentAmounts += paymentLine.amount;
        //                                                     paymentLine.paymentType = 'Less Tip Paid Out';
        //                                                     paymentLine.amount = -totalWorkerSalesAllTipsPaidOut;
        //                                                     paymentLine.recordCount = totalWorkerSalesAllTipsPaidOutRecordCount;
        //                                                     paymentLine.isTotalLine = true;
        //                                                     totalPaymentAmounts += paymentLine.amount;
        //                                                     cashInRecordCount = 0;
        //                                                     cashOutRecordCount = 0;
        //                                                     cashInTotalAmount = 0.00;
        //                                                     cashOutTotalAmount = 0.00;
        //                                                     getCashInOutRecordsByDate(req.params.begindate, req.params.enddate, function (err, data) {
        //                                                         for (var i = 0; i < data.length; i++) {
        //                                                             if (data[i].Amount__c == null)
        //                                                                 data[i].Amount__c = 0.00;
        //                                                             if (data[i].Type__c == 'Cash Paid In') {
        //                                                                 cashInRecordCount++;
        //                                                                 cashInTotalAmount += data[i].Amount__c;
        //                                                             }
        //                                                             if (data[i].Type__c == 'Cash Paid Out') {
        //                                                                 cashOutRecordCount++;
        //                                                                 cashOutTotalAmount += data[i].Amount__c;
        //                                                             }
        //                                                         }
        //                                                         paymentLine.paymentType = 'Cash Paid In';
        //                                                         paymentLine.amount = cashInTotalAmount;
        //                                                         paymentLine.recordCount = cashInRecordCount;
        //                                                         paymentLineisTotalLine = true;
        //                                                         totalPaymentAmounts += paymentLine.amount;
        //                                                         paymentType = 'Cash Paid Out';
        //                                                         paymentLine.amount = cashInTotalAmount;
        //                                                         paymentLine.recordCount = cashInRecordCount;
        //                                                         paymentLine.isTotalLine = true;
        //                                                         totalPaymentAmounts += paymentLine.amount;
        //                                                         // populateGrandTotalsList
        //                                                         grandTotalLine.amount = totalWorkerSalesAllServices;
        //                                                         grandTotalLine.tax = totalCompanySalesAllServiceTax;
        //                                                         grandTotalLine.amountPlusTax = grandTotalLine.amount + grandTotalLine.tax;
        //                                                         grandTotalLine.totalType = 'Service Sales';
        //                                                         grandTotalLine.isTotalLine = false;
        //                                                         grandTotalLine.amount = totalWorkerSalesAllProducts;
        //                                                         grandTotalLine.tax = totalCompanySalesAllProductTax;
        //                                                         grandTotalLine.amountPlusTax = grandTotalLine.amount + grandTotalLine.tax;
        //                                                         grandTotalLine.totalType = 'Product Sales';
        //                                                         grandTotalLine.isTotalLine = false;
        //                                                         grandTotalLine.amount = totalAccountBalanceAmount + totalCompanySalesAllGifts + totalCompanySalesAllMemberships + totalCompanySalesAllPackages + totalCompanyRedemptions + totalCompanySalesAllMisc;
        //                                                         grandTotalLine.tax = 0.00;
        //                                                         grandTotalLine.amountPlusTax = amount;
        //                                                         grandTotalLine.totalType = 'Other';
        //                                                         grandTotalLine.isTotalLine = false;
        //                                                         grandTotalLine.amount = totalWorkerSalesAllTipsLeftInDrawer;
        //                                                         grandTotalLine.tax = 0.00;
        //                                                         grandTotalLine.amountPlusTax = totalWorkerSalesAllTipsLeftInDrawer;
        //                                                         grandTotalLine.totalType = 'Tips Left In Drawer';
        //                                                         grandTotalLine.isTotalLine = false;
        //                                                         grandTotalLine.amount = cashInTotalAmount;
        //                                                         grandTotalLine.tax = 0.00;
        //                                                         grandTotalLine.amountPlusTax = cashInTotalAmount;
        //                                                         grandTotalLine.totalType = 'Cash Paid In';
        //                                                         grandTotalLine.isTotalLine = false;
        //                                                         grandTotalLine.amount = cashOutTotalAmount;
        //                                                         grandTotalLine.tax = 0.00;
        //                                                         grandTotalLine.amountPlusTax = cashOutTotalAmount;
        //                                                         grandTotalLine.totalType = 'Cash Paid Out';
        //                                                         grandTotalLine.isTotalLine = false;
        //                                                         grandTotalLine.amount = totalAllPaymentOverchargeRefunds;
        //                                                         grandTotalLine.tax = 0.00;
        //                                                         grandTotalLine.amountPlusTax = totalAllPaymentOverchargeRefunds;
        //                                                         grandTotalLine.totalType = 'Electronic Payment Refunds';
        //                                                         grandTotalLine.isTotalLine = false;
        //                                                         grandTotalAmount = 0.00;
        //                                                         grandTotalTax = 0.00;
        //                                                         grandTotalAmountPlusTax = 0.00;
        //                                                         grandTotalAmount += grandTotalLine.amount;
        //                                                         grandTotalAmountPlusTax += grandTotalLine.amountPlusTax;
        //                                                         grandTotalTax += grandTotalLine.tax.toFixed(2);
        //                                                         grandTotalLine.amount = grandTotalAmount;
        //                                                         grandTotalLine.tax = grandTotalTax;
        //                                                         grandTotalLine.amountPlusTax = grandTotalAmountPlusTax;
        //                                                         grandTotalLine.totalType = 'Total';
        //                                                         grandTotalLine.isTotalLine = true;
        //                                                         grandTotalLine.amount = totalWorkerSalesAllTipsPaidOut;
        //                                                         grandTotalLine.tax = 0.00;
        //                                                         grandTotalLine.amountPlusTax = totalWorkerSalesAllTipsPaidOut;
        //                                                         grandTotalLine.totalType = 'Tips Paid Out';
        //                                                         grandTotalLine.isTotalLine = false;
        //                                                         showReport = true;
        //                                                         console.log('workerSalesDTO66', workerSalesDTO, 'companySalesDTo77', companySalesDTO, 'accountBalanceDTO22', accountBalanceDTO, 'paymentLine22', paymentLine,
        //                                                             'grandTotalLine', grandTotalLine)
        //                                                         // done(err, )
        //                                                     });
        //                                                 });
        //                                             });
        //                                         }
        //                                     });
        //                                 });
        //                             });
        //                         });
        //                     });
        //                 });
        //             });


        //         }
        //     });
        // } catch (err) {
        //     logger.error('Unknown error in reports dao - getDailyCashDrawerRecords:', err);
        //     return (err, { statusCode: '9999' });
        // }
    }
}

function getServiceSales(beginDate, endDate, callback) {
    var sqlQuery = 'select u.Id workerId, IFNULL(u.Display_Order__c, 0) Display_Order__c, CONCAT(u.FirstName," ", u.LastName) workerName, sum(ts.Net_Price__c) servicesales, sum(ts.Price__c) serviceprice, '
        + ' IFNULL(sum(ts.Service_Tax__c), 0) servicetax, at.isRefund__c as isRefund, ts.Client_Package__c as clientPackage, IFNULL(sum( ts.Guest_Charge__c ), 0) guestCharge, '
        + ' IFNULL(sum(IF( at.isRefund__c, 0, (ts.Net_Price__c + (ts.Service_Tax__c)+ (tpro.Qty_Sold__c  *  tpro.Net_Price__c) +(tpro.Product_Tax__c) + (tot.Amount__c))+ at.Included_Ticket_Amount__c - (tp.Amount_Paid__c))), 0) balancedue'
        + ' from Ticket_Service__c as ts '
        + ' LEFT JOIN Appt_Ticket__c as at on at.Id = ts.Appt_Ticket__c '
        + ' LEFT JOIN User__c as u on u.Id = ts.Worker__c '
        + ' LEFT JOIN Ticket_Other__c as tot on tot.Ticket__c = at.Id '
        + ' LEFT JOIN Ticket_Product__c as tpro on tpro.Appt_Ticket__c = at.Id '
        + ' LEFT JOIN Ticket_Payment__c as tp on tp.Appt_Ticket__c = at.Id '
        + ' where at.Appt_Date_Time__c >= "' + beginDate + '" '
        + ' and at.Appt_Date_Time__c <= "' + endDate + '" '
        + ' and at.IsTicket__c = 1 '
        + ' group by u.Id, u.Username, at.isRefund__c, ts.Client_Package__c';
    execute.query(sqlQuery, function (error, result) {
        if (error) {
            logger.error('Error in getting getWorkerDetail: ', error);
            callback(error, result);
        } else {
            callback(error, result);
        }
    });
}

function getProductSales(beginDate, endDate, callback) {
    var sqlQuery = 'select p.Id productId, p.Name productName, u.Id workerId,u.Display_Order__c,CONCAT(u.FirstName,"",u.LastName) workerName,'
        + ' IFNULL(sum(tp.Qty_Sold__c  *  tp.Net_Price__c), 0) productsales, IFNULL(avg(tp.Net_Price__c), 0) netprice, IFNULL(avg(tp.Price__c), 0) productprice, '
        + ' IFNULL(sum(tp.Product_Tax__c), 0) producttax, IFNULL(sum(tp.Qty_Sold__c), 0) qtySold, at.isRefund__c isRefund '
        + ' from Ticket_Product__c as tp '
        + ' LEFT JOIN Appt_Ticket__c as at on at.Id= tp.Appt_Ticket__c '
        + ' left JOIN Product__c as p on p.Id =tp.Product__c '
        + ' LEFT JOIN User__c as u on u.Id = tp.Worker__c '
        + ' where at.Appt_Date_Time__c  >= "' + beginDate + '" '
        + ' and at.Appt_Date_Time__c  <= "' + endDate + '" '
        + ' and at.IsTicket__c = 1 '
        + ' group by p.Id, p.Name, u.Id, at.isRefund__c';
    execute.query(sqlQuery, function (error, result) {
        if (error) {
            logger.error('Error in getting getWorkerDetail: ', error);
            callback(error, result);
        } else {
            callback(error, result);
        }
    });
}
function getTips(beginDate, endDate, callback) {
    var sqlQuery = 'select at.Id, u.Id workerId, u.Display_Order__c,CONCAT(u.FirstName,"",u.LastName) workerName, t.Tip_Option__c tipOption,'
        + ' IFNULL(sum(t.Tip_Amount__c), 0) tips from Ticket_Tip__c as t left JOIN Appt_Ticket__c as at on at.Id = t.Appt_Ticket__c '
        + ' LEFT JOIN User__c as u on u.Id = t.Worker__c'
        + ' where at.Appt_Date_Time__c >= "' + beginDate + '" '
        + ' and at.Appt_Date_Time__c <= "' + endDate + '" '
        + ' and at.IsTicket__c = 1 '
        + ' group by at.Id, u.Id, t.Tip_Option__c';
    execute.query(sqlQuery, function (error, result) {
        if (error) {
            logger.error('Error in getting getWorkerDetail: ', error);
            callback(error, result);
        } else {
            callback(error, result);
        }
    });
}
function getOtherSales(beginDate, endDate, callback) {
    var sqlQuery = 'select IFNULL(sum(t.Amount__c), 0) amount, IFNULL(sum(t.Package_Price__c), 0) packageprice, IFNULL(sum(t.Service_Tax__c), 0) servicetax, '
        + ' t.Transaction_Type__c transType, t.Online__c onlineField from Ticket_Other__c as t '
        + ' LEFT JOIN Appt_Ticket__c as at on at.Id = t.Ticket__c  where at.Appt_Date_Time__c >= "' + beginDate + '"'
        + ' and at.Appt_Date_Time__c <= "' + endDate + '" group by t.Transaction_Type__c, t.Online__c';
    execute.query(sqlQuery, function (error, result) {
        if (error) {
            logger.error('Error in getting getWorkerDetail: ', error);
            callback(error, result);
        } else {
            callback(error, result);
        }
    });
}
function getAccountBalances(beginDate, endDate, callback) {
    var sqlQuery = 'select t.Transaction_Type__c transType, IFNULL(sum(t.Amount__c), 0) amount, t.Online__c onlineField '
        + ' from Ticket_Other__c as t LEFT JOIN Appt_Ticket__c as at on at.Id =t.Ticket__c '
        + ' where at.Appt_Date_Time__c >= "' + beginDate + '" and at.Appt_Date_Time__c  <= "' + endDate + '" '
        + ' and t.Transaction_Type__c in ("Deposit","Prepayment","Received on Account") ';
    + ' group by t.Transaction_Type__c, t.Online__c ';
    execute.query(sqlQuery, function (error, result) {
        if (error) {
            logger.error('Error in getting getWorkerDetail: ', error);
            callback(error, result);
        } else {
            callback(error, result);
        }
    });
}
function getPayments(beginDate, endDate, callback) {
    var sqlQuery = 'select p.Name paymentType, p.Process_Electronically__c, IFNULL(sum(tp.Amount_Paid__c), 0) amount, COUNT(DISTINCT(tp.Id)) countId '
        + ' from Ticket_Payment__c as tp LEFT JOIN Payment_Types__c as p on p.Id = tp.Payment_Type__c '
        + ' LEFT JOIN Appt_Ticket__c as at on at.Id = tp.Appt_Ticket__c where at.Appt_Date_Time__c >= "' + beginDate + '" '
        + ' and at.Appt_Date_Time__c <= "' + endDate + '" and at.IsTicket__c = 1 and p.Name IS NOT NULL '
        + ' and tp.Original_Ticket_Payment__c IS NULL group by p.Name';
    execute.query(sqlQuery, function (error, result) {
        if (error) {
            logger.error('Error in getting getWorkerDetail: ', error);
            callback(error, result);
        } else {
            callback(error, result);
        }
    });
}
function getPaymentOverchargeRefundPayments(beginDate, endDate, callback) {
    var sqlQuery = 'select p.Name paymentType,p.Process_Electronically__c, IFNULL(sum(tp.Amount_Paid__c), 0) amount, COUNT(DISTINCT(tp.Id)) countId '
        + ' from Ticket_Payment__c as tp LEFT JOIN Payment_Types__c as p on p.Id = tp.Payment_Type__c '
        + ' left JOIN Appt_Ticket__c as at on at.Id = tp.Appt_Ticket__c where at.Appt_Date_Time__c >= "' + beginDate + '" '
        + ' and at.Appt_Date_Time__c  <= "' + endDate + '" and at.IsTicket__c = 1  and p.Name IS NOT null '
        + ' and tp.Original_Ticket_Payment__c IS NOT NULL and at.isRefund__c = true group by p.Name';
    execute.query(sqlQuery, function (error, result) {
        if (error) {
            logger.error('Error in getting getWorkerDetail: ', error);
            callback(error, result);
        } else {
            callback(error, result);
        }
    });
}
function getBalanceDueApptTicketsByReportDate(beginDate, endDate, callback) {
    var sqlQuery = 'select COUNT(DISTINCT(tp.Id)) countId, IFNULL(sum(IF( at.isRefund__c, 0, (ts.Net_Price__c + (ts.Service_Tax__c)+ (tpro.Qty_Sold__c  *  tpro.Net_Price__c) +(tpro.Product_Tax__c) + (tot.Amount__c))+ at.Included_Ticket_Amount__c - (tp.Amount_Paid__c))), 0) balancedue '
        + ' from Appt_Ticket__c as at LEFT JOIN Ticket_Payment__c as tp on tp.Appt_Ticket__c = at.Id LEFT JOIN Ticket_Other__c as tot on tot.Ticket__c = at.Id '
        + ' LEFT JOIN Ticket_Service__c as ts on ts.Appt_Ticket__c = at.Id LEFT JOIN Ticket_Product__c as tpro on tpro.Appt_Ticket__c = at.Id '
        + ' where at.Appt_Date_Time__c >= "' + beginDate + '" and at.Appt_Date_Time__c <= "' + endDate + '" '
        + ' and (ts.Net_Price__c + (ts.Service_Tax__c)+ (tpro.Qty_Sold__c  *  tpro.Net_Price__c) +(tpro.Product_Tax__c) + (tot.Amount__c))+ at.Included_Ticket_Amount__c - (tp.Amount_Paid__c) < 0';
    execute.query(sqlQuery, function (error, result) {
        if (error) {
            logger.error('Error in getting getWorkerDetail: ', error);
            callback(error, result);
        } else {
            callback(error, result);
        }
    });
}
function getCashInOutRecordsByDate(beginDate, endDate, callback) {
    var sqlQuery = 'select Id, Amount__c, Type__c, CreatedDate  from Cash_In_Out__c  where DATE(CreatedDate)  >="' + beginDate + '" '
        + ' and DATE(CreatedDate)  <= "' + endDate + '" order by Name asc';
    execute.query(sqlQuery, function (error, result) {
        if (error) {
            logger.error('Error in getting getWorkerDetail: ', error);
            callback(error, result);
        } else {
            callback(error, result);
        }
    });
}
function getServicesCountAndSalesByDateRange(beginDate, endDate, worker, callback) {
    if (!worker) {
        var sqlQuery = 'select count(ts.Service__c) serviceCount, s.Name serviceName, s.Service_Group__c serviceGroup,'
            + ' IFNULL(sum(ts.Net_Price__c), 0) serviceTotal, IFNULL(sum(ts.Guest_Charge__c),0) guestCharge '
            + ' from Ticket_Service__c as ts LEFT JOIN Appt_Ticket__c as at on at.Id = ts.Appt_Ticket__c '
            + ' LEFT JOIN Service__c as s on s.Id = ts.Service__c where at.isTicket__c = 1 '
            + ' and at.Status__c ="Complete"  and at.Is_Booked_Out__c != 1 and at.IsRefund__c != 1 '
            + ' and ts.Service_Date_Time__c >= "' + beginDate + '" and ts.Service_Date_Time__c  <= "' + endDate + '" '
            + ' and ts.IsDeleted = 0 GROUP BY s.Name, s.Service_Group__c ORDER BY s.Service_Group__c, s.Name';
    } else {
        var sqlQuery = 'select count(ts.Service__c) serviceCount, s.Name serviceName, s.Service_Group__c serviceGroup, '
            + ' IFNULL(sum(ts.Net_Price__c),0) serviceTotal, IFNULL(sum(ts.Guest_Charge__c),0) guestCharge '
            + ' from Ticket_Service__c as ts LEFT JOIN Appt_Ticket__c as at on at.Id = ts.Appt_Ticket__c '
            + ' LEFT JOIN Service__c as s on s.Id = ts.Service__c LEFT JOIN User__c as u on u.Id = ts.Worker__c '
            + ' where at.isTicket__c = 1 and at.Status__c ="Complete" and at.Is_Booked_Out__c != 1 '
            + ' and at.IsRefund__c != 1  and ts.Service_Date_Time__c  >= "' + beginDate + '"  and '
            + ' ts.Service_Date_Time__c >= "' + endDate + '" and ts.Worker__c ="' + worker + '" '
            + ' and ts.IsDeleted = 0 GROUP BY s.Name, s.Service_Group__c ORDER BY s.Service_Group__c, s.Name';
    }
    execute.query(sqlQuery, function (error, result) {
        if (error) {
            logger.error('Error in getting getWorkerDetail: ', error);
            callback(error, result);
        } else {
            callback(error, result);
        }
    });
}

function finalResponse(index, workerSalesObj, companySalesObj, done) {
    if (index === 1) {
        done(null, {
            'workerSalesObj': workerSalesObj,
            'companySalesObj': companySalesObj
        });
    }
}

function addProductSales(index1, workerSalesObj, prdData, tipsData, companySalesObj, index2, done) {
    if (index1 === 3) {
        for (var i = 0; i < workerSalesObj.length; i++) {
            for (var j = 0; j < prdData.length; j++) {
                if (workerSalesObj[i]['workerId'] == prdData[j]['workerId']) {
                    workerSalesObj[i]['productSales'] += prdData[j]['productsales'];
                }
            }
            workerSalesObj[i]['totalSales'] = workerSalesObj[i]['serviceSales'] + workerSalesObj[i]['productSales'];
            for (var j = 0; j < tipsData.length; j++) {
                if (workerSalesObj[i]['workerId'] == tipsData[j]['workerId']) {
                    if (tipsData[j]['tipOption'] === 'Tip Paid Out') {
                        workerSalesObj[i]['tipPaidOut'] += tipsData[j]['tips']
                    } else {
                        workerSalesObj[i]['tipLeftInDrawer'] += tipsData[j]['tips']
                    }
                }
                workerSalesObj[i]['totalTips'] = workerSalesObj[i]['tipPaidOut'] + workerSalesObj[i]['tipLeftInDrawer']
            }
        }
        var nullVal = workerSalesObj.filter(function (a) { return a['displayOrder'] === 0 });
        var notNullVal = workerSalesObj.filter(function (a) { return a['displayOrder'] !== 0 });
        notNullVal.sort(function (a, b) {
            return parseInt(a.displayOrder) - parseInt(b.displayOrder);
        });
        workerSalesObj = notNullVal.concat(nullVal);
        //         var a = [1,2,3];
        // var sum = workerSalesObj.reduce(function(a, b) { console.log('---',a);console.log('====',b); return a + b.serviceSales; }, 0);
        //         var totalObj = {
        //             'workerName': 'Totals',
        //             'serviceSales': workerSalesObj.reduce((a, b) => a.serviceSales + b.serviceSales, 0),
        //             'guestCharge': workerSalesObj.reduce((a, b) => a.serviceSales + b.serviceSales, 0),
        //             'serviceTax': workerSalesObj.reduce((a, b) => a.serviceSales + b.serviceSales, 0),
        //             'displayOrder': workerSalesObj.reduce((a, b) => a.serviceSales + b.serviceSales, 0),
        //             'workerId': workerSalesObj.reduce((a, b) => a.serviceSales + b.serviceSales, 0),
        //             'productSales': workerSalesObj.reduce((a, b) => a.serviceSales + b.serviceSales, 0),
        //             'totalSales': workerSalesObj.reduce((a, b) => a.serviceSales + b.serviceSales, 0),
        //             'tipLeftInDrawer': workerSalesObj.reduce((a, b) => a.serviceSales + b.serviceSales, 0),
        //             'tipPaidOut': workerSalesObj.reduce((a, b) => a.serviceSales + b.serviceSales, 0),
        //             'totalTips': workerSalesObj.reduce((a, b) => a.serviceSales + b.serviceSales, 0)
        //         }
        // workerSalesObj.push(totalObj);
        index2++;
        finalResponse(index2, workerSalesObj, companySalesObj, done);
    }
}

function checkWorker(workerSalesObj, wrkId) {
    for (var i = 0; i < workerSalesObj.length; i++) {
        if (workerSalesObj[i]['workerId'] === wrkId) {
            return [true, i];
        }
    }
    return [false, 0];
}
