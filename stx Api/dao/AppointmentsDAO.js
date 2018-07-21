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
    getApptUsers: function (req, done) {
        try {
            var sqlQuery = 'SELECT FirstName as first,LEFT(LastName,1) as last FROM ' + config.dbTables.setupUsersTBL
                + ' WHERE IsActive = 1';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    done(err, result);
                } else {
                    logger.error('Error in appoitments dao - getApptBookingData:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in apptBooking dao 55- getApptBookingData:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getAppointments: function (req, done) {
        moment.suppressDeprecationWarnings = true;
        var sqlQuery = "SELECT c.Id as clientId,a.Name as apptName, CONCAT(u.FirstName,' ', LEFT(u.LastName,1)) as bookoutName, ts.Worker__c as workerId,a.Id as apptid, a.Appt_Date_Time__c as apdate,a.Status__c as apstatus, a.Is_Booked_Out__c, CONCAT(c.FirstName, ' ', c.LastName) as clientName, "
            + " ts.Visit_Type__c as visttype, c.MobilePhone as mbphone, ts.Rebooked__c as rebook, c.Email as cltemail, a.New_Client__c as newclient, "
            + " c.Phone as cltphone, a.Is_Standing_Appointment__c as standingappt, a.Has_Booked_Package__c as pkgbooking, a.Booked_Online__c as bookonline, "
            + " a.Notes__c as notes, c.Client_Pic__c as clientpic,ts.Service_Group_Color__c, ts.Service_Date_Time__c as srvcDate, s.Name as srvcname, ts.Net_Price__c as netprice, "
            + " ts.Duration__c as duration, GROUP_CONCAT(s.Name, '(', CONCAT(u.FirstName,' ', LEFT(u.LastName,1)), ')') as workerName, s.Service_Group__c, ts.Resources__c as resource, a.CreatedDate as creadate, "
            + " a.LastModifiedDate as lastmofdate FROM Appt_Ticket__c as a left join Contact__c as c on c.Id = a.Client__c left join Ticket_Service__c as "
            + " ts on ts.isDeleted=0 and ts.Appt_Ticket__c = a.Id left join Service__c as s on s.Id = ts.Service__c left join User__c as u on u.Id = ts.Worker__c ";
        if (req.params.worker === 'all' && req.params.viewBy === 'One Day') {
            // var apptDate1 = moment(req.params.appdate).format('YYYY-MM-DD 00:00');
            // var apptDate2 = moment(req.params.appdate).format('YYYY-MM-DD 23:59');
            var apptDate1 = req.params.appdate;
            var apptDate2 = dateFns.getDBNxtDay(req.params.appdate);
            sqlQuery = sqlQuery + " WHERE "
                + " a.Appt_Date_Time__c >='" + apptDate1 + "' and a.Appt_Date_Time__c <='" + apptDate2 + "' and a.isNoService__c =0 group by a.Id order by a.Appt_Date_Time__c asc";
        } else if (req.params.viewBy === 'One Day' && req.params.worker !== 'all') {
            // var apptDate1 = moment(req.params.appdate).format('YYYY-MM-DD 00:00');
            // var apptDate2 = moment(req.params.appdate).format('YYYY-MM-DD 23:59');
            var apptDate1 = req.params.appdate;
            var apptDate2 = dateFns.getDBNxtDay(req.params.appdate);
            sqlQuery = sqlQuery + " WHERE "
                + " ts.Worker__c ='" + req.params.worker + "' and a.Appt_Date_Time__c >='" + apptDate1 + "' "
                + " and a.Appt_Date_Time__c <='" + apptDate2 + "' and a.isNoService__c =0 group by a.Id order by a.Appt_Date_Time__c asc";
        } else if (req.params.viewBy === 'One Week' && req.params.worker === 'all') {
            done(null, { statusCode: '2078' });
        } else if (req.params.viewBy === 'One Weekday' && req.params.worker === 'all') {
            done(null, { statusCode: '2078' });
        } else if (req.params.viewBy === 'One Week' && req.params.worker !== 'all') {
            // var startOfWeek = moment(req.params.appdate).startOf('week');
            // var endOfWeek = moment(req.params.appdate).endOf('week');
            // var startOfWeek1 = moment(startOfWeek).format('YYYY-MM-DD 00:00');
            // var endOfWeek1 = moment(endOfWeek).format('YYYY-MM-DD 23:59');
            var weekDates = dateFns.getDBStEndWk(req.params.appdate);
            var startOfWeek1 = weekDates[0];
            var endOfWeek1 = weekDates[1];
            sqlQuery = sqlQuery + " WHERE "
                + " ts.Worker__c ='" + req.params.worker + "' and a.Appt_Date_Time__c >='" + startOfWeek1 + "' "
                + " and a.Appt_Date_Time__c <='" + endOfWeek1 + "' and a.isNoService__c =0 group by a.Id order by a.Appt_Date_Time__c asc";
        } else if (req.params.viewBy === 'One Weekday' && req.params.worker !== 'all') {
            // const startOfMonth = moment(req.params.appdate).startOf('month');
            // const endOfMonth = moment(req.params.appdate).endOf('month');
            // var startOfMonth1 = moment(startOfMonth).format('YYYY-MM-DD 00:00');
            // var endOfMonth1 = moment(endOfMonth).format('YYYY-MM-DD 23:59');
            var monthDates = dateFns.getDBWkDays(req.params.appdate);
            montStr = '(';
            for (var i = 0; i < monthDates.length; i++) {
                montStr += '\'' + monthDates[i] + '\',';
            }
            montStr = montStr.slice(0, -1) + ')';
            var startOfMonth1 = monthDates[0];
            var endOfMonth1 = monthDates[1];
            sqlQuery = sqlQuery + " WHERE "
                + " ts.Worker__c ='" + req.params.worker + "' and DATE(a.Appt_Date_Time__c) in " + montStr + " "
                + " and a.isNoService__c =0 group by a.Id order by a.Appt_Date_Time__c asc";
        }
        execute.query(sqlQuery, '', function (err, result) {
            if (err) {
                logger.error('Error in appoitments dao - getApptBookingData:', err);
                done(err, { statusCode: '9999' });
            } else {
                done(err, result);
            }
        });
    },
    getAppointmentById: function (req, done) {
        var id = req.params.apptid;
        var sqlQuery = "SELECT a.Name as aptName, a.Status__c, u.Id as workerId, c.Current_Balance__c, a.Name, a.Id as apptid, a.Duration__c as aptDuration,CONCAT(u.FirstName,' ', LEFT(u.LastName,1)) as bookoutName, ts.Id as TicketServieId,a.isTicket__c,c.No_Email__c,c.Mobile_Carrier__c,a.Is_Booked_Out__c,  a.Appt_Date_Time__c as apdate,a.Status__c as apstatus, CONCAT(c.FirstName, ' ', c.LastName) as clientName, "
            + " c.Id as clientId, a.Client_Type__c as visttype, c.MobilePhone as mbphone, ts.Rebooked__c as rebook, c.Email as cltemail, a.New_Client__c as newclient, "
            + " c.Phone as cltphone, a.Is_Standing_Appointment__c as standingappt, a.Has_Booked_Package__c as pkgbooking, a.Booked_Online__c as bookonline, "
            + " ts.Notes__c as serviceNotes, a.Notes__c as notes, c.Client_Pic__c as clientpic, ts.Service_Date_Time__c as srvcDate, s.Name as srvcname, s.Service_Group__c, ts.Notes__c as serviceNotes, ts.Net_Price__c as netprice, "
            + " ts.Duration__c as duration, CONCAT(u.FirstName, ' ', u.LastName) as workerName, ts.Resources__c as resource, a.CreatedDate as creadate, "
            + " a.LastModifiedDate as lastmofdate FROM Appt_Ticket__c as a left join Contact__c as c on c.Id = a.Client__c left join Ticket_Service__c as "
            + " ts on ts.Appt_Ticket__c = a.Id left join Service__c as s on s.Id = ts.Service__c left join User__c as u on u.Id = ts.Worker__c WHERE "
            + " a.Id ='" + id + "'";
        execute.query(sqlQuery, '', function (err, result) {
            if (err) {
                logger.error('Error in appoitments dao - getApptBookingData:', err);
                done(err, { statusCode: '9999' });
            } else {
                done(err, result);
            }
        });
    },
    getBookOutAppoinment: function (req, done) {
        moment.suppressDeprecationWarnings = true;
        var workerid = req.body.Worker__c;
        var apptDate = req.body.Appt_Date_Time__c;
        var startTime = req.body.Appt_Start;
        var endTime = req.body.Appt_End;
        var bookOutEvery = req.body.bookOutEvery;
        var bookEvery = req.body.bookEvery1;
        var numberOfBooks = req.body.numberOfBooks;
        var onlineFlag = false;
        var theHoursId = '';
        var hoursIds = '';
        var workerHoursMap = [];
        temp = 0;
        finresult = [];
        if (req.body.page === 'bookStanding') {
            var workerid = '(' + workerid + ')';
            var sqlQuery = 'SELECT u.Id as workerId, ap.*, CONCAT(u.FirstName," " , LEFT(u.LastName,1)) as FullName FROM Appt_Ticket__c as ap '
                + 'JOIN Ticket_Service__c as Ts on Ts.Appt_Ticket__c = ap.Id'
                + ' left join User__c as u on u.Id = Ts.Worker__c and isNoService__c = false '
                + ' WHERE Ts.Worker__c IN ' + workerid + ' AND DATE(Appt_Date_Time__c) BETWEEN  "' + startTime + '" AND "' + endTime + '" '
                + ' order by ap.Appt_Date_Time__c asc';
            var cmpHrsQry = "SELECT u.Id, " +
                "IF(ch.Id IS NULL, ch2.Id, ch.Id) as compHrsId, " +
                "IF(ch.SundayStartTime__c IS NULL OR ch.SundayStartTime__c = '', ch2.SundayStartTime__c, ch.SundayStartTime__c) as SundayStartTime__c, " +
                "IF(ch.SundayEndTime__c IS NULL OR ch.SundayEndTime__c = '', ch2.SundayEndTime__c, ch.SundayEndTime__c) as SundayEndTime__c, " +
                "IF(ch.MondayStartTime__c IS NULL OR ch.MondayStartTime__c = '', ch2.MondayStartTime__c, ch.MondayStartTime__c) as MondayStartTime__c, " +
                "IF(ch.MondayEndTime__c IS NULL OR ch.MondayEndTime__c = '', ch2.MondayEndTime__c, ch.MondayEndTime__c) as MondayEndTime__c, " +
                "IF(ch.TuesdayStartTime__c IS NULL OR ch.TuesdayStartTime__c = '', ch2.TuesdayStartTime__c, ch.TuesdayStartTime__c) as TuesdayStartTime__c, " +
                "IF(ch.TuesdayEndTime__c IS NULL OR ch.TuesdayEndTime__c = '', ch2.TuesdayEndTime__c, ch.TuesdayEndTime__c) as TuesdayEndTime__c, " +
                "IF(ch.WednesdayStartTime__c IS NULL OR ch.WednesdayStartTime__c = '', ch2.WednesdayStartTime__c, ch.WednesdayStartTime__c) as WednesdayStartTime__c, " +
                "IF(ch.WednesdayEndTime__c IS NULL OR ch.WednesdayEndTime__c = '', ch2.WednesdayEndTime__c, ch.WednesdayEndTime__c) as WednesdayEndTime__c, " +
                "IF(ch.ThursdayStartTime__c IS NULL OR ch.ThursdayStartTime__c = '', ch2.ThursdayStartTime__c, ch.ThursdayStartTime__c) as ThursdayStartTime__c, " +
                "IF(ch.ThursdayEndTime__c IS NULL OR ch.ThursdayEndTime__c = '', ch2.ThursdayEndTime__c, ch.ThursdayEndTime__c) as ThursdayEndTime__c, " +
                "IF(ch.FridayStartTime__c IS NULL OR ch.FridayStartTime__c = '', ch2.FridayStartTime__c, ch.FridayStartTime__c) as FridayStartTime__c, " +
                "IF(ch.FridayEndTime__c IS NULL OR ch.FridayEndTime__c = '', ch2.FridayEndTime__c, ch.FridayEndTime__c) as FridayEndTime__c, " +
                "IF(ch.SaturdayStartTime__c IS NULL OR ch.SaturdayStartTime__c = '', ch2.SaturdayStartTime__c, ch.SaturdayStartTime__c) as SaturdayStartTime__c, " +
                "IF(ch.SaturdayEndTime__c IS NULL OR ch.SaturdayEndTime__c = '', ch2.SaturdayEndTime__c, ch.SaturdayEndTime__c) as SaturdayEndTime__c " +
                "FROM " +
                "User__c as u " +
                "LEFT JOIN Company_Hours__c as ch on ch.Id = u.Appointment_Hours__c " +
                "LEFT JOIN Company_Hours__c as ch2 on ch2.isDefault__c = 1 " +
                "WHERE " +
                "u.Id IN " + workerid;


        } else {
            // var ApptDate = dateFns.getUTCDatTmStr(apptDate);
            // var startTime = dateFns.getUTCDatTmStr(startTime[0]);
            // var endTime = dateFns.getUTCDatTmStr(endTime[endTime.length - 1]);
            var sqlQuery = 'SELECT ap.*, CONCAT(u.FirstName," " , LEFT(u.LastName,1)) as FullName FROM Appt_Ticket__c as ap '
                + ' JOIN Ticket_Service__c as Ts on Ts.Appt_Ticket__c = ap.Id'
                + ' left join User__c as u on u.Id = Ts.Worker__c and isNoService__c = false '
                + ' WHERE Ts.Worker__c = "' + workerid + '" AND DATE(ap.Appt_Date_Time__c) BETWEEN  "' + startTime + '" AND "' + endTime + '" '
                + ' order by ap.Appt_Date_Time__c asc';
            var cmpHrsQry = "SELECT u.Id, " +
                "IF(ch.Id IS NULL, ch2.Id, ch.Id) as compHrsId, " +
                "IF(ch.SundayStartTime__c IS NULL OR ch.SundayStartTime__c = '', ch2.SundayStartTime__c, ch.SundayStartTime__c) as SundayStartTime__c, " +
                "IF(ch.SundayEndTime__c IS NULL OR ch.SundayEndTime__c = '', ch2.SundayEndTime__c, ch.SundayEndTime__c) as SundayEndTime__c, " +
                "IF(ch.MondayStartTime__c IS NULL OR ch.MondayStartTime__c = '', ch2.MondayStartTime__c, ch.MondayStartTime__c) as MondayStartTime__c, " +
                "IF(ch.MondayEndTime__c IS NULL OR ch.MondayEndTime__c = '', ch2.MondayEndTime__c, ch.MondayEndTime__c) as MondayEndTime__c, " +
                "IF(ch.TuesdayStartTime__c IS NULL OR ch.TuesdayStartTime__c = '', ch2.TuesdayStartTime__c, ch.TuesdayStartTime__c) as TuesdayStartTime__c, " +
                "IF(ch.TuesdayEndTime__c IS NULL OR ch.TuesdayEndTime__c = '', ch2.TuesdayEndTime__c, ch.TuesdayEndTime__c) as TuesdayEndTime__c, " +
                "IF(ch.WednesdayStartTime__c IS NULL OR ch.WednesdayStartTime__c = '', ch2.WednesdayStartTime__c, ch.WednesdayStartTime__c) as WednesdayStartTime__c, " +
                "IF(ch.WednesdayEndTime__c IS NULL OR ch.WednesdayEndTime__c = '', ch2.WednesdayEndTime__c, ch.WednesdayEndTime__c) as WednesdayEndTime__c, " +
                "IF(ch.ThursdayStartTime__c IS NULL OR ch.ThursdayStartTime__c = '', ch2.ThursdayStartTime__c, ch.ThursdayStartTime__c) as ThursdayStartTime__c, " +
                "IF(ch.ThursdayEndTime__c IS NULL OR ch.ThursdayEndTime__c = '', ch2.ThursdayEndTime__c, ch.ThursdayEndTime__c) as ThursdayEndTime__c, " +
                "IF(ch.FridayStartTime__c IS NULL OR ch.FridayStartTime__c = '', ch2.FridayStartTime__c, ch.FridayStartTime__c) as FridayStartTime__c, " +
                "IF(ch.FridayEndTime__c IS NULL OR ch.FridayEndTime__c = '', ch2.FridayEndTime__c, ch.FridayEndTime__c) as FridayEndTime__c, " +
                "IF(ch.SaturdayStartTime__c IS NULL OR ch.SaturdayStartTime__c = '', ch2.SaturdayStartTime__c, ch.SaturdayStartTime__c) as SaturdayStartTime__c, " +
                "IF(ch.SaturdayEndTime__c IS NULL OR ch.SaturdayEndTime__c = '', ch2.SaturdayEndTime__c, ch.SaturdayEndTime__c) as SaturdayEndTime__c " +
                "FROM " +
                "User__c as u " +
                "LEFT JOIN Company_Hours__c as ch on ch.Id = u.Appointment_Hours__c " +
                "LEFT JOIN Company_Hours__c as ch2 on ch2.isDefault__c = 1 " +
                "WHERE " +
                "u.Id ='" + workerid + "'";
        }
        execute.query(sqlQuery, '', function (err, result) {
            if (err) {
                logger.error('Error in appoitments dao - getApptBookingData:', err);
                done(err, { statusCode: '9999' });
            } else {
                execute.query(cmpHrsQry, '', function (err, companyhours) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, { result, companyhours });
                    }
                });
            }
        });
    },
    createBookOutAppoinment: function (req, done) {
        var date = new Date();
        var appointmentbookingObj = req.body;
        var records = [];
        var records1 = [];
        var apptName;
        var selectSql = 'SELECT Name, CreatedDate FROM `Appt_Ticket__c` where isDeleted =0 ORDER BY CreatedDate DESC';
        execute.query(selectSql, '', function (err, result) {
            if (err) {
                done(err, result);
            } else {
                if (result && result.length) {
                    var generator = new sequential.Generator({
                        digits: 6,
                        restore: result[0].Name
                    });
                    apptName = generator.generate();
                } else {
                    apptName = '000001';
                }
            }
            if (appointmentbookingObj.AppDates.length > 0) {
                for (var i = 0; i < appointmentbookingObj.AppDates.length; i++) {
                    var apptDate1 = appointmentbookingObj.AppDates[i].bsValue;
                    records.push([uniqid(), uniqid(),
                    config.booleanFalse,
                        apptName,
                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                    dateFns.getUTCDatTmStr(new Date()),
                        apptDate1,
                        '',
                        '',
                        '',
                    appointmentbookingObj.bookOutDuration,
                        '',
                        1,
                    appointmentbookingObj.AppDates[i].Status__c,
                        '',
                    ]);
                    var generator = new sequential.Generator({
                        digits: 6,
                        restore: records[i][3]
                    });

                    apptName = generator.generate();

                    records1.push([uniqid(),
                    config.booleanFalse,
                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                    dateFns.getUTCDatTmStr(new Date()),
                    records[i][0],
                    appointmentbookingObj.AppDates[i].Client_Type__c,
                    appointmentbookingObj.AppDates[i].Client__c,
                    appointmentbookingObj.workerId,
                        apptDate1,
                    appointmentbookingObj.bookOutDuration,
                    appointmentbookingObj.AppDates[i].Service_Tax__c,
                        1,
                        0,
                        0,
                        0,
                        '',
                    appointmentbookingObj.AppDates[i].Status__c,
                    ]);
                }
                var insertQuery = 'INSERT INTO ' + config.dbTables.apptTicketTBL
                    + ' (Id, OwnerId, IsDeleted,Name, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                    + ' SystemModstamp, Appt_Date_Time__c, Client_Type__c, Client__c,'
                    + ' Worker__c, Duration__c, Service_Tax__c,'
                    + ' Is_Booked_Out__c, Status__c, Notes__c) VALUES ?';
                var insertQuery1 = 'INSERT INTO ' + config.dbTables.ticketServiceTBL
                    + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                    + ' SystemModstamp, Appt_Ticket__c, Visit_Type__c, Client__c,'
                    + ' Worker__c, Service_Date_Time__c, Duration__c, Service_Tax__c,'
                    + ' Is_Booked_Out__c, Net_Price__c, Non_Standard_Duration__c, Rebooked__c, Notes__c, Status__c) VALUES ?';
                execute.query(insertQuery, [records], function (err, result) {
                    if (err) {
                        logger.error('Error in WorkerServices dao - updateWorkerService:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        execute.query(insertQuery1, [records1], function (err1, result1) {
                            if (err1) {
                                logger.error('Error in WorkerServices dao - updateWorkerService:', err1);
                                done(err1, { statusCode: '9999' });
                            } else {
                                done(err1, result1);
                            }
                        });
                    }
                });
            } else {
                done(null, { statusCode: '2080' });
            }

        });
    },
    createBookSatndingAppoinment: function (req, done) {
        var appointmentbookingObj = req.body;
        moment.suppressDeprecationWarnings = true;
        var apptServicesData = appointmentbookingObj.serviceData;
        var id = uniqid();
        var apptName;
        var date = new Date();
        var records = [];
        var records1 = [];
        var updaterecords = [];
        var i = 0;
        var insertArray = [];
        var queries = '';
        var updatequeries = '';
        var indexParm = 0;
        var apptDate;
        var selectSql = 'SELECT Name, CreatedDate FROM `Appt_Ticket__c` where isDeleted =0 ORDER BY CreatedDate DESC';
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
            var apptDates = JSON.parse(appointmentbookingObj.AppDates);
            if (apptDates.length > 0) {
                for (var i = 0; i < apptDates.length; i++) {
                    var apptDate1 = apptDates[i][0].bsValue;
                    records.push([uniqid(), uniqid(),
                    config.booleanFalse,
                        apptName,
                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                    dateFns.getUTCDatTmStr(new Date()),
                        apptDate1,
                    appointmentbookingObj.Client_Type__c,
                    appointmentbookingObj.Client__c,
                        '',
                    appointmentbookingObj.Duration__c,
                        '',
                        0,
                        1,
                    apptDates[i][0].Appt_Status__c,
                        '',
                    apptDates[i][0].IsPackage,
                    ]);
                    var generator = new sequential.Generator({
                        digits: 6,
                        restore: records[i][3]
                    });
                    apptName = generator.generate();

                    for (var j = 0; j < apptDates[i].length; j++) {
                        if (!apptDates[i][j].Duration_1__c) {
                            apptDates[i][j].Duration_1__c = 0;
                        }
                        if (!apptDates[i][j].Duration_2__c) {
                            apptDates[i][j].Duration_2__c = 0;
                        }
                        if (!apptDates[i][j].Duration_3__c) {
                            apptDates[i][j].Duration_3__c = 0;
                        }
                        if (!apptDates[i][j].Guest_Charge__c) {
                            apptDates[i][j].Guest_Charge__c = 0;
                        }
                        if (!apptDates[i][j].Buffer_After__c) {
                            apptDates[i][j].Buffer_After__c = 0;
                        }
                        if (!apptDates[i][j].Duration__c) {
                            apptDates[i][j].Duration__c = parseInt(apptDates[i][j].Duration_1__c, 10) + parseInt(apptDates[i][j].Duration_2__c, 10) + parseInt(apptDates[i][j].Duration_3__c, 10);
                        }
                        // var apptDate = records[i][9];
                        records1.push([uniqid(),
                        config.booleanFalse,
                        dateFns.getUTCDatTmStr(new Date()), uniqid(),
                        dateFns.getUTCDatTmStr(new Date()), uniqid(),
                        dateFns.getUTCDatTmStr(new Date()),
                        records[i][0],
                        appointmentbookingObj.Client_Type__c,
                        appointmentbookingObj.Client__c,
                        apptDates[i][j].workerName,
                        apptDates[i][j].bsValue,
                        apptDates[i][j].Status__c,
                        apptDates[i][j].serviceGroupColour,
                        apptDates[i][j].Duration_1__c,
                        apptDates[i][j].Duration_2__c,
                        apptDates[i][j].Duration_3__c,
                        apptDates[i][j].Duration__c,
                        apptDates[i][j].Buffer_After__c,
                        apptDates[i][j].Guest_Charge__c,
                        apptDates[i][j].Booked_Package__c,
                            0.0,
                            0,
                        apptDates[i][j].Net_Price__c,
                        apptDates[i][j].Net_Price__c,
                            0,
                            0,
                        apptDates[i][j].Id,
                            '',
                        ]);
                    }
                }
                var insertQuery = 'INSERT INTO ' + config.dbTables.apptTicketTBL
                    + ' (Id, OwnerId, IsDeleted,Name, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                    + ' SystemModstamp, Appt_Date_Time__c, Client_Type__c, Client__c,'
                    + ' Worker__c, Duration__c, Service_Tax__c,'
                    + ' Is_Booked_Out__c, Is_Standing_Appointment__c, Status__c, Notes__c, Has_Booked_Package__c) VALUES ?';
                var insertQuery1 = 'INSERT INTO ' + config.dbTables.ticketServiceTBL
                    + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                    + ' SystemModstamp, Appt_Ticket__c, Visit_Type__c, Client__c,'
                    + ' Worker__c, Service_Date_Time__c, Status__c, Service_Group_Color__c,Duration_1__c,Duration_2__c,Duration_3__c, Duration__c,Buffer_After__c,Guest_Charge__c, Booked_Package__c, Service_Tax__c,'
                    + ' Is_Booked_Out__c, Net_Price__c,Price__c, Non_Standard_Duration__c, Rebooked__c,Service__c, Notes__c) VALUES ?';
                execute.query(insertQuery, [records], function (err, result) {
                    if (err) {
                        logger.error('Error in WorkerServices dao - updateWorkerService:', err);
                        indexParm++;
                        standingSendResponse(indexParm, done, err, result);
                    } else {
                        execute.query(insertQuery1, [records1], function (err1, result1) {
                            if (err1) {
                                logger.error('Error in WorkerServices dao - updateWorkerService:', err1);
                                indexParm++;
                                standingSendResponse(indexParm, done, err1, result1);
                            } else {
                                indexParm++;
                                standingSendResponse(indexParm, done, err1, result1);
                            }
                        });
                    }
                });
            } else {
                done(null, { statusCode: '2080' });
            }
        });
    },
    workerList: function (req, done) {
        try {
            var sqlQuery = 'SELECT DISTINCT '
                + ' concat(UPPER(LEFT(users.FirstName,1)),LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", '
                + ' concat(UPPER(LEFT(users.LastName,1)),LOWER(SUBSTRING(users.LastName,2,LENGTH(users.LastName)))) )as names,'
                + ' users.Id as workerId FROM Worker_Service__c as service '
                + ' join Service__c as groups on groups.Id = service.Service__c '
                + ' join User__c as users on users.Id = service.Worker__c '
                + ' and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL '
                + ' and users.FirstName IS NOT NULL and users.IsActive =1 '
                + '  GROUP by users.FirstName';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in appoitments dao - workerList:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in apptBooking dao 6 - getApptBookingData:', err);
            return (err, { statusCode: '9999' });
        }
    },
    personCalendar: function (req, done) {
        var currentDay;
        try {
            var day = req.params.day;
            var companyHoursObj = req.params;
            var companyHoursData = {
                Name: companyHoursObj.name,
            }
            if (companyHoursData.Name === 'all') {
                var sqlQuery = "SELECT CONCAT(hrs.MondayStartTime__c,'|',hrs.MondayEndTime__c) as Monday, CONCAT(hrs.TuesdayStartTime__c,'|',hrs.TuesdayEndTime__c) as Tuesday, CONCAT(hrs.WednesdayStartTime__c,'|',hrs.WednesdayEndTime__c) as Wednesday, CONCAT(hrs.ThursdayStartTime__c,'|',hrs.ThursdayEndTime__c) as Thursday, CONCAT(hrs.FridayStartTime__c,'|',hrs.FridayEndTime__c) as Friday, CONCAT(hrs.SaturdayStartTime__c,'|',hrs.SaturdayEndTime__c) as Saturday, CONCAT(hrs.SundayStartTime__c,'|',hrs.SundayEndTime__c) as Sunday, users.FirstName ,users.LastName ,users.IsActive ,users.Id , users.Appointment_Hours__c FROM `User__c` as users left join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c where hrs.Id=users.Appointment_Hours__c";
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao205 - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });

            } else if (companyHoursData.Name !== 'all' && day === "Monday") {
                currentDay = 'hrs.MondayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.MondayStartTime__c as start ,hrs.MondayEndTime__c as end FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " where hrs.Id=users.Appointment_Hours__c and users.Id ='" + companyHoursData.Name + "'";
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });

            } else if (companyHoursData.Name !== 'all' && day === "Tuesday") {
                currentDay = 'hrs.TuesdayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.TuesdayStartTime__c as start , hrs.TuesdayEndTime__c as end FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " where hrs.Id=users.Appointment_Hours__c and users.Id ='" + companyHoursData.Name + "'";
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            } else if (companyHoursData.Name !== 'all' && day === "Wednesday") {
                currentDay = 'hrs.WednesdayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.WednesdayStartTime__c as start,hrs.WednesdayEndTime__c as end FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " where hrs.Id=users.Appointment_Hours__c and users.Id ='" + companyHoursData.Name + "'";
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            } else if (companyHoursData.Name !== 'all' && day === "Thursday") {
                currentDay = 'hrs.ThursdayStartTime__c != ""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names,hrs.ThursdayStartTime__c as start ,hrs.ThursdayEndTime__c as end FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " where hrs.Id=users.Appointment_Hours__c and users.Id ='" + companyHoursData.Name + "'";
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            } else if (companyHoursData.Name !== 'all' && day === "Friday") {
                currentDay = 'hrs.FridayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.FridayStartTime__c as start,hrs.FridayEndTime__c as end FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " where hrs.Id=users.Appointment_Hours__c and users.Id ='" + companyHoursData.Name + "'";
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            } else if (companyHoursData.Name !== 'all' && day === "Saturday") {
                currentDay = 'hrs.SaturdayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.SaturdayStartTime__c as start,hrs.SaturdayEndTime__c as end FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " where hrs.Id=users.Appointment_Hours__c and users.Id ='" + companyHoursData.Name + "'";
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            } else if (companyHoursData.Name !== 'all' && day === "Sunday") {
                currentDay = 'hrs.SundayStartTime__c !=""';
                var sqlQuery = "SELECT DISTINCT users.FirstName as names, hrs.SundayStartTime__c as start ,hrs.SundayEndTime__c as end FROM Worker_Service__c as service join Service__c as groups on groups.Id = service.Service__c join User__c as users on users.Id = service.Worker__c join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL and users.IsActive =1 and " + currentDay.split("'")[0] + " where hrs.Id=users.Appointment_Hours__c and users.Id ='" + companyHoursData.Name + "'";
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            }
        } catch (err) {
            logger.error('Unknown error in apptBooking dao personal calendar- getApptBookingData:', err);
            return (err, { statusCode: '9999' });
        }
    },
    activeMembers: function (req, done) {
        var currentDay;
        try {
            var day = req.params.day;
            if (day === "Monday") {
                currentDay = 'hrs.MondayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + ' LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image, hrs.MondayStartTime__c as start,hrs.MondayEndTime__c as end FROM Worker_Service__c as service '
                    + ' join Service__c as groups on groups.Id = service.Service__c '
                    + '  join User__c as users on users.Id = service.Worker__c '
                    + '  join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + ' LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + ' and cs.All_Day_Off__c =0 and cs.IsDeleted =0  and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and '
                    + ' users.IsActive =1 and ' + currentDay.split("'")[0] + ' '
                    + ' GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                        if (result && result.length > 0) {
                            var sql1 = ' SELECT DISTINCT concat(UPPER(LEFT(us.FirstName,1)), '
                                + 'LOWER(SUBSTRING(us.FirstName,2,LENGTH(us.FirstName)))," ", UPPER(LEFT(us.LastName,1)),"." ) as names, '
                                + ' ts.Worker__c as workerId FROM Ticket_Service__c as ts '
                                + ' left join User__c as us on us.Id = ts.Worker__c '
                                + ' left JOIN Appt_Ticket__c as ap on ts.Appt_Ticket__c = ap.Id '
                                + ' where DATE(ts.Service_Date_Time__c) = "' + req.params.date + '" '
                                + ' and ts.IsDeleted=0 ';
                            execute.query(sql1, '', function (err1, result1) {
                                if (err1) {
                                    logger.error('Error in appoitments dao - workerList2:', err1);
                                    done(err1, { statusCode: '9999' });
                                } else {

                                    var sql2 = ' SELECT Id,MondayStartTime__c as start,MondayEndTime__c as end FROM Company_Hours__c '
                                        + '  where isDefault__c=1 and isActive__c=1 and IsDeleted=0 ';
                                    execute.query(sql2, '', function (err2, result2) {
                                        if (err2) {
                                            logger.error('Error in appoitments dao - workerList3:', err2);
                                            done(err2, { statusCode: '9999' });
                                        } else {

                                            if (result2.length > 0) {
                                                for (var i = 0; i < result1.length; i++) {
                                                    result1[i].start = result2[0].start;
                                                    result1[i].end = result2[0].end;
                                                }

                                                for (var j = 0; j < result1.length; j++) {
                                                    for (var i = 0; i < result.length; i++) {
                                                        if (result[i].workerId === result1[j].workerId) {
                                                            result1[j].workerId = null;
                                                        }
                                                    }
                                                }
                                                for (var j = 0; j < result1.length; j++) {
                                                    if (result1[j].workerId) {
                                                        result.push(result1[j]);
                                                    }
                                                }
                                            }
                                            result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                                            done(err2, result);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else if (day === "Tuesday") {
                currentDay = 'hrs.TuesdayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image,hrs.TuesdayStartTime__c as start,hrs.TuesdayEndTime__c as end FROM Worker_Service__c as service '
                    + 'join Service__c as groups on groups.Id = service.Service__c '
                    + 'join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + 'and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + ' and service.Service__c IS NOT NULL and users.IsActive =1 and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                        if (result && result.length > 0) {
                            var sql1 = ' SELECT DISTINCT concat(UPPER(LEFT(us.FirstName,1)), '
                                + 'LOWER(SUBSTRING(us.FirstName,2,LENGTH(us.FirstName)))," ", UPPER(LEFT(us.LastName,1)),"." ) as names, '
                                + ' ts.Worker__c as workerId FROM Ticket_Service__c as ts '
                                + ' left join User__c as us on us.Id = ts.Worker__c '
                                + ' left JOIN Appt_Ticket__c as ap on ts.Appt_Ticket__c = ap.Id '
                                + ' where DATE(ts.Service_Date_Time__c) = "' + req.params.date + '" '
                                + ' and ts.IsDeleted=0 ';
                            execute.query(sql1, '', function (err1, result1) {
                                if (err1) {
                                    logger.error('Error in appoitments dao - workerList2:', err1);
                                    done(err1, { statusCode: '9999' });
                                } else {
                                    var sql2 = ' SELECT Id,TuesdayStartTime__c as start,TuesdayEndTime__c as end FROM Company_Hours__c '
                                        + '  where isDefault__c=1 and isActive__c=1 and IsDeleted=0 ';
                                    execute.query(sql2, '', function (err2, result2) {
                                        if (err2) {
                                            logger.error('Error in appoitments dao - workerList3:', err2);
                                            done(err2, { statusCode: '9999' });
                                        } else {

                                            if (result2.length > 0) {
                                                for (var i = 0; i < result1.length; i++) {
                                                    result1[i].start = result2[0].start;
                                                    result1[i].end = result2[0].end;
                                                }

                                                for (var j = 0; j < result1.length; j++) {
                                                    for (var i = 0; i < result.length; i++) {
                                                        if (result[i].workerId === result1[j].workerId) {
                                                            result1[j].workerId = null;
                                                        }
                                                    }
                                                }
                                                for (var j = 0; j < result1.length; j++) {
                                                    if (result1[j].workerId) {
                                                        result.push(result1[j]);
                                                    }
                                                }
                                            }
                                            result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                                            done(err2, result);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else if (day === "Wednesday") {
                currentDay = 'hrs.WednesdayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '   users.image as image,hrs.WednesdayStartTime__c as start ,hrs.WednesdayEndTime__c as end FROM Worker_Service__c as service '
                    + '  join Service__c as groups on groups.Id = service.Service__c '
                    + ' join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + '  LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + ' and cs.All_Day_Off__c =0 and cs.IsDeleted =0  and users.StartDay IS NOT NULL '
                    + '  and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + ' and ' + currentDay.split("'")[0] + ' GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                        if (result && result.length > 0) {
                            var sql1 = ' SELECT DISTINCT concat(UPPER(LEFT(us.FirstName,1)), '
                                + 'LOWER(SUBSTRING(us.FirstName,2,LENGTH(us.FirstName)))," ", UPPER(LEFT(us.LastName,1)),"." ) as names, '
                                + ' ts.Worker__c as workerId FROM Ticket_Service__c as ts '
                                + ' left join User__c as us on us.Id = ts.Worker__c '
                                + ' left JOIN Appt_Ticket__c as ap on ts.Appt_Ticket__c = ap.Id '
                                + ' where DATE(ts.Service_Date_Time__c) = "' + req.params.date + '" '
                                + ' and ts.IsDeleted=0 ';
                            execute.query(sql1, '', function (err1, result1) {
                                if (err1) {
                                    logger.error('Error in appoitments dao - workerList2:', err1);
                                    done(err1, { statusCode: '9999' });
                                } else {
                                    var sql2 = ' SELECT Id,WednesdayStartTime__c as start,WednesdayEndTime__c as end FROM Company_Hours__c '
                                        + '  where isDefault__c=1 and isActive__c=1 and IsDeleted=0 ';
                                    execute.query(sql2, '', function (err2, result2) {
                                        if (err2) {
                                            logger.error('Error in appoitments dao - workerList3:', err2);
                                            done(err2, { statusCode: '9999' });
                                        } else {
                                            if (result2.length > 0) {
                                                for (var i = 0; i < result1.length; i++) {
                                                    result1[i].start = result2[0].start;
                                                    result1[i].end = result2[0].end;
                                                }

                                                for (var j = 0; j < result1.length; j++) {
                                                    for (var i = 0; i < result.length; i++) {
                                                        if (result[i].workerId === result1[j].workerId) {
                                                            result1[j].workerId = null;
                                                        }
                                                    }
                                                }
                                                for (var j = 0; j < result1.length; j++) {
                                                    if (result1[j].workerId) {
                                                        result.push(result1[j]);
                                                    }
                                                }
                                            }
                                            result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                                            done(err2, result);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else if (day === "Thursday") {
                currentDay = 'hrs.ThursdayStartTime__c != ""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  hrs.ThursdayStartTime__c as start,  users.image as image,'
                    + 'hrs.ThursdayEndTime__c as end FROM Worker_Service__c as service '
                    + 'join Service__c as groups on groups.Id = service.Service__c '
                    + 'join User__c as users on users.Id = service.Worker__c '
                    + 'join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + 'and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + 'and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                        if (result && result.length > 0) {
                            var sql1 = ' SELECT DISTINCT concat(UPPER(LEFT(us.FirstName,1)), '
                                + 'LOWER(SUBSTRING(us.FirstName,2,LENGTH(us.FirstName)))," ", UPPER(LEFT(us.LastName,1)),"." ) as names, '
                                + ' ts.Worker__c as workerId FROM Ticket_Service__c as ts '
                                + ' left join User__c as us on us.Id = ts.Worker__c '
                                + ' left JOIN Appt_Ticket__c as ap on ts.Appt_Ticket__c = ap.Id '
                                + ' where DATE(ts.Service_Date_Time__c) = "' + req.params.date + '" '
                                + ' and ts.IsDeleted=0 ';
                            execute.query(sql1, '', function (err1, result1) {
                                if (err1) {
                                    logger.error('Error in appoitments dao - workerList2:', err1);
                                    done(err1, { statusCode: '9999' });
                                } else {
                                    var sql2 = ' SELECT Id,ThursdayStartTime__c as start,ThursdayEndTime__c as end FROM Company_Hours__c '
                                        + '  where isDefault__c=1 and isActive__c=1 and IsDeleted=0 ';
                                    execute.query(sql2, '', function (err2, result2) {
                                        if (err2) {
                                            logger.error('Error in appoitments dao - workerList3:', err2);
                                            done(err2, { statusCode: '9999' });
                                        } else {

                                            if (result2.length > 0) {
                                                for (var i = 0; i < result1.length; i++) {
                                                    result1[i].start = result2[0].start;
                                                    result1[i].end = result2[0].end;
                                                }

                                                for (var j = 0; j < result1.length; j++) {
                                                    for (var i = 0; i < result.length; i++) {
                                                        if (result[i].workerId === result1[j].workerId) {
                                                            result1[j].workerId = null;
                                                        }
                                                    }
                                                }
                                                for (var j = 0; j < result1.length; j++) {
                                                    if (result1[j].workerId) {
                                                        result.push(result1[j]);
                                                    }
                                                }
                                            }
                                            result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                                            done(err2, result);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else if (day === "Friday") {
                currentDay = 'hrs.FridayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + ' users.image as image, hrs.FridayStartTime__c as start,hrs.FridayEndTime__c as end FROM Worker_Service__c as service '
                    + 'join Service__c as groups on groups.Id = service.Service__c '
                    + 'join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + ' LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + 'and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + ' and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + 'and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';

                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                        if (result && result.length > 0) {
                            var sql1 = ' SELECT DISTINCT concat(UPPER(LEFT(us.FirstName,1)), '
                                + 'LOWER(SUBSTRING(us.FirstName,2,LENGTH(us.FirstName)))," ", UPPER(LEFT(us.LastName,1)),"." ) as names, '
                                + ' ts.Worker__c as workerId FROM Ticket_Service__c as ts '
                                + ' left join User__c as us on us.Id = ts.Worker__c '
                                + ' left JOIN Appt_Ticket__c as ap on ts.Appt_Ticket__c = ap.Id '
                                + ' where DATE(ts.Service_Date_Time__c) = "' + req.params.date + '" '
                                + ' and ts.IsDeleted=0 ';
                            execute.query(sql1, '', function (err1, result1) {
                                if (err1) {
                                    logger.error('Error in appoitments dao - workerList2:', err1);
                                    done(err1, { statusCode: '9999' });
                                } else {
                                    var sql2 = ' SELECT Id,FridayStartTime__c as start,FridayEndTime__c as end FROM Company_Hours__c '
                                        + '  where isDefault__c=1 and isActive__c=1 and IsDeleted=0 ';
                                    execute.query(sql2, '', function (err2, result2) {
                                        if (err2) {
                                            logger.error('Error in appoitments dao - workerList3:', err2);
                                            done(err2, { statusCode: '9999' });
                                        } else {
                                            if (result2.length > 0) {
                                                for (var i = 0; i < result1.length; i++) {
                                                    result1[i].start = result2[0].start;
                                                    result1[i].end = result2[0].end;
                                                }

                                                for (var j = 0; j < result1.length; j++) {
                                                    for (var i = 0; i < result.length; i++) {
                                                        if (result[i].workerId === result1[j].workerId) {
                                                            result1[j].workerId = null;
                                                        }
                                                    }
                                                }
                                                for (var j = 0; j < result1.length; j++) {
                                                    if (result1[j].workerId) {
                                                        result.push(result1[j]);
                                                    }
                                                }
                                            }
                                            result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                                            done(err2, result);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else if (day === "Saturday") {
                currentDay = 'hrs.SaturdayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image, hrs.SaturdayStartTime__c as start,hrs.SaturdayEndTime__c as end FROM Worker_Service__c as service'
                    + '  join Service__c as groups on groups.Id = service.Service__c'
                    + '  join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + ' and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + 'and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                        if (result && result.length > 0) {
                            var sql1 = ' SELECT DISTINCT concat(UPPER(LEFT(us.FirstName,1)), '
                                + 'LOWER(SUBSTRING(us.FirstName,2,LENGTH(us.FirstName)))," ", UPPER(LEFT(us.LastName,1)),"." ) as names, '
                                + ' ts.Worker__c as workerId FROM Ticket_Service__c as ts '
                                + ' left join User__c as us on us.Id = ts.Worker__c '
                                + ' left JOIN Appt_Ticket__c as ap on ts.Appt_Ticket__c = ap.Id '
                                + ' where DATE(ts.Service_Date_Time__c) = "' + req.params.date + '" '
                                + ' and ts.IsDeleted=0 ';
                            execute.query(sql1, '', function (err1, result1) {
                                if (err1) {
                                    logger.error('Error in appoitments dao - workerList2:', err1);
                                    done(err1, { statusCode: '9999' });
                                } else {
                                    var sql2 = ' SELECT Id,SaturdayStartTime__c as start,SaturdayEndTime__c as end FROM Company_Hours__c '
                                        + '  where isDefault__c=1 and isActive__c=1 and IsDeleted=0 ';
                                    execute.query(sql2, '', function (err2, result2) {
                                        if (err2) {
                                            logger.error('Error in appoitments dao - workerList3:', err2);
                                            done(err2, { statusCode: '9999' });
                                        } else {
                                            if (result2.length > 0) {
                                                for (var i = 0; i < result1.length; i++) {
                                                    result1[i].start = result2[0].start;
                                                    result1[i].end = result2[0].end;
                                                }

                                                for (var j = 0; j < result1.length; j++) {
                                                    for (var i = 0; i < result.length; i++) {
                                                        if (result[i].workerId === result1[j].workerId) {
                                                            result1[j].workerId = null;
                                                        }
                                                    }
                                                }
                                                for (var j = 0; j < result1.length; j++) {
                                                    if (result1[j].workerId) {
                                                        result.push(result1[j]);
                                                    }
                                                }
                                            }
                                            result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                                            done(err2, result);
                                        }
                                    });


                                }

                            });
                        }
                    }
                });
            } else if (day === "Sunday") {
                currentDay = 'hrs.SundayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image, hrs.SundayStartTime__c as start ,hrs.SundayEndTime__c as end FROM Worker_Service__c as service '
                    + '  join Service__c as groups on groups.Id = service.Service__c '
                    + ' join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + 'and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and users.IsActive =1 and '
                    + ' ' + currentDay.split("'")[0] + ' '
                    + ' GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                        if (result && result.length > 0) {
                            var sql1 = ' SELECT DISTINCT concat(UPPER(LEFT(us.FirstName,1)), '
                                + 'LOWER(SUBSTRING(us.FirstName,2,LENGTH(us.FirstName)))," ", UPPER(LEFT(us.LastName,1)),"." ) as names, '
                                + ' ts.Worker__c as workerId FROM Ticket_Service__c as ts '
                                + ' left join User__c as us on us.Id = ts.Worker__c '
                                + ' left JOIN Appt_Ticket__c as ap on ts.Appt_Ticket__c = ap.Id '
                                + ' where DATE(ts.Service_Date_Time__c) = "' + req.params.date + '" '
                                + ' and ts.IsDeleted=0 ';
                            execute.query(sql1, '', function (err1, result1) {
                                if (err1) {
                                    logger.error('Error in appoitments dao - workerList2:', err1);
                                    done(err1, { statusCode: '9999' });
                                } else {


                                    var sql2 = ' SELECT Id,SundayStartTime__c as start,SundayEndTime__c as end FROM Company_Hours__c '
                                        + '  where isDefault__c=1 and isActive__c=1 and IsDeleted=0 ';
                                    execute.query(sql2, '', function (err2, result2) {
                                        if (err2) {
                                            logger.error('Error in appoitments dao - workerList3:', err2);
                                            done(err2, { statusCode: '9999' });
                                        } else {
                                            if (result2.length > 0) {
                                                for (var i = 0; i < result1.length; i++) {
                                                    result1[i].start = result2[0].start;
                                                    result1[i].end = result2[0].end;
                                                }

                                                for (var j = 0; j < result1.length; j++) {
                                                    for (var i = 0; i < result.length; i++) {
                                                        if (result[i].workerId === result1[j].workerId) {
                                                            result1[j].workerId = null;
                                                        }
                                                    }
                                                }
                                                for (var j = 0; j < result1.length; j++) {
                                                    if (result1[j].workerId) {
                                                        result.push(result1[j]);
                                                    }
                                                }
                                            }
                                            result = result.filter(function (a) { return (a.start !== null && a.start !== '' && a.end !== null && a.end !== '') });
                                            done(err2, result);
                                        }
                                    });

                                }

                            });
                        }
                    }
                });
            } else if ("all") {
                var sqlQuery = " SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), "
                    + "LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName))),' ', UPPER(LEFT(users.LastName,1)),'.' ) as names, "
                    + "CONCAT('Monday', '-' ,hrs.MondayStartTime__c,'|',hrs.MondayEndTime__c) as Monday,"
                    + "CONCAT('Tuesday', '-',hrs.TuesdayStartTime__c,'|',hrs.TuesdayEndTime__c) as Tuesday,"
                    + "CONCAT('Wednesday', '-',hrs.WednesdayStartTime__c,'|',hrs.WednesdayEndTime__c) as Wednesday, "
                    + "CONCAT('Thursday', '-',hrs.ThursdayStartTime__c,'|',hrs.ThursdayEndTime__c) as Thursday, "
                    + "CONCAT('Friday', '-',hrs.FridayStartTime__c,'|',hrs.FridayEndTime__c) as Friday, "
                    + "CONCAT('Saturday', '-',hrs.SaturdayStartTime__c,'|',hrs.SaturdayEndTime__c) as Satuday,"
                    + "CONCAT('Sunday', '-',hrs.SundayStartTime__c,'|',hrs.SundayEndTime__c) as Sunday FROM Worker_Service__c as service"
                    + " join Service__c as groups on groups.Id = service.Service__c "
                    + "join User__c as users on users.Id = service.Worker__c "
                    + "join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c "
                    + " and users.StartDay IS NOT NULL and service.Service__c IS NOT NULL "
                    + " and users.IsActive =1 and " + currentDay.split("'")[0] + " "
                    + "  GROUP by users.FirstName";
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            }

        } catch (err) {
            logger.error('Unknown error in apptBooking dao  personal calendar - getApptBookingData:', err);
            return (err, { statusCode: '9999' });
        }
    },
    changeStatus: function (req, done) {
        var changeStatusTo = req.body.ApptStatus;
        var apptId = req.params.id;
        try {
            var sqlQuery = 'UPDATE Appt_Ticket__c SET Status__c = "' + changeStatusTo + '" WHERE Id = "' + apptId + '"'
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in appoitments dao - getApptBookingData:', err);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in apptBooking dao 2 - getApptBookingData:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getWorkerByClass: function (req, done) {
        try {
            var sqlQuery = 'SELECT CONCAT(U.FirstName, " ", LEFT(U.LastName,1)) as workerName, U.Id as workerId '
                + ' FROM `Class_Client__c` as Cc JOIN Service__c as S on S.Id = Cc.Class__c '
                + ' JOIN Appt_Ticket__c as Apt on Cc.Client__c = Apt.Client__c '
                + 'JOIN User__c as U on U.Id = Apt.Worker__c '
                + 'WHERE S.Is_Class__c = 1 AND S.Id = "' + req.params.id + '" GROUP BY S.Id';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in appoitments dao - getApptBookingData:', err);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in apptBooking dao1 - getApptBookingData:', err);
            return (err, { statusCode: '9999' });
        }
    },
    updateAppointmentDeatailByAppointmentId: function (req, done) {
        var apptId = req.params.id;
        try {
            var sqlQuery = 'UPDATE Appt_Ticket__c SET Status__c = "' + req.body.status
                + '", Notes__c = "' + req.body.notes
                + '", Client_Type__c = "' + req.body.visttype
                + '" WHERE Id = "' + apptId + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in appoitments dao - getApptBookingData:', err);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in apptBooking dao 3 - getApptBookingData:', err);
            return (err, { statusCode: '9999' });
        }
    },
    updateAppointmentBookOutByAppointmentId: function (req, done) {
        var apptId = req.params.id;
        try {
            var sqlQuery = 'UPDATE Appt_Ticket__c SET Status__c = "' + req.body.status
                + '", Notes__c = "' + req.body.notes
                + '", Appt_Date_Time__c = "' + req.body.starttime
                + '", Duration__c = "' + req.body.Duration__c
                + '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                + '" WHERE Id = "' + apptId + '" and Is_Booked_Out__c = 1';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in appoitments dao - updateAppointmentBookOutByAppointmentId:', err);
                } else {
                    var sqlQuery1 = 'UPDATE Ticket_Service__c SET Status__c = "' + req.body.status
                        + '", Notes__c = "' + req.body.notes
                        + '", Worker__c = "' + req.body.workerName
                        + '", Service_Date_Time__c = "' + req.body.starttime
                        + '", Duration__c = "' + req.body.Duration__c
                        + '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                        + '" WHERE Appt_Ticket__c = "' + apptId + '" and Is_Booked_Out__c = 1';
                    execute.query(sqlQuery1, '', function (err1, result1) {
                        if (err) {
                            logger.error('Error in appoitments dao - updateAppointmentBookOutByAppointmentId:', err);
                        } else {
                            done(err1, result1);
                        }
                    });
                }
            });
        } catch (err) {
            logger.error('Unknown error in apptBooking dao 4- getApptBookingData:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getExpressBookingServices(req, done) {
        try {
            var sql = 'SELECT  s.Service_Group__c, s.Id as serviceId,s.Name, ws.Price__c, ws.Buffer_after__c, ws.Duration_1__c, ws.Duration_2__c, ws.Duration_3__c, s.IsDeleted=0, ws.IsDeleted=0 , SUM( IFNULL(ws.Buffer_after__c,0) + IFNULL(ws.Duration_1__c,0) + IFNULL(ws.Duration_2__c,0) + IFNULL(ws.Duration_3__c,0) ) as sumDurationBuffer FROM `Worker_Service__c` as ws left join Service__c as s on s.Id = ws.Service__c where ws.Worker__c="' + req.params.id + '"  and s.Id = ws.Service__c GROUP by s.Name';
            execute.query(sql, '', function (err, result) {
                if (err) {
                    logger.error('Error in appoitments dao - getExpressBookingServices:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    var color = [];
                    if (result && result.length > 0) {
                        var sql2 = 'SELECT JSON__c FROM Preference__c WHERE Name = "Service Groups" and IsDeleted=0';
                        execute.query(sql2, '', function (err2, result2) {
                            if (!err2 && result2 && result2.length) {
                                const colorList = JSON.parse(result2[0].JSON__c);
                                for (var i = 0; i < result.length; i++) {
                                    for (var j = 0; j < colorList.length; j++) {
                                        if (colorList[j].serviceGroupName === result[i].Service_Group__c) {
                                            result[i].color = colorList[j].serviceGroupColor;
                                        }
                                    }
                                }
                            }
                            done(err, result);
                        });
                    } else {
                        done(err, result);
                    }
                }
            });
        } catch (err) {
            logger.error('Unknown error in apptBooking dao - getExpressBookingServices:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getServicesByApptId(req, done) {
        try {
            var sql = "SELECT pckg.Name as packageName, at.Id as apptId,at.Name as ticketNumber, Ts.Id as tsId, CONCAT(IFNULL(S.Id, ''), '$', IF(ws.Duration_1__c = null, S.Duration_1__c,"
                + " IF(ws.Duration_1__c > 0, ws.Duration_1__c, S.Duration_1__c)), '$', IF(ws.Duration_2__c = null, S.Duration_2__c, IF(ws.Duration_2__c > 0, ws.Duration_2__c, S.Duration_2__c)), "
                + " '$', IF(ws.Duration_3__c = null, S.Duration_3__c, IF(ws.Duration_3__c > 0, ws.Duration_3__c, S.Duration_3__c)),'$', IF(ws.Buffer_after__c = null, S.Buffer_after__c, "
                + " IF(ws.Buffer_after__c > 0, ws.Buffer_after__c, S.Buffer_after__c))) as serviceName, S.Name as Name, at.Status__c,S.Id,Ts.Service_Date_Time__c,  Ts.Net_Price__c, Ts.Notes__c,"
                + " Ts.Resources__c, Ts.Rebooked__c, Ts.Worker__c as workerName,Ts.Duration__c, Ts.Preferred_Duration__c,  Ts.Duration_1__c, Ts.Duration_2__c,Ts.Duration_3__c, Ts.Buffer_after__c,"
                + " Ts.Duration_1_Available_for_Other_Work__c, Ts.Duration_2_Available_for_Other_Work__c, Ts.Duration_3_Available_for_Other_Work__c,  IFNULL(Ts.Guest_Charge__c, IFNULL(S.Guest_Charge__c, 0))  Guest_Charge__c, "
                + " CONCAT(S.Service_Group__c, '$', Ts.Service_Group_Color__c) as serviceGroup,  CONCAT(U.FirstName, ' ', U.LastName) as name, Ts.Service_Group_Color__c as serviceGroupColour, S.Service_Group__c as serviceGroupName "
                + " FROM Ticket_Service__c as Ts  LEFT JOIN Service__c as S ON S.Id = Ts.Service__c  LEFT JOIN User__c as U ON U.Id = Ts.Worker__c  LEFT Join Appt_Ticket__c as at on at.Id = Ts.Appt_Ticket__c "
                + " LEFT JOIN Worker_Service__c as ws on ws.Service__c =S.Id LEFT Join Package__c as pckg on pckg.Id = Ts.Booked_Package__c WHERE Ts.isDeleted = 0 And Ts.Client__c ='" + req.params.id + "' and at.Id ='" + req.params.apptid + "' "
                + " order by Ts.Service_Date_Time__c asc ";
            execute.query(sql, '', function (err, srvcresult) {
                if (err) {
                    logger.error('Error in appoitments dao - getExpressBookingServices:', err);
                    done(err, []);
                } else {
                    var apptrst = [];
                    var indexParam = 0;
                    var servList = [];
                    var srvGroupList = [];
                    var workerList = [];
                    if (srvcresult && srvcresult.length > 0) {
                        for (var i = 0; i < srvcresult.length; i++) {
                            servList.push(srvcresult[i].Id);
                            srvGroupList.push(srvcresult[i].serviceGroupName);
                            workerList.push(srvcresult[i].Id)
                            srvcresult[i]['servList'] = [];
                            srvcresult[i]['workerList'] = [];
                        }
                    }
                    if (servList.length > 0) {
                        var servPar = '(';
                        for (var i = 0; i < servList.length; i++) {
                            servPar = servPar + '"' + servList[i] + '",'
                        }
                        servPar = servPar.substr(0).slice(0, -2);
                        servPar = servPar + '")';
                        var srvGrpPar = '(';
                        for (var i = 0; i < srvGroupList.length; i++) {
                            srvGrpPar = srvGrpPar + '"' + srvGroupList[i] + '",'
                        }
                        srvGrpPar = srvGrpPar.substr(0).slice(0, -2);
                        srvGrpPar = srvGrpPar + '")';

                        var wrkrPar = '(';
                        for (var i = 0; i < workerList.length; i++) {
                            wrkrPar = wrkrPar + '"' + workerList[i] + '",'
                        }
                        wrkrPar = wrkrPar.substr(0).slice(0, -2);
                        wrkrPar = wrkrPar + '")';

                        var srvGrpQuery = 'SELECT s.Id, ws.Duration_1__c, ws.Duration_2__c, ws.Duration_3__c, s.Name, s.Service_Group__c as serviceGroupName'
                            + ' FROM Worker_Service__c as ws LEFT JOIN Service__c as s on s.Id = ws.`Service__c`'
                            + ' WHERE s.isDeleted =0 and s.Service_Group__c IN ' + srvGrpPar
                            + ' GROUP BY s.Name';

                        var servicesQuery = 'SELECT CONCAT(u.FirstName, " ", u.LastName) as name, ws.Service__c as sId, ws.Worker__c as workername FROM Worker_Service__c as ws'
                            + ' join User__c as u ON u.Id = ws.Worker__c WHERE ws.Service__c IN ' + wrkrPar + ' and ws.isDeleted =0 GROUP BY ws.Worker__c'

                        // SELECT u.Id, u.FirstName as name, ws.Service__c as sId FROM Worker_Service__c as ws JOIN User__c as u on u.Id = ws.Worker__c WHERE Service__c IN ('l0b090otpjeo1fz74', 'l0b0903iojepgrm9n') GROUP BY ws.Worker__c
                        execute.query(srvGrpQuery, '', function (srvGrpErr, srvGrpData) {
                            if (srvGrpData && srvGrpData.length > 0) {
                                for (var i = 0; i < srvGrpData.length; i++) {
                                    for (var j = 0; j < srvcresult.length; j++) {
                                        if (srvGrpData[i].serviceGroupName == srvcresult[j].serviceGroupName) {
                                            srvcresult[j].servList.push(srvGrpData[i]);
                                        }
                                    }
                                }
                                indexParam++;
                                sendResponse(indexParam, done, srvGrpErr, { srvcresult, apptrst });
                            }
                        });

                        execute.query(servicesQuery, '', function (srvcErr, srvcData) {
                            if (srvcData && srvcData.length > 0) {
                                for (var i = 0; i < srvcData.length; i++) {
                                    for (var j = 0; j < srvcresult.length; j++) {
                                        if (srvcData[i].sId == srvcresult[j].Id) {
                                            srvcresult[j].workerList.push(srvcData[i]);
                                        }
                                    }
                                }
                                indexParam++;
                                sendResponse(indexParam, done, srvcErr, { srvcresult, apptrst });
                            }
                        });
                    } else {
                        indexParam += 2;
                        sendResponse(indexParam, done, null, { srvcresult, apptrst });
                    }
                    // var apptsql = 'SELECT Appt_Date_Time__c, Notes__c, Duration__c, Client_Type__c FROM Appt_Ticket__c WHERE Id ="' + req.params.apptid + '"';

                    var apptSql = 'SELECT apt.Status__c as apstatus,apt.Name as ticketNumber, apt.Client_Type__c as visttype, apt.Appt_Date_Time__c, CONCAT(c.FirstName, " ", c.LastName) as clientName,  c.MobilePhone as mbphone, apt.Notes__c, apt.Duration__c, '
                        + ' c.Email as cltemail, apt.New_Client__c as newclient,  c.Phone as cltphone, apt.Is_Standing_Appointment__c as standingappt, apt.Has_Booked_Package__c as pkgbooking, '
                        + ' apt.Notes__c as notes, c.Client_Pic__c as clientpic, apt.CreatedDate as creadate,apt.LastModifiedDate as lastmofdate, '
                        + 'apt.Client_Type__c FROM Appt_Ticket__c as apt LEFT JOIN Contact__c as c on c.Id = apt.Client__c '
                        + ' LEFT JOIN Ticket_Service__c as ts on ts.Appt_Ticket__c= apt.Id WHERE apt.Id = "' + req.params.apptid + '" AND c.Id = "' + req.params.id + '" and apt.isDeleted =0 GROUP BY c.Id';
                    execute.query(apptSql, '', function (err, apptresult) {
                        if (err) {
                            logger.error('Error in appoitments dao - getExpressBookingServices:', err);
                        } else {
                            apptrst = apptresult;
                        }
                        // indexParam++;
                        // sendResponse(indexParam, done, err, { srvcresult, apptrst });
                        if (apptresult && apptresult.length > 0) {
                            var nextserviceSql = 'select ap.id, ap.Client__c, ap.Client_Type__c, c.FirstName, c.LastName, c.Email, c.MobilePhone, c.Title, c.Client_Pic__c, ap.Appt_Date_Time__c, '
                                + ' ap.Check_In_Time__c, ap.Reminder_Type__c, ap.Reminder_Sent__c, ap.Duration__c, ap.Status__c, ap.Status_Color__c, ap.isNoService__c, ap.Booked_Online__c, ap.Is_Class__c, '
                                + ' GROUP_CONCAT(s.Name) as serviceName, s.Service_Group__c, ts.Worker__c, u.Username, ts.Service_Date_Time__c, ts.Duration__c, ts.Visit_Type__c,ts.CreatedDate, ts.LastModifiedDate, '
                                + ' ts.Rebooked__c, ts.Status__c, ts.Price__c, ts.Net_Price__c, ts.Preferred_Duration__c, s.Available_For_Client_To_Self_Book__c, s.Client_Facing_Name__c, ts.Duration_1__c, ts.Duration_1_Available_For_Other_Work__c, '
                                + ' ts.Duration_2__c, ts.Duration_2_Available_For_Other_Work__c, ts.Duration_3__c, ts.Duration_3_Available_For_Other_Work__c, ts.Non_Standard_Duration__c, ts.Is_Class__c, ts.Max_Attendees__c, ts.Price_per_Attendee__c '
                                + ' from Appt_Ticket__c as ap join Ticket_Service__c as ts on ts.Appt_Ticket__c =ap.Id Join Contact__c as c on c.Id = ap.Client__c LEFT JOIN Service__c as s on s.Id = ts.Service__c LEFT JOIN User__c as u on u.Id =ts.Worker__c '
                                + ' where ap.Client__c = "' + req.params.id + '" and '
                                + ' ap.Appt_Date_Time__c > "' + apptresult[0].Appt_Date_Time__c + '" '
                                + ' and ap.Status__c != "CANCELED" '
                                + ' and ap.isNoService__c = false '
                                + ' order by ts.Service_Date_Time__c asc';
                            execute.query(nextserviceSql, '', function (err, nextapptresult) {
                                if (err) {
                                    logger.error('Error in appoitments dao - getExpressBookingServices:', err);
                                }
                                indexParam++;
                                sendResponse(indexParam, done, err, { srvcresult, apptrst, nextapptresult });
                            });
                        } else {
                            indexParam++;
                            sendResponse(indexParam, done, err, { srvcresult, apptrst });
                        }
                    });
                }
            });
        } catch (err) {
            logger.error('Unknown error in apptBooking dao - getExpressBookingServices:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getServicesByNextAppt(req, done) {
        var apptDate = new Date(req.params.date)
        try {
            var sql = 'select ap.Appt_Date_Time__c,CONCAT(us.FirstName," ", us.LastName) as workerName from Appt_Ticket__c as ap LEFT JOIN Ticket_Service__c as ts on ts.Appt_Ticket__c = ap.Id LEFT JOIN User__c as us on ts.Worker__c = us.Id where ts.Client__c= "' + req.params.id + '" and ap.Appt_Date_Time__c > "' + dateFns.getDBDatTmStr(apptDate) + '" and ap.Status__c != "CANCELED" and ap.isNoService__c = false and ap.IsDeleted = 0 and ts.IsDeleted = 0';
            execute.query(sql, '', function (err, result) {
                if (err) {
                    logger.error('Error in Nextappoitments dao - getServicesByNextAppt:', err);
                    done(err, result[0])
                } else {
                    done(err, result[0])
                }
            });
        } catch (err) {
            logger.error('Unknown error in NextapptBooking dao - getServicesByNextAppt:', err);
            return (err, { statusCode: '9999' });
        }
    },
    expressbookingsave(req, done) {
        var date = new Date();
        var id = uniqid();
        var indexParm = 0;
        var expressBookingObj = req.body;
        var sglength = [];
        var colorCode = [];
        var records = [];
        var apptName;
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
            var expressBookingData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                AccountId: uniqid(),
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                FirstName: expressBookingObj.firstName,
                LastName: expressBookingObj.lastName,
                MobilePhone: expressBookingObj.mobileNumber,
                Mobile_Carrier__c: expressBookingObj.mobileCarrier,
                Email: expressBookingObj.primaryEmail,
            }
            var sqlQuery = 'INSERT INTO ' + config.dbTables.ContactTBL + ' SET ?';
            execute.query(sqlQuery, expressBookingData, function (err, data) {
                if (err) {
                    logger.error('Error in Appointments dao - expressBookingData:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    if (expressBookingData.Id !== '') {
                        // var apptDate1 = moment(expressBookingObj.bookingDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
                        var apptDate1 = new Date(expressBookingObj.bookingDate);
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
                            Appt_Date_Time__c: apptDate1,
                            Client_Type__c: expressBookingObj.visitType,
                            Client__c: expressBookingData.Id,
                            Duration__c: expressBookingObj.sumDuration,
                            Status__c: 'Booked',
                            Is_Booked_Out__c: 0,
                            New_Client__c: 1,
                            Notes__c: expressBookingObj.textArea
                        }
                        var insertQuery = 'INSERT INTO ' + config.dbTables.apptTicketTBL + ' SET ?';

                        execute.query(insertQuery, apptObjData, function (error, data2) {
                            if (error) {
                                logger.error('Error in getting exprsssbokking1: ', error);
                                done(error, { statusCode: '9999' });
                            } else {
                                if (data2 && data2.affectedRows > 0) {
                                    for (var i = 0; i < expressBookingObj.service.length; i++) {
                                        records.push([
                                            uniqid(),
                                            config.booleanFalse,
                                            dateFns.getUTCDatTmStr(new Date()), uniqid(),
                                            dateFns.getUTCDatTmStr(new Date()), uniqid(),
                                            dateFns.getUTCDatTmStr(new Date()),
                                            apptObjData.Id,
                                            expressBookingObj.visitType,
                                            expressBookingData.Id,
                                            expressBookingObj.service[i].worker,                        // worker 
                                            apptDate1,
                                            expressBookingObj.service[i].service.split('$')[8],    // service group color
                                            expressBookingObj.service[i].service.split('$')[1], // duration 1
                                            expressBookingObj.service[i].service.split('$')[2], // duration 2
                                            expressBookingObj.service[i].service.split('$')[3], // duration 3
                                            expressBookingObj.service[i].service.split('$')[4],  // sum of duations
                                            0.0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            expressBookingObj.service[i].service.split('$')[6],
                                            expressBookingObj.textArea,
                                            'Booked'
                                        ]);
                                        if (expressBookingObj.service[i].service.split('$')[4]) {

                                            apptDate1 = new Date(apptDate1.getTime() + expressBookingObj.service[i].service.split('$')[4] * 60000);

                                        } else {
                                            apptDate1 = new Date(apptDate1.getTime() + expressBookingObj.service[i].service.split('$')[1] * 60000);
                                        }
                                        var insertQuery1 = 'INSERT INTO ' + config.dbTables.ticketServiceTBL
                                            + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                                            + ' SystemModstamp, Appt_Ticket__c, Visit_Type__c, Client__c,'
                                            + ' Worker__c, Service_Date_Time__c,Service_Group_Color__c,Duration_1__c,Duration_2__c,Duration_3__c, Duration__c, Service_Tax__c,'
                                            + ' Is_Booked_Out__c, Net_Price__c, Non_Standard_Duration__c, Rebooked__c,Service__c, Notes__c, Status__c) VALUES ?';
                                    }
                                    execute.query(insertQuery1, [records], function (err1, result1) {
                                        if (err1) {
                                            logger.error('Error in express1 dao - updateExpress:', err1);
                                            done(err1, result1);
                                        } else {
                                            done(err1, result1);
                                        }
                                    });
                                } else {
                                    done(err1, result1);
                                }
                            }
                        });
                    }
                }
            })
        });
    },

    autoSearchClient: function (req, done) {
        query = 'SELECT DISTINCT FirstName as first ,LastName as last, IFNULL(MobilePhone,"") as mobile, IFNULL(Phone,"") as phone FROM `Contact__c` where CONCAT(FirstName," ", LastName) like  "%' + req.params.id + '%"  or MobilePhone LIKE  "%' + req.params.id + '%"  OR Phone LIKE  "%' + req.params.id + '%"  and IsDeleted=0 LIMIT 10';
        execute.query(query, function (error, results) {
            if (error) {
                logger.error('Error in getting getClientSearch: ', error);
                done(error, results);
            } else {
                done(error, results);
            }
        });
    },

    // showing all service in calendar {{ venkey }}  All 
    getServices: function (req, done) {
        var sql = '  SELECT ts.Id as tsid,IFNULL(ap.Notes__c,"") as Notes__c,ts.Is_Booked_Out__c,IFNULL(ts.Status__c,"") as status,'
            + 'concat( IFNULL(cont.FirstName,""),"","," , IFNULL(cont.LastName,"")) as Name ,'
            + 'IFNULL(ser.Name, "") as serviceName, ts.Appt_Ticket__c,ts.Service_Date_Time__c,'
            + ' ts.Worker__c, ts.Service__c,ts.Duration__c, IFNULL(ts.Service_Group_Color__c," ") as serviceGroupColor,'
            + ' IFNULL(ts.Client__c,"") as clientID FROM Ticket_Service__c as ts'
            + ' left JOIN Service__c as ser on ser.Id = ts.Service__c '
            + ' left JOIN Appt_Ticket__c as ap on ts.Appt_Ticket__c = ap.Id '
            + ' left JOIN Contact__c as cont on cont.Id = ts.Client__c '
            + ' where DATE(ts.Service_Date_Time__c) = "' + req.params.id + '" '
            + '  and ts.IsDeleted=0 ';
        execute.query(sql, function (error, result) {
            if (error) {
                logger.error('Error in getting getSerives: ', error);
                done(error, result);
            } else {
                if (result && result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        if (srchAry(result[i].Appt_Ticket__c, i, result) !== null) {
                            result[i].Appt_Icon = 'asterix';
                        }
                    }
                }
                done(error, result);
            }
        });
    },
    // week 

    getWorkerWeek: function (req, done) {
        if (req.params.weekOrweekday === 'One Week') {
            startdate = req.params.start + ' ' + '00:00:00';
            var week = dateFns.getDBStEndWk(startdate);
            var sql = ' SELECT ts.Id as tsid,IFNULL(ap.Notes__c,"") as Notes__c,ts.Is_Booked_Out__c ,IFNULL(ts.Status__c,"") as status,'
                + ' concat( IFNULL(cont.FirstName,""),"", "," , IFNULL(cont.LastName,"")) as Name, '
                + ' IFNULL(ser.Name, "") as serviceName, ts.Appt_Ticket__c,ts.Service_Date_Time__c, '
                + '  ts.Worker__c, ts.Service__c,ts.Duration__c, IFNULL(ts.Service_Group_Color__c," ") as serviceGroupColor,'
                + '  IFNULL(ts.Client__c,"") as clientID FROM Ticket_Service__c as ts '
                + '  left JOIN Service__c as ser on ser.Id = ts.Service__c '
                + ' left JOIN Appt_Ticket__c as ap on ts.Appt_Ticket__c = ap.Id '
                + ' left JOIN Contact__c as cont on cont.Id = ts.Client__c '
                + ' where ts.Worker__c = "' + req.params.workerId + '" '
                + ' and ts.Service_Date_Time__c >= "' + week[0] + '" '
                + ' and ts.Service_Date_Time__c <= "' + week[1] + '" '
                + ' and ts.IsDeleted=0 order by ts.Service_Date_Time__c ASC ';
            execute.query(sql, function (error, result) {
                if (error) {
                    logger.error('Error in getting getSerives: ', error);
                    done(error, result);
                } else {
                    done(error, result);
                }
            });

        } else if (req.params.weekOrweekday === 'One Weekday') {
            startdate = req.params.start + ' ' + '00:00:00';
            var monthDates = dateFns.getDBWkDays(startdate);
            montStr = '(';
            for (var i = 0; i < monthDates.length; i++) {
                montStr += '\'' + monthDates[i] + '\',';
            }
            montStr = montStr.slice(0, -1) + ')';
            var startOfMonth1 = monthDates[0];
            var endOfMonth1 = monthDates[1];
            var sql = ' SELECT ts.Id as tsid,IFNULL(ap.Notes__c,"") as Notes__c,ts.Is_Booked_Out__c ,IFNULL(ts.Status__c,"") as status,'
                + ' concat( IFNULL(cont.FirstName,""),"", "," , IFNULL(cont.LastName,"")) as Name, '
                + ' IFNULL(ser.Name, "") as serviceName, ts.Appt_Ticket__c,ts.Service_Date_Time__c, '
                + '  ts.Worker__c, ts.Service__c,ts.Duration__c, IFNULL(ts.Service_Group_Color__c," ") as serviceGroupColor,'
                + '  IFNULL(ts.Client__c,"") as clientID FROM Ticket_Service__c as ts '
                + '  left JOIN Service__c as ser on ser.Id = ts.Service__c '
                + ' left JOIN Appt_Ticket__c as ap on ts.Appt_Ticket__c = ap.Id '
                + ' left JOIN Contact__c as cont on cont.Id = ts.Client__c '
                + ' where ts.Worker__c = "' + req.params.workerId + '" '
                + ' and date(ts.Service_Date_Time__c) in ' + montStr + ' '
                + ' and ts.IsDeleted=0 order by ts.Service_Date_Time__c ASC ';
            execute.query(sql, function (error, result) {
                if (error) {
                    logger.error('Error in getting getSerives: ', error);
                    done(error, result);
                } else {
                    done(error, result);
                }
            });
        }
    },
    upadateApptEvents: function (req, done) {
        const duration = req.body.duration.split('-')[1];
        var sql = 'update  Ticket_Service__c SET Worker__c="' + req.body.resourceId + '" '
            + ' ,Service_Date_Time__c = "' + req.body.eventStartTime + '",Duration__c="' + duration + '" '
            + ' where Id="' + req.body.ticket_service_id + '" ';
        execute.query(sql, function (error, result) {
            if (error) {
                logger.error('Error in getting upadateApptEvents: ', error);
                done(error, [null, null]);
            } else {
                var sqlQuery = 'update Appt_Ticket__c SET Duration__c="' + duration + '" '
                    + ',Appt_Date_Time__c="' + req.body.eventStartTime + '"  '
                    + 'where Id = "' + req.body.apptId + '" ';
                execute.query(sqlQuery, function (err, result1) {
                    if (err) {
                        logger.error('err in getting upadateApptEvents: ', err);
                        done(err, [result, null]);
                    } else {
                        done(err, [result, result1]);
                    }
                });
            }
        });
    },
    showAllWorkers: function (req, done) {

        var currentDay;
        try {
            var day = req.params.day;
            if (day === "Monday") {
                currentDay = 'hrs.MondayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image, hrs.MondayStartTime__c as start,hrs.MondayEndTime__c as end FROM Worker_Service__c as service'
                    + '  join Service__c as groups on groups.Id = service.Service__c'
                    + '  join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + ' and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + 'and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            } else if (day === "Tuesday") {
                currentDay = 'hrs.TuesdayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image, hrs.TuesdayStartTime__c as start,hrs.TuesdayEndTime__c as end FROM Worker_Service__c as service'
                    + '  join Service__c as groups on groups.Id = service.Service__c'
                    + '  join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + ' and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + 'and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });

            } else if (day === "Wednesday") {
                currentDay = 'hrs.WednesdayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image, hrs.WednesdayStartTime__c as start,hrs.WednesdayEndTime__c as end FROM Worker_Service__c as service'
                    + '  join Service__c as groups on groups.Id = service.Service__c'
                    + '  join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + ' and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + 'and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });

            } else if (day === "Thursday") {
                currentDay = 'hrs.ThursdayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image, hrs.ThursdayStartTime__c as start,hrs.ThursdayEndTime__c as end FROM Worker_Service__c as service'
                    + '  join Service__c as groups on groups.Id = service.Service__c'
                    + '  join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + ' and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + 'and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });

            } else if (day === "Friday") {
                currentDay = 'hrs.FridayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image, hrs.FridayStartTime__c as start,hrs.FridayEndTime__c as end FROM Worker_Service__c as service'
                    + '  join Service__c as groups on groups.Id = service.Service__c'
                    + '  join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + ' and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + 'and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });

            } else if (day === "Saturday") {
                currentDay = 'hrs.SaturdayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image, hrs.SaturdayStartTime__c as start,hrs.SaturdayEndTime__c as end FROM Worker_Service__c as service'
                    + '  join Service__c as groups on groups.Id = service.Service__c'
                    + '  join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + ' and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + 'and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });

            } else if (day === "Sunday") {

                currentDay = 'hrs.SundayStartTime__c !=""';
                var sqlQuery = ' SELECT DISTINCT users.Id as workerId, concat(UPPER(LEFT(users.FirstName,1)), '
                    + 'LOWER(SUBSTRING(users.FirstName,2,LENGTH(users.FirstName)))," ", UPPER(LEFT(users.LastName,1)),"." ) as names, '
                    + '  users.image as image, hrs.SundayStartTime__c as start,hrs.SundayEndTime__c as end FROM Worker_Service__c as service'
                    + '  join Service__c as groups on groups.Id = service.Service__c'
                    + '  join User__c as users on users.Id = service.Worker__c '
                    + ' join Company_Hours__c as hrs on hrs.Id=users.Appointment_Hours__c '
                    + 'LEFT OUTER JOIN CustomHours__c as cs on cs.Company_Hours__c = hrs.Id '
                    + ' and cs.All_Day_Off__c =0 and cs.IsDeleted =0 and users.StartDay IS NOT NULL '
                    + 'and service.Service__c IS NOT NULL and users.IsActive =1 '
                    + 'and ' + currentDay.split("'")[0] + ' '
                    + 'GROUP by users.FirstName';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in appoitments dao - getApptBookingData:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });

            }
        } catch (err) {
            logger.error('Unknown error in apptBooking dao  personal calendar - workerlistting :', err);
            return (err, { statusCode: '9999' });
        }

    },
    // existingBooking(req, done) {            // allready exists people for express booking save
    //     var date = new Date();
    //     var id = uniqid();
    //     var indexParm = 0;
    //     var expressBookingObj = req.body;
    //     var sglength = [];
    //     var colorCode = [];
    //     var records = [];
    //     var apptName;
    //     var apptDate1 = moment(expressBookingObj.bookingDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');


    //     console.log('--===--another   ', apptDate1, expressBookingObj.client_person_id, expressBookingObj.workerId);
    //     var sql = 'SELECT Client__c,Worker__c, Service_Date_Time__c FROM Ticket_Service__c '
    //         + 'where Service_Date_Time__c="' + apptDate1 + '" '
    //         + 'and Client__c="' + expressBookingObj.client_person_id + '" '
    //         + 'and Worker__c = "' + expressBookingObj.workerId + '" ';
    //     console.log(sql);
    //     execute.query(sql, '', function (err, result) {
    //         if (err) {
    //             done(err, { statusCode: '9999' });
    //         } else {
    //             console.log('--===--another   ', apptDate1, expressBookingData.Id, expressBookingObj.firstName);
    //             // if (result && result.length > 0) {
    //             //     for (var i = 0; i < result.length; i++) {
    //             //         if (result[i].Service_Date_Time__c === apptDate1) {
    //             //             console.log('can not be book');
    //             //         } else {
    //             //             console.log('here  ',result[i].Service_Date_Time__c, result[i].Worker__c, result[i].Worker__c);
    //             //         }

    //             //     }
    //             // } else {
    //             //     console.log('err in express booking', err);
    //             // }
    //         }
    //     });


    //     // var selectSql = 'SELECT Name, CreatedDate FROM `Appt_Ticket__c` where isDeleted =0 ORDER BY CreatedDate DESC';
    //     // execute.query(selectSql, '', function (err, result) {
    //     //     if (err) {
    //     //         done(err, result);
    //     //     } else {
    //     //         if (result && result[0].Name) {
    //     //             var generator = new sequential.Generator({
    //     //                 digits: 6,
    //     //                 restore: result[0].Name
    //     //             });
    //     //             apptName = generator.generate();
    //     //         } else {
    //     //             apptName = '000001';
    //     //         }
    //     //     }
    //     //     var expressBookingData = {
    //     //         Id: uniqid(),
    //     //         OwnerId: uniqid(),
    //     //         AccountId: uniqid(),
    //     //         CreatedDate: dateFns.getUTCDatTmStr(new Date()),
    //     //         LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
    //     //         LastModifiedById: uniqid(),
    //     //         SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
    //     //         FirstName: expressBookingObj.firstName,
    //     //         LastName: expressBookingObj.lastName,
    //     //         MobilePhone: expressBookingObj.mobileNumber,
    //     //         Mobile_Carrier__c: expressBookingObj.mobileCarrier,
    //     //         Email: expressBookingObj.primaryEmail,
    //     //     }
    //     //     var sqlQuery = 'INSERT INTO ' + config.dbTables.ContactTBL + ' SET ?';
    //     //     execute.query(sqlQuery, expressBookingData, function (err, data) {
    //     //         if (err) {
    //     //             logger.error('Error in Appointments dao - expressBookingData:', err);
    //     //             done(err, { statusCode: '9999' });
    //     //         } else {
    //     //             if (expressBookingData.Id !== '') {
    //     //                 // var apptDate1 = moment(expressBookingObj.bookingDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    //     //                 var apptDate1 = new Date(expressBookingObj.bookingDate);
    //     //                 var apptObjData = {
    //     //                     Id: id,
    //     //                     OwnerId: uniqid(),
    //     //                     IsDeleted: 0,
    //     //                     Name: apptName,
    //     //                     CreatedDate: dateFns.getUTCDatTmStr(new Date()),
    //     //                     CreatedById: uniqid(),
    //     //                     LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
    //     //                     LastModifiedById: uniqid(),
    //     //                     SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
    //     //                     LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
    //     //                     Appt_Date_Time__c: apptDate1,
    //     //                     Client_Type__c: expressBookingObj.visitType,
    //     //                     Client__c: expressBookingData.Id,
    //     //                     Duration__c: expressBookingObj.sumDuration,
    //     //                     Status__c: 'Booked',
    //     //                     Is_Booked_Out__c: 0,
    //     //                     New_Client__c: 1,
    //     //                     Notes__c: expressBookingObj.textArea
    //     //                 }
    //     //                 var insertQuery = 'INSERT INTO ' + config.dbTables.apptTicketTBL + ' SET ?';

    //     //                 execute.query(insertQuery, apptObjData, function (error, data2) {
    //     //                     if (error) {
    //     //                         logger.error('Error in getting exprsssbokking1: ', error);
    //     //                         done(error, { statusCode: '9999' });
    //     //                     } else {
    //     //                         if (data2 && data2.affectedRows > 0) {
    //     //                             for (var i = 0; i < expressBookingObj.service.length; i++) {
    //     //                                 records.push([
    //     //                                     uniqid(),
    //     //                                     config.booleanFalse,
    //     //                                     dateFns.getUTCDatTmStr(new Date()), uniqid(),
    //     //                                     dateFns.getUTCDatTmStr(new Date()), uniqid(),
    //     //                                     dateFns.getUTCDatTmStr(new Date()),
    //     //                                     apptObjData.Id,
    //     //                                     expressBookingObj.visitType,
    //     //                                     expressBookingData.Id,
    //     //                                     expressBookingObj.service[i].worker,                        // worker 
    //     //                                     apptDate1,
    //     //                                     expressBookingObj.service[i].service.split('$')[8],    // service group color
    //     //                                     expressBookingObj.service[i].service.split('$')[1], // duration 1
    //     //                                     expressBookingObj.service[i].service.split('$')[2], // duration 2
    //     //                                     expressBookingObj.service[i].service.split('$')[3], // duration 3
    //     //                                     expressBookingObj.service[i].service.split('$')[4],  // sum of duations
    //     //                                     0.0,
    //     //                                     0,
    //     //                                     0,
    //     //                                     0,
    //     //                                     0,
    //     //                                     expressBookingObj.service[i].service.split('$')[6],
    //     //                                     expressBookingObj.textArea,
    //     //                                     'Booked'
    //     //                                 ]);
    //     //                                 if (expressBookingObj.service[i].service.split('$')[4]) {

    //     //                                     apptDate1 = new Date(apptDate1.getTime() + expressBookingObj.service[i].service.split('$')[4] * 60000);

    //     //                                 } else {
    //     //                                     apptDate1 = new Date(apptDate1.getTime() + expressBookingObj.service[i].service.split('$')[1] * 60000);
    //     //                                 }
    //     //                                 var insertQuery1 = 'INSERT INTO ' + config.dbTables.ticketServiceTBL
    //     //                                     + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
    //     //                                     + ' SystemModstamp, Appt_Ticket__c, Visit_Type__c, Client__c,'
    //     //                                     + ' Worker__c, Service_Date_Time__c,Service_Group_Color__c,Duration_1__c,Duration_2__c,Duration_3__c, Duration__c, Service_Tax__c,'
    //     //                                     + ' Is_Booked_Out__c, Net_Price__c, Non_Standard_Duration__c, Rebooked__c,Service__c, Notes__c, Status__c) VALUES ?';
    //     //                             }
    //     //                             execute.query(insertQuery1, [records], function (err1, result1) {
    //     //                                 if (err1) {
    //     //                                     logger.error('Error in express1 dao - updateExpress:', err1);
    //     //                                     done(err1, result1);
    //     //                                 } else {
    //     //                                     done(err1, result1);
    //     //                                 }
    //     //                             });
    //     //                         } else {
    //     //                             done(err1, result1);
    //     //                         }
    //     //                     }
    //     //                 });
    //     //             }
    //     //         }
    //     //     })
    //     // });
    // },

}

function sendResponse(indexParam, callback, error, result) {
    if (indexParam == 3) {
        callback(error, result);
    }
}
function standingSendResponse(indexParam, callback, error, result) {
    if (indexParam == 1) {
        callback(error, result);
    }
}

function srchAry(nameKey, index, myArray) {
    var rtnVal = null;
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].Appt_Ticket__c === nameKey && index !== i) {
            rtnVal = i;
        }
    }
    return rtnVal;
}