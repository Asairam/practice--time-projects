/**
 * Importing required modules
 */
var config = require('config');
var logger = require('../lib/logger');
var mysql = require('mysql');
var moment = require('moment');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var async = require('async');
var sequential = require("sequential-ids");
var dateFns = require('./../common/dateFunctions');

module.exports = {

    getClientSearch: function (req, done) {
        var searchString = req.params.searchstring;
        if (searchString) {
            var searchString1 = req.params.searchstring.replace(" ", "");
        }
        query = 'SELECT *, CONCAT(FirstName, " , ", LastName)as FullName FROM Contact__c'
        if (searchString)
            query = query + ' WHERE CONCAT(FirstName, "", LastName) like "%' + searchString1 + '%" Or CONCAT(LastName, "", FirstName) like "%' + searchString1 + '%" Or Email '
                + ' like "%' + searchString + '%" Or FirstName like "%' + searchString + '%" Or LastName like "%' + searchString + '%" Or Phone like "%' + searchString + '%" Or MobilePhone like "%' + searchString + '%"';
        execute.query(query, function (error, results) {
            if (error) {
                logger.error('Error in getting getClientSearch: ', error);
                done(error, results);
            } else {
                done(error, results);
            }
        });
    },
    getClientById: function (req, done) {
        var query = 'SELECT c1.*, GROUP_CONCAT(CONCAT(c2.FirstName, " ", c2.LastName)) as refName, GROUP_CONCAT(c2.Client_Pic__c) as refClientPics, GROUP_CONCAT(c2.Referred_On_Date__c) as refClientDates, CONCAT(c1.FirstName, " , ", '
            + ' c1.LastName)as FullName, CONCAT(c3.FirstName, " , ", c3.LastName)as ReferredClient,c3.Client_Pic__c as ReferredClientPic  FROM `Contact__c` c1 join Contact__c c2 on c1.Id=c2.Referred_By__c '
            + 'left JOIN Contact__c as c3 on c3.Id = c1.Referred_By__c WHERE c1.`Id` = "' + req.params.id + '" and c1.isDeleted =0'
        var lastvisitsql = 'SELECT ts.Service_Date_Time__c, s.Name FROM Ticket_Service__c as ts JOIN Service__c as s on s.Id = ts.Service__c '
            + ' WHERE Client__c="' + req.params.id + '" and Service_Date_Time__c < "' + dateFns.getUTCDatTmStr(new Date()) + '" ORDER BY Service_Date_Time__c desc';
        var nextvisitsql = 'SELECT ts.Service_Date_Time__c, s.Name FROM Ticket_Service__c as ts JOIN Service__c as s on s.Id = ts.Service__c '
            + ' WHERE Client__c="' + req.params.id + '" and Service_Date_Time__c > "' + dateFns.getUTCDatTmStr(new Date()) + '" ORDER BY Service_Date_Time__c asc';
        execute.query(query, function (error, results) {
            if (error) {
                logger.error('Error in getting getClientSearch: ', error);
                done(error, results);
            } else {
                execute.query(lastvisitsql, function (error1, results1) {
                    if (error1) {
                        logger.error('Error in getting getClientSearch: ', error1);
                        done(error1, results1);
                    } else {
                        execute.query(nextvisitsql, function (error2, results2) {
                            if (error2) {
                                logger.error('Error in getting getClientSearch: ', error2);
                                done(error2, results2);
                            } else {
                                done(error2, { results, results1, results2 });
                            }
                        });
                    }
                });
            }
        });
    },
    bookAppointmentBasedOnClientSearch: function (req, done) {
        // query = 'SELECT DISTINCT u.FirstName as name, ws.Worker__c as workername FROM Worker_Service__c as ws join User__c as u ON u.Id = ws.Worker__c WHERE Service__c = "' + req.params.id + '"'
        var query = 'SELECT CONCAT(u.FirstName, " ", u.LastName) as name, ws.Service__c as sId, ws.Worker__c as workername FROM Worker_Service__c as ws'
            + ' join User__c as u ON u.Id = ws.Worker__c WHERE Service__c = "' + req.params.id + '" GROUP BY ws.Worker__c'
        execute.query(query, function (error, results) {
            if (error) {
                logger.error('Error in getting getClientSearch: ', error);
                done(error, results);
            } else {
                done(error, results);
            }
        });
    },
    quickEditClient: function (req, done) {
        var date = new Date();
        if (req.body.isNewClient === true) {
            var quickAddClientData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                FirstName: req.body.firstname,
                MiddleName: req.body.middlename,
                LastName: req.body.lastname,
                Phone: req.body.primaryPhone,
                Email: req.body.email,
                MobilePhone: req.body.mobilePhone
            };
            var sqlQuery = 'INSERT INTO ' + config.dbTables.ContactTBL + ' SET ?';
            execute.query(sqlQuery, quickAddClientData, function (err, data) {
                if (err) {
                    logger.error('Error in ClientSearch dao - quickAddClient:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    query1 = 'SELECT * FROM ' + config.dbTables.ContactTBL + ' WHERE Id = "' + quickAddClientData.Id + '" and isDeleted =0'
                    execute.query(query1, '', function (err1, data1) {
                        if (err1) {
                            logger.error('Error in ClientSearch dao - quickAddClient:', err1);
                            done(err1, { statusCode: '9999' });
                        } else {
                            done(err1, data1);
                        }
                    });
                }
            });
        } else {
            var sqlQuery = 'UPDATE ' + config.dbTables.ContactTBL
                + ' SET Email = "' + req.body.email
                + '", MobilePhone = "' + req.body.mobilePhone
                + '", Phone = "' + req.body.primaryPhone
                + '" WHERE Id = "' + req.params.id + '"';
            execute.query(sqlQuery, function (error, results) {
                if (error) {
                    logger.error('Error in edit Client: ', error);
                    done(error, results);
                } else {
                    done(error, results);
                }
            });
        }
    },
    clientProPIc: function (req, done) {
        try {
            if (req.files && req.files.length > 0) {
                clientImagePath = req.files[0].path
            } else {
                clientImagePath = '';
            }
            var sqlQuery = 'UPDATE ' + config.dbTables.ContactTBL
                + ' SET Client_Pic__c = "' + clientImagePath
                + '" WHERE Id = "' + req.params.id + '"';
            execute.query(sqlQuery, function (error, results) {
                if (error) {
                    logger.error('Error in profile upload: ', error);
                    done(error, results);
                } else {
                    done(error, results);
                }
            });
        } catch (err) {
            logger.error('Error in profile upload: ', err);
        }
    },
    editClient: function (req, done) {
        var date = new Date();
        var updateObj = JSON.parse(req.body.clientObj);
        var clientRewardsUpdateData = updateObj.clientRewardsData;
        var clientImagePath = '';
        var temp = 0;
        if (req.files && req.files.length > 0) {
            clientImagePath = req.files[0].path
        } else {
            clientImagePath = '';
        }
        var birthDate = updateObj.birthMonth + '-' + updateObj.birthDay + '-' + updateObj.birthYear;
        var editQuery = 'UPDATE ' + config.dbTables.ContactTBL
            + ' SET Gender__c = "' + updateObj.gender
            // client Info
            + '", FirstName = "' + updateObj.clientInfoFirstName
            + '", LastName = "' + updateObj.clientInfoLastName
            + '", MiddleName	= "' + updateObj.clientInfoMiddleName
            + '", MailingStreet = "' + updateObj.clientInfoMailingStreet
            + '", MailingCity = "' + updateObj.clientInfoMailingCity
            + '", MailingState = "' + updateObj.clientInfoMailingState
            + '", MailingPostalCode = "' + updateObj.clientInfoPostalCode
            + '", MailingCountry = "' + updateObj.clientInfoMailingCountry
            + '", Phone = "' + updateObj.clientInfoPrimaryPhone
            + '", MobilePhone = "' + updateObj.clientInfoMobilePhone
            + '", Email = "' + updateObj.clientInfoPrimaryMail
            + '", Secondary_Email__c = "' + updateObj.clientInfoSecondaryEmail
            + '", Emergency_Name__c = "' + updateObj.clientInfoEmergName
            + '", Emergency_Primary_Phone__c = "' + updateObj.clientInfoEmergPrimaryPhone
            + '", Emergency_Secondary_Phone__c = "' + updateObj.clientInfoEmergSecondaryPhone
            + '", Active__c = "' + updateObj.clientInfoActive
            + '", No_Email__c = "' + updateObj.clientInfoNoEmail
            + '", Responsible_Party__c = "' + updateObj.responsibleParty
            // client profile && preferences
            + '", Birthdate = "' + birthDate
            + '", BirthYearNumber__c = "' + updateObj.birthYear
            + '", BirthDateNumber__c = "' + updateObj.birthDay
            + '", BirthMonthNumber__c = "' + updateObj.birthMonth
            + '", Notes__c = "' + updateObj.notes
            + '", Referred_By__c = "' + updateObj.referredBy
            + '", Title = "' + updateObj.occupationvalue
            + '", Client_Flag__c = "' + updateObj.selectedFlags
            + '", Referred_On_Date__c = "' + updateObj.referedOnDate
            // + '", Client_Pic__c = "' + updateObj.clientPictureFile
            + '", Marketing_Opt_Out__c = "' + updateObj.marketingOptOut
            + '", Marketing_Mobile_Phone__c = "' + updateObj.marketingMobilePhone
            + '", Marketing_Primary_Email__c = "' + updateObj.marketingPrimaryEmail
            + '", Marketing_Secondary_Email__c = "' + updateObj.marketingSecondaryEmail
            + '", Mobile_Carrier__c = "' + updateObj.mobileCarrierName
            + '", Notification_Mobile_Phone__c = "' + updateObj.notificationMobilePhone
            + '", Notification_Opt_Out__c = "' + updateObj.notificationOptOut
            + '", Notification_Primary_Email__c = "' + updateObj.notificationPrimaryEmail
            + '", Notification_Secondary_Email__c = "' + updateObj.notificationSecondaryEmail
            + '", Reminder_Mobile_Phone__c = "' + updateObj.reminderMobilePhone
            + '", Reminder_Opt_Out__c = "' + updateObj.reminderOptOut
            + '", Reminder_Primary_Email__c = "' + updateObj.reminderPrimaryEmail
            + '", Reminder_Secondary_Email__c = "' + updateObj.reminderSecondaryEmail
            + '", Credit_Card_Token__c = "' + updateObj.creditCardToken
            + '", Token_Expiration_Date__c = "' + updateObj.tokenExpirationDate
            + '", Payment_Type_Token__c = "' + updateObj.PaymentType
            + '", Token_Present__c = "' + updateObj.tokenPresent
        if (clientImagePath !== '') {
            editQuery += '", Client_Pic__c = "' + clientImagePath
        }
        editQuery += '", Refer_A_Friend_Prospect__c = "' + parseInt(updateObj.ReferedAFriendProspect)
            // appointments
            + '", BR_Reason_No_Email__c = "' + updateObj.noEmailAppt
            + '", BR_Reason_Account_Charge_Balance__c = "' + updateObj.accoutChargeBalance
            + '", BR_Reason_Deposit_Required__c = "' + updateObj.depositRequired
            + '", BR_Reason_Other__c = "' + updateObj.other
            + '", Booking_Restriction_Note__c = "' + updateObj.otherReason
            + '", BR_Reason_Other_Note__c = "' + updateObj.apptNotes
            + '", Booking_Frequency__c = "' + updateObj.bookingFrequency
            + '", Allow_Online_Booking__c = "' + updateObj.allowOnlineBooking
            + '", Has_Standing_Appts__c = "' + updateObj.hasStandingAppt
            + '", Booking_Restriction_Type__c = "' + updateObj.restrictionType
            + '", BR_Reason_No_Show__c = "' + updateObj.persistanceNoShow
            + '", Pin__c = "' + updateObj.pin
            // Accounts
            + '", Active_Rewards__c = "' + updateObj.activeRewards
            + '", Membership_ID__c = "' + updateObj.clientMemberShipId
            + '", Starting_Balance__c = "' + updateObj.startingBalance
            + '" WHERE Id = "' + req.params.id + '"';
        var Birthdate = req.body.birthMonth + '-' + req.body.birthDay + '-' + req.body.birthYear;
        if (req.files && req.files.length > 0) {
            updateObj.clientPicture = req.files[0].path;
        }
        var quickAddClientData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            // clientInfo
            Active__c: updateObj.clientInfoActive,
            FirstName: updateObj.clientInfoFirstName,
            MiddleName: updateObj.clientInfoMiddleName,
            LastName: updateObj.clientInfoLastName,
            MailingStreet: updateObj.clientInfoMailingStreet,
            MailingCity: updateObj.clientInfoMailingCity,
            MailingState: updateObj.clientInfoMailingState,
            MailingPostalCode: updateObj.clientInfoPostalCode,
            MailingCountry: updateObj.clientInfoMailingCountry,
            Phone: updateObj.clientInfoPrimaryPhone,
            MobilePhone: updateObj.clientInfoMobilePhone,
            Email: updateObj.clientInfoPrimaryMail,
            Secondary_Email__c: updateObj.clientInfoSecondaryEmail,
            Emergency_Name__c: updateObj.lientInfoEmergName,
            Emergency_Primary_Phone__c: updateObj.clientInfoEmergPrimaryPhone,
            Emergency_Secondary_Phone__c: updateObj.clientInfoEmergSecondaryPhone,
            No_Email__c: updateObj.clientInfoNoEmail,
            // client profile && preferences
            Birthdate: birthDate,
            BirthYearNumber__c: updateObj.birthYear,
            BirthDateNumber__c: updateObj.birthDay,
            BirthMonthNumber__c: updateObj.birthMonth,
            Notes__c: updateObj.notes,
            Referred_By__c: updateObj.referredBy,
            Title: updateObj.occupationvalue,
            Marketing_Opt_Out__c: updateObj.marketingOptOut,
            Marketing_Mobile_Phone__c: updateObj.marketingMobilePhone,
            Marketing_Primary_Email__c: updateObj.marketingPrimaryEmail,
            Marketing_Secondary_Email__c: updateObj.marketingSecondaryEmail,
            Mobile_Carrier__c: updateObj.mobileCarrierName,
            Notification_Mobile_Phone__c: updateObj.notificationMobilePhone,
            Notification_Opt_Out__c: updateObj.notificationOptOut,
            Notification_Primary_Email__c: updateObj.notificationPrimaryEmail,
            Notification_Secondary_Email__c: updateObj.notificationSecondaryEmail,
            Reminder_Mobile_Phone__c: updateObj.reminderMobilePhone,
            Reminder_Opt_Out__c: updateObj.reminderOptOut,
            Reminder_Primary_Email__c: updateObj.reminderPrimaryEmail,
            Reminder_Secondary_Email__c: updateObj.reminderSecondaryEmail,
            Client_Pic__c: clientImagePath,
            Refer_A_Friend_Prospect__c: parseInt(updateObj.ReferedAFriendProspect),
            // appointments
            BR_Reason_No_Email__c: updateObj.noEmailAppt,
            BR_Reason_Account_Charge_Balance__c: updateObj.accoutChargeBalance,
            BR_Reason_Deposit_Required__c: updateObj.depositRequired,
            BR_Reason_Other__c: updateObj.other,
            Booking_Restriction_Note__c: updateObj.otherReason,
            BR_Reason_Other_Note__c: updateObj.apptNotes,
            Booking_Frequency__c: updateObj.bookingFrequency,
            Allow_Online_Booking__c: updateObj.allowOnlineBooking,
            Has_Standing_Appts__c: updateObj.hasStandingAppt,
            Booking_Restriction_Type__c: updateObj.restrictionType,
            Pin__c: updateObj.pin,
            // Accounts
            Active_Rewards__c: updateObj.activeRewards,
            Membership_ID__c: updateObj.clientMemberShipId,
            Starting_Balance__c: updateObj.startingBalance
        };
        var insertQuery = 'INSERT INTO ' + config.dbTables.ContactTBL + ' SET ?';
        if (updateObj.isNewClient === true) {
            execute.query(insertQuery, quickAddClientData, function (err, data) {
                if (err) {
                    logger.error('Error in ClientSearch dao - quickAddClient:', err);
                    done(err, { statusCode: '9999' });
                }
                temp++;
                if (temp == 2) {
                    done(err, data);
                }
            });
        } else {
            execute.query(editQuery, function (error, results) {
                if (error) {
                    logger.error('Error in edit Client: ', error);
                    done(error, results);
                }
                temp++;
                if (temp == 2) {
                    done(error, results);
                }
            });
        }
        /**
         * To Update the Points and Description value in Client reward Details Table
         */
        if (clientRewardsUpdateData && clientRewardsUpdateData.length > 0) {
            async.each(clientRewardsUpdateData, function (updateData, next) {
                if (updateData.adjustPoints === undefined || updateData.adjustPoints === null) {
                    updateData.adjustPoints = updateData.Points_c;
                }
                if (updateData.rewardDesc === undefined || updateData.rewardDesc === null) {
                    updateData.rewardDesc = updateData.Description__c;
                }
                if (updateData && updateData.adjustPoints || updateData && updateData.rewardDesc) {
                    var clientRewardQuery = 'UPDATE ' + config.dbTables.clientRewardDetailTBL
                        + ' SET Points_c = "' + updateData.adjustPoints
                        + '", Description__c = "' + updateData.rewardDesc
                        + '" WHERE Client_Reward__c = "' + updateData.Id + '"';
                    execute.query(clientRewardQuery, function (error1, result1) {
                        if (error1) {
                            logger.error('Error in edit Client: ', error1);
                        }
                        temp++;
                        if (temp == 2) {
                            done(error1, result1);
                        }
                    });
                }
            });
        } else {
            temp++;
            if (temp == 2) {
                done(null, []);
            }
        }
        /**
         * To Update the Points and Description value in Client reward Details Table
         */
        if (updateObj.clientMemberShipsData && updateObj.clientMemberShipsData.length > 0) {
            for (var i = 0; i < updateObj.clientMemberShipsData.length; i++) {
                const Ndate = new Date(updateObj.clientMemberShipsData[i].Next_Bill_Date__c);
                updateObj.clientMemberShipsData[i].Next_Bill_Date__c = Ndate.getFullYear() + '-' + ('0' + (Ndate.getMonth() + 1)).slice(-2) + '-' + ('0' + Ndate.getDate()).slice(-2) + ' 00:00:00';
                var clientMemberShipQuery = 'UPDATE `Client_Membership__c`'
                    + ' SET Auto_Bill__c = "' + updateObj.clientMemberShipsData[i].Auto_Bill__c
                    + '", Next_Bill_Date__c = "' + updateObj.clientMemberShipsData[i].Next_Bill_Date__c
                    + '" WHERE Id = "' + updateObj.clientMemberShipsData[i].Id + '"';
                execute.query(clientMemberShipQuery, function (error1, result1) {
                    if (error1) {
                        logger.error('Error in edit Client: ', error1);
                    }
                    temp++;
                    if (temp == 2) {
                        done(error1, result1);
                    }
                });
            }
        } else {
            temp++;
            if (temp == 2) {
                done(null, []);
            }
        }
    },
    serviceLogNotes: function (req, done) {
        var date = new Date();
        var noteObj = req.body;
        var editQuery = 'UPDATE ' + config.dbTables.ticketServiceTBL
            + ' SET Notes__c = "' + noteObj.notes
            + '" WHERE Id = "' + req.params.id + '"';
        execute.query(editQuery, function (error, results) {
            if (error) {
                logger.error('Error in edit Client: ', error);
                done(error, results);
            } else {
                done(error, results);
            }
        });
    },

    /** 
     * This Method is using for client appoint ment , Modify appt and Book Appt pages
    */
    appointmentbooking: function (req, done) {
        var appointmentbookingObj = req.body;
        moment.suppressDeprecationWarnings = true;
        var apptServicesData = appointmentbookingObj.servicesData;
        var id = uniqid();
        var apptName;
        var newClient = 0;
        var date = dateFns.getUTCDatTmStr(new Date());
        var records = [];
        var updaterecords = [];
        var i = 0;
        var insertArray = [];
        var queries = '';
        var updatequeries = '';
        var indexParm = 0;
        var selectSql = 'SELECT Name, CreatedDate FROM `Appt_Ticket__c` where isDeleted =0 ORDER BY CreatedDate DESC';
        var sqlnewClient = 'SELECT New_Client__c FROM `Appt_Ticket__c` WHERE Client__c="' + appointmentbookingObj.Client__c + '" ';
        execute.query(selectSql, '', function (err, result) {
            if (err) {
                done(err, result);
            } else {
                if (result && result.length > 0) {
                    var generator = new sequential.Generator({
                        digits: 6,
                        restore: result[0].Name
                    });
                    apptName = generator.generate();
                } else {
                    apptName = '000001';
                }
            }
            execute.query(sqlnewClient, '', function (err, result) {
                if (result.length === 0) {
                    newClient = 1;
                }
                if (appointmentbookingObj && appointmentbookingObj.apptId === '') {
                    var apptDate = appointmentbookingObj.Appt_Date_Time__c;
                    var apptObjData = {
                        Id: id,
                        OwnerId: uniqid(),
                        IsDeleted: 0,
                        Name: apptName,
                        CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                        CreatedById: uniqid(),
                        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                        LastModifiedById: uniqid(),
                        SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                        Appt_Date_Time__c: appointmentbookingObj.Appt_Date_Time__c,
                        Client_Type__c: appointmentbookingObj.Client_Type__c,
                        Client__c: appointmentbookingObj.Client__c,
                        Duration__c: appointmentbookingObj.Duration__c,
                        Status__c: 'Booked',
                        New_Client__c: newClient,
                        Is_Booked_Out__c: 0,
                        Notes__c: appointmentbookingObj.Notes__c

                    };
                    var insertQuery = 'INSERT INTO ' + config.dbTables.apptTicketTBL + ' SET ?';
                    execute.query(insertQuery, apptObjData, function (err, result) {
                        if (err) {
                            logger.error('Error in WorkerServices dao - updateWorkerService:', err);
                            indexParm++;
                            sendResponse(indexParm, err, { statusCode: '9999' }, done);
                        } else {
                            for (var i = 0; i < apptServicesData.length; i++) {
                                if (!apptServicesData[i].Duration_1__c) {
                                    apptServicesData[i].Duration_1__c = 0;
                                }
                                if (!apptServicesData[i].Duration_2__c) {
                                    apptServicesData[i].Duration_2__c = 0;
                                }
                                if (!apptServicesData[i].Duration_3__c) {
                                    apptServicesData[i].Duration_3__c = 0;
                                }
                                if (!apptServicesData[i].Guest_Charge__c) {
                                    apptServicesData[i].Guest_Charge__c = 0;
                                }
                                if (!apptServicesData[i].Buffer_After__c) {
                                    apptServicesData[i].Buffer_After__c = 0;
                                }
                                if (!apptServicesData[i].Duration__c) {
                                    apptServicesData[i].Duration__c = parseInt(apptServicesData[i].Duration_1__c, 10) + parseInt(apptServicesData[i].Duration_2__c, 10) + parseInt(apptServicesData[i].Duration_3__c, 10);
                                }
                                records.push([uniqid(),
                                config.booleanFalse,
                                    date, uniqid(),
                                    date, uniqid(),
                                    date,
                                apptObjData.Id,
                                appointmentbookingObj.Client_Type__c,
                                appointmentbookingObj.Client__c,
                                apptServicesData[i].workerName,
                                    apptDate,
                                    'Booked',
                                apptServicesData[i].serviceGroupColour,
                                apptServicesData[i].Duration_1__c,
                                apptServicesData[i].Duration_2__c,
                                apptServicesData[i].Duration_3__c,
                                apptServicesData[i].Duration__c,
                                apptServicesData[i].Buffer_After__c,
                                apptServicesData[i].Guest_Charge__c,
                                    0.0,
                                    0,
                                apptServicesData[i].Net_Price__c,
                                apptServicesData[i].Net_Price__c,
                                    0,
                                appointmentbookingObj.Rebooked__c,
                                apptServicesData[i].Id,
                                    '',
                                ]);
                                var insertQuery1 = 'INSERT INTO ' + config.dbTables.ticketServiceTBL
                                    + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                                    + ' SystemModstamp, Appt_Ticket__c, Visit_Type__c, Client__c,'
                                    + ' Worker__c, Service_Date_Time__c, Status__c, Service_Group_Color__c,Duration_1__c,Duration_2__c,Duration_3__c, Duration__c, Buffer_After__c, Guest_Charge__c, Service_Tax__c,'
                                    + ' Is_Booked_Out__c, Net_Price__c,Price__c, Non_Standard_Duration__c, Rebooked__c,Service__c, Notes__c) VALUES ?';
                                if (apptServicesData[i].Duration__c) {
                                    // apptDate = new Date(apptDate.getTime() + parseInt(apptServicesData[i].Duration__c, 10) * 60000);
                                    apptDate = dateFns.addMinToDBStr(apptDate, parseInt(apptServicesData[i].Duration__c, 10));
                                } else {
                                    // apptDate = new Date(apptDate.getTime() + parseInt(apptServicesData[i].Duration_1__c, 10) + parseInt(apptServicesData[i].Duration_2__c, 10) + parseInt(apptServicesData[i].Duration_3__c, 10) * 60000);
                                    apptDate = dateFns.addMinToDBStr(apptDate, parseInt(apptServicesData[i].Duration_1__c, 10) + parseInt(apptServicesData[i].Duration_2__c, 10) + parseInt(apptServicesData[i].Duration_3__c, 10));
                                }
                            }
                            execute.query(insertQuery1, [records], function (err1, result1) {
                                if (err1) {
                                    logger.error('Error in WorkerServices dao - updateWorkerService:', err1);
                                    indexParm++;
                                    sendResponse(indexParm, err1, { statusCode: '9999' }, done);
                                } else {
                                    indexParm++;
                                    sendResponse(indexParm, err1, result1, done);
                                }
                            });
                        }
                    });
                } else {
                    var apptDate1 = appointmentbookingObj.Appt_Date_Time__c;
                    var updateQuery = "UPDATE " + config.dbTables.apptTicketTBL
                        + " SET Appt_Date_Time__c = '" + apptDate1
                        + "', Client_Type__c = '" + appointmentbookingObj.Client_Type__c
                        + "', Client__c = '" + appointmentbookingObj.Client__c
                        + "', Duration__c = '" + appointmentbookingObj.Duration__c
                        + "', Notes__c = '" + appointmentbookingObj.Notes__c
                        + "', LastModifiedDate = '" + date
                        + "' WHERE Id = '" + appointmentbookingObj.apptId + "'";
                    execute.query(updateQuery, '', function (err, result) {
                        if (err) {
                            logger.error('Error in WorkerServices dao - updateWorkerService:', err);
                            indexParm++;
                            sendResponse(indexParm, err, result, done);
                        } else {
                            if (req.body.daleteArray.length > 0) {
                                for (var i = 0; i < req.body.daleteArray.length; i++) {
                                    queries += mysql.format('UPDATE ' + config.dbTables.ticketServiceTBL
                                        + ' SET IsDeleted = 1'
                                        + ' WHERE Id = "' + req.body.daleteArray[i].tsId + '";');
                                }
                                if (queries.length > 0) {
                                    execute.query(queries, function (err, result) {
                                        indexParm++;
                                        sendResponse(indexParm, err, result, done);
                                    });
                                } else {
                                    indexParm++;
                                    sendResponse(indexParm, null, null, done);
                                }
                            }
                            if (apptServicesData.length > 0) {
                                for (var i = 0; i < apptServicesData.length; i++) {
                                    if (apptServicesData[i].tsId && appointmentbookingObj.apptId) {
                                        if (!apptServicesData[i].Duration_1__c) {
                                            apptServicesData[i].Duration_1__c = 0;
                                        }
                                        if (!apptServicesData[i].Duration_2__c) {
                                            apptServicesData[i].Duration_2__c = 0;
                                        }
                                        if (!apptServicesData[i].Duration_3__c) {
                                            apptServicesData[i].Duration_3__c = 0;
                                        }
                                        if (!apptServicesData[i].Guest_Charge__c) {
                                            apptServicesData[i].Guest_Charge__c = 0;
                                        }
                                        if (!apptServicesData[i].Buffer_After__c) {
                                            apptServicesData[i].Buffer_After__c = 0;
                                        }
                                        if (!apptServicesData[i].Duration__c) {
                                            apptServicesData[i].Duration__c = parseInt(apptServicesData[i].Duration_1__c, 10) + parseInt(apptServicesData[i].Duration_2__c, 10) + parseInt(apptServicesData[i].Duration_3__c, 10);
                                        }
                                        queries += mysql.format('UPDATE ' + config.dbTables.ticketServiceTBL
                                            + ' SET Visit_Type__c = "' + appointmentbookingObj.Client_Type__c
                                            + '", Client__c = "' + appointmentbookingObj.Client__c
                                            + '", Worker__c = "' + apptServicesData[i].workerName
                                            + '", Service_Date_Time__c = "' + apptDate1
                                            + '", Service_Group_Color__c = "' + apptServicesData[i].serviceGroupColour
                                            + '", Duration_1__c = "' + apptServicesData[i].Duration_1__c
                                            + '", Duration_2__c = "' + apptServicesData[i].Duration_2__c
                                            + '", Duration_3__c = "' + apptServicesData[i].Duration_3__c
                                            + '", Duration__c = "' + apptServicesData[i].Duration__c
                                            + '", Buffer_After__c = "' + apptServicesData[i].Buffer_After__c
                                            + '", Guest_Charge__c = "' + apptServicesData[i].Guest_Charge__c
                                            + '", Service_Tax__c = "' + 0
                                            + '", Is_Booked_Out__c = "' + 0
                                            + '", Net_Price__c = "' + apptServicesData[i].Net_Price__c
                                            + '", Non_Standard_Duration__c = "' + 0
                                            + '", Rebooked__c = "' + appointmentbookingObj.Rebooked__c
                                            + '", Service__c = "' + apptServicesData[i].Id
                                            + '", LastModifiedDate = "' + moment(date).format('YYYY-MM-DD HH:MM:SS A')
                                            + '", Appt_Ticket__c = "' + appointmentbookingObj.apptId
                                            + '" WHERE Id = "' + apptServicesData[i].tsId + '";');
                                    } else {
                                        if (!apptServicesData[i].Duration_1__c) {
                                            apptServicesData[i].Duration_1__c = 0;
                                        }
                                        if (!apptServicesData[i].Duration_2__c) {
                                            apptServicesData[i].Duration_2__c = 0;
                                        }
                                        if (!apptServicesData[i].Duration_3__c) {
                                            apptServicesData[i].Duration_3__c = 0;
                                        }
                                        if (!apptServicesData[i].Guest_Charge__c) {
                                            apptServicesData[i].Guest_Charge__c = 0;
                                        }
                                        if (!apptServicesData[i].Buffer_After__c) {
                                            apptServicesData[i].Buffer_After__c = 0;
                                        }
                                        if (!apptServicesData[i].Duration__c) {
                                            apptServicesData[i].Duration__c = parseInt(apptServicesData[i].Duration_1__c, 10) + parseInt(apptServicesData[i].Duration_2__c, 10) + parseInt(apptServicesData[i].Duration_3__c, 10);
                                        }
                                        updaterecords.push([uniqid(),
                                        config.booleanFalse,
                                            date, uniqid(),
                                            date, uniqid(),
                                            date,
                                        appointmentbookingObj.apptId,
                                        appointmentbookingObj.Client_Type__c,
                                        appointmentbookingObj.Client__c,
                                        apptServicesData[i].workerName,
                                            apptDate1,
                                            'Booked',
                                        apptServicesData[i].serviceGroupColour,
                                        apptServicesData[i].Duration_1__c,
                                        apptServicesData[i].Duration_2__c,
                                        apptServicesData[i].Duration_3__c,
                                        apptServicesData[i].Duration__c,
                                        apptServicesData[i].Buffer_After__c,
                                        apptServicesData[i].Guest_Charge__c,
                                            0.0,
                                            0,
                                        apptServicesData[i].Net_Price__c,
                                            0,
                                            0,
                                        apptServicesData[i].Id,
                                            '',
                                        ]);
                                    }
                                    if (apptServicesData[i].Duration__c) {
                                        // apptDate1 = new Date(apptDate1.getTime() + parseInt(apptServicesData[i].Duration__c, 10) * 60000);
                                        apptDate1 = dateFns.addMinToDBStr(apptDate1, parseInt(apptServicesData[i].Duration__c, 10));
                                    } else {
                                        // apptDate1 = new Date(apptDate1.getTime() + parseInt(apptServicesData[i].Duration_1__c, 10) + parseInt(apptServicesData[i].Duration_2__c, 10) + parseInt(apptServicesData[i].Duration_3__c, 10) * 60000);
                                        apptDate1 = dateFns.addMinToDBStr(apptDate1, parseInt(apptServicesData[i].Duration_1__c, 10) + parseInt(apptServicesData[i].Duration_2__c, 10) + parseInt(apptServicesData[i].Duration_3__c, 10));
                                    }
                                }
                                if (updaterecords.length > 0) {
                                    var insertQuery1 = 'INSERT INTO ' + config.dbTables.ticketServiceTBL
                                        + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                                        + ' SystemModstamp, Appt_Ticket__c, Visit_Type__c, Client__c,'
                                        + ' Worker__c, Service_Date_Time__c, Status__c, Service_Group_Color__c,Duration_1__c,Duration_2__c,Duration_3__c, Duration__c,Buffer_After__c,Guest_Charge__c, Service_Tax__c,'
                                        + ' Is_Booked_Out__c, Net_Price__c, Non_Standard_Duration__c, Rebooked__c,Service__c, Notes__c) VALUES ?';
                                    execute.query(insertQuery1, [updaterecords], function (err1, result1) {
                                        if (err1) {
                                            logger.error('Error in WorkerServices dao - updateWorkerService:', err1);
                                            indexParm++;
                                            sendResponse(indexParm, err1, { statusCode: '9999' }, done);
                                        } else {
                                            indexParm++;
                                            sendResponse(indexParm, err1, result1, done);
                                        }
                                    });
                                } else {
                                    indexParm++;
                                    if (indexParm === 2) {
                                        done(null, 'done');
                                    }
                                }
                                if (queries.length > 0) {
                                    execute.query(queries, function (err, result) {
                                        indexParm++;
                                        if (indexParm === 2) {
                                            done(err, result);
                                        }
                                    });
                                } else {
                                    indexParm++;
                                    if (indexParm === 2) {
                                        done(err, result);
                                    }
                                }
                            } else {
                                done(null, 'done');
                            }
                        }
                    });
                }
            });
        });
    },
    clientSearchMembers: function (req, done) {
        var workerIds = req.body.workerIds;
        var serviceIds = req.body.serviceIds;
        var clientId = req.body.clientId;
        var day = req.body.searchDay;
        var currentDay;
        try {
            // var day = req.params.day;
            // var name = req.params.name;
            if (day === "Monday") {
                currentDay = 'hrs.MondayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.MondayStartTime__c as starttime , "
                    + " hrs.MondayEndTime__c as endtime FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c "
                    + " join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c "
                    + " and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " and users.Id IN " + workerIds + " "
                    + " LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 GROUP by users.FirstName";
            } else if (day === "Tuesday") {
                currentDay = 'hrs.TuesdayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.TuesdayStartTime__c as starttime , "
                    + " hrs.TuesdayEndTime__c as endtime FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c "
                    + " join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c "
                    + " and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " and users.Id IN " + workerIds + ""
                    + " LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 GROUP by users.FirstName";
            } else if (day === "Wednesday") {
                currentDay = 'hrs.WednesdayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.WednesdayStartTime__c as starttime , "
                    + " hrs.WednesdayEndTime__c as endtime FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c "
                    + " join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c "
                    + " and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " and users.Id IN " + workerIds + ""
                    + " LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 GROUP by users.FirstName";
            } else if (day === "Thursday") {
                currentDay = 'hrs.ThursdayStartTime__c != ""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.ThursdayStartTime__c as starttime , "
                    + " hrs.ThursdayEndTime__c as endtime FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c "
                    + " join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c "
                    + " and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " and users.Id IN " + workerIds + ""
                    + " LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 GROUP by users.FirstName";
            } else if (day === "Friday") {
                currentDay = 'hrs.FridayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.FridayStartTime__c as starttime , "
                    + " hrs.FridayEndTime__c as endtime FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c "
                    + " join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c "
                    + " and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " and users.Id IN " + workerIds + ""
                    + " LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 GROUP by users.FirstName";
            } else if (day === "Saturday") {
                currentDay = 'hrs.SaturdayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.SaturdayStartTime__c as starttime , "
                    + " hrs.SaturdayEndTime__c as endtime FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c "
                    + " join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c "
                    + " and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " and users.Id IN " + workerIds + ""
                    + " LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 GROUP by users.FirstName";
            } else if (day === "Sunday") {
                currentDay = 'hrs.SundayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.SundayStartTime__c as starttime , "
                    + " hrs.SundayEndTime__c as endtime FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c "
                    + " join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c "
                    + " and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " and users.Id IN " + workerIds + ""
                    + " LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 GROUP by users.FirstName";

            } else if (day === "all") {
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.MondayStartTime__c as starttime, hrs.MondayEndTime__c as endtime,CONCAT('Tuesday', '-',hrs.TuesdayStartTime__c,'|',hrs.TuesdayEndTime__c) as Tuesday,CONCAT('Wednesday', '-',hrs.WednesdayStartTime__c,'|',hrs.WednesdayEndTime__c) as Wednesday, CONCAT('Thursday', '-',hrs.ThursdayStartTime__c,'|',hrs.ThursdayEndTime__c) as Thursday,CONCAT('Friday', '-',hrs.FridayStartTime__c,'|',hrs.FridayEndTime__c) as Friday, CONCAT('Saturday', '-',hrs.SaturdayStartTime__c,'|',hrs.SaturdayEndTime__c) as Satuday,CONCAT('Sunday', '-',hrs.SundayStartTime__c,'|',hrs.SundayEndTime__c) as Sunday FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + ""
                    + " LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 GROUP by users.FirstName";
            }
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in appoitments dao - getApptBookingData:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in ClientSearch dao - getClientSearch:', err);
            return (err, { statusCode: '9999' });
        }
    },
    searchApptAvailability: function (req, done) {
        var date = req.body.date;
        var workerData = req.body.workerData;
        // var ApptDate = moment(date).format('YYYY-MM-DD, hh:mm:ss');
        var ApptDate = moment(date).format('YYYY-MM-DD');
        clientType = req.body.visitType;
        workerId = req.body.worker;
        workerId1 = req.body.workerName;
        apptBookDate = req.body.date;
        clientId = req.body.clientId;
        apptViewValue = req.body.apptViewValue;
        var workerIds = '';
        if (workerData && workerData.length > 0) {
            for (i = 0; i < workerData.length; i++) {
                if (workerData[i].workerId) {
                    workerIds += "'" + workerData[i].workerId + "',";
                } else {
                    workerIds += "'" + workerData[i].workerName + "',";
                }
            }
        }
        workerIds = '(' + workerIds.slice(0, -1) + ')';
        if (workerData && ApptDate) {
            //query = 'SELECT * FROM Appt_Ticket__c WHERE DATE(Appt_Date_Time__c) = "' + ApptDate + '"  AND Worker__c IN  ' + workerIds;
            query = 'SELECT * FROM Appt_Ticket__c as ap left join Ticket_Service__c as ts on ap.Id = ts.Appt_Ticket__c where DATE(ap.Appt_Date_Time__c) = "' + ApptDate + '" AND ts.Worker__c IN ' + workerIds + ' and ts.isDeleted =0 GROUP by ts.Id';
            execute.query(query, function (error, results) {
                if (error) {
                    logger.error('Error in getting getClientSearch: ', error);
                    done(error, results);
                } else {
                    done(error, results);
                }
            });
        } else {
            if (clientId && apptViewValue === 'Future') {
                query1 = 'SELECT * FROM Appt_Ticket__c WHERE Client__c = "' + clientId + '" AND Appt_Date_Time__c > "' + ApptDate + '"';
                query2 = 'SELECT Ts.*, S.Name as ServiceName, U.FirstName as WorkerName, Apt.Appt_Date_Time__c as AptDate '
                    + 'FROM Ticket_Service__c Ts JOIN Service__c S on Ts.Service__c = S.Id JOIN User__c U on '
                    + 'Ts.Worker__c = U.Id JOIN Appt_Ticket__c as Apt on Apt.Id = Ts.Appt_Ticket__c WHERE '
                    + 'Ts.Client__c = "' + clientId + '" AND Apt.Appt_Date_Time__c > "' + ApptDate + '"';
            } else if (clientId && apptViewValue === 'Past') {
                query1 = 'SELECT * FROM Appt_Ticket__c WHERE Client__c = "' + clientId + '" AND Appt_Date_Time__c < "' + ApptDate + '"';
                query2 = 'SELECT Ts.*, S.Name as ServiceName, U.FirstName as WorkerName, Apt.Appt_Date_Time__c as AptDate '
                    + 'FROM Ticket_Service__c Ts JOIN Service__c S on Ts.Service__c = S.Id JOIN User__c U on '
                    + 'Ts.Worker__c = U.Id JOIN Appt_Ticket__c as Apt on Apt.Id = Ts.Appt_Ticket__c WHERE '
                    + 'Ts.Client__c = "' + clientId + '" AND Apt.Appt_Date_Time__c < "' + ApptDate + '"';
            } else if (clientId && apptViewValue === 'All') {
                query1 = 'SELECT * FROM Appt_Ticket__c WHERE Client__c = "' + clientId + '"';
                query2 = 'SELECT Ts.*, S.Name as ServiceName, U.FirstName as WorkerName, Apt.Appt_Date_Time__c as AptDate '
                    + 'FROM Ticket_Service__c Ts JOIN Service__c S on Ts.Service__c = S.Id JOIN User__c U on '
                    + 'Ts.Worker__c = U.Id JOIN Appt_Ticket__c as Apt on Apt.Id = Ts.Appt_Ticket__c WHERE '
                    + 'Ts.Client__c = "' + clientId + '"';
            } else if (clientId && apptViewValue === 'Cancelled') {
                query1 = 'SELECT * FROM Appt_Ticket__c WHERE Client__c = "' + clientId + '" AND Status__c = "Cancelled"';
                query2 = 'SELECT Ts.*, S.Name as ServiceName, U.FirstName as WorkerName, Apt.Appt_Date_Time__c as AptDate '
                    + 'FROM Ticket_Service__c Ts JOIN Service__c S on Ts.Service__c = S.Id JOIN User__c U on '
                    + 'Ts.Worker__c = U.Id JOIN Appt_Ticket__c as Apt on Apt.Id = Ts.Appt_Ticket__c WHERE '
                    + 'Ts.Client__c = "' + clientId + '"  AND Apt.Status__c = "Cancelled"';
            }
            execute.query(query1, function (error1, result1) {
                if (error1) {
                    logger.error('Error in getting getClientSearch: ', error1);
                    done(error1, result1);
                } else {
                    execute.query(query2, function (error2, result2) {
                        if (error2) {
                            logger.error('Error in getting getClientSearch: ', error2);
                            done(error2, result2);
                        } else {
                            done(error2, results = { 'Appointments': result1, 'AppointmenServices': result2 });
                        }
                    });
                }
            });
        }
    },
    quickAddClient: function (req, done) {
        var date = new Date();
        var quickAddClientObj = req.body;
        var quickAddClientData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            FirstName: apptDate,
            MiddleName: 0,
            LastName: 0,
            Phone: appointmentbookingObj.Client_Type__c,
            Email: appointmentbookingObj.Client__c,
            MobilePhone: appointmentbookingObj.Worker__c
        };
        var sqlQuery = 'INSERT INTO ' + config.dbTables.ContactTBL + ' SET ?';
        execute.query(sqlQuery, appointmentbookingData, function (err, data) {
            if (err) {
                logger.error('Error in ClientSearch dao - quickAddClient:', err);
                done(err, { statusCode: '9999' });
            } else {
                done(err, data);
            }
        });
    },
    getClientRewards: function (req, done) {
        query = 'SELECT Cr.*, Crd.Points_c, Crd.Description__c, R.Name FROM `Client_Reward__c` as Cr '
            + 'JOIN Client_Reward_Detail__c as Crd on Cr.Id = Crd.Client_Reward__c '
            + 'JOIN Reward__c as R on R.Id = Cr.Reward__c '
            + 'WHERE Cr.Client__c= "' + req.params.id + '" and Cr.isDeleted =0 GROUP BY Cr.Id'
        execute.query(query, function (error, results) {
            if (error) {
                logger.error('Error in getting getClientSearch: ', error);
                done(error, results);
            } else {
                done(error, results);
            }
        });
    },
    getClientMemberShips: function (req, done) {
        query = 'SELECT Cm.*, M.Name FROM `Client_Membership__c` as Cm '
            + ' JOIN Membership__c as M on Cm.Membership__c = M.Id WHERE Cm.Client__c= "' + req.params.id + '" and Cm.isDeleted =0'
        execute.query(query, function (error, results) {
            if (error) {
                logger.error('Error in getting getClientSearch: ', error);
                done(error, results);
            } else {
                done(error, results);
            }
        });
    },
    getClientPackages: function (req, done) {
        query = 'SELECT Cp.*, Apt.Name as TicketName, P.Name FROM `Client_Package__c` as Cp '
            + 'JOIN Package__c as P on P.Id = Cp.Package__c '
            + 'JOIN Appt_Ticket__c as Apt on Cp.Ticket__c = Apt.Id '
            + 'WHERE Cp.Client__c= "' + req.params.id + '" and Cp.isDeleted =0'
        execute.query(query, function (error, results) {
            var serviceIds = "'";
            for (i = 0; i < results.length; i++) {
                var packageJson = JSON.parse(results[i].Package_Details__c);
                for (j = 0; j < packageJson.length; j++) {
                    serviceIds += packageJson[j].serviceId + "','";
                }
            }
            if (error) {
                logger.error('Error in getting getClientPackages: ', error);
                done(error, results);
            } else {
                if (results.length > 0) {
                    query1 = 'SELECT Name as ServiceName FROM Service__c WHERE Id IN (' + serviceIds.slice(0, serviceIds.length - 2) + ');'
                    execute.query(query1, function (error1, results1) {
                        if (error1) {
                            logger.error('Error in getting getClientServices: ', error1);
                            done(error1, results1);
                        } else {
                            done(error1, results = { 'ClientPackageData': results, 'ServiceData': results1 });
                        }
                    });
                } else {
                    done(error, '');
                }
            }
        });
    },
    getClientAccounts: function (req, done) {
        try {
            var Id = req.params.id
            var sqlQuery = 'SELECT Tp.*, T.Transaction_Type__c, T.Ticket__c, T.Amount__c, Pt.Name as debitType, '
                + ' Apt.Appt_Date_Time__c as dateTime, Apt.Name as TicketName FROM `Ticket_Payment__c` as Tp '
                + ' JOIN Ticket_Other__c as T on T.Ticket__c = Tp.Appt_Ticket__c JOIN Appt_Ticket__c as Apt '
                + 'JOIN Payment_Types__c as Pt ON Pt.Id = Tp.Payment_Type__c '
                + ' WHERE Apt.Client__c = "' + Id + '" and Apt.isDeleted =0 GROUP BY Apt.Client__c';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in getting getClientAccounts:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in getting getClientAccounts:', err);
            done(err, null);
        }
    },
    getClientEmail: function (req, done) {
        try {
            var Id = req.params.id
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.EmailTBL + ' WHERE Client__c = "' + Id + '" and isDeleted =0 ORDER BY Sent__c desc ';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in getting getClientEmail:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in getting getClientEmail:', err);
            done(err, null);
        }
    },
    getServiceLog: function (req, done) {
        try {
            var Id = req.params.id
            var sqlQuery = "select cc.id, cc.Class__c, ts.Service_Date_Time__c,"
                + " ts.Price_per_Attendee__c, ts.Name, ts.Notes__c,"
                + " ts.Status__c, ts.Worker__c, u.Username,"
                + " ts.Id, cc.Client__c, cc.Payment_Status__c, cc.Check_In_Status__c,"
                + " ts.Appt_Ticket__c, at.Id, at.Name, at.Status__c"
                + " from Class_Client__c as cc"
                + " left JOIN Ticket_Service__c as ts on ts.Client__c = cc.Client__c"
                + " left JOIN User__c as u on u.Id = ts.Worker__c"
                + " left JOIN Appt_Ticket__c as at on at.Id = ts.Appt_Ticket__c"
                + " where cc.Client__c = '" + Id + "' and at.Status__c != 'Canceled'"
                + " order by ts.Service_Date_Time__c desc limit 200";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in getting getServiceLog:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in getting getServiceLog:', err);
            done(err, null);
        }
    },
    getProductLog: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = "select tp.id, at.Client__c, at.Name as apptName, at.Appt_Date_Time__c,"
                + " at.Status__c, tp.Price__c, tp.Promotion__c, p.Name as promotionName, tp.Net_Price__c,"
                + " tp.Qty_Sold__c, tp.Product__c, tp.Appt_Ticket__c, pd.Id, pd.Name as productName, pd.Size__c, pd.Unit_of_Measure__c, pd.Product_Line__c,"
                + " pl.Name as productLineName, tp.Worker__c, u.Username from Ticket_Product__c as tp"
                + " left JOIN Appt_Ticket__c as at on at.Id = tp.Appt_Ticket__c"
                + " left JOIN Promotion__c as p on p.Id = tp.Promotion__c"
                + " left JOIN Product__c as pd on pd.Id = tp.Product__c"
                + " left JOIN User__c as u on u.Id = tp.Worker__c"
                + " left JOIN Product_Line__c as pl on pl.Id = pd.Product_Line__c"
                + " where at.Client__c = '" + Id + "' order by at.Appt_Date_Time__c desc limit 100";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in getting getProductLog:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in :', err);
            done(err, null);
        }
    },
    getClassLog: function (req, done) {
        try {
            var Id = req.params.id;
            var sqlQuery = "select cc.id, cc.Class__c, ts.Service_Date_Time__c, ts.Name, ts.Price_per_Attendee__c, "
                + " ts.Status__c, ts.Worker__c, u.Username, ts.Id, cc.Client__c, cc.Payment_Status__c, cc.Check_In_Status__c, "
                + " ts.Appt_Ticket__c, at.Id, at.Name, at.Status__c from Class_Client__c cc left join Ticket_Service__c as ts on "
                + " ts.Client__c = cc.Client__c LEFT JOIN Appt_Ticket__c as at on at.Id = ts.Appt_Ticket__c LEFT JOIN User__c "
                + " as u on u.Id = ts.Worker__c where cc.Client__c = '" + Id + "' "
                + " and at.Status__c != 'Canceled' order by ts.Service_Date_Time__c desc limit 200";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in getting getClassLog:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in :', err);
            done(err, null);
        }
    },
    // SELECT t.Amount__c, u.Username, Cc.Class__c, s.Name as className, Cm.Next_Bill_Date__c as ClassLogDate FROM Class_Client__c Cc left JOIN Client_Membership__c as Cm ON Cc.Client__c = Cm.Client__cleft JOIN Service__c as s on s.Id = Cc.Class__c LEFT JOIN User__c as u on u.Id = Cc.OwnerId LEFT JOIN Ticket_Other__c as t on t.Worker__c = u.Id where Cc.Client__c ='00341000003WMXJAA4'
    deleteClient: function (req, done) {
        var sqlQuery = 'SELECT * FROM ' + config.dbTables.apptTicketTBL;
        sqlQuery = sqlQuery + ' WHERE Client__c = "' + req.params.id + '"';
        if (req.params.type === 'Edit') {
            execute.query(sqlQuery, '', function (err, result) {
                if (result.length > 0) {
                    done(err, { statusCode: '2040' });
                } else {
                    var sqlQuery = 'SELECT * FROM ' + config.dbTables.ticketServiceTBL;
                    sqlQuery = sqlQuery + ' WHERE Client__c = "' + req.params.id + '"';
                    execute.query(sqlQuery, '', function (err, result) {
                        if (result.length > 0) {
                            done(err, { statusCode: '2040' });
                        } else {
                            done(err, { statusCode: '2041' });
                        }
                    });
                }
            });
        } else {
            execute.query(sqlQuery, '', function (err, result) {
                if (result.length > 0) {
                    done(err, { statusCode: '2040' });
                } else {
                    var date = new Date();
                    var newDate = moment(date).format('YYYY-MM-DD HH:MM:SS');
                    var sqlQuery = 'SELECT * FROM ' + config.dbTables.ticketServiceTBL;
                    sqlQuery = sqlQuery + ' WHERE Client__c = "' + req.params.id + '"';
                    execute.query(sqlQuery, '', function (err, result) {
                        if (result.length > 0) {
                            done(err, { statusCode: '2040' });
                        } else {
                            var sqlQuery = "UPDATE " + config.dbTables.ContactTBL
                                + " SET IsDeleted = '" + config.booleanTrue
                                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                + "' WHERE Id = '" + req.params.id + "'";
                            execute.query(sqlQuery, function (err, result) {
                                if (err) {
                                    logger.error('Error in SetupProductLineDAO - editSetupProductLine:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    done(err, { statusCode: '2041' });
                                }
                            });
                        }
                    });
                }
            });
        }

        /* 
         try {
            var date = new Date();
            var newDate = moment(date).format('YYYY-MM-DD HH:MM:SS');
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.apptTicketTBL;
            sqlQuery = sqlQuery + ' WHERE Client__c = "' + req.params.id + '"';
            if (req.params.type === 'Edit') {
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in SetupProductLineDAO - getSetupProductLine:', err);
                        done(err, result);
                    } else if (result.length > 0) {
                        done(err, { statusCode: '2040' });
                    } else {
                        var sqlQuery1 = 'SELECT * FROM ' + config.dbTables.clientMembershipTBL;
                        sqlQuery1 = sqlQuery1 + ' WHERE Payment_Type__c = "' + req.params.id + '"';
                        execute.query(sqlQuery1, function (err, result) {
                            if (err) {
                                logger.error('Error in SetupProductLineDAO - editSetupProductLine:', err);
                                done(err, { statusCode: '9999' });
                            } else if (result.length > 0) {
                                done(err, { statusCode: '2040' });
                            } else {
                                done(err, { statusCode: '2041' });
                            }
                        });
                    }
                });
            } else {
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in PaymentTypesDAO - deletePaymentTypes:', err);
                        done(err, result);
                    } else if (result.length > 0) {
                        done(err, { statusCode: '2040' });
                    } else {
                        var sqlQuery1 = 'SELECT * FROM ' + config.dbTables.clientMembershipTBL;
                        sqlQuery1 = sqlQuery1 + ' WHERE Payment_Type__c = "' + req.params.id + '"';
                        execute.query(sqlQuery1, function (err, result) {
                            if (err) {
                                logger.error('Error in PaymentTypesDAO - deletePaymentTypes:', err);
                                done(err, { statusCode: '9999' });
                            } else if (result.length > 0) {
                                done(err, { statusCode: '2040' });
                            } else {
                                var val = Math.floor(1000 + Math.random() * 9000);
                                var sqlQuery2 = 'UPDATE ' + config.dbTables.paymentTypesTBL
                                    + ' SET IsDeleted = 1'
                                    + ', Name = "' + req.params.name + '-' + newDate
                                    + '", Abbreviation__c = "' + req.params.abbrevation + '-' + newDate
                                    + '", Sort_Order__c = ' + req.params.order + '+' + val
                                    + ' WHERE Id = "' + req.params.id + '"';
                                execute.query(sqlQuery2, function (err, result) {
                                    if (err) {
                                        logger.error('Error in PaymentTypesDAO - deletePaymentTypes:', err);
                                        done(err, { statusCode: '9999' });
                                    } else {
                                        done(err, { statusCode: '2041' });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        } catch (err) {
            logger.error('Unknown error in SetupProductLineDAO - getSetupProductLine:', err);
            done(err, null);
        }
        */

    },
    getAllclients: function (req, done) {
        try {
            var sqlQuery = 'SELECT *, IFNULL(Email, "") as Email,  IFNULL(MobilePhone, "") as MobilePhone, CONCAT(FirstName, " , ", LastName)as FullName FROM Contact__c';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in getting getAllclients:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in getting getAllclients:', err);
            done(err, null);
        }
    },
    createClientToken: function (req, done) {
        var date = new Date();
        if (req.body.isNewClient === true) {
            var quickAddClientData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: date,
                CreatedById: uniqid(),
                LastModifiedDate: date,
                LastModifiedById: uniqid(),
                SystemModstamp: date,
                LastModifiedDate: date,
                MailingCity: req.body.mailingCountry,
                MailingState: req.body.mailingState,
                MailingCity: req.body.mailingCity,
                MailingPostalCode: req.body.mailingPostalCode,
                MailingStreet: req.body.mailingStreet,
                Credit_Card_Token__c: req.body.cardNumber,
                Token_Expiration_Date__c: req.body.tokenExpirationDate
            };
            // var sqlQuery = 'INSERT INTO ' + config.dbTables.ContactTBL + ' SET ?';
            // execute.query(sqlQuery, quickAddClientData, function (err, data) {
            //     if (err) {
            //         logger.error('Error in ClientSearch dao - quickAddClient:', err);
            //         done(err, { statusCode: '9999' });
            //     } else {
            //         done(err, data);
            //     }
            // });
        } else {
            var sqlQuery = 'UPDATE ' + config.dbTables.ContactTBL
                + ' SET MailingCity = "' + req.body.mailingCity
                + '", MailingCountry = "' + req.body.mailingCountry
                + '", MailingState = "' + req.body.mailingState
                + '", MailingPostalCode = "' + req.body.mailingPostalCode
                + '", MailingStreet = "' + req.body.mailingStreet
                + '", Credit_Card_Token__c = "' + req.body.cardNumber
                + '", Token_Expiration_Date__c = "' + '01/01'
                // + '", Token_Expiration_Date__c = "' + req.body.tokenExpirationDate
                + '", LastModifiedDate = "' + date
                + '" WHERE Id = "' + req.body.clientId + '"';
            execute.query(sqlQuery, function (error, results) {
                if (error) {
                    logger.error('Error in edit Client: ', error);
                    done(error, results);
                } else {
                    done(error, results);
                }
            });
        }
    },
};

function sendResponse(indexParm, err, result, done) {
    if (indexParm === 1) {
        done(err, result);
    }
    if (indexParm === 2) {
        done(err, result);
    }
}