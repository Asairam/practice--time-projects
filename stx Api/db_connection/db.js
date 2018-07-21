/*MyAQL connections*/

var mysql = require('mysql');
var logger = require('../lib/logger');
var config = require('config');

var query = function (query, data, done) {
	try {
		/**
		 * Aurora db configuration
		 */
		mySQLConnection = mysql.createConnection({
			// AWS DB
			host     : config.auroraMySQLDB.host,
			user     : config.auroraMySQLDB.user,
			password : config.auroraMySQLDB.password,
			database : config.auroraMySQLDB.databaseDev,

			// Local DB
			// host: config.MySQLDB.host,
			// user: config.MySQLDB.user,
			// password: config.MySQLDB.password,
			// database: config.MySQLDB.databaseDev,

			dateStrings: 'date',
			multipleStatements: true,
			connectTimeout: 30000
		});
		mySQLConnection.connect(function (err) {
			if (err === null) {
				logger.log('We are connected MySQL');
			} else {
				logger.error('Unable to connect MySQL');
				logger.error(err);
			}
		});

		if (data === '') {
			mySQLConnection.query(query, function (err, queryResult) {
				done(err, queryResult);
			});
		} else {
			mySQLConnection.query(query, data, function (err, queryResult) {
				done(err, queryResult);
			});
		}

		// logger.log('In the function execute query end');

		mySQLConnection.end();

	} catch (e) {
		logger.log('Error in execute query');
		logger.log(e);
	}
}

module.exports.query = query;
