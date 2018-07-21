/**
 * New node file
 */
var winston = require('winston');
winston.transports.DailyRotateFile = require('winston-daily-rotate-file');
var cfg = require('config');
var mkpath = require('mkpath');

var customFormat = function(options) {
    // Return string will be passed to logger.
    return options.timestamp() + ' | ' + options.level.toUpperCase() + ' | ' +
            (undefined !== options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? ' ' + JSON.stringify(options.meta) : '' );
};

var dirctoryPath = 'logs/';
mkpath(dirctoryPath, function(err) {
    if (err)
        throw err;
});
mkpath.sync(dirctoryPath, 0700);

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.DailyRotateFile)({
            name: 'file',
            filename: cfg.logsPath,
            datePattern: '.yyyy-MM-dd',
            level: cfg.logsLevel,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            timestamp: function() {
                return (new Date().toUTCString());
            },
            formatter: customFormat
        })
    ],
    exitOnError: false
});

logger.setMaxListeners(0);

module.exports=logger;
