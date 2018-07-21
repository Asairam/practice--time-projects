/**
 * Importing required modules
 */
// ClientSearch
var cfg = require('config');
var ClientSearchSRVC = require('../services/ClientSearchSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var fs = require('fs-extra');
var multer = require('multer');
var upload = multer({
	dest : cfg.clientPictureLocation
});

// --- Start of Controller
module.exports.controller = function (app, passport) {
    app.put('/api/clientsearch/:id', function (req, res) {
        ClientSearchSRVC.editWorkerDetail(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/clientsearch/:searchstring?', function (req, res) {
        ClientSearchSRVC.getClientSearch(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/client/:id', function (req, res) {
        ClientSearchSRVC.getClientById(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/clientSearch/bookappointment/:id', function (req, res) {
        ClientSearchSRVC.bookAppointmentBasedOnClientSearch(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.post('/api/clientsearch/activemembers', function (req, res) {
        ClientSearchSRVC.clientSearchMembers(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.post('/api/clientSearch/bookappointments', function (req, res) {
        ClientSearchSRVC.searchApptAvailability(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.post('/api/clientSearch/appointmentbooking', function (req, res) {
        ClientSearchSRVC.appointmentbooking(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.put('/api/client/quick/:id', function (req, res) {
        ClientSearchSRVC.quickEditClient(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.put('/api/client/savenotes/:id', function (req, res) {
        ClientSearchSRVC.serviceLogNotes(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
   
    app.put('/api/client/:id', function (req, res) {
        uploadFiles(req, res, 'clientPictureFile', cfg.clientPictureLocation+'/'+req.params.id, function() {
			ClientSearchSRVC.editClient(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
		});
    });
    app.put('/api/clientProfilePic/:id', function (req, res) {
        uploadProPic(req, res, 'clientPictureFile', cfg.clientPictureLocation+'/'+req.params.id, function() {
			ClientSearchSRVC.clientProPIc(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
		});
    });
    app.post('/api/client/quick', function (req, res) {
        ClientSearchSRVC.quickAddClient(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/client/rewards/:id', function (req, res) {
        ClientSearchSRVC.getClientRewards(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    app.get('/api/client/memberships/:id', function (req, res) {
        ClientSearchSRVC.getClientMemberShips(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    app.get('/api/client/packages/:id', function (req, res) {
        ClientSearchSRVC.getClientPackages(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/client/accounts/:id', function (req, res) {
        ClientSearchSRVC.getClientAccounts(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    
    app.delete('/api/client/:id/:type', function (req, res) {
        ClientSearchSRVC.deleteClient(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/client/emaillog/:id', function (req, res) {
        ClientSearchSRVC.getClientEmail(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/client/productlog/:id', function (req, res) {
        ClientSearchSRVC.getProductLog(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/client/servicelog/:id', function (req, res) {
        ClientSearchSRVC.getServiceLog(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/client/classlog/:id', function (req, res) {
        ClientSearchSRVC.getClassLog(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    
    app.post('/api/clients/createtoken', function (req, res) {
        ClientSearchSRVC.createClientToken(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    app.get('/api/clients/all', function (req, res) {
        ClientSearchSRVC.getAllclients(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};

//--- Start of function to upload files from UI to server ---//
function uploadFiles(req, res, uploadFileName, uplLoc, callback) {
	var storage = multer.diskStorage({
		destination : function(req, file, callback) {
			if (!fs.pathExistsSync(uplLoc)) {
				fs.mkdirsSync(uplLoc);
			} else {
                fs.removeSync(uplLoc);
                fs.mkdirsSync(uplLoc);
            }
			callback(null, uplLoc);
		},
		filename : function(req, file, callback) {
			callback(null, file.originalname);
		}
	});
	var upload = multer({
		storage : storage
	}).array(uploadFileName);
	upload(req, res, function(err) {
		if (err) {
			console.error(err);
		}
		if (callback && typeof (callback) === "function") {
			callback(err);
		}
	});
}
//--- End of function to upload files from UI to server ---//
function uploadProPic(req, res, uploadFileName, uplLoc, callback) {
	var storage = multer.diskStorage({
		destination : function(req, file, callback) {
			if (!fs.pathExistsSync(uplLoc)) {
				fs.mkdirsSync(uplLoc);
			} else {
                fs.removeSync(uplLoc);
                fs.mkdirsSync(uplLoc);
            }
			callback(null, uplLoc);
		},
		filename : function(req, file, callback) {
			callback(null, file.originalname);
		}
	});
	var upload = multer({
		storage : storage
	}).array(uploadFileName);
	upload(req, res, function(err) {
		if (err) {
			console.error(err);
		}
		if (callback && typeof (callback) === "function") {
			callback(err);
		}
	});
}
