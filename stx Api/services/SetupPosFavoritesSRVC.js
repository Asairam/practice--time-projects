/**
 * Importing required modules
 */
var setupPosFavoritesDAO = require('../dao/SetupPosFavoritesDAO');

module.exports = {
    saveFavorites: function(req, done) {
        setupPosFavoritesDAO.saveFavorites(req, function(err, data) {
            if (data.statusCode === '2048') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2049') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            }else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This function lists the POS Favorites
     */
    getFavorites: function(req, done) {
        setupPosFavoritesDAO.getFavorites(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
};


