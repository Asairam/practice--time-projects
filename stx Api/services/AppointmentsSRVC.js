/**
 * Importing required modules
 */
var appointmentsDAO = require('../dao/AppointmentsDAO');
var config = require('config');
var fs = require('fs');

module.exports = {
    /**
     * Dao call to book appointment
     */

    getApptUsers: function (req, done) {
        appointmentsDAO.getApptUsers(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },

    /**
     * Dao call to get Appointments
     */

    getAppointments: function (req, done) {
        appointmentsDAO.getAppointments(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (data.statusCode === '2078') {
                done({ httpCode: 400, statusCode: data.statusCode, result: '' });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    /**
         * Dao call to get Appointments
         */

    getAppointmentById: function (req, done) {
        appointmentsDAO.getAppointmentById(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    /**
     * Dao call to get BookOutAppoinment
     */

    getBookOutAppoinment: function (req, done) {
        appointmentsDAO.getBookOutAppoinment(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    /**
         * Dao call to create BookOutAppoinment
         */

    createBookOutAppoinment: function (req, done) {
        appointmentsDAO.createBookOutAppoinment(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (data.statusCode === '2080') {
                done({ httpCode: 200, statusCode: '2080', result: data });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    /**
     * Dao call to create createBookSatndingAppoinment
     */

    createBookSatndingAppoinment: function (req, done) {
        appointmentsDAO.createBookSatndingAppoinment(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    workerList: function (req, done) {
        appointmentsDAO.workerList(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    personCalendar: function (req, done) {
        appointmentsDAO.personCalendar(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    activeMembers: function (req, done) {
        appointmentsDAO.activeMembers(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    changeStatus: function (req, done) {
        appointmentsDAO.changeStatus(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    getWorkerByClass: function (req, done) {
        appointmentsDAO.getWorkerByClass(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    updateAppointmentDeatailByAppointmentId: function (req, done) {
        appointmentsDAO.updateAppointmentDeatailByAppointmentId(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    updateAppointmentBookOutByAppointmentId: function (req, done) {
        appointmentsDAO.updateAppointmentBookOutByAppointmentId(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    getExpressBookingServices: function (req, done) {
        appointmentsDAO.getExpressBookingServices(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    getServicesByApptId: function (req, done) {
        appointmentsDAO.getServicesByApptId(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    getServicesByNextAppt: function (req, done) {
        appointmentsDAO.getServicesByNextAppt(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    expressbookingsave: function (req, done) {
        appointmentsDAO.expressbookingsave(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    autoSearchClient: function (req, done) {
        appointmentsDAO.autoSearchClient(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    getServices: function (req, done) {
        appointmentsDAO.getServices(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    getWorkerWeek: function (req, done) {
        appointmentsDAO.getWorkerWeek(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });

    },
    upadateApptEvents: function (req, done) {
        appointmentsDAO.upadateApptEvents(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    showAllWorkers: function (req, done) {
        appointmentsDAO.showAllWorkers(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    existingBooking: function (req, done) {
        appointmentsDAO.existingBooking(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
};
