/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var _ = require("underscore");
var mysql = require('mysql');
var sequential = require("sequential-ids");
var dateFns = require('./../common/dateFunctions');
var mail = require('../config/sendMail');
var fs = require('fs');
var pdf = require('html-pdf');
var path = require('path');


module.exports = {
    /**
     * Saving Check Outs
     */

    /**
     * This function lists Check Outs  
     */
    getCheckOutServices: function (req, done) {
        try {
            var ticketId = req.params.id;
            var sqlQuery = 'SELECT Ts.*, S.Service_Group__c, S.Id as id, S.Name as name, S.Levels__c as pricelevels, "Service" as type FROM `Ticket_Service__c` as Ts '
                + ' JOIN Service__c as S on S.Id = Ts.Service__c WHERE  Ts.isDeleted =0 GROUP BY Ts.Service__c';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getCheckOut:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getCheckOut:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
    * This function update Check Outs Service 
    */
    updateCheckOutService: function (req, done) {
        var dataObj = req.body.updateServiceData[0];
        try {
            var tsId = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.ticketServiceTBL
                + " SET Worker__c = '" + dataObj.workerId.split('$')[1]
                + "', Notes__c = '" + dataObj.Notes__c
                + "', Net_Price__c = '" + dataObj.Net_Price__c
                + "', Promotion__c = '" + dataObj.promotionId
                + "', Reward__c = '" + dataObj.rewardId
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + tsId + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getCheckOut:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getCheckOut:', err);
            return (err, { statusCode: '9999' });
        }
    },
    deleteServiceById: function (req, done) {
        try {
            var tsId = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.ticketServiceTBL
                + " SET isDeleted = 1 "
                + ", LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + tsId + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getCheckOut:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getCheckOut:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getServicesByApptId: function (req, done) {
        try {
            var ticketId = req.params.id;
            var sqlQuery = 'SELECT ts.Service_Tax__c, ts.Price__c, ts.Net_Price__c, ts.Id as TicketServiceId,CONCAT(u.FirstName," ", u.LastName) as workerName, u.Id as workerId,ts.Notes__c,ts.reward__c, ts.Promotion__c, s.Id as ServiceId, s.Name as ServiceName, ts.Net_Price__c as netPrice '
                + ' FROM Ticket_Service__c as ts JOIN Service__c as s on ts.Service__c = s.Id '
                + ' LEFT JOIN User__c as u on u.Id = ts.Worker__c WHERE ts.Appt_Ticket__c = "' + req.params.id + '" and ts.isDeleted = 0';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getServicesByApptId:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getServicesByApptId:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getServicesByWorker: function (req, done) {
        try {
            var Id = req.params.serviceid;
            var sqlQuery = 'SELECT CONCAT(u.FirstName," " , LEFT(u.LastName,1)) as FullName, s.Id as serviceId, s.Name as serviceName, u.Id, IFNULL(ws.Price__c, s.Price__c) as Price FROM Worker_Service__c as ws '
                + ' JOIN Service__c as s on s.Id = ws.Service__c JOIN User__c as u on u.Id =ws.Worker__c WHERE ws.Service__c = "' + Id + '" and ws.isDeleted =0 GROUP BY u.Id';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getServicesByWorker:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getServicesByWorker:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
    * This function lists Check Outs 
    */
    getCheckOutList: function (req, done) {
        try {
            var sqlQuery = 'SELECT c.Id as clientId, ap.Id as appId,ap.Status__c, ap.Name as ticketNumber, CONCAT(c.FirstName, " ", c.LastName) as clientName, '
                + ' GROUP_CONCAT(s.Name, "(", CONCAT(u.FirstName," ", LEFT(u.LastName,1)), ")") as serviceName, ap.Appt_Date_Time__c Date from Appt_Ticket__c as ap '
                + ' LEFT JOIN Contact__c as c on c.Id = ap.Client__c LEFT JOIN Ticket_Service__c as ts on ts.Appt_Ticket__c = ap.Id '
                + ' LEFT JOIN User__c as u on u.Id = ts.Worker__c LEFT JOIN Service__c as s on s.Id = ts.Service__c '
                + ' where ap.Status__c = "Checked In" GROUP BY clientName';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getCheckOutList:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getCheckOutList:', err);
            return (err, { statusCode: '9999' });
        }
    },
    addToTicket: function (req, done1) {
        try {
            var ticketServiceObj = req.body[0];
            var date = new Date();
            if (ticketServiceObj.Duration_1__c === null)
                ticketServiceObj.Duration_1__c = 0
            if (ticketServiceObj.Duration_2__c === null)
                ticketServiceObj.Duration_2__c = 0
            if (ticketServiceObj.Duration_3__c === null)
                ticketServiceObj.Duration_3__c = 0
            if (ticketServiceObj.Buffer_After__c === null)
                ticketServiceObj.Buffer_After__c = 0
            if (ticketServiceObj.Guest_Charge__c === null)
            ticketServiceObj.Guest_Charge__c = 0
            ticketServiceObj.serviceDur = parseInt(ticketServiceObj.Duration_1__c) + parseInt(ticketServiceObj.Duration_2__c)
            parseInt(ticketServiceObj.Duration_3__c) + parseInt(ticketServiceObj.Buffer_After__c);
            if (ticketServiceObj.serviceDur === null) {
                ticketServiceObj.serviceDur = 0;
            }
            if (req.params.type === 'New') {
                createAppt(ticketServiceObj, function (err, done) {
                    ticketServiceObj.Appt_Ticket__c = done;
                    createTicketService(ticketServiceObj, function (err, done) {
                        done1(err, done)
                    });
                });
            } else {
                createTicketService(ticketServiceObj, function (err, done) {
                    done1(err, done)
                });
            }
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - addToProduct:', err);
            return (err, { statusCode: '9999' });
        }
    },
    addToProduct: function (req, done1) {
        var ticketProductObj = req.body;
        try {
            if (req.params.type === 'New') {
                createAppt(ticketProductObj, function (err, done) {
                    ticketProductObj.Appt_Ticket__c = done;
                    createTicketProduct(ticketProductObj, function (err, done) {
                        done1(err, done)
                    });
                });
            } else {
                createTicketProduct(ticketProductObj, function (err, done) {
                    done1(err, done)
                });
            }

        } catch (err) {
            logger.error('Unknown error in CheckOut dao - addToProduct:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
  * This function lists Check Outs of  products
  */
    getCheckOutProducts: function (req, done) {
        try {
            var ticketId = req.params.id;
            var sqlQuery = 'SELECT p.*, IFNULL(p.Price__c, 0) as price, pl.Color__c FROM `Product__c` as p JOIN Product_Line__c as pl on pl.Id = p.Product_Line__c GROUP BY p.Id';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getCheckOutProducts:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getCheckOutProducts:', err);
            return (err, { statusCode: '9999' });
        }
    },
    updateProductsById: function (req, done) {
        try {
            var tpId = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.ticketProductTBL
                + " SET Worker__c = '" + req.body.Worker__c
                + "', Qty_Sold__c = '" + req.body.Qty_Sold__c
                + "', Net_Price__c = '" + req.body.Price__c
                + "', Reward__c = '" + req.body.Reward__c
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + tpId + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - updateProductsById:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - updateProductsById:', err);
            return (err, { statusCode: '9999' });
        }
    },
    deleteProductsById: function (req, done) {
        try {
            var tpId = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.ticketProductTBL
                + " SET isDeleted = 1 "
                + ", LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + tpId + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - deleteProductsById:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - deleteProductsById:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
  * This function lists Check Outs of Ticket products
  */
    getCheckOutTicketProducts: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = 'SELECT p.Size__c, p.Name, tp.Product_Tax__c, tp.Promotion__c, tp.Reward__c, tp.Id, IFNULL(tp.Net_Price__c,0) as Net_Price__c, tp.Price__c, tp.Qty_Sold__c as quantity,tp.Worker__c as workerId, CONCAT(u.FirstName, " ", u.LastName) as workerName FROM Ticket_Product__c as tp LEFT JOIN Product__c as p on p.Id = tp.Product__c '
                + ' LEFT JOIN User__c as u on u.Id =tp.Worker__c where tp.Appt_Ticket__c ="' + Id + '" and tp.isDeleted =0 GROUP BY p.Name';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getCheckOutTicketProducts:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getCheckOutTicketProducts:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
    * This function lists Check Outs product workers
    */
    getCheckOutProductWorkers: function (req, done) {
        try {
            var ticketId = req.params.id;
            var sqlQuery = 'SELECT * from User__c where isActive =1 or Retail_Only__c = 1 ';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getCheckOutProductWorkers:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getCheckOutProductWorkers:', err);
            return (err, { statusCode: '9999' });
        }
    },
    addpromotion: function (req, done) {
        try {
            var TicketServiceData = req.body.TicketServiceData;
            var ticketProductsList = req.body.ticketProductsList;
            var queries = '';
            if (TicketServiceData && TicketServiceData.length > 0) {
                for (var i = 0; i < TicketServiceData.length; i++) {
                    if (TicketServiceData[i].Net_Price__c) {
                        queries += mysql.format('UPDATE ' + config.dbTables.ticketServiceTBL
                            + ' SET Promotion__c = "' + TicketServiceData[i].Promotion__c
                            + '", Net_Price__c = "' + TicketServiceData[i].Net_Price__c
                            + '" WHERE Id = "' + TicketServiceData[i].TicketServiceId + '" AND (Promotion__c IS NULL OR Promotion__c = "");');
                    }
                }
            }
            if (ticketProductsList && ticketProductsList.length > 0) {
                for (var i = 0; i < ticketProductsList.length; i++) {
                    if (ticketProductsList[i].Net_Price__c) {
                        queries += mysql.format('UPDATE ' + config.dbTables.ticketProductTBL
                            + ' SET Promotion__c = "' + ticketProductsList[i].Promotion__c
                            + '", Net_Price__c = "' + ticketProductsList[i].Net_Price__c
                            + '" WHERE Id = "' + ticketProductsList[i].Id + '" AND (Promotion__c IS NULL OR Promotion__c = "");');
                    }
                }
            }
            if (queries.length > 0) {
                execute.query(queries, function (err, result) {
                    done(err, result);
                });
            }
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - addpromotion:', err);
            return (err, { statusCode: '9999' });
        }
    },
    addClientMembership: function (req, done) {
        var ClientMembershipObj = req.body;
        var date = new Date();
        try {
            var ClientMembershipObjData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                Auto_Bill__c: ClientMembershipObj.Auto_Bill__c,
                Billing_Status__c: 'Approved',
                Client__c: ClientMembershipObj.Client__c,
                Membership_Price__c: ClientMembershipObj.Membership_Price__c,
                Membership__c: ClientMembershipObj.Membership__c,
                Next_Bill_Date__c: ClientMembershipObj.Next_Bill_Date__c,
                Payment_Type__c: ClientMembershipObj.Payment_Type__c,
                Result__c: ClientMembershipObj.Result__c,
                Token__c: ClientMembershipObj.Token__c
            };
            var insertQuery = 'INSERT INTO ' + config.dbTables.clientMembershipTBL + ' SET ?';
            execute.query(insertQuery, ClientMembershipObjData, function (ticketPrdErr, ticketPrdResult) {
                if (ticketPrdErr) {
                    logger.error('Error in CheckOut dao - addClientMembership:', ticketPrdErr);
                    done(ticketPrdErr, { statusCode: '9999' });
                } else {
                    var sqlQuery = "UPDATE " + config.dbTables.ContactTBL
                        + " SET Membership_ID__c = '" + ClientMembershipObj.Membership_ID__c + "'"
                        + ", Active__c = " + 1
                        + ", LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Id = '" + ClientMembershipObj.Client__c + "'";
                    execute.query(sqlQuery, '', function (err, result) {
                        if (err) {
                            logger.error('Error in CheckOut dao - addClientMembership:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            var paymentLine = {
                                paymentIconURL: '',
                                paymentCustomURL: '',
                                isElectronic: '',
                                displayCCReaderPanel: '',
                                swipeInput: '',
                                readyToProcessCreditCard: '',
                                creditCardMessage: '',
                                creditCardError: '',
                                paymentTypeName: '',
                                ticketPayment: ''
                            }
                            merchantElectronicBilling = false;
                            // done(err, result)
                            var ptYsQL = 'Select p.Reads_Only_Name__c, p.Read_Only_Active_Flag__c, p.Transaction_Fee_Percentage__c, '
                                + ' p.Transaction_Fee_Per_Transaction__c, p.SystemModstamp, p.Sort_Order__c, p.Process_Electronically__c, '
                                + ' p.OwnerId, p.Name, p.Minimum_Purchase_Amount__c, p.LastModifiedDate, p.Process_Electronically_Online__c, '
                                + ' p.LastModifiedById, p.IsDeleted, p.Id, p.CreatedDate, p.CreatedById, Active__c, p.Abbreviation__c, '
                                + ' Icon_Document_Name__c from Payment_Types__c p where p.Id ="' + ClientMembershipObj.Payment_Type__c + '" ';
                            execute.query(ptYsQL, '', function (err, result) {
                                if (err) {
                                    logger.error('Error in CheckOut dao - addClientMembership:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    if (result[0] != null) {
                                        autoBilling = result[0].Process_Electronically__c;
                                        paymentId = result[0].Id;
                                        if (merchantElectronicBilling && autoBilling) {
                                            allowAutoBill = true;
                                            allowSave = false;
                                        } else if (merchantElectronicBilling && !autoBilling) {
                                            allowAutoBill = false;
                                            allowSave = true;
                                        } else {
                                            allowAutoBill = false;
                                            autoBilling = false;
                                            allowSave = true;
                                        }
                                    } else {
                                        paymentLines = [];
                                        allowSave = false;
                                        autoBilling = false;
                                        //reset other vars back to none status
                                        paymentLine.swipeInput = null;
                                        paymentLine.paymentCustomURL = null;
                                        paymentLine.paymentTypeName = null;
                                        paymentLine.isElectronic = false;
                                        paymentLine.displayCCReaderPanel = false;
                                        selectedPaymentType = null;
                                    }
                                    var selectSql = 'SELECT Name, CreatedDate FROM `Appt_Ticket__c` where isDeleted =0 ORDER BY CreatedDate DESC';
                                    execute.query(selectSql, '', function (err, result) {
                                        if (err) {
                                            done(err, result);
                                        } else {
                                            if (result && result[0].Name) {
                                                var generator = new sequential.Generator({
                                                    digits: 6,
                                                    restore: result[0].Name
                                                });
                                                apptName = generator.generate();
                                            } else {
                                                apptName = '000001';
                                            }
                                        }
                                        var apptObjData = {
                                            Id: uniqid(),
                                            OwnerId: uniqid(),
                                            IsDeleted: 0,
                                            Name: apptName,
                                            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                                            CreatedById: uniqid(),
                                            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                                            LastModifiedById: uniqid(),
                                            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                                            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                                            Appt_Date_Time__c: dateFns.getUTCDatTmStr(new Date()),
                                            Client__c: ClientMembershipObj.Client__c,
                                            Duration__c: 0,
                                            Status__c: 'Checked In',
                                            isTicket__c: 1,
                                            isNoService__c: 1
                                            //   Notes__c: expressBookingObj.textArea
                                        }
                                        var insertQuery = 'INSERT INTO ' + config.dbTables.apptTicketTBL + ' SET ?';
                                        execute.query(insertQuery, apptObjData, function (apptDataErr, apptDataResult) {
                                            if (apptDataErr) {
                                                logger.error('Error in CheckOut dao - createAppt:', apptDataErr);
                                                done(apptDataErr, { statusCode: '9999' });
                                            } else {
                                                //	if the payment line is an electronic payment and it's not persisted yet, insert the Ticket_Payment__c
                                                //	record so we have an Id to pass to the payment processing method.
                                                // if (autoBilling) {
                                                // if (aTicketPayment.Id == null) {
                                                var paymentOtherObjData = {
                                                    Id: uniqid(),
                                                    IsDeleted: 0,
                                                    CreatedDate: dateFns.getUTCDatTmStr(date),
                                                    CreatedById: uniqid(),
                                                    LastModifiedDate: dateFns.getUTCDatTmStr(date),
                                                    LastModifiedById: uniqid(),
                                                    SystemModstamp: dateFns.getUTCDatTmStr(date),
                                                    LastModifiedDate: dateFns.getUTCDatTmStr(date),
                                                    Amount_Paid__c: ClientMembershipObj.Membership_Price__c,
                                                    Appt_Ticket__c: apptObjData.Id,
                                                    Payment_Gateway_Name__c: 'AnywhereCommerce',
                                                    Payment_Type__c: ClientMembershipObj.Payment_Type__c,
                                                };
                                                var insertQuery = 'INSERT INTO ' + config.dbTables.ticketPaymentsTBL + ' SET ?';
                                                execute.query(insertQuery, paymentOtherObjData, function (ticketPaymentErr, ticketPaymentResult) {
                                                    if (ticketPaymentErr) {
                                                        logger.error('Error in CheckOut dao - addToTicketpayments:', ticketPaymentErr);
                                                        done(ticketPaymentErr, { statusCode: '9999' });
                                                    } else {
                                                        // aTicketPayment.Payment_Gateway_Name__c = paymentGatewayName;
                                                        // }
                                                        //  else {
                                                        //     aTicketPayment.Payment_Type__c = this.paymentId;
                                                        //     aTicketPayment.Amount_Paid__c = this.selectedMembershipPrice;
                                                        // }

                                                        // aPaymentLine.paymentCustomURL = '#paymentPageBlock';
                                                        // if (this.isMobile) {
                                                        // if (paymentGatewayName == PaymentBIZ.ANYWHERECOMMERCE) {
                                                        //     // aTicketPayment.Payment_Gateway_Name__c = PaymentBIZ.ANYWHERECOMMERCE;
                                                        //     //	this is a custom URL for the STX-Beacon-AC app on an iOS/Android device
                                                        //     aPaymentLine.paymentCustomURL = 'stxbcn://processCard?CREDITAMT='
                                                        //         + this.selectedMembershipPrice + '&TRANIDENT=' + aTicketPayment.Id
                                                        //         + '&CUSTIDENT=' + this.client.Id
                                                        //         + '&TERMID=' + this.merchantID + '&SECRET=' + this.merchantKey;
                                                        // }
                                                        // } else {
                                                        //     aPaymentLine.creditCardMessage = System.Label.Label_Ready_CC_Swipe;
                                                        //     aPaymentLine.displayCCReaderPanel = true;
                                                        // }

                                                        //	also persist Client_Membership__c record so we can enroll the card in secure storage
                                                        // if (this.clientMembership.id == null) {
                                                        //     this.clientMembership.Client__c = this.client.id;
                                                        //     this.clientMembership.Membership__c = this.selectedMembership;
                                                        //     insert this.clientMembership;
                                                        // }
                                                        // } 
                                                        // else {
                                                        //     if (aTicketPayment.Id == null) {
                                                        //         aTicketPayment.Appt_Ticket__c = this.appt.Id;
                                                        //         aTicketPayment.Payment_Type__c = this.paymentId;
                                                        //         aTicketPayment.Amount_Paid__c = this.selectedMembershipPrice;
                                                        //     } else {
                                                        //         aTicketPayment.Payment_Type__c = this.paymentId;
                                                        //         aTicketPayment.Amount_Paid__c = this.selectedMembershipPrice;
                                                        //     }
                                                        // }
                                                        //create a ticket other record so you don't end up with a payment that is out of balance if user navigates away without clicking cancel
                                                        var ticketOtherDataObj = {
                                                            Id: uniqid(),
                                                            IsDeleted: 0,
                                                            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                                                            CreatedById: uniqid(),
                                                            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                                                            LastModifiedById: uniqid(),
                                                            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                                                            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                                                            Ticket__c: apptObjData.Id,
                                                            Amount__c: ClientMembershipObj.Membership_Price__c,
                                                            Transaction_Type__c: 'Membership',
                                                            Gift_Type__c: null,
                                                            Gift_Number__c: null,
                                                            Membership__c: ClientMembershipObj.Membership__c
                                                        };
                                                        var insertQuery = 'INSERT INTO ' + config.dbTables.ticketOtherTBL + ' SET ?';
                                                        execute.query(insertQuery, ticketOtherDataObj, function (err, result) {
                                                            if (err) {
                                                                logger.error('Error in CheckOut dao - addToMiscSale:', err);
                                                                done(err, { statusCode: '9999' });
                                                            } else {
                                                                done(err, result)
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - addClientMembership:', err);
            return (err, { statusCode: '9999' });
        }
    },

    addToTicketOther: function (req, done1) {
        var ticketOtherData = req.body;
        try {
            if (req.params.type === 'New') {
                createAppt(ticketOtherData, function (err, done) {
                    ticketOtherData.Ticket__c = done;
                    createTicketOther(ticketOtherData, function (err, done) {
                        done1(err, done)
                    });
                });
            } else {
                createTicketOther(ticketOtherData, function (err, done) {
                    done1(err, done)
                });
            }
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - addToTicketOther:', err);
            return (err, { statusCode: '9999' });
        }
    },
    addToTicketpayments: function (req, done) {
        var ticketpaymentsData = req.body;
        var date = new Date();
        try {
            var paymentOtherObjData = {
                Id: ticketpaymentsData.Id,
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(date),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(date),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(date),
                LastModifiedDate: dateFns.getUTCDatTmStr(date),
                Amount_Paid__c: ticketpaymentsData.amountToPay,
                Appt_Ticket__c: ticketpaymentsData.apptId,
                Merchant_Account_Name__c: ticketpaymentsData.merchantAccnt,
                Notes__c: ticketpaymentsData.notes,
                Payment_Type__c: ticketpaymentsData.paymentType,
                Approval_Code__c: ticketpaymentsData.approvalCode
            };
            var insertQuery = 'INSERT INTO ' + config.dbTables.ticketPaymentsTBL + ' SET ?';
            execute.query(insertQuery, paymentOtherObjData, function (ticketPaymentErr, ticketPaymentResult) {
                if (ticketPaymentErr) {
                    logger.error('Error in CheckOut dao - addToTicketpayments:', ticketPaymentErr);
                    done(ticketPaymentErr, { statusCode: '9999' });
                } else {
                    var status = 'Complete';
                    var sqlQuery = "UPDATE " + config.dbTables.apptTicketTBL
                        + " SET Status__c = '" + status
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Id = '" + ticketpaymentsData.apptId + "'";
                    execute.query(sqlQuery, '', function (ticketErr, ticketResult) {
                        if (ticketErr) {
                            logger.error('Error in CheckOut dao - addToTicketpayments:', ticketErr);
                            done(ticketErr, { statusCode: '9999' });
                        } else {
                            done(ticketPaymentErr, ticketPaymentResult)
                        }
                    });
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - addToTicketpayments:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getMerchantWorker: function (req, done) {
        try {
            var sqlQuery = 'SELECT Id,FirstName, LastName, Payment_Gateway__c,Merchant_Account_Key__c, Merchant_Account_Test__c, '
                + ' Merchant_Account_ID__c, CreatedDate, Display_Order__c FROM `User__c` WHERE Merchant_Account_ID__c IS NOT null '
                + ' AND Merchant_Account_ID__c != "null" AND Merchant_Account_ID__c != ""'
            execute.query(sqlQuery, '', function (workerErr, workerResult) {
                if (workerErr) {
                    logger.error('Error in CheckOut dao - getMerchantWorker:', workerErr);
                    done(workerErr, { statusCode: '9999' });
                } else {
                    done(workerErr, workerResult)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getMerchantWorker:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getTicketPayments: function (req, done) {
        try {
            var sqlQuery = 'SELECT tp.*, pt.Name as paymentTypeName FROM `Ticket_Payment__c` as tp '
                + 'JOIN Payment_Types__c as pt on pt.Id = tp.Payment_Type__c WHERE tp.Appt_Ticket__c = "' + req.params.id + '"';
            execute.query(sqlQuery, '', function (tcktErr, tcktResult) {
                if (tcktErr) {
                    logger.error('Error in CheckOut dao - getTicketPayments:', tcktErr);
                    done(tcktErr, { statusCode: '9999' });
                } else {
                    done(tcktErr, tcktResult)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getTicketPayments:', err);
            return (err, { statusCode: '9999' });
        }
        // }
    },
    addToMiscSale: function (req, done1) {
        var miscSaleData = req.body;
        try {
            if (req.params.type === 'New') {
                createAppt(miscSaleData, function (err, done) {
                    miscSaleData.Ticket__c = done;
                    createMisc(miscSaleData, function (err, done) {
                        done1(err, done)
                    });
                });
            } else {
                createMisc(miscSaleData, function (err, done) {
                    done1(err, done)
                });
            }
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - addToMiscSale:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
  * This function lists getTicketOther
  */
    getTicketOther: function (req, done) {
        try {
            // var sqlQuery = 'SELECT * FROM ' + config.dbTables.ticketOtherTBL + ' where isDeleted = 0';
            if (req.params.type === "Misc Sale") {
                sqlQuery = 'SELECT * FROM Ticket_Other__c where isDeleted = 0 and Transaction_Type__c = "Misc Sale" and Ticket__c = "' + req.params.id + '"';
            } else {
                sqlQuery = 'SELECT p.Name as packageName, tco.* FROM Ticket_Other__c as tco '
                    + ' left JOIN Package__c as p on p.Id = tco.Package__c '
                    + ' where tco.isDeleted = 0 and tco.Ticket__c = "' + req.params.id + '"';
            }
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getTicketOther:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getCheckOutProducts:', err);
            return (err, { statusCode: '9999' });
        }
    },
    updateMiscSale: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.ticketOtherTBL
                + " SET Amount__c = '" + req.body.Amount__c
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + Id + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - updateMiscSale:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - updateMiscSale:', err);
            return (err, { statusCode: '9999' });
        }
    },
    deleteMiscSale: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.ticketOtherTBL
                + " SET isDeleted = 1 "
                + ", LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + Id + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - deleteMiscSale:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - deleteMiscSale:', err);
            return (err, { statusCode: '9999' });
        }
    },
    updateTicketOther: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.ticketOtherTBL
                + " SET Amount__c = '" + req.body.Amount__c
                + "', Package_Price__c = '" + req.body.Package_Price__c
                + "', Package__c = '" + req.body.Package__c
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + Id + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - updateTicketOther:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - updateTicketOther:', err);
            return (err, { statusCode: '9999' });
        }
    },
    deleteTicketOther: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.ticketOtherTBL
                + " SET isDeleted = 1 "
                + ", LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + Id + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - deleteTicketOther:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - deleteTicketOther:', err);
            return (err, { statusCode: '9999' });
        }
    },
    editVisitType: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.apptTicketTBL
                + " SET Client_Type__c = '" + req.body.vistTypeVal
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + Id + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - deleteTicketOther:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - deleteTicketOther:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getClientMembership: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = " select * from " + config.dbTables.clientMembershipTBL + " where isDeleted = 0";
            var sqlClientQuery = " select Membership_ID__c from Contact__c where isDeleted = 0";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - deleteTicketOther:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    execute.query(sqlClientQuery, '', function (err, clientresult) {
                        if (err) {
                            logger.error('Error in CheckOut dao - deleteTicketOther:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, { result, clientresult })
                        }
                    });

                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - deleteTicketOther:', err);
            return (err, { statusCode: '9999' });
        }
    },
    addClient: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.apptTicketTBL
                + " SET Client__c = '" + req.body.clientId
                + "' WHERE Id = '" + req.params.id + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - deleteTicketOther:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - deleteTicketOther:', err);
            return (err, { statusCode: '9999' });
        }
    },
    addToCashInOut: function (req, done) {
        var cashInOutData = req.body;
        try {
            var cashInOutObjData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                Amount__c: cashInOutData.Amount__c,
                Drawer_Name__c: cashInOutData.Drawer_Name__c,
                Drawer_Number__c: cashInOutData.Drawer_Number__c,
                From__c: cashInOutData.From__c,
                Reason__c: cashInOutData.Reason__c,
                To__c: cashInOutData.To__c,
                Transaction_By__c: cashInOutData.Transaction_By__c,
                Type__c: cashInOutData.Type__c
            };
            var insertQuery = 'INSERT INTO ' + config.dbTables.cashInOutTBL + ' SET ?';
            execute.query(insertQuery, cashInOutObjData, function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - addToCashInOut:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - addToCashInOut:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getRefund: function (req, done) {
        try {
            var Id = req.params.id;
            var ticketsToExcludeSet = [];
            if (req.body.type == 'Payment Overcharge') {
                if (req.body.id === 'no client') {
                    var sqlQuery = 'select tpay.Id, at.Id as Appt_Ticket__c, at.Name as apptName, at.Appt_Date_Time__c, at.Client__c, at.Client_Type__c, c.FirstName, c.LastName, c.System_Client__c,c.Phone, c.MobilePhone, c.Email, c.Active__c, at.Status__c, at.Status_Color__c, '
                        + ' at.Service_Sales__c, at.Service_Tax__c, at.Product_Sales__c, at.Product_Tax__c, at.Other_Sales__c, at.Included_Ticket_Amount__c, at.Paid_By_Ticket__c, '
                        + ' SUM(at.Service_Sales__c + ts.Service_Tax__c + at.Product_Sales__c + tp.Product_Tax__c + at.Other_Sales__c) as Ticket_Total__c, at.Payments__c, at.CreatedDate, at.CreatedById, at.LastModifiedDate, '
                        + ' at.LastModifiedById, at.Booked_Online__c, c.Current_Balance__c, c.Starting_Balance__c, at.isRefund__c, at.isNoService__c, at.Tips__c, c.Active_Rewards__c, '
                        + ' at.Has_Booked_Package__c, at.Is_Class__c, ts.Original_Ticket_Service__c, ts.Is_Class__c, ts.Max_Attendees__c, ts.Price_per_Attendee__c, '
                        + ' tp.Original_Ticket_Product__c, tpay.Payment_Type__c, p.Name, tpay.Amount_Paid__c, tpay.Original_Ticket_Payment__c, '
                        + ' p.Process_Electronically_Online__c, p.Process_Electronically__c, tot.Transaction_Type__c '
                        + ' from Appt_Ticket__c as at '
                        + ' LEFT JOIN Contact__c as c on c.Id = at.Client__c '
                        + ' LEFT JOIN Ticket_Service__c as ts on ts.Appt_Ticket__c = at.Id '
                        + ' LEFT JOIN Ticket_Product__c as tp on tp.Appt_Ticket__c = at.Id '
                        + ' LEFT JOIN Ticket_Payment__c as tpay on tpay.Appt_Ticket__c = at.Id '
                        + ' LEFT JOIN Payment_Types__c as p on p.Id = tpay.Payment_Type__c '
                        + ' LEFT JOIN Ticket_Other__c as tot on tot.Ticket__c = at.Id '
                        + ' where at.Status__c = "Complete" '
                        + ' and DATE(at.Appt_Date_Time__c) >= "' + req.body.startDate + '"'
                        + ' and DATE(at.Appt_Date_Time__c) <= "' + req.body.endDate + '" '
                        + ' order by at.Appt_Date_Time__c desc ';
                } else {
                    var sqlQuery = 'select tpay.Id, at.Id as Appt_Ticket__c, at.Name as apptName, at.Appt_Date_Time__c, at.Client__c, at.Client_Type__c, c.FirstName, c.LastName, c.System_Client__c,c.Phone, c.MobilePhone, c.Email, c.Active__c, at.Status__c, at.Status_Color__c, '
                        + ' at.Service_Sales__c, at.Service_Tax__c, at.Product_Sales__c, at.Product_Tax__c, at.Other_Sales__c, at.Included_Ticket_Amount__c, at.Paid_By_Ticket__c, '
                        + ' SUM(at.Service_Sales__c + ts.Service_Tax__c + at.Product_Sales__c + tp.Product_Tax__c + at.Other_Sales__c) as Ticket_Total__c, at.Payments__c, at.CreatedDate, at.CreatedById, at.LastModifiedDate, '
                        + ' at.LastModifiedById, at.Booked_Online__c, c.Current_Balance__c, c.Starting_Balance__c, at.isRefund__c, at.isNoService__c, at.Tips__c, c.Active_Rewards__c, '
                        + ' at.Has_Booked_Package__c, at.Is_Class__c, ts.Original_Ticket_Service__c, ts.Is_Class__c, ts.Max_Attendees__c, ts.Price_per_Attendee__c, '
                        + ' tp.Original_Ticket_Product__c, tpay.Payment_Type__c, p.Name, tpay.Amount_Paid__c, tpay.Original_Ticket_Payment__c, '
                        + ' p.Process_Electronically_Online__c, p.Process_Electronically__c, tot.Transaction_Type__c '
                        + ' from Appt_Ticket__c as at '
                        + ' LEFT JOIN Contact__c as c on c.Id = at.Client__c '
                        + ' LEFT JOIN Ticket_Service__c as ts on ts.Appt_Ticket__c = at.Id '
                        + ' LEFT JOIN Ticket_Product__c as tp on tp.Appt_Ticket__c = at.Id '
                        + ' LEFT JOIN Ticket_Payment__c as tpay on tpay.Appt_Ticket__c = at.Id '
                        + ' LEFT JOIN Payment_Types__c as p on p.Id = tpay.Payment_Type__c '
                        + ' LEFT JOIN Ticket_Other__c as tot on tot.Ticket__c = at.Id '
                        + ' where at.Client__c = "' + req.body.id + '" '
                        + ' and at.Status__c = "Complete" '
                        + ' and DATE(at.Appt_Date_Time__c) >= "' + req.body.startDate + '"'
                        + ' and DATE(at.Appt_Date_Time__c) <= "' + req.body.endDate + '" '
                        + ' order by at.Appt_Date_Time__c desc ';
                }
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in CheckOut dao - deleteTicketOther:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var rtnObj = result.filter(function (a) {
                            return (a['Transaction_Type__c'] === 'Membership' || a['Original_Ticket_Service__c'] === null
                                || a['Original_Ticket_Product__c'] === null || a['Original_Ticket_Payment__c'] === null)
                        });
                        done(err, rtnObj)
                    }
                });
            } else if (req.body.type == 'Service Refund') {
                if (req.body.id === 'no client') {
                    var sqlQuery = 'select ts.Id, ts.Appt_Ticket__c, at.Name as apptName, ts.Service_Date_Time__c, ts.Service__c,s.Name as serviceName, '
                        + ' ts.Price__c, ts.Net_Price__c, ts.Taxable__c, ts.Service_Tax__c, ts.Reward__c, ts.Redeem_Rule_Name__c, ts.Promotion__c, '
                        + ' ts.Worker__c, CONCAT(u.FirstName, " ", u.LastName) as workerName, Original_Ticket_Service__c'
                        + ' from Ticket_Service__c as ts '
                        + ' left join Service__c as s on s.Id = ts.Service__c'
                        + ' left JOIN Appt_Ticket__c as at on at.Id = ts.Appt_Ticket__c '
                        + ' left join User__c as u on u.Id = ts.Worker__c '
                        + ' where at.Status__c = "Complete" '
                        + ' and DATE(ts.Service_Date_Time__c) >= "' + req.body.startDate + '" '
                        + ' and DATE(ts.Service_Date_Time__c) <= "' + req.body.endDate + '" '
                        + ' order by ts.Service_Date_Time__c desc limit 100';
                } else {
                    var sqlQuery = 'select ts.Id, ts.Appt_Ticket__c, at.Name as apptName, ts.Service_Date_Time__c, ts.Service__c,s.Name as serviceName, '
                        + ' ts.Price__c, ts.Net_Price__c, ts.Taxable__c, ts.Service_Tax__c, ts.Reward__c, ts.Redeem_Rule_Name__c, ts.Promotion__c, '
                        + ' ts.Worker__c, CONCAT(u.FirstName, " ", u.LastName) as workerName, Original_Ticket_Service__c'
                        + ' from Ticket_Service__c as ts '
                        + ' left join Service__c as s on s.Id = ts.Service__c'
                        + ' left JOIN Appt_Ticket__c as at on at.Id = ts.Appt_Ticket__c '
                        + ' left join User__c as u on u.Id = ts.Worker__c '
                        + ' where at.Client__c ="' + req.body.id + '" '
                        + ' and at.Status__c = "Complete" '
                        + ' and DATE(ts.Service_Date_Time__c)  >= "' + req.body.startDate + '" '
                        + ' and DATE(ts.Service_Date_Time__c) <= "' + req.body.endDate + '" '
                        + ' order by ts.Service_Date_Time__c desc limit 100';
                }
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in CheckOut dao - deleteTicketOther:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var rtnObj = result.filter(function (a) { return (a['Net_Price__c'] > 0 && a['Original_Ticket_Service__c'] === null) });
                        for (var i = 0; i < rtnObj.length; i++) {
                            rtnObj[i].selected = false;
                            rtnObj[i].refundAmount = rtnObj[i].Net_Price__c;
                            rtnObj[i].deductFromWorker = 1;
                        }
                        done(err, rtnObj)
                    }
                });
            } else {
                if (req.body.id === 'no client') {
                    var sqlQuery = 'select tp.Id, tp.Appt_Ticket__c, at.Name as apptName, at.Appt_Date_Time__c as Service_Date_Time__c, tp.Product__c, p.Name, tp.Price__c, tp.Net_Price__c, '
                        + ' tp.Qty_Sold__c, tp.Taxable__c, tp.Product_Tax__c, tp.Reward__c, tp.Redeem_Rule_Name__c, tp.Promotion__c, tp.Worker__c, '
                        + ' CONCAT(u.FirstName, " ", u.LastName) as workerName, Original_Ticket_Product__c from Ticket_Product__c as tp left join Appt_Ticket__c as at on at.Id = tp.Appt_Ticket__c '
                        + ' LEFT JOIN Product__c as p on p.Id = tp.Product__c left join User__c as u on u.Id = tp.Worker__c '
                        + ' where at.Status__c = "Complete" and DATE(at.Appt_Date_Time__c) >= "' + req.body.startDate + '" '
                        + ' and DATE(at.Appt_Date_Time__c) <= "' + req.body.endDate + '" order by at.Appt_Date_Time__c desc limit 100';
                } else {
                    var sqlQuery = 'select tp.Id, tp.Appt_Ticket__c, at.Name as apptName, at.Appt_Date_Time__c as Service_Date_Time__c, tp.Product__c, p.Name, tp.Price__c, tp.Net_Price__c, '
                        + ' tp.Qty_Sold__c,(tp.Qty_Sold__c * tp.Net_Price__c) as Extended_Price__c, tp.Taxable__c, tp.Product_Tax__c, tp.Reward__c, tp.Redeem_Rule_Name__c, tp.Promotion__c, tp.Worker__c, '
                        + ' CONCAT(u.FirstName, " ", u.LastName) as workerName, Original_Ticket_Product__c from Ticket_Product__c as tp left join Appt_Ticket__c as at on at.Id = tp.Appt_Ticket__c '
                        + ' LEFT JOIN Product__c as p on p.Id = tp.Product__c left join User__c as u on u.Id = tp.Worker__c '
                        + ' where at.Client__c ="' + req.body.id + '" and at.Status__c = "Complete" and DATE(at.Appt_Date_Time__c) >= "' + req.body.startDate + '" '
                        + ' and DATE(at.Appt_Date_Time__c) <= "' + req.body.endDate + '" order by at.Appt_Date_Time__c desc limit 100';
                }
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in CheckOut dao - deleteTicketOther:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var rtnObj = result.filter(function (a) { return (a['Net_Price__c'] > 0 && a['Original_Ticket_Product__c'] === null) });
                        for (var i = 0; i < rtnObj.length; i++) {
                            rtnObj[i].selected = false;
                            rtnObj[i].refundAmount = rtnObj[i].Extended_Price__c;
                            rtnObj[i].deductFromWorker = 1;
                            rtnObj[i].returnToInventory = 1;
                        }
                        done(err, rtnObj)
                    }
                });
            }
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - deleteTicketOther:', err);
            return (err, { statusCode: '9999' });
        }
    },

    getPaymentRefund: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = ' SELECT tpay.Id,tpay.Name, tp.Amount_Paid__c, tp.Merchant_Account_Name__c,tp.Reference_Number__c FROM Ticket_Payment__c as tp '
                + ' left join Payment_Types__c as tpay on tpay.Id = tp.Payment_Type__c '
                + ' where tp.Appt_Ticket__c = "' + Id + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - deleteTicketOther:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - deleteTicketOther:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getCashCounting: function (req, done) {
        var showReadOnly = false;
        var showClosing = false;
        var showOpening = false;
        var dailyCashRecord;
        var cashDrawerNumber = req.params.drawer.split(' ')[0];
        var sqlQuery = 'select Id, Cash_Drawer_Number__c, CONCAT(Cash_Drawer_Number__c,"-", Cash_Drawer__c) as cashdrawer, Date__c, Status__c, Cash_In_Out_Total__c, '
            + ' Cash_Over_Under__c, Close_1__c, Close_10__c, Close_100__c, Close_10_cent__c, Close_1_cent__c, Close_20__c, '
            + ' Close_25_cent__c, Close_5__c, Close_50__c, Close_50_cent__c, Close_5_cent__c, Closing_Cash__c, Open_1__c, Open_10__c, '
            + ' Open_100__c, Open_10_cent__c, Open_1_cent__c, Open_20__c, Open_25_cent__c, Open_5__c, Open_50__c, Open_50_cent__c, '
            + ' Open_5_cent__c, Opening_Cash__c, Total_Close__c, Total_Open__c, Transaction_Total__c from Daily_Cash__c '
            + ' where Date__c ="' + req.params.date + '" and Cash_Drawer_Number__c ="' + cashDrawerNumber + '"';
        execute.query(sqlQuery, '', function (err, result) {
            if (err) {
                logger.error('Error in CheckOut dao - deleteTicketOther:', err);
                done(err, { statusCode: '9999' });
            } else {
                if (result != null && result.length > 0) {
                    dailyCashRecord = result[0];
                    if (dailyCashRecord.Status__c == 'Closed')
                        showReadOnly = true;
                    if (dailyCashRecord.Status__c == 'Open')
                        showClosing = true;
                } else
                    showOpening = true;
                if (!showReadOnly) {
                    /* 
                         *	This method prepares the report's data
                         */
                    // no record exists, so initialize with 0s
                    if (showOpening)
                        var dailyCashRecord = {};
                    if (dailyCashRecord.Opening_Cash__c == null)
                        dailyCashRecord.Opening_Cash__c = 0;
                    if (dailyCashRecord.Closing_Cash__c == null)
                        dailyCashRecord.Closing_Cash__c = 0;
                    if (dailyCashRecord.Transaction_Total__c == null)
                        dailyCashRecord.Transaction_Total__c = 0;
                    if (dailyCashRecord.Cash_In_Out_Total__c == null)
                        dailyCashRecord.Cash_In_Out_Total__c = 0;
                    // var cashDrawerNumber = cashDrawerNumber;
                    var cashPaidInOut = 0;
                    var cashpaidSql = 'select sum(Amount__c) cashAmount from Cash_In_Out__c where  DATE(CreatedDate) ="' + req.params.date + '" '
                        + ' and Drawer_Number__c ="' + cashDrawerNumber + '"';
                    execute.query(cashpaidSql, '', function (err, result) {
                        var cashInOutList = result;
                        if (cashInOutList != null && cashInOutList.length > 0) {
                            cashPaidInOut = cashInOutList[0].cashAmount;
                            if (cashPaidInOut == null)
                                cashPaidInOut = 0;
                            dailyCashRecord.Cash_In_Out_Total__c = cashPaidInOut;
                        }
                        var tipPaidOutAmount = 0;
                        var tipSql = 'select sum(tp.Tip_Amount__c) tipsPaidOut from Ticket_Tip__c as tp left join Appt_Ticket__c '
                            + ' as a on a.Id = tp.Appt_Ticket__c where tp.Drawer_Number__c ="' + cashDrawerNumber + '" and a.Status__c in ("Complete", "Checked In") '
                            + '  and tp.Tip_Option__c ="Tip Paid Out" and DATE(a.Appt_Date_Time__c)  ="' + req.params.date + '"';
                        execute.query(tipSql, '', function (err, result) {
                            var tipsPaidOutList = result;
                            if (tipsPaidOutList != null && tipsPaidOutList.length > 0) {
                                tipPaidOutAmount = tipsPaidOutList[0].tipsPaidOut;
                                if (tipPaidOutAmount == null)
                                    tipPaidOutAmount = 0;
                            }
                            var tipLeftInDrawerAmount = 0;
                            var tipleftSql = 'select sum(tp.Tip_Amount__c) tipsLeftInDrawer from Ticket_Tip__c as tp left join Appt_Ticket__c as a on a.Id = tp.Appt_Ticket__c '
                                + ' where tp.Drawer_Number__c ="' + cashDrawerNumber + '" and a.Status__c in ("Complete", "Checked In") '
                                + ' and tp.Tip_Option__c ="Tip Left in Drawer" and DATE(a.Appt_Date_Time__c)  ="' + req.params.date + '"';
                            execute.query(tipleftSql, '', function (err, result) {
                                var tipsLeftInDrawerList = result
                                if (tipsLeftInDrawerList != null && tipsLeftInDrawerList.length > 0) {
                                    tipLeftInDrawerAmount = tipsLeftInDrawerList[0].tipsLeftInDrawer;
                                    if (tipLeftInDrawerAmount == null)
                                        tipLeftInDrawerAmount = 0;
                                }
                                var cashPaymentAmount = 0;
                                var cashSql = 'select sum(tp.Amount_Paid__c) amountPaid from Ticket_Payment__c as tp left JOIN Payment_Types__c as '
                                    + ' p on p.Id=tp.Payment_Type__c LEFT JOIN Appt_Ticket__c as a on a.Id=tp.Appt_Ticket__c where '
                                    + ' tp.Drawer_Number__c ="' + cashDrawerNumber + '" and p.Name ="Cash" and a.Status__c in ("Complete", "Checked in") '
                                    + ' and DATE(a.Appt_Date_Time__c) ="' + req.params.date + '"';
                                execute.query(cashSql, '', function (err, result) {
                                    var cashPaymentList = result;
                                    if (cashPaymentList != null && cashPaymentList.length > 0) {
                                        cashPaymentAmount = cashPaymentList[0].amountPaid;
                                        if (cashPaymentAmount == null)
                                            cashPaymentAmount = 0;
                                    }
                                    // NOTE: Balance Due will be a negative number or zero on completed tickets
                                    var balanceDue = 0;
                                    // var balanceSql = 'select sum(a.Balance_Due__c) balanceDue from Appt_Ticket__c where a.Drawer_Number__c ="' + cashDrawerNumber + '" '
                                    //     + ' and a.Status__c in ("Complete", "Checked In") and a.Appt_Date_Time__c ="' + req.params.date + '" And a.Balance_Due__c < 0';
                                    // execute.query(balanceSql, '', function (err, result) {
                                    // var balanceDueList = result;
                                    // if (balanceDueList != null && balanceDueList.length > 0) {
                                    // balanceDue = balanceDueList[0].balanceDue;
                                    // if (balanceDue == null)
                                    // }
                                    //System.debug( '**** getReportData - cashPaymentAmount ' + cashPaymentAmount
                                    //	+ '   tipPaidOutAmount ' + tipPaidOutAmount + '   tipLeftInDrawerAmount ' + tipLeftInDrawerAmount
                                    //	+ '   balanceDue ' + balanceDue );
                                    dailyCashRecord.Transaction_Total__c = cashPaymentAmount + tipLeftInDrawerAmount + balanceDue;
                                    dailyCashRecord.Cash_Over_Under__c = dailyCashRecord.Closing_Cash__c - (dailyCashRecord.Opening_Cash__c + dailyCashRecord.Transaction_Total__c + dailyCashRecord.Cash_In_Out_Total__c);
                                    done(err, { dailyCashRecord, showReadOnly, showClosing, showOpening })
                                    // });
                                    // done(err, result)
                                });
                            });
                        });
                    });
                } else {
                    done(null, { dailyCashRecord, showReadOnly, showClosing, showOpening })
                }
            }
        });
    },
    saveCashCounting: function (req, done) {
        var cashCounting = req.body;
        try {
            var cashCountingData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                Cash_Drawer_Number__c: cashCounting.Cash_Drawer_Number__c,
                Cash_Drawer__c: cashCounting.Cash_Drawer__c,
                Cash_In_Out_Total__c: cashCounting.Cash_In_Out_Total__c,
                Cash_Over_Under__c: cashCounting.Cash_Over_Under__c,
                Date__c: cashCounting.Date__c,
                Open_100__c: cashCounting.Open_100__c,
                Open_10__c: cashCounting.Open_10__c,
                Open_10_cent__c: cashCounting.Open_10_cent__c,
                Open_1__c: cashCounting.Open_1__c,
                Open_1_cent__c: cashCounting.Open_1_cent__c,
                Open_20__c: cashCounting.Open_20__c,
                Open_25_cent__c: cashCounting.Open_25_cent__c,
                Open_50__c: cashCounting.Open_50__c,
                Open_50_cent__c: cashCounting.Open_50_cent__c,
                Open_5__c: cashCounting.Open_5__c,
                Open_5_cent__c: cashCounting.Open_5_cent__c,
                Opening_Cash__c: cashCounting.Opening_Cash__c,
                Status__c: cashCounting.Status__c,
                Total_Open__c: cashCounting.Total_Open__c,
                Transaction_Total__c: cashCounting.Transaction_Total__c
            };
            var insertQuery = 'INSERT INTO ' + config.dbTables.dailyCashTBL + ' SET ?';
            if (cashCounting.Total_Open__c > 0) {
                execute.query(insertQuery, cashCountingData, function (err, result) {
                    if (err) {
                        logger.error('Error in CheckOut dao - addToCashInOut:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result)
                    }
                });
            } else {
                done(null, [])
            }
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - addToCashInOut:', err);
            return (err, { statusCode: '9999' });
        }
    },
    updateCashCounting: function (req, done) {
        var cashCounting = req.body;
        var queryString = '';
        var tempItem = {
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            Close_100__c: cashCounting.Close_100__c,
            Close_10__c: cashCounting.Close_10__c,
            Close_10_cent__c: cashCounting.Close_10_cent__c,
            Close_1__c: cashCounting.Close_1__c,
            Close_1_cent__c: cashCounting.Close_1_cent__c,
            Close_20__c: cashCounting.Close_20__c,
            Close_25_cent__c: cashCounting.Close_25_cent__c,
            Close_50__c: cashCounting.Close_50__c,
            Close_50_cent__c: cashCounting.Close_50_cent__c,
            Close_5__c: cashCounting.Close_5__c,
            Close_5_cent__c: cashCounting.Close_5_cent__c,
            Closing_Cash__c: cashCounting.Closing_Cash__c,
            Total_Close__c: cashCounting.Total_Close__c,
            Opening_Cash__c: cashCounting.Opening_Cash__c,
            Status__c: cashCounting.Status__c,
            Total_Open__c: cashCounting.Total_Open__c,
            Cash_In_Out_Total__c: cashCounting.Cash_In_Out_Total__c,
            Cash_Over_Under__c: cashCounting.Cash_Over_Under__c,
            Transaction_Total__c: cashCounting.Transaction_Total__c
        }
        var whereCond = {
            Id: req.params.id
        };

        cashPaidInOut = 0;
        var cashInOutListSql = 'select sum(Amount__c) cashAmount from Cash_In_Out__c where DATE(CreatedDate) ="' + cashCounting.Date__c + '"  and Drawer_Number__c ="' + cashCounting.Cash_Drawer_Number__c + '"';
        if (cashCounting.Total_Close__c > 0) {
            execute.query(cashInOutListSql, '', function (err, result) {
                var cashInOutList = result;
                if (cashInOutList != null && cashInOutList.length > 0) {
                    cashPaidInOut = cashInOutList[0].cashAmount;
                    if (cashPaidInOut == null)
                        cashPaidInOut = 0;
                    tempItem.Cash_In_Out_Total__c = cashPaidInOut;
                }
                tipPaidOutAmount = 0;
                var tipPaidOutAmountSql = 'select sum(tp.Tip_Amount__c) tipsPaidOut from Ticket_Tip__c as tp '
                    + ' LEFT JOIN Appt_Ticket__c as a on a.Id= tp.Appt_Ticket__c where tp.Drawer_Number__c ="' + cashCounting.Cash_Drawer_Number__c + '" '
                    + ' and tp.Tip_Option__c ="Tip Paid Out" and a.Status__c in ("Complete", "Checked In")  and DATE(a.Appt_Date_Time__c) ="' + cashCounting.Date__c + '"';
                execute.query(tipPaidOutAmountSql, '', function (err, result) {
                    var tipsPaidOutList = result;
                    if (tipsPaidOutList != null && tipsPaidOutList.length > 0) {
                        tipPaidOutAmount = tipsPaidOutList[0].tipsPaidOut;
                        if (tipPaidOutAmount == null)
                            tipPaidOutAmount = 0;
                    }
                    tipLeftInDrawerAmount = 0;
                    var tipLeftInDrawerAmountSql = 'select sum(tp.Tip_Amount__c) tipsLeftInDrawer from Ticket_Tip__c as tp left join Appt_Ticket__c as a on a.Id = tp.Appt_Ticket__c '
                        + ' where tp.Drawer_Number__c ="' + cashCounting.Cash_Drawer_Number__c + '" and a.Status__c in ("Complete", "Checkrd In") '
                        + ' and tp.Tip_Option__c ="Tip Left in Drawer" and DATE(a.Appt_Date_Time__c) ="' + cashCounting.Date__c + '"';
                    execute.query(tipLeftInDrawerAmountSql, '', function (err, result) {
                        tipsLeftInDrawerList = result;
                        if (tipsLeftInDrawerList != null && tipsLeftInDrawerList.length > 0) {
                            tipLeftInDrawerAmount = tipsLeftInDrawerList[0].tipsLeftInDrawer;
                            if (tipLeftInDrawerAmount == null)
                                tipLeftInDrawerAmount = 0;
                        }
                        cashPaymentAmount = 0;
                        var cashPaymentAmountSql = 'select sum(tp.Amount_Paid__c) amountPaid from Ticket_Payment__c as tp LEFT JOIN Payment_Types__c as p on p.Id = tp.Payment_Type__c '
                            + ' LEFT JOIN Appt_Ticket__c as a on a.Id = tp.Appt_Ticket__c where tp.Drawer_Number__c = "' + cashCounting.Cash_Drawer_Number__c + '"'
                            + ' and p.Name = "Cash" and a.Status__c in ("Complete", "Checked In") and DATE(a.Appt_Date_Time__c) = "' + cashCounting.Date__c + '"'
                        execute.query(cashPaymentAmountSql, '', function (err, result) {
                            cashPaymentList = result;
                            if (cashPaymentList != null && cashPaymentList.length > 0) {
                                cashPaymentAmount = cashPaymentList[0].amountPaid;
                                if (cashPaymentAmount == null)
                                    cashPaymentAmount = 0;
                            }
                            balanceDue = 0;
                            tempItem.Transaction_Total__c = cashPaymentAmount + tipLeftInDrawerAmount + balanceDue;
                            tempItem.Cash_Over_Under__c = tempItem.Closing_Cash__c - (tempItem.Opening_Cash__c + tempItem.Transaction_Total__c + tempItem.Cash_In_Out_Total__c);
                            queryString += mysql.format('UPDATE ' + config.dbTables.dailyCashTBL
                                + ' SET ? '
                                + ' WHERE ?; ', [tempItem, whereCond]);
                            execute.query(queryString, function (error, results) {
                                if (error) {
                                    logger.error('Error in SetupServicePackage dao - updateCashCounting:', error);
                                    done(error, '9999');
                                } else {
                                    done(error, results);
                                }
                            });
                        });
                    });
                });
            });
        } else {
            done(null, [])
        }

    },
    saveRefundPayment: function (req, done) {
        var refundPaymentData = req.body;
        var records = [];
        var indexParm = 0;
        var queries = '';
        var date = dateFns.getUTCDatTmStr(new Date());
        var selectSql = 'SELECT Name, CreatedDate FROM `Appt_Ticket__c` where isDeleted =0 ORDER BY CreatedDate DESC';
        if (refundPaymentData.refundType === 'Service Refund') {
            execute.query(selectSql, '', function (err, result) {
                if (err) {
                    done(err, result);
                } else {
                    if (result && result[0].Name) {
                        var generator = new sequential.Generator({
                            digits: 6,
                            restore: result[0].Name
                        });
                        apptName = generator.generate();
                    } else {
                        apptName = '000001';
                    }
                }
                var apptObjData = {
                    Id: uniqid(),
                    OwnerId: uniqid(),
                    IsDeleted: 0,
                    Name: apptName,
                    CreatedDate: date,
                    CreatedById: uniqid(),
                    LastModifiedDate: date,
                    LastModifiedById: uniqid(),
                    SystemModstamp: date,
                    LastModifiedDate: date,
                    Appt_Date_Time__c: date,
                    Client_Type__c: '',
                    Client__c: refundPaymentData.clientId,
                    Duration__c: 0,
                    Is_Booked_Out__c: 0,
                    New_Client__c: 0,
                    isTicket__c: 1,
                    isRefund__c: 1,
                    Status__c: 'Complete'
                    //   Notes__c: expressBookingObj.textArea
                }
                var insertQuery = 'INSERT INTO ' + config.dbTables.apptTicketTBL + ' SET ?';
                execute.query(insertQuery, apptObjData, function (apptDataErr, apptDataResult) {
                    if (apptDataErr) {
                        logger.error('Error in CheckOut dao - createAppt:', apptDataErr);
                        done(apptDataErr, { statusCode: '9999' });
                    } else {
                        for (var i = 0; i < refundPaymentData.selectList.length; i++) {
                            if(refundPaymentData.clientId === 'no client'){
                                refundPaymentData.clientId = null;
                            }
                            //	Handle Service_Tax__c
                            if (refundPaymentData.selectList[i].Taxable === 1) {
                                if (refundPaymentData.refundToList[i].AmountToRefund == refundPaymentData.selectList[i].Amount)
                                    var Service_Tax__c = -refundPaymentData.selectList[i].Service_Tax__c;
                                else
                                    var Service_Tax__c = -refundPaymentData.selectList[i].Service_Tax__c * (refundPaymentData.refundToList[i].AmountToRefund / refundPaymentData.selectList[i].Amount);
                            }
                            var id = uniqid();
                            records.push([id,
                                config.booleanFalse,
                                date, uniqid(),
                                date, uniqid(),
                                date,
                                apptObjData.Id,
                                '',
                                refundPaymentData.clientId,
                                refundPaymentData.selectList[i].WorkerId,
                                dateFns.getUTCDatTmStr(new Date()),
                                'Complete',
                                '',
                                0,
                                0,
                                0,
                                0,
                                0.0,
                                0,
                                -refundPaymentData.selectList[0].Amount,
                                -refundPaymentData.selectList[0].Amount,
                                0,
                                0,
                                refundPaymentData.selectList[i].ServiceId,
                                '',
                                refundPaymentData.selectList[i].Taxable,
                                refundPaymentData.selectList[i].deductFromWorker,
                                refundPaymentData.selectList[i].id,
                                Service_Tax__c
                            ]);
                            var insertQuery1 = 'INSERT INTO ' + config.dbTables.ticketServiceTBL
                                + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                                + ' SystemModstamp, Appt_Ticket__c, Visit_Type__c, Client__c,'
                                + ' Worker__c, Service_Date_Time__c, Status__c, Service_Group_Color__c,Duration_1__c,Duration_2__c,Duration_3__c, Duration__c, Buffer_After__c,'
                                + ' Is_Booked_Out__c, Net_Price__c,Price__c, Non_Standard_Duration__c, Rebooked__c,Service__c, Notes__c, Taxable__c, Do_Not_Deduct_From_Worker__c, Original_Ticket_Service__c, Service_Tax__c) VALUES ?';
                            queries += mysql.format('UPDATE ' + config.dbTables.ticketServiceTBL
                                + ' SET Original_Ticket_Service__c = "' + refundPaymentData.selectList[i].id
                                + '" WHERE Id = "' + refundPaymentData.selectList[i].id + '";');
                        }
                        execute.query(insertQuery1, [records], function (err1, result1) {
                            if (err1) {
                                logger.error('Error in WorkerServices dao - updateWorkerService:', err1);
                                indexParm++;
                                sendResponse(indexParm, err1, { statusCode: '9999' }, done);
                            } else {
                                execute.query(queries, '', function (err, result) {
                                    var accountChargeRefund = 0.00;
                                    var ptSql = 'Select p.Reads_Only_Name__c, p.Read_Only_Active_Flag__c, p.Transaction_Fee_Percentage__c, p.Transaction_Fee_Per_Transaction__c, '
                                        + ' p.SystemModstamp, p.Sort_Order__c, p.Process_Electronically__c, p.OwnerId, p.Name, p.Minimum_Purchase_Amount__c, '
                                        + ' p.LastModifiedDate, p.Process_Electronically_Online__c, p.LastModifiedById, p.IsDeleted, p.Id, p.CreatedDate, '
                                        + ' p.CreatedById, p.Active__c, p.Abbreviation__c, p.Icon_Document_Name__c from Payment_Types__c p where p.Name ="Cash"';
                                    execute.query(ptSql, '', function (err, result) {
                                        cashPaymentType = result[0];
                                        var accountChargePaymentTypeSql = 'Select p.Reads_Only_Name__c, p.Read_Only_Active_Flag__c, p.Transaction_Fee_Percentage__c, p.Transaction_Fee_Per_Transaction__c, '
                                            + ' p.SystemModstamp, p.Sort_Order__c, p.Process_Electronically__c, p.OwnerId, p.Name, p.Minimum_Purchase_Amount__c, '
                                            + ' p.LastModifiedDate, p.Process_Electronically_Online__c, p.LastModifiedById, p.IsDeleted, p.Id, p.CreatedDate, '
                                            + ' p.CreatedById, p.Active__c, p.Abbreviation__c, p.Icon_Document_Name__c from Payment_Types__c p where p.Name ="Account Charge"';
                                        execute.query(accountChargePaymentTypeSql, '', function (err, result) {
                                            accountChargePaymentType = result[0];
                                            var giftRedemptionPaymentTypeSql = 'Select p.Reads_Only_Name__c, p.Read_Only_Active_Flag__c, p.Transaction_Fee_Percentage__c, p.Transaction_Fee_Per_Transaction__c, '
                                                + ' p.SystemModstamp, p.Sort_Order__c, p.Process_Electronically__c, p.OwnerId, p.Name, p.Minimum_Purchase_Amount__c, '
                                                + ' p.LastModifiedDate, p.Process_Electronically_Online__c, p.LastModifiedById, p.IsDeleted, p.Id, p.CreatedDate, '
                                                + ' p.CreatedById, p.Active__c, p.Abbreviation__c, p.Icon_Document_Name__c from Payment_Types__c p where p.Name ="Gift Redemption"';
                                            execute.query(giftRedemptionPaymentTypeSql, '', function (err, result) {
                                                giftRedemptionPaymentType = result[0];
                                                var paymentRefunds;
                                                var paymentOtherObjData = {
                                                    Id: uniqid(),
                                                    IsDeleted: 0,
                                                    CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                                                    CreatedById: uniqid(),
                                                    LastModifiedDate: date,
                                                    LastModifiedById: uniqid(),
                                                    SystemModstamp: date,
                                                    LastModifiedDate: date,
                                                    Amount_Paid__c: -refundPaymentData.refundToList[0].AmountToRefund,
                                                    Appt_Ticket__c: apptObjData.Id,
                                                    Approval_Code__c: refundPaymentData.Approval_Code__c,
                                                    Drawer_Number__c: refundPaymentData.Drawer_Number__c,
                                                    Notes__c: refundPaymentData.notes,
                                                    Payment_Type__c: refundPaymentData.refundToList[0].Id,
                                                };
                                                // paymentOtherObjData.Payment_Type__c = cashPaymentType.Id
                                                // paymentOtherObjData.Payment_Type__c = accountChargePaymentType.Id
                                                var insertQuery = 'INSERT INTO ' + config.dbTables.ticketPaymentsTBL + ' SET ?';
                                                execute.query(insertQuery, paymentOtherObjData, function (ticketPaymentErr, ticketPaymentResult) {
                                                    if (ticketPaymentErr) {
                                                        logger.error('Error in CheckOut dao - addToTicketpayments:', ticketPaymentErr);
                                                        done(ticketPaymentErr, { statusCode: '9999' });
                                                    } else {
                                                        var clientSql = 'select Id, Active__c,  FirstName, MiddleName__c, LastName, Title, Email, Secondary_Email__c, No_Email__c, '
                                                            + ' Phone, MobilePhone, BirthDate, Gender__c, Notes__c, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry,'
                                                            + ' Marketing_Opt_Out__c, Marketing_Primary_Email__c, Marketing_Secondary_Email__c, Marketing_Mobile_Phone__c, Notification_Opt_Out__c, '
                                                            + ' Notification_Primary_Email__c, Notification_Secondary_Email__c, Notification_Mobile_Phone__c, Reminder_Opt_Out__c, '
                                                            + ' Reminder_Primary_Email__c, Reminder_Secondary_Email__c, Reminder_Mobile_Phone__c, Mobile_Carrier__c, Client_Flag__c, '
                                                            + ' Starting_Balance__c, Current_Balance__c, Pin__c, Allow_Online_Booking__c, Active_Rewards__c, Refer_A_Friend_Prospect__c,'
                                                            + '  Referred_On_Date__c, Membership_ID__c, Client_Pic__c, Booking_Restriction_Note__c, Booking_Restriction_Type__c, '
                                                            + ' BR_Reason_Account_Charge_Balance__c, BR_Reason_Deposit_Required__c, BR_Reason_No_Email__c, BR_Reason_No_Show__c, BR_Reason_Other__c, '
                                                            + ' BR_Reason_Other_Note__c, BirthYearNumber__c, BirthMonthNumber__c, BirthDateNumber__c, CreatedDate, LastModifiedDate, System_Client__c'
                                                            + ' from Contact__c where id = "' + refundPaymentData.clientId + '"'
                                                        execute.query(clientSql, '', function (err, result) {
                                                            // if (originalPayment.ticketPayment.Payment_Type__c == accountChargePaymentType.id || (originalPayment.ticketPayment.Payment_Type__c == null && originalPayment.paymentName == System.Label.Label_Account_Charge)) {
                                                            accountChargeRefund += refundPaymentData.refundToList[0].AmountToRefund;
                                                            // }
                                                            if (result.length > 0) {
                                                                if (result[0].Current_Balance__c === null || result[0].Current_Balance__c === 0)
                                                                    result[0].Current_Balance__c = 0.00 - accountChargeRefund;
                                                                else
                                                                    result[0].Current_Balance__c -= accountChargeRefund;
                                                                var sqlQuery = 'UPDATE Contact__c '
                                                                    + ' SET Current_Balance__c = ' + result[0].Current_Balance__c
                                                                    + ', LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                                                                    + '" WHERE Id = "' + refundPaymentData.clientId + '"';
                                                                execute.query(sqlQuery, '', function (err, result) {
                                                                    indexParm++;
                                                                    sendResponse(indexParm, err, result, done);
                                                                });
                                                            } else {
                                                                indexParm++;
                                                                sendResponse(indexParm, null, result, done);
                                                            }

                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                                // saveRefundedPayments(ticket.id);
                            }
                        });
                        // done(apptDataErr, apptObjData.Id)
                    }
                });
            });
        } else if (refundPaymentData.refundType === 'Product Refund') {
            execute.query(selectSql, '', function (err, result) {
                if (err) {
                    done(err, result);
                } else {
                    if (result && result[0].Name) {
                        var generator = new sequential.Generator({
                            digits: 6,
                            restore: result[0].Name
                        });
                        apptName = generator.generate();
                    } else {
                        apptName = '000001';
                    }
                }
                var apptObjData = {
                    Id: uniqid(),
                    OwnerId: uniqid(),
                    IsDeleted: 0,
                    Name: apptName,
                    CreatedDate: date,
                    CreatedById: uniqid(),
                    LastModifiedDate: date,
                    LastModifiedById: uniqid(),
                    SystemModstamp: date,
                    LastModifiedDate: date,
                    Appt_Date_Time__c: date,
                    Client_Type__c: '',
                    Client__c: refundPaymentData.clientId,
                    Duration__c: 0,
                    isNoService__c: 1,
                    isTicket__c: 1,
                    isRefund__c: 1,
                    Status__c: 'Complete'
                }
                var insertQuery = 'INSERT INTO ' + config.dbTables.apptTicketTBL + ' SET ?';
                execute.query(insertQuery, apptObjData, function (apptDataErr, apptDataResult) {
                    if (apptDataErr) {
                        logger.error('Error in CheckOut dao - createAppt:', apptDataErr);
                        done(apptDataErr, { statusCode: '9999' });
                    } else {
                        for (var i = 0; i < refundPaymentData.selectList.length; i++) {
                            //	Handle Product_Tax__c
                            if (refundPaymentData.selectList[i].Taxable === 1) {
                                if(refundPaymentData.clientId === 'no client'){
                                    refundPaymentData.clientId = null;
                                }
                                if (refundPaymentData.refundToList[i].AmountToRefund == (refundPaymentData.selectList[i].Quantity * refundPaymentData.selectList[i].Amount))
                                    var Product_Tax__c = -refundPaymentData.selectList[i].Product_Tax__c;
                                else
                                    var Product_Tax__c = -refundPaymentData.selectList[i].Product_Tax__c * (refundPaymentData.refundToList[i].AmountToRefund / (refundPaymentData.selectList[i].Quantity * refundPaymentData.selectList[i].Amount));
                            }
                            var id = uniqid();
                            records.push([id,
                                config.booleanFalse,
                                date, uniqid(),
                                date, uniqid(),
                                date,
                                apptObjData.Id,
                                refundPaymentData.clientId,
                                -refundPaymentData.refundToList[0].AmountToRefund / refundPaymentData.selectList[i].Quantity,
                                refundPaymentData.selectList[i].id,
                                -refundPaymentData.refundToList[0].AmountToRefund / refundPaymentData.selectList[i].Quantity,
                                refundPaymentData.selectList[i].WorkerId,
                                refundPaymentData.selectList[i].ProductId,
                                refundPaymentData.selectList[i].Taxable,
                                refundPaymentData.selectList[i].Quantity,
                                refundPaymentData.selectList[i].deductFromWorker,
                                refundPaymentData.selectList[i].ReturntoInventory,
                                Product_Tax__c
                            ]);
                            var insertQuery1 = 'INSERT INTO ' + config.dbTables.ticketProductTBL
                                + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                                + ' SystemModstamp, Appt_Ticket__c, Client__c, Net_Price__c,Original_Ticket_Product__c, Price__c,'
                                + ' Worker__c, Product__c, Taxable__c,Qty_Sold__c,Do_Not_Deduct_From_Worker__c, Return_To_Inventory__c,Product_Tax__c) VALUES ?';
                            queries += mysql.format('UPDATE ' + config.dbTables.ticketProductTBL
                                + ' SET Original_Ticket_Product__c = "' + refundPaymentData.selectList[i].id
                                + '" WHERE Id = "' + refundPaymentData.selectList[i].id + '";');
                        }
                        execute.query(insertQuery1, [records], function (err1, result1) {
                            if (err1) {
                                logger.error('Error in WorkerServices dao - updateWorkerService:', err1);
                                indexParm++;
                                sendResponse(indexParm, err1, { statusCode: '9999' }, done);
                            } else {
                                execute.query(queries, '', function (err, result) {
                                    var accountChargeRefund = 0.00;
                                    var ptSql = 'Select p.Reads_Only_Name__c, p.Read_Only_Active_Flag__c, p.Transaction_Fee_Percentage__c, p.Transaction_Fee_Per_Transaction__c, '
                                        + ' p.SystemModstamp, p.Sort_Order__c, p.Process_Electronically__c, p.OwnerId, p.Name, p.Minimum_Purchase_Amount__c, '
                                        + ' p.LastModifiedDate, p.Process_Electronically_Online__c, p.LastModifiedById, p.IsDeleted, p.Id, p.CreatedDate, '
                                        + ' p.CreatedById, p.Active__c, p.Abbreviation__c, p.Icon_Document_Name__c from Payment_Types__c p where p.Name ="Cash"';
                                    execute.query(ptSql, '', function (err, result) {
                                        cashPaymentType = result[0];
                                        var accountChargePaymentTypeSql = 'Select p.Reads_Only_Name__c, p.Read_Only_Active_Flag__c, p.Transaction_Fee_Percentage__c, p.Transaction_Fee_Per_Transaction__c, '
                                            + ' p.SystemModstamp, p.Sort_Order__c, p.Process_Electronically__c, p.OwnerId, p.Name, p.Minimum_Purchase_Amount__c, '
                                            + ' p.LastModifiedDate, p.Process_Electronically_Online__c, p.LastModifiedById, p.IsDeleted, p.Id, p.CreatedDate, '
                                            + ' p.CreatedById, p.Active__c, p.Abbreviation__c, p.Icon_Document_Name__c from Payment_Types__c p where p.Name ="Account Charge"';
                                        execute.query(accountChargePaymentTypeSql, '', function (err, result) {
                                            accountChargePaymentType = result[0];
                                            var giftRedemptionPaymentTypeSql = 'Select p.Reads_Only_Name__c, p.Read_Only_Active_Flag__c, p.Transaction_Fee_Percentage__c, p.Transaction_Fee_Per_Transaction__c, '
                                                + ' p.SystemModstamp, p.Sort_Order__c, p.Process_Electronically__c, p.OwnerId, p.Name, p.Minimum_Purchase_Amount__c, '
                                                + ' p.LastModifiedDate, p.Process_Electronically_Online__c, p.LastModifiedById, p.IsDeleted, p.Id, p.CreatedDate, '
                                                + ' p.CreatedById, p.Active__c, p.Abbreviation__c, p.Icon_Document_Name__c from Payment_Types__c p where p.Name ="Gift Redemption"';
                                            execute.query(giftRedemptionPaymentTypeSql, '', function (err, result) {
                                                giftRedemptionPaymentType = result[0];
                                                var paymentRefunds;
                                                var paymentOtherObjData = {
                                                    Id: uniqid(),
                                                    IsDeleted: 0,
                                                    CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                                                    CreatedById: uniqid(),
                                                    LastModifiedDate: date,
                                                    LastModifiedById: uniqid(),
                                                    SystemModstamp: date,
                                                    LastModifiedDate: date,
                                                    Amount_Paid__c: -refundPaymentData.refundToList[0].AmountToRefund,
                                                    Appt_Ticket__c: apptObjData.Id,
                                                    Approval_Code__c: refundPaymentData.Approval_Code__c,
                                                    Drawer_Number__c: refundPaymentData.Drawer_Number__c,
                                                    Notes__c: refundPaymentData.notes,
                                                    Payment_Type__c: refundPaymentData.refundToList[0].Id,
                                                };
                                                // paymentOtherObjData.Payment_Type__c = cashPaymentType.Id
                                                // paymentOtherObjData.Payment_Type__c = accountChargePaymentType.Id
                                                var insertQuery = 'INSERT INTO ' + config.dbTables.ticketPaymentsTBL + ' SET ?';
                                                execute.query(insertQuery, paymentOtherObjData, function (ticketPaymentErr, ticketPaymentResult) {
                                                    if (ticketPaymentErr) {
                                                        logger.error('Error in CheckOut dao - addToTicketpayments:', ticketPaymentErr);
                                                        done(ticketPaymentErr, { statusCode: '9999' });
                                                    } else {
                                                        var clientSql = 'select Id, Active__c,  FirstName, MiddleName__c, LastName, Title, Email, Secondary_Email__c, No_Email__c, '
                                                            + ' Phone, MobilePhone, BirthDate, Gender__c, Notes__c, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry,'
                                                            + ' Marketing_Opt_Out__c, Marketing_Primary_Email__c, Marketing_Secondary_Email__c, Marketing_Mobile_Phone__c, Notification_Opt_Out__c, '
                                                            + ' Notification_Primary_Email__c, Notification_Secondary_Email__c, Notification_Mobile_Phone__c, Reminder_Opt_Out__c, '
                                                            + ' Reminder_Primary_Email__c, Reminder_Secondary_Email__c, Reminder_Mobile_Phone__c, Mobile_Carrier__c, Client_Flag__c, '
                                                            + ' Starting_Balance__c, Current_Balance__c, Pin__c, Allow_Online_Booking__c, Active_Rewards__c, Refer_A_Friend_Prospect__c,'
                                                            + '  Referred_On_Date__c, Membership_ID__c, Client_Pic__c, Booking_Restriction_Note__c, Booking_Restriction_Type__c, '
                                                            + ' BR_Reason_Account_Charge_Balance__c, BR_Reason_Deposit_Required__c, BR_Reason_No_Email__c, BR_Reason_No_Show__c, BR_Reason_Other__c, '
                                                            + ' BR_Reason_Other_Note__c, BirthYearNumber__c, BirthMonthNumber__c, BirthDateNumber__c, CreatedDate, LastModifiedDate, System_Client__c'
                                                            + ' from Contact__c where id = "' + refundPaymentData.clientId + '"'
                                                        execute.query(clientSql, '', function (err, result) {
                                                            // if (originalPayment.ticketPayment.Payment_Type__c == accountChargePaymentType.id || (originalPayment.ticketPayment.Payment_Type__c == null && originalPayment.paymentName == System.Label.Label_Account_Charge)) {
                                                            accountChargeRefund += refundPaymentData.refundToList[0].AmountToRefund;
                                                            // }
                                                            if (result > 0) {
                                                                if (result[0].Current_Balance__c === null || result[0].Current_Balance__c === 0)
                                                                    result[0].Current_Balance__c = 0.00 - accountChargeRefund;
                                                                else
                                                                    result[0].Current_Balance__c -= accountChargeRefund;
                                                                var sqlQuery = 'UPDATE Contact__c '
                                                                    + ' SET Current_Balance__c = ' + result[0].Current_Balance__c
                                                                    + ', LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                                                                    + '" WHERE Id = "' + refundPaymentData.clientId + '"';
                                                                execute.query(sqlQuery, '', function (err, result) {
                                                                    indexParm++;
                                                                    sendResponse(indexParm, err, result, done);
                                                                });
                                                            } else {
                                                                indexParm++;
                                                                sendResponse(indexParm, null, result, done);
                                                            }

                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                                // saveRefundedPayments(ticket.id);

                            }
                        });
                        // done(apptDataErr, apptObjData.Id)
                    }
                });
            });
        } else if (refundPaymentData.refundType === 'Payment Overcharge') {
            execute.query(selectSql, '', function (err, result) {
                if (err) {
                    done(err, result);
                } else {
                    if (result && result[0].Name) {
                        var generator = new sequential.Generator({
                            digits: 6,
                            restore: result[0].Name
                        });
                        apptName = generator.generate();
                    } else {
                        apptName = '000001';
                    }
                }
                var apptObjData = {
                    Id: uniqid(),
                    OwnerId: uniqid(),
                    IsDeleted: 0,
                    Name: apptName,
                    CreatedDate: date,
                    CreatedById: uniqid(),
                    LastModifiedDate: date,
                    LastModifiedById: uniqid(),
                    SystemModstamp: date,
                    LastModifiedDate: date,
                    Appt_Date_Time__c: date,
                    Client_Type__c: '',
                    Client__c: refundPaymentData.clientId,
                    Duration__c: 0,
                    isNoService__c: 1,
                    isTicket__c: 1,
                    isRefund__c: 1,
                    Status__c: 'Complete'
                }
                var insertQuery = 'INSERT INTO ' + config.dbTables.apptTicketTBL + ' SET ?';
                execute.query(insertQuery, apptObjData, function (apptDataErr, apptDataResult) {
                    if (apptDataErr) {
                        logger.error('Error in CheckOut dao - createAppt:', apptDataErr);
                        done(apptDataErr, { statusCode: '9999' });
                    } else {
                        for (var i = 0; i < refundPaymentData.selectList.length; i++) {
                            //	Handle Product_Tax__c
                            if (refundPaymentData.selectList[i].Taxable === 1) {
                                if (refundPaymentData.refundToList[i].AmountToRefund == (refundPaymentData.selectList[i].Quantity * refundPaymentData.selectList[i].Amount))
                                    var Product_Tax__c = -refundPaymentData.selectList[i].Product_Tax__c;
                                else
                                    var Product_Tax__c = -refundPaymentData.selectList[i].Product_Tax__c * (refundPaymentData.refundToList[i].AmountToRefund / (refundPaymentData.selectList[i].Quantity * refundPaymentData.selectList[i].Amount));
                            }
                            var id = uniqid();
                            records.push([id,
                                config.booleanFalse,
                                date, uniqid(),
                                date, uniqid(),
                                date,
                                apptObjData.Id,
                                -refundPaymentData.refundToList[0].AmountToRefund,
                                '',
                                refundPaymentData.Drawer_Number__c,
                                -refundPaymentData.refundToList[0].MerchantAccountName,
                                'Refunds',
                                refundPaymentData.selectList[i].id,
                                '',
                                refundPaymentData.refundToList[i].Id,
                                refundPaymentData.refundToList[i].ReferenceNumber,
                            ]);
                            var insertQuery1 = 'INSERT INTO ' + config.dbTables.ticketPaymentTBL
                                + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                                + ' SystemModstamp, Appt_Ticket__c, Amount_Paid__c, Approval_Code__c,Drawer_Number__c, Merchant_Account_Name__c,'
                                + ' Notes__c, Original_Ticket_Payment__c, Payment_Gateway_Name__c,Payment_Type__c,Reference_Number__c) VALUES ?';
                            queries += mysql.format('UPDATE ' + config.dbTables.ticketPaymentTBL
                                + ' SET Original_Ticket_Product__c = "' + refundPaymentData.selectList[i].id
                                + '" WHERE Id = "' + refundPaymentData.selectList[i].id + '";');
                        }
                        execute.query(insertQuery1, [records], function (err1, result1) {
                            if (err1) {
                                logger.error('Error in WorkerServices dao - updateWorkerService:', err1);
                                indexParm++;
                                sendResponse(indexParm, err1, { statusCode: '9999' }, done);
                            } else {
                                execute.query(queries, '', function (err, result) {
                                    var accountChargeRefund = 0.00;
                                    var ptSql = 'Select p.Reads_Only_Name__c, p.Read_Only_Active_Flag__c, p.Transaction_Fee_Percentage__c, p.Transaction_Fee_Per_Transaction__c, '
                                        + ' p.SystemModstamp, p.Sort_Order__c, p.Process_Electronically__c, p.OwnerId, p.Name, p.Minimum_Purchase_Amount__c, '
                                        + ' p.LastModifiedDate, p.Process_Electronically_Online__c, p.LastModifiedById, p.IsDeleted, p.Id, p.CreatedDate, '
                                        + ' p.CreatedById, p.Active__c, p.Abbreviation__c, p.Icon_Document_Name__c from Payment_Types__c p where p.Name ="Cash"';
                                    execute.query(ptSql, '', function (err, result) {
                                        cashPaymentType = result[0];
                                        var accountChargePaymentTypeSql = 'Select p.Reads_Only_Name__c, p.Read_Only_Active_Flag__c, p.Transaction_Fee_Percentage__c, p.Transaction_Fee_Per_Transaction__c, '
                                            + ' p.SystemModstamp, p.Sort_Order__c, p.Process_Electronically__c, p.OwnerId, p.Name, p.Minimum_Purchase_Amount__c, '
                                            + ' p.LastModifiedDate, p.Process_Electronically_Online__c, p.LastModifiedById, p.IsDeleted, p.Id, p.CreatedDate, '
                                            + ' p.CreatedById, p.Active__c, p.Abbreviation__c, p.Icon_Document_Name__c from Payment_Types__c p where p.Name ="Account Charge"';
                                        execute.query(accountChargePaymentTypeSql, '', function (err, result) {
                                            accountChargePaymentType = result[0];
                                            var giftRedemptionPaymentTypeSql = 'Select p.Reads_Only_Name__c, p.Read_Only_Active_Flag__c, p.Transaction_Fee_Percentage__c, p.Transaction_Fee_Per_Transaction__c, '
                                                + ' p.SystemModstamp, p.Sort_Order__c, p.Process_Electronically__c, p.OwnerId, p.Name, p.Minimum_Purchase_Amount__c, '
                                                + ' p.LastModifiedDate, p.Process_Electronically_Online__c, p.LastModifiedById, p.IsDeleted, p.Id, p.CreatedDate, '
                                                + ' p.CreatedById, p.Active__c, p.Abbreviation__c, p.Icon_Document_Name__c from Payment_Types__c p where p.Name ="Gift Redemption"';
                                            execute.query(giftRedemptionPaymentTypeSql, '', function (err, result) {
                                                giftRedemptionPaymentType = result[0];
                                                var paymentRefunds;
                                                var paymentOtherObjData = {
                                                    Id: uniqid(),
                                                    IsDeleted: 0,
                                                    CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                                                    CreatedById: uniqid(),
                                                    LastModifiedDate: date,
                                                    LastModifiedById: uniqid(),
                                                    SystemModstamp: date,
                                                    LastModifiedDate: date,
                                                    Amount_Paid__c: -refundPaymentData.refundToList[0].AmountToRefund,
                                                    Appt_Ticket__c: apptObjData.Id,
                                                    Approval_Code__c: refundPaymentData.Approval_Code__c,
                                                    Drawer_Number__c: refundPaymentData.Drawer_Number__c,
                                                    Notes__c: refundPaymentData.notes,
                                                    Payment_Type__c: refundPaymentData.refundToList[0].Id,
                                                };
                                                // paymentOtherObjData.Payment_Type__c = cashPaymentType.Id
                                                // paymentOtherObjData.Payment_Type__c = accountChargePaymentType.Id
                                                var insertQuery = 'INSERT INTO ' + config.dbTables.ticketPaymentsTBL + ' SET ?';
                                                execute.query(insertQuery, paymentOtherObjData, function (ticketPaymentErr, ticketPaymentResult) {
                                                    if (ticketPaymentErr) {
                                                        logger.error('Error in CheckOut dao - addToTicketpayments:', ticketPaymentErr);
                                                        done(ticketPaymentErr, { statusCode: '9999' });
                                                    } else {
                                                        var clientSql = 'select Id, Active__c,  FirstName, MiddleName__c, LastName, Title, Email, Secondary_Email__c, No_Email__c, '
                                                            + ' Phone, MobilePhone, BirthDate, Gender__c, Notes__c, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry,'
                                                            + ' Marketing_Opt_Out__c, Marketing_Primary_Email__c, Marketing_Secondary_Email__c, Marketing_Mobile_Phone__c, Notification_Opt_Out__c, '
                                                            + ' Notification_Primary_Email__c, Notification_Secondary_Email__c, Notification_Mobile_Phone__c, Reminder_Opt_Out__c, '
                                                            + ' Reminder_Primary_Email__c, Reminder_Secondary_Email__c, Reminder_Mobile_Phone__c, Mobile_Carrier__c, Client_Flag__c, '
                                                            + ' Starting_Balance__c, Current_Balance__c, Pin__c, Allow_Online_Booking__c, Active_Rewards__c, Refer_A_Friend_Prospect__c,'
                                                            + '  Referred_On_Date__c, Membership_ID__c, Client_Pic__c, Booking_Restriction_Note__c, Booking_Restriction_Type__c, '
                                                            + ' BR_Reason_Account_Charge_Balance__c, BR_Reason_Deposit_Required__c, BR_Reason_No_Email__c, BR_Reason_No_Show__c, BR_Reason_Other__c, '
                                                            + ' BR_Reason_Other_Note__c, BirthYearNumber__c, BirthMonthNumber__c, BirthDateNumber__c, CreatedDate, LastModifiedDate, System_Client__c'
                                                            + ' from Contact__c where id = "' + refundPaymentData.clientId + '"'
                                                        execute.query(clientSql, '', function (err, result) {
                                                            // if (originalPayment.ticketPayment.Payment_Type__c == accountChargePaymentType.id || (originalPayment.ticketPayment.Payment_Type__c == null && originalPayment.paymentName == System.Label.Label_Account_Charge)) {
                                                            accountChargeRefund += refundPaymentData.refundToList[0].AmountToRefund;
                                                            // }
                                                            if (result.length > 0) {
                                                                if (result[0].Current_Balance__c === null || result[0].Current_Balance__c === 0)
                                                                    result[0].Current_Balance__c = 0.00 - accountChargeRefund;
                                                                else
                                                                    result[0].Current_Balance__c -= accountChargeRefund; var sqlQuery = 'UPDATE Contact__c '
                                                                        + ' SET Current_Balance__c = ' + result[0].Current_Balance__c
                                                                        + ', LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                                                                        + '" WHERE Id = "' + refundPaymentData.clientId + '"';
                                                                execute.query(sqlQuery, '', function (err, result) {
                                                                    indexParm++;
                                                                    sendResponse(indexParm, err, result, done);
                                                                });
                                                            } else {
                                                                indexParm++;
                                                                sendResponse(indexParm, null, result, done);
                                                            }


                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                                // saveRefundedPayments(ticket.id);

                            }
                        });
                        // done(apptDataErr, apptObjData.Id)
                    }
                });
            });

        }
    },
    saveTips: function (req, done1) {
        var tipsData = req.body;
        try {
            if (req.params.type === 'New') {
                createAppt(tipsData, function (err, done) {
                    tipsData.Appt_Ticket__c = done;
                    createTips(tipsData, function (err, done) {
                        done1(err, done)
                    });
                });
            } else {
                createTips(tipsData, function (err, done) {
                    done1(err, done)
                });
            }
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - saveTips:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getTips: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = ' SELECT u.Id as Worker__c, CONCAT(u.FirstName,"",u.LastName) as workerName ,tp.Tip_Amount__c, tp.Id as tipId,tp.Tip_Option__c FROM Ticket_Tip__c as tp '
                + ' left join User__c as u on u.Id = tp.Worker__c '
                + ' where tp.Appt_Ticket__c = "' + Id + '" and tp.isDeleted = 0';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - getTips:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - getTips:', err);
            return (err, { statusCode: '9999' });
        }
    },
    updateTips: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.ticketTipTBL
                + " SET Appt_Ticket__c = '" + req.body.Appt_Ticket__c
                + "', Drawer_Number__c = '" + req.body.Drawer_Number__c
                + "', Tip_Amount__c = '" + req.body.Tip_Amount__c
                + "', Worker__c = '" + req.body.Worker__c
                + "', Tip_Option__c = '" + req.body.Tip_Option__c
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + Id + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - updateTips:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - updateTips:', err);
            return (err, { statusCode: '9999' });
        }
    },
    deleteTips: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = "UPDATE " + config.dbTables.ticketTipTBL
                + " SET isDeleted = 1 "
                + ", LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + Id + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CheckOut dao - deleteTips:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result)
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - deleteTips:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /*
	 *	This action method clears all services, products, other, and tips from this ticket
	 */
    deleteTicket: function (req, done) {
        try {
            var Id = req.params.id;
            var query = "UPDATE Ticket_Service__c SET isDeleted = 1 WHERE Appt_Ticket__c = '" + Id + "';" +
                "UPDATE Ticket_Product__c  SET isDeleted = 1 WHERE Appt_Ticket__c = '" + Id + "';" +
                "UPDATE Ticket_Other__c SET isDeleted = 1 WHERE Ticket__c = '" + Id + "';" +
                "UPDATE Ticket_Tip__c SET isDeleted = 1 WHERE Appt_Ticket__c = '" + Id + "';";
            execute.query(query, '', function (err, result) {
                if (err) {
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - deleteTicket:', err);
            return (err, { statusCode: '9999' });
        }
    },
    sendEmailReciept: function (req, done) {
        try {
            var recieptMailData = req.body.data;
            var fileName = 'Reciept ' + recieptMailData.apptName;
            fs.writeFile(config.recieptEmailReadHtmlPath, recieptMailData.htmlFile, function (err) {
                if (err) {
                    return err;
                } else {
                    var html = fs.readFileSync(config.recieptEmailReadHtmlPath, 'utf8');
                    var options = { format: 'Letter' };
                    pdf.create(html, options).toFile(config.recieptEmailPath + fileName + '.pdf', function (err, res) {
                        if (err) {
                            logger.error('Error in creating pdf file:', err);
                            utils.sendResponse(res, 500, '9999', {});
                        } else {
                            fs.readFile(config.recieptEmailPath + fileName + '.pdf', function (err, data) {
                                if (err) {
                                    logger.error('Error in reading pdf file :', err);
                                    utils.sendResponse(res, 500, '9999', {});
                                } else {
                                    var subject = config.recieptEmailSub + fileName;
                                    var doc = [{ path: config.recieptEmailPath + fileName + '.pdf', data: data, type: 'file/pdf' }]
                                    var textData = config.recieptEmailText;
                                    mail.sendeMailReciept(recieptMailData.clientEmail, textData, subject, doc, function (err, result) {
                                        fs.readdir(config.recieptEmailPath, (err, files) => {
                                            if (err) throw err;
                                            for (const file of files) {
                                                fs.unlink(path.join(config.recieptEmailPath, file), err => {
                                                    if (err) throw err;
                                                });
                                            }
                                        });
                                        done(err, result);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - sendEmailReciept:', err);
            return (err, { statusCode: '9999' });
        }
    },
    giftBalancingSearch: function (req, done) {
        try {
            var searchString = req.params.searchstring;
            var searchQuery = 'SELECT tot.Id, tot.Name, tot.Amount__c, tot.Expires__c, tot.Gift_Number__c, tot.Issued__c, tot.Recipient__c, '
                + ' tot.Ticket__c, apt.Client__c, apt.Status__c, IFNULL(IF(tot.Gift_Number__c = NULL, 0, tot.Gift_Number__c - Amount__c), 0) as currentBalance '
                + ' from Ticket_Other__c as tot left join Appt_Ticket__c as apt on tot.Ticket__c = apt.Id where tot.Transaction_Type__c ="Gift" '
                + ' and tot.Gift_Number__c LIKE "%' + searchString + '%" and apt.Status__c ="Complete" order by tot.Gift_Number__c asc LIMIT 500';
            execute.query(searchQuery, '', function (err, result) {
                if (err) {
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in CheckOut dao - giftBalancingSearch:', err);
            return (err, { statusCode: '9999' });
        }
    }
};

/**
 * Method to create A Record in appointment Table
 * @param {*} ticketServiceObj required DataObj for Create Record
 * @param {*} done callback
 */

function createAppt(ticketServiceObj, done) {
    var selectSql = 'SELECT Name, CreatedDate FROM `Appt_Ticket__c` where isDeleted =0 ORDER BY CreatedDate DESC';
    execute.query(selectSql, '', function (err, result) {
        if (err) {
            done(err, result);
        } else {
            if (result && result[0].Name) {
                var generator = new sequential.Generator({
                    digits: 6,
                    restore: result[0].Name
                });
                apptName = generator.generate();
            } else {
                apptName = '000001';
            }
        }
        var apptObjData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            Name: apptName,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            Appt_Date_Time__c: dateFns.getUTCDatTmStr(new Date()),
            Client_Type__c: ticketServiceObj.Client_Type__c,
            Client__c: ticketServiceObj.Client__c,
            Duration__c: 0,
            Status__c: 'Booked',
            Is_Booked_Out__c: 0,
            New_Client__c: 0,
            isNoService__c: ticketServiceObj.isNoService__c
        }
        var insertQuery = 'INSERT INTO ' + config.dbTables.apptTicketTBL + ' SET ?';
        execute.query(insertQuery, apptObjData, function (apptDataErr, apptDataResult) {
            if (apptDataErr) {
                logger.error('Error in CheckOut dao - createAppt:', apptDataErr);
                done(apptDataErr, { statusCode: '9999' });
            } else {
                done(apptDataErr, apptObjData.Id)
            }
        });
    });
}
/**
 * Method to create A Record in TicketService Table
 * @param {*} ticketServiceObj required DataObj for Create Record
 * @param {*} done callback
 */
function createTicketService(ticketServiceObj, done) {
    var sqlQuery = 'SELECT Service_Date_Time__c, Duration__c FROM `Ticket_Service__c` WHERE Appt_Ticket__c = "' + ticketServiceObj.Appt_Ticket__c + '" ORDER BY Service_Date_Time__c DESC'
    execute.query(sqlQuery, '', function (err, result) {
        if (err) {
            logger.error('Error in CheckOut dao - addToTicket:', err);
            done(err, { statusCode: '9999' });
        } else {
            var apptDate;
            if (result && result.length > 0 && result[0].Service_Date_Time__c !== null) {
                apptDate = dateFns.addMinToDBStr(result[0].Service_Date_Time__c, parseInt(result[0].Duration__c, 10));
            } else {
                // apptDate = dateFns.addMinToDBStr(result[0].Service_Date_Time__c, parseInt(result[0].Duration__c, 10));
            }
            var ticketObjData = {
                Id: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                Service_Date_Time__c: apptDate,
                Visit_Type__c: ticketServiceObj.Client_Type__c,
                Client__c: ticketServiceObj.Client__c,
                Duration_1__c: ticketServiceObj.Duration_1__c,
                Duration_2__c: ticketServiceObj.Duration_2__c,
                Duration_3__c: ticketServiceObj.Duration_3__c,
                Guest_Charge__c: ticketServiceObj.Guest_Charge__c,
                Buffer_After__c: ticketServiceObj.Buffer_After__c,
                Service_Tax__c: ticketServiceObj.Service_Tax__c,
                Net_Price__c: ticketServiceObj.Net_Price__c,
                Price__c: ticketServiceObj.Price__c,
                Non_Standard_Duration__c: ticketServiceObj.Non_Standard_Duration__c,
                Rebooked__c: ticketServiceObj.Rebooked__c,
                Service__c: ticketServiceObj.id,
                Duration__c: ticketServiceObj.serviceDur,
                Status__c: 'Booked',
                Is_Booked_Out__c: 0,
                Notes__c: ticketServiceObj.Notes__c,
                Appt_Ticket__c: ticketServiceObj.Appt_Ticket__c,
                Worker__c: ticketServiceObj.workerId.split('$')[1],
                Service_Group_Color__c: ticketServiceObj.Service_Group_Color__c,
                Promotion__c: ticketServiceObj.promotionId,
                reward__c: ticketServiceObj.rewardId
            };
            var insertQuery = 'INSERT INTO ' + config.dbTables.ticketServiceTBL + ' SET ?';
            execute.query(insertQuery, ticketObjData, function (ticketServErr, ticketServResult) {
                if (ticketServErr) {
                    logger.error('Error in CheckOut dao - addToTicket:', ticketServErr);
                    done(ticketServErr, { statusCode: '9999' });
                } else {

                    done(ticketServErr, ticketServResult = { 'apptId': ticketServiceObj.Appt_Ticket__c })
                }
            });
        }
    });
}
/**
 * Method to create A Record in TicketProduct Table
 * @param {*} ticketProductObj required DataObj for Create Record
 * @param {*} done callback
 */
function createTicketProduct(ticketProductObj, done) {
    var date = new Date();
    var ticketProductObjData = {
        Id: uniqid(),
        IsDeleted: 0,
        CreatedDate: dateFns.getUTCDatTmStr(new Date()),
        CreatedById: uniqid(),
        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
        LastModifiedById: uniqid(),
        SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
        Appt_Ticket__c: ticketProductObj.Appt_Ticket__c,
        Client__c: ticketProductObj.Client__c,
        Net_Price__c: ticketProductObj.Price__c,
        Price__c: ticketProductObj.Price__c,
        Product__c: ticketProductObj.Product__c,
        Promotion__c: ticketProductObj.Promotion__c,
        Reward__c: ticketProductObj.Reward__c,
        Qty_Sold__c: ticketProductObj.Qty_Sold__c,
        Taxable__c: ticketProductObj.Taxable__c,
        Worker__c: ticketProductObj.Worker__c,
        Product_Tax__c: ticketProductObj.Product_Tax__c
    };
    var insertQuery = 'INSERT INTO ' + config.dbTables.ticketProductTBL + ' SET ?';
    execute.query(insertQuery, ticketProductObjData, function (ticketPrdErr, ticketPrdResult) {
        if (ticketPrdErr) {
            logger.error('Error in CheckOut dao - addToProduct:', ticketPrdErr);
            done(ticketPrdErr, { statusCode: '9999' });
        } else {
            done(ticketPrdErr, ticketPrdResult = { 'apptId': ticketProductObj.Appt_Ticket__c })
        }
    });
}
function sendResponse(indexParm, err, result, done) {
    if (indexParm === 1) {
        done(err, result);
    }
}
/**
 * To create a record into ticketother Table
 * @param {*} ticketOtherData 
 * @param {*} done 
 */
function createTicketOther(ticketOtherData, done) {
    var date = new Date();
    var ticketOtherDataObj = {
        Id: uniqid(),
        IsDeleted: 0,
        CreatedDate: dateFns.getUTCDatTmStr(new Date()),
        CreatedById: uniqid(),
        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
        LastModifiedById: uniqid(),
        SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
        Ticket__c: ticketOtherData.Ticket__c,
        Amount__c: ticketOtherData.Amount__c,
        Transaction_Type__c: ticketOtherData.Transaction_Type__c,
        Package__c: ticketOtherData.Package__c,
        Package_Price__c: ticketOtherData.Package_Price__c,
        Gift_Number__c: ticketOtherData.Gift_Number__c,
        Expires__c: ticketOtherData.Expires__c,
        Issued__c: ticketOtherData.Issued__c,
        Worker__c: ticketOtherData.Worker__c,
        Recipient__c: ticketOtherData.Recipient__c
    };
    var insertQuery = 'INSERT INTO ' + config.dbTables.ticketOtherTBL + ' SET ?';
    execute.query(insertQuery, ticketOtherDataObj, function (err, result) {
        if (err) {
            logger.error('Error in CheckOut dao - addToMiscSale:', err);
            done(err, { statusCode: '9999' });
        } else {
            done(err, result = { 'apptId': ticketOtherData.Ticket__c })
        }
    });
}
function createMisc(miscSaleData, done) {
    var date = new Date();
    var miscSaleObjData = {
        Id: uniqid(),
        IsDeleted: 0,
        CreatedDate: dateFns.getUTCDatTmStr(new Date()),
        CreatedById: uniqid(),
        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
        LastModifiedById: uniqid(),
        SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
        Ticket__c: miscSaleData.Ticket__c,
        Amount__c: miscSaleData.Amount__c,
        Transaction_Type__c: miscSaleData.Transaction_Type__c
    };
    var insertQuery = 'INSERT INTO ' + config.dbTables.ticketOtherTBL + ' SET ?';
    execute.query(insertQuery, miscSaleObjData, function (err, result) {
        if (err) {
            logger.error('Error in CheckOut dao - addToMiscSale:', err);
            done(err, { statusCode: '9999' });
        } else {
            done(err, result = { 'apptId': miscSaleData.Ticket__c })
        }
    });
}
/**
 * To Save the Record into Ticket tips Table
 * @param {*} tipsData 
 * @param {*} done 
 */
function createTips(tipsData, done) {
    var date = new Date();
    var tipsObjData = {
        Id: uniqid(),
        IsDeleted: 0,
        CreatedDate: dateFns.getUTCDatTmStr(new Date()),
        CreatedById: uniqid(),
        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
        LastModifiedById: uniqid(),
        SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
        Appt_Ticket__c: tipsData.Appt_Ticket__c,
        Drawer_Number__c: tipsData.Drawer_Number__c,
        Tip_Amount__c: tipsData.Tip_Amount__c,
        Tip_Option__c: tipsData.Tip_Option__c,
        Worker__c: tipsData.Worker__c
    };
    var insertQuery = 'INSERT INTO ' + config.dbTables.ticketTipTBL + ' SET ?';
    execute.query(insertQuery, tipsObjData, function (err, result) {
        if (err) {
            logger.error('Error in CheckOut dao - saveTips:', err);
            done(err, { statusCode: '9999' });
        } else {
            done(err, result = { 'apptId': tipsData.Appt_Ticket__c })
        }
    });
}