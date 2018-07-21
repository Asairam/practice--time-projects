/**
 * Importing required modules
 */
var OnlineGiftsDAO = require('../dao/OnlineGiftsDAO');

module.exports = {
    saveOnlineGifts: function(req, done) {
        OnlineGiftsDAO.saveOnlineGifts(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getOnlineGifts: function(req, done) {
        OnlineGiftsDAO.getOnlineGifts(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    }
};


