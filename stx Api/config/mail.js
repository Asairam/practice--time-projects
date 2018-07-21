//Imports required modules
// var config = require('config');
var ses = require('node-ses')
var logger = require('../lib/logger');

//AWS SES (Simple Email Service) email configuration
var client = ses.createClient({
	key : "AKIAJ7QNX27TBMG5B3VA",
	secret : "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"
});

// var console = require('../lib/console');

module.exports = {
	sendemail : function(emailAddress, message, flagMailSubject, callback) {
		client.sendEmail({
			to : 'akhila-qa@webappclouds.com',
			from : 'info@salonclouds.io',
			subject : flagMailSubject,
			message : message
		}, function(err, res) {
			if (err) {
				logger.info(err, 'err------------', err);
				throw err;
			} else {
				callback(err, '2057');
				logger.info('Email succesfully sent');
				
				}
			})
		//});
	}
}