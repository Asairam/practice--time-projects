/**
 * Importing required modules
 */
var favoritesDAO = require('../dao/SetupFavoritesDAO');

module.exports = {
    /**
     * Dao call to save saveFavorites
     */
    updateFavorites: function(req, done) {
        favoritesDAO.updateFavorites(req, function(err, data) {
            if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * Dao call to lists the saveFavorites
     */
    getFavorites: function(req, done) {
        favoritesDAO.getFavorites(req, function(err, data) {
            if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
     /**
     * Dao call to lists the services , Product and Promotion
     */
    gettypes: function(req, done) {
        favoritesDAO.gettypes(req, function(err, data) {
            if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * Dao call to lists the services , Product and Promotiongetselecttypes
     */
    getselecttypes: function(req, done) {
        favoritesDAO.getselecttypes(req, function(err, data) {
            if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * Dao call to lists the saveFavorites
     */
    getFavoritesBySearch: function(req, done) {
        favoritesDAO.getFavoritesBySearch(req, function(err, data) {
            if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
};
