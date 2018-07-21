/**
 * Importing required modules
 */
var config = require('config');
var logger = require('../lib/logger');
var mysql = require('mysql');
var moment = require('moment');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var bcrypt = require('bcrypt');
var mail = require('../config/sendMail');
var fs = require('fs');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    editWorkerDetail: function (req, done) {
        var curDate = dateFns.getUTCDatTmStr(new Date());
        var index = 0;
        var errorResponse = {
            'workerDetailError': null,
            'workerServiceError': null,
            'workerGoalsError': null
        }
        var workerId = uniqid();
        if (JSON.parse(req.body.workerInfo).page === 'edit') {
            workerId = req.params.id;
        }
        workerDetailsImpl(req, workerId, curDate, function (error, status) {
            index++;
            if (error) {
                errorResponse.workerDetailError = error;
            }
            sendResponse(index, errorResponse, done);
        });
        workerServiceImpl(req, workerId, curDate, function (error, status) {
            index++;
            if (error) {
                errorResponse.workerServiceError = error;
            }
            sendResponse(index, errorResponse, done);
        });
        workerGoalsImpl(req, workerId, curDate, function (error, status) {
            index++;
            if (error) {
                errorResponse.workerGoalsError = error;
            }
            sendResponse(index, errorResponse, done);
        });
    },
    getWorkerDetail: function (req, done) {
        query = 'SELECT u.*, CONCAT(u.FirstName, "  ", u.LastName)as FullName, p.Name as PermissionName from User__c as u left join Permission_Set__c as p ON u.Permission_Set__c = p.Id order by case when Display_Order__c is null then 1 else 0 end, Display_Order__c,CONCAT(u.FirstName, "  ", u.LastName), CreatedDate asc';
        execute.query(query, function (error, results, fields) {
            if (error) {
                logger.error('Error in getting getWorkerDetail: ', error);
                done(error, results);
            } else {
                done(error, results);
            }
        });
    },
    getWorkerservicesByUser: function (req, done) {
        // query = 'SELECT * from Worker_Service__c';
        var query = 'SELECT * FROM `Worker_Service__c` WHERE `Worker__c` ="' + req.params.id + '" GROUP by Service__c';
        execute.query(query, function (error, results, fields) {
            if (error) {
                logger.error('Error in getting getWorkerDetail: ', error);
                done(error, results);
            } else {
                done(error, results);
            }
        });
    },
};

function workerDetailsImpl(req, workerId, curDate, callback) {
    var workerDetailObj = JSON.parse(req.body.workerInfo).workerData;
    if (workerDetailObj.displayOrder == '' || workerDetailObj.displayOrder == 0) {
        workerDetailObj.displayOrder = null;
    }
    updatePassword(workerDetailObj, function () {
        if (JSON.parse(req.body.workerInfo).page === 'add') {
            var valuesJSON = {
                Appointment_Hours__c: workerDetailObj.appointmentsValue,
                Birth_Date__c: workerDetailObj.birthDay,
                Birth_Month__c: workerDetailObj.birthMonth,
                Book_Every__c: workerDetailObj.appointmentsBookEveryValue,
                Can_View_Appt_Values_Totals__c: workerDetailObj.canViewApptValues,
                City: workerDetailObj.city,
                Compensation__c: workerDetailObj.compensationMethodValue,
                Country: workerDetailObj.country,
                CreatedById: workerId,
                CreatedDate: curDate,
                Display_Order__c: workerDetailObj.displayOrder,
                Email: workerDetailObj.email,
                Emergency_Name__c: workerDetailObj.emergencyName,
                Emergency_Primary_Phone__c: workerDetailObj.primaryPhone,
                Emergency_Secondary_Phone__c: workerDetailObj.emergencySecondaryPhone,
                FirstName: workerDetailObj.firstName,
                Hourly_Wage__c: parseFloat(workerDetailObj.hourlyWageValue).toFixed(2),
                Id: workerId,
                IsActive: workerDetailObj.activeStatus,
                LastModifiedById: workerId,
                LastModifiedDate: curDate,
                LastModifiedDate: curDate,
                LastName: workerDetailObj.lastName,
                Legal_First_Name__c: workerDetailObj.legalFirstName,
                Legal_Last_Name__c: workerDetailObj.legalLastName,
                Legal_Middle_Name__c: workerDetailObj.legalMiddleName,
                Merchant_Account_ID__c: workerDetailObj.merchantTerminalId,
                Merchant_Account_Key__c: workerDetailObj.merchantAccountKey,
                Merchant_Account_Test__c: workerDetailObj.merchantAccountTest,
                MiddleName: workerDetailObj.middleName,
                Mobile_Carrier__c: workerDetailObj.mobileCarrier,
                MobilePhone: workerDetailObj.mobilePhone,
                Online_Hours__c: workerDetailObj.onlineBookingHoursValue,
                Payment_Gateway__c: workerDetailObj.paymentGateWay,
                Permission_Set__c: workerDetailObj.permissioneMethodValue,
                Phone: workerDetailObj.primaryPhone,
                PostalCode: workerDetailObj.zipCode,
                Retail_Only__c: workerDetailObj.retailOnlyValue,
                Salary__c: parseFloat(workerDetailObj.salaryValue).toFixed(2),
                Send_Notification_for_Booked_Appointment__c: workerDetailObj.isSendNotificationForBookAppointment,
                Send_Notification_for_Canceled_Appt__c: workerDetailObj.isSendNotificationForCancelAppointment,
                Service_Level__c: workerDetailObj.serviceLevel,
                StartDay: workerDetailObj.startDate,
                State: workerDetailObj.state,
                Street: workerDetailObj.street,
                SystemModstamp: curDate,
                UserName: workerDetailObj.userName,
                Uses_Time_Clock__c: workerDetailObj.usesTimeClockValue,
                View_Only_My_Appointments__c: workerDetailObj.viewOnlyMyApptsValues,
                Worker_Notes__c: workerDetailObj.workerNotes,
                Worker_Pin__c: workerDetailObj.workerPin
            };
            if (req.file) {
                workerImagePath = config.workerFilePath + '/' + workerId + '.' + req.file.filename.split('.')[1];
                fs.rename(config.workerFilePath + '/' + req.file.filename, workerImagePath, function (err) {

                });
                valuesJSON.image = workerImagePath;
            }
            if (workerDetailObj.password && workerDetailObj.password.length > 0) {
                valuesJSON.Password__c = workerDetailObj.password;
            }
            var insertQuery = 'INSERT INTO ' + config.dbTables.setupUsersTBL + ' SET ?';
            execute.query(insertQuery, valuesJSON, function (err, result) {
                if (err) {
                    logger.error('Error in Inserting Worker:', err);
                    callback(err, { statusCode: '9999' });
                } else {
                    callback(null, 'done');
                }
            });
        } else {
            var valuesJSON = {
                Appointment_Hours__c: workerDetailObj.appointmentsValue,
                Birth_Date__c: workerDetailObj.birthDay,
                Birth_Month__c: workerDetailObj.birthMonth,
                Book_Every__c: workerDetailObj.appointmentsBookEveryValue,
                Can_View_Appt_Values_Totals__c: workerDetailObj.canViewApptValues,
                City: workerDetailObj.city,
                Compensation__c: workerDetailObj.compensationMethodValue,
                Country: workerDetailObj.country,
                CreatedDate: curDate,
                Display_Order__c: workerDetailObj.displayOrder,
                Email: workerDetailObj.email,
                Emergency_Name__c: workerDetailObj.emergencyName,
                Emergency_Primary_Phone__c: workerDetailObj.primaryPhone,
                Emergency_Secondary_Phone__c: workerDetailObj.emergencySecondaryPhone,
                FirstName: workerDetailObj.firstName,
                Hourly_Wage__c: parseFloat(workerDetailObj.hourlyWageValue).toFixed(2),
                IsActive: workerDetailObj.activeStatus,
                LastModifiedById: workerId,
                LastModifiedDate: curDate,
                LastName: workerDetailObj.lastName,
                Legal_First_Name__c: workerDetailObj.legalFirstName,
                Legal_Last_Name__c: workerDetailObj.legalLastName,
                Legal_Middle_Name__c: workerDetailObj.legalMiddleName,
                Merchant_Account_ID__c: workerDetailObj.merchantTerminalId,
                Merchant_Account_Key__c: workerDetailObj.merchantAccountKey,
                Merchant_Account_Test__c: workerDetailObj.merchantAccountTest,
                MiddleName: workerDetailObj.middleName,
                Mobile_Carrier__c: workerDetailObj.mobileCarrier,
                MobilePhone: workerDetailObj.mobilePhone,
                Online_Hours__c: workerDetailObj.onlineBookingHoursValue,
                Payment_Gateway__c: workerDetailObj.paymentGateWay,
                Permission_Set__c: workerDetailObj.permissioneMethodValue,
                Phone: workerDetailObj.primaryPhone,
                PostalCode: workerDetailObj.zipCode,
                Retail_Only__c: workerDetailObj.retailOnlyValue,
                Salary__c: parseFloat(workerDetailObj.salaryValue).toFixed(2),
                Send_Notification_for_Booked_Appointment__c: workerDetailObj.isSendNotificationForBookAppointment,
                Send_Notification_for_Canceled_Appt__c: workerDetailObj.isSendNotificationForCancelAppointment,
                Service_Level__c: workerDetailObj.serviceLevel,
                StartDay: workerDetailObj.startDate,
                State: workerDetailObj.state,
                Street: workerDetailObj.street,
                SystemModstamp: curDate,
                Username: workerDetailObj.userName,
                Uses_Time_Clock__c: workerDetailObj.usesTimeClockValue,
                View_Only_My_Appointments__c: workerDetailObj.viewOnlyMyApptsValues,
                Worker_Notes__c: workerDetailObj.workerNotes,
                Worker_Pin__c: workerDetailObj.workerPin
            }
            if (req.file) {
                workerImagePath = config.workerFilePath + '/' + workerId + '.' + req.file.filename.split('.')[1];
                if (workerDetailObj.image) {
                    valuesJSON.image = workerDetailObj.image;
                    var path = valuesJSON.image.split('.')[1];
                    if (fs.existsSync(path)) {
                        fs.unlinkSync(path, function (err) {
                        });
                    }
                }
                valuesJSON.image = workerImagePath;
                fs.rename(config.workerFilePath + '/' + req.file.filename, workerImagePath, function (err) {
                });
            }
            if (workerDetailObj.password && workerDetailObj.password.length > 0) {
                valuesJSON.Password__c = workerDetailObj.password;
            }
            var whereCond = {
                Id: req.params.id
            };
            var sqlQuery = mysql.format('UPDATE ' + config.dbTables.setupUsersTBL + ' SET ? WHERE ?', [valuesJSON, whereCond]);
            execute.query(sqlQuery, function (err, results) {
                if (err) {
                    if (err.errno === 1062) {
                        callback(err, { statusCode: '2033' });
                    } else {
                        logger.error('Error in WorkerServicePackage dao - saveWorkerDetail:', err);
                        callback(err, '9999');
                    }
                } else {           
                    if (workerDetailObj.namechanged === true) {
                        fs.readFile(config.userNameChangeHTML, function (err, data) {
                            if (err) {
                                logger.error('Error in reading HTML template:', err);
                                utils.sendResponse(res, 500, '9999', {});
                            } else {
                                var emailTempalte = data.toString();
                                emailTempalte = emailTempalte.replace("{{name}}", valuesJSON.FirstName + " " + valuesJSON.LastName);
                                mail.sendemail(workerDetailObj.email, emailTempalte, config.userNameChangedSubject, function (err, result) {

                                });
                            }
                        });
                    }
                    callback(null, results);
                }
            });
        }
    });
}

function workerServiceImpl(req, workerId, curDate, callback) {
    var workerServiceData = JSON.parse(req.body.workerInfo).workerServiceData;
    var insertArray = [];
    var deleteArray = [];
    var queries = '';
    var indexParm = 0;
    if (workerServiceData && workerServiceData.length > 0) {
        for (var i = 0; i < workerServiceData.length; i++) {
            if (workerServiceData[i].Removed !== true && workerServiceData[i].Edit === false) {
                insertArray.push([uniqid(), workerId, config.booleanFalse, curDate, workerId, curDate, workerId, curDate, curDate,
                workerServiceData[i]['Service__c'],
                workerServiceData[i]['Price__c'],
                workerServiceData[i]['Duration_1_Available_For_Other_Work__c'],
                workerServiceData[i]['Duration_2_Available_For_Other_Work__c'],
                workerServiceData[i]['Duration_3_Available_For_Other_Work__c'],
                workerServiceData[i]['Duration_1__c'],
                workerServiceData[i]['Duration_2__c'],
                workerServiceData[i]['Duration_3__c'],
                workerServiceData[i]['Buffer_after__c'],
                workerServiceData[i]['Service_Fee_Percent__c'],
                workerServiceData[i]['Service_Fee_Amount__c'],
                workerServiceData[i]['Worker__c']]);
            } else if (workerServiceData[i].Edit === true) {
                var tempItem = {
                    Service__c: workerServiceData[i]['Service__c'],
                    CreatedDate: curDate,
                    Active__c: 0,
                    Price__c: workerServiceData[i]['Price__c'],
                    Duration_1_Available_For_Other_Work__c: workerServiceData[i]['Duration_1_Available_For_Other_Work__c'],
                    Duration_2_Available_For_Other_Work__c: workerServiceData[i]['Duration_2_Available_For_Other_Work__c'],
                    Duration_3_Available_For_Other_Work__c: workerServiceData[i]['Duration_3_Available_For_Other_Work__c'],
                    Duration_1__c: workerServiceData[i]['Duration_1__c'],
                    Duration_2__c: workerServiceData[i]['Duration_2__c'],
                    Duration_3__c: workerServiceData[i]['Duration_3__c'],
                    Buffer_after__c: workerServiceData[i]['Buffer_after__c'],
                    Service_Fee_Percent__c: workerServiceData[i]['Service_Fee_Percent__c'],
                    Service_Fee_Amount__c: workerServiceData[i]['Service_Fee_Amount__c'],
                    Worker__c: workerServiceData[i]['Worker__c'],
                    LastModifiedDate: curDate,
                    LastModifiedById: workerId,
                    SystemModstamp: curDate
                }
                var whereCond = {
                    Id: workerServiceData[i].Id
                };
                queries += mysql.format('UPDATE ' + config.dbTables.workerServiceTBL
                    + ' SET ? '
                    + ' WHERE Id = ?; ', [tempItem, whereCond]);
            } else if (workerServiceData[i].Removed === true) {
                deleteArray.push(workerServiceData[i].Id);
            }
        }
        if (insertArray.length > 0) {
            var insertQuery = 'INSERT INTO ' + config.dbTables.workerServiceTBL
                + ' (Id, OwnerId, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                + ' SystemModstamp, LastActivityDate, Service__c, Price__c, Duration_1_Available_For_Other_Work__c,'
                + ' Duration_2_Available_For_Other_Work__c, Duration_3_Available_For_Other_Work__c, Duration_1__c,'
                + ' Duration_2__c, Duration_3__c, Buffer_after__c, Service_Fee_Percent__c, Service_Fee_Amount__c, Worker__c) VALUES ?';
            execute.query(insertQuery, [insertArray], function (err, result) {
                indexParm++;
                if (indexParm === 2) {
                    callback(err, result);
                }
            });
        } else {
            indexParm++;
            if (indexParm === 2) {
                callback(null, 'done');
            }
        }
        if (deleteArray.length !== 0) {
            var inStrPar = '(';
            for (var i = 0; i < deleteArray.length; i++) {
                inStrPar = inStrPar + '"' + deleteArray[i] + '",'
            }
            inStrPar = inStrPar.substr(0).slice(0, -2);
            inStrPar = inStrPar + '")';
            queries += mysql.format('DELETE from ' + config.dbTables.workerServiceTBL
                + ' WHERE Service__c IN ' + inStrPar + ';');
        }
        if (queries.length > 0) {
            execute.query(queries, function (err, result) {
                indexParm++;
                if (indexParm === 2) {
                    callback(err, result);
                }
            });
        } else {
            indexParm++;
            if (indexParm === 2) {
                callback(err, result);
            }
        }
    } else {
        callback(null, 'done');
    }
}

function workerGoalsImpl(req, workerId, curDate, callback) {
    var workerGoalsObj = JSON.parse(req.body.workerInfo).goalsData;
    if (workerGoalsObj && workerGoalsObj.length > 0) {
        var records = [];
        var i = 0;
        var datesdata = 0;
        var insertArray = [];
        var queries = '';
        var indexParm = 0;
        for (var i = 0; i < workerGoalsObj.length; i++) {
            if (!workerGoalsObj[i].delete) {
                if (workerGoalsObj[i].startDate > workerGoalsObj[i].endDate) {
                    datesdata++;
                }
            }
        }
        if (datesdata > 0) {

            callback(null, { statusCode: '2070' });
        } else {
            if (workerGoalsObj && workerGoalsObj.length > 0) {
                for (var i = 0; i < workerGoalsObj.length; i++) {
                    if (workerGoalsObj[i].delete) {
                        queries += mysql.format('UPDATE ' + config.dbTables.workerGoalsTBL
                            + ' SET IsDeleted = 1'
                            + ' WHERE Id = "' + workerGoalsObj[i].workerGoalId + '";');
                    } else if (workerGoalsObj[i].workerGoalId) {
                        queries += mysql.format('UPDATE ' + config.dbTables.workerGoalsTBL
                            + ' SET Start_Date__c = "' + workerGoalsObj[i].startDate
                            + '", End_Date__c = "' + workerGoalsObj[i].endDate
                            + '", Goal_Target__c = "' + workerGoalsObj[i].target
                            + '" WHERE Id = "' + workerGoalsObj[i].workerGoalId + '";');
                    } else {
                        insertArray.push([uniqid(), workerId, 0, curDate, workerId, curDate,
                            workerId, curDate, workerGoalsObj[i].endDate,
                        workerGoalsObj[i].goalTarget, workerGoalsObj[i].goalsId,
                        workerGoalsObj[i].startDate, workerId]);
                    }
                }
                if (insertArray.length > 0) {
                    var insertQuery = 'INSERT INTO ' + config.dbTables.workerGoalsTBL
                        + ' (Id, OwnerId, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                        + ' SystemModstamp,End_Date__c, Goal_Target__c, Goal__c,Start_Date__c,Worker__c) VALUES ?';
                    execute.query(insertQuery, [insertArray], function (err, result) {
                        indexParm++;
                        if (indexParm === 2) {
                            callback(err, result);
                        }
                    });
                } else {
                    indexParm++;
                    if (indexParm === 2) {
                        callback(null, 'done');
                    }
                }
                if (queries.length > 0) {
                    execute.query(queries, function (err, result) {
                        indexParm++;
                        if (indexParm === 2) {
                            callback(err, result);
                        }
                    });
                } else {
                    indexParm++;
                    if (indexParm === 2) {
                        callback(err, result);
                    }
                }
            } else {
                callback(null, 'done');
            }
        }
    } else {
        callback(null, 'done');
    }
}

function updatePassword(workerDetailObj, callback) {
    if (workerDetailObj.password && workerDetailObj.password.length > 0) {
        const saltRounds = 10;
        bcrypt.hash(workerDetailObj.password, saltRounds, function (err, hash) {
            workerDetailObj.password = hash;
            callback();
        });
    } else {
        callback();
    }
}

function sendResponse(index, error, done) {
    if (index === 3) {
        if (error.workerDetailError === null && error.workerServiceError === null && error.workerGoalsError === null) {
            error = null;
            done(error, { statusCode: '1001' });
        } else {
            done(error, error);
        }
    }
}
