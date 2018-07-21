/**
 * Importing required modules
 */
var SetupPosDevicesDAO = require('../dao/SetupPosDevicesDAO');

module.exports = {
    /**
     * DAO call to save PosDevices
     */
    savePosDevices: function(req, done) {
        SetupPosDevicesDAO.savePosDevices(req, function(err, data) {
            if(data.statusCode === '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This function lists PosDevices
     */
    getPosDevices: function(req, done) {
        SetupPosDevicesDAO.getPosDevices(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This function lists Pos
     */
    getPos: function(req, done) {
        SetupPosDevicesDAO.getPos(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
     /**
     * DAO call to save PosDevices
     */
    savePos: function(req, done) {
        SetupPosDevicesDAO.savePos(req, function(err, data) {
            if(data.statusCode === '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
}
