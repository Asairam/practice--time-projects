/**
 * Importing required modules
 */
var cfg = require('config');
var appointmentsSRVC = require('../services/AppointmentsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {
    /**
     * This api is to book appointment
     */
    app.get('/api/appointments/users', function (req, res) {
        appointmentsSRVC.getApptUsers(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
    * This api is to get appointment
    */
    app.get('/api/appointments/date/worker/:appdate/:worker/:viewBy', function (req, res) {
        appointmentsSRVC.getAppointments(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This api is to get appointment
     */
    app.get('/api/appointments/:apptid', function (req, res) {
        appointmentsSRVC.getAppointmentById(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This api is to get BookOutAppoinment
     */
    app.post('/api/appointments/bookoutappoinment', function (req, res) {
        appointmentsSRVC.getBookOutAppoinment(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    /**
     * This api is to create BookOutAppoinment
     */
    app.post('/api/appointments/bookoutappoinmentswithdata', function (req, res) {
        appointmentsSRVC.createBookOutAppoinment(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This api is to create bookstandingappoinmentswithdata
     */
    app.post('/api/appointments/bookstandingappoinmentswithdata', function (req, res) {
        appointmentsSRVC.createBookSatndingAppoinment(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
     * listing only users from wokers with active and service group active only
     */
    app.get('/api/appointment/workerList', function (req, res) {
        appointmentsSRVC.workerList(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
     * fetching person and getting calenda according to the person
     */
    app.get('/api/appointments/personCalendar/:name/:day', function (req, res) {
        appointmentsSRVC.personCalendar(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
     * fetching active memebers
     */
    app.get('/api/appointments/activeMembers/:day/:date', function (req, res) {
        appointmentsSRVC.activeMembers(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
    * Change Appointment status active memebers
    */
    app.put('/api/appointments/changestatus/:id', function (req, res) {
        appointmentsSRVC.changeStatus(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
     * get workers by class record
     */
    app.get('/api/appointments/workers/:id', function (req, res) {
        appointmentsSRVC.getWorkerByClass(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
     * update appointment Deatail by appointmentId
     */
    app.put('/api/appointment/detail/:id', function (req, res) {
        appointmentsSRVC.updateAppointmentDeatailByAppointmentId(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
     * update appointment book out by appointmentId
     */
    app.put('/api/appointments/bookout/:id', function (req, res) {
        appointmentsSRVC.updateAppointmentBookOutByAppointmentId(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/appointments/expressbookingservices/:id', function (req, res) {
        appointmentsSRVC.getExpressBookingServices(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/appointments/services/:id/:apptid', function (req, res) {
        appointmentsSRVC.getServicesByApptId(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/nextappointments/services/:id/:date', function (req, res) {
        appointmentsSRVC.getServicesByNextAppt(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.post('/api/appointment/expressbooking', function (req, res) {
        appointmentsSRVC.expressbookingsave(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/appointment/getclientnames/:id', function (req, res) {
        appointmentsSRVC.autoSearchClient(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/appointment/getServices/:id', function (req, res) {
        appointmentsSRVC.getServices(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    //week and weekdays
    app.get('/api/appointment/getWorkerWeek/:workerId/:start/:weekOrweekday', function (req, res) {
        appointmentsSRVC.getWorkerWeek(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.post('/api/calendarEventsUpdates', function (req, res) {
        appointmentsSRVC.upadateApptEvents(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/showAllWorkers/:day/:date', function (req, res) {
        appointmentsSRVC.showAllWorkers(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.post('/api/appointment/existingExpressBooking', function (req, res) {
        appointmentsSRVC.existingBooking(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

};
