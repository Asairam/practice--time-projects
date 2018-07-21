var nodemailer = require('nodemailer');
var logger = require('../lib/logger');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'infostxbeacon@gmail.com',
        pass: 'webappclouds'
    }
});

module.exports = {
	sendemail : function(toAddress, htmlMessage, subject, callback) {
        var mailOptions = {
            from: 'info@salonclouds.io',
            to: toAddress,
            subject: subject,
            html: htmlMessage
        };
        
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error('Error in sending Mail:', err);
                callback(error, null);
            } else {
                callback(null, info);
            }
        });
    },
    sendeMailReciept : function(toAddress, textData, subject, attachments, callback) {
        var mailOptions = {
            from: 'info@salonclouds.io',
            to: toAddress,
            subject: subject,
            text: textData,
            attachments: attachments
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error('Error in sending Mail:', err);
                callback(error, null);
            } else {
                callback(null, info);
            }
        });
	}
}
