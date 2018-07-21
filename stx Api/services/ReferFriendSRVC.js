/**
 * Importing required modules
 */
var ReferFriendDAO = require('../dao/ReferFriendDAO');

module.exports = {
    referFriend: function(req, done) {
        ReferFriendDAO.referFriend(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getreferFriend: function(req, done) {
        ReferFriendDAO.getreferFriend(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    }
};


