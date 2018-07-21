/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var moment = require('moment');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var dateFns = require('./../common/dateFunctions');
// var https = require('https');
// var http = require('http');
// var request = require('request');
var global;
module.exports = {
    /**
     * This function is to saves marketingset into db
     */
    saveMarketingset: function (req, done) {
        var marketingsetObj = req.body;
        var marketingsetData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            Name: marketingsetObj.Name,
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            Active__c: marketingsetObj.Active__c,
            External_Email_ID__c: marketingsetObj.External_Email_ID__c,
            External_Email_Name__c: marketingsetObj.External_Email_Name__c,
            Filters__c: '',
            Frequency__c: marketingsetObj.Frequency__c,
            Generate_Every__c: marketingsetObj.Generate_Every__c,
            Include_Missing_Postal_Code__c: '',
            Last_Generated__c: '',
            Next_Generation__c: marketingsetObj.Next_Generation__c,
            Output__c: marketingsetObj.Output__c
        };
        var sqlQuery = 'INSERT INTO ' + config.dbTables.marketingSetTBL + ' SET ?';
        execute.query(sqlQuery, marketingsetData, function (err, data) {
            if (err !== null) {
                if (err.sqlMessage.indexOf('Name') > 0) {
                    done(err, { statusCode: '2076' });
                } else {
                    logger.error('Error in marketingset dao - Addmarketingset:', err);
                    done(err, { statusCode: '9999' });
                }
            } else {
                done(err, data);
            }
        });
    },
    /**
     * This function lists the Marketingsets
     */
    getMarketingsets: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.marketingSetTBL
                + ' WHERE isDeleted = 0 ';
            if (req.params.active === 'true')
                sqlQuery = sqlQuery + 'And Active__c = 1';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Marketingset dao - getMarketingsets:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in Marketingset dao - getMarketingsets:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
    * This function lists the Marketingsets
    */
    getMarketingsetById: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.marketingSetTBL
                + " WHERE Id ='" + req.params.id + "'";
              execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Marketingset dao - getMarketingsetByID:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result[0]);
                }
            });
        } catch (err) {
            logger.error('Unknown error in Marketingset dao - getMarketingsetByID:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
     * This function lists the getEmailList 
     */

    getEmailList: function (req, done) {
        var msg = validateEmailPreferences();
        if (msg == null) {
            //	read in marketing emails and build options list
            //  marketingEmailList = retrieveMarketingEmailList();
            //this.marketingEmailOptions = new List<SelectOption>();
            //for ( SendEmailBIZ.MarketingEmailItem emailItem : marketingEmailList )
            //	this.marketingEmailOptions.add( new SelectOption( String.valueOf( emailItem.emailExternalId ), emailItem.emailName ));
            this.isMarketingEmailSetup = true;
            done('', true)
        } else {
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, msg));
            this.isMarketingEmailSetup = false;
            done('', false)
        }
    },

    /**
     * This method edit single record by using id
     */
    editMarketingset: function (req, done) {
        try {
            var updateObj = req.body;

            var sqlQuery = 'UPDATE ' + config.dbTables.marketingSetTBL
                + ' SET Name = "' + updateObj.Name
                + '", Active__c = "' + updateObj.Active__c
                + '", External_Email_ID__c = "' + updateObj.Abbreviation__c
                + '", External_Email_Name__c = "' + updateObj.External_Email_Name__c
                + '", Frequency__c = "' + updateObj.Frequency__c
                + '", Generate_Every__c = "' + updateObj.Generate_Every__c
                + '", Include_Missing_Postal_Code__c = "' + updateObj.Include_Missing_Postal_Code__c
                + '", Next_Generation__c = "' + updateObj.Next_Generation__c
                + '", Output__c = "' + updateObj.Output__c
                + '" WHERE Id = "' + req.params.id + '"';
            execute.query(sqlQuery, function (err, result) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2076' });
                    } else {
                        logger.error('Error in marketingset dao - edit marketingset:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in marketingset DAO - editmarketingset:', err);
            done(err, { statusCode: '9999' });
        }
    },
    deleteMarketingset: function (req, done) {
        try {
            var sqlQuery = 'UPDATE ' + config.dbTables.marketingSetTBL
                + ' SET  IsDeleted = ' + 1
                + ' WHERE Id = "' + req.params.id + '"';
            execute.query(sqlQuery, function (err, result) {
                if (err !== null) {
                    logger.error('Error in marketingset dao - delete marketingset:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in marketingset DAO - delete marketingset:', err);
            done(err, { statusCode: '9999' });
        }
    },
    getrewards: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM Reward__c WHERE IsDeleted = 0 ORDER BY Name';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Marketingset dao - getrewards:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in marketingset DAO - getrewards:', err);
            done(err, { statusCode: '9999' });
        }
    },
    getClientRewards: function (req, done) {
        try {
            var sqlQuery = 'select cr.Id, cr.Name, cr.Client__c, c.Id, cr.Points_Balance__c, cr.Reward__c, r.Name, r.Active__c '
                + ' from Client_Reward__c as cr left join Contact__c as c on c.Id = cr.Client__c '
                + ' left JOIN Reward__c as r on r.Id = cr.Reward__c where Client__c ="' + req.params.id + '" ';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Marketingset dao - getrewards:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in marketingset DAO - getrewards:', err);
            done(err, { statusCode: '9999' });
        }
    },
    saveRewards: function (req, done) {
        var rewardsetObj = req.body;
        for (let i = 0; i < rewardsetObj.award_rules__c.length; i++) {
            const sdate = new Date(rewardsetObj.award_rules__c[i].startDate);
            const edate = new Date(rewardsetObj.award_rules__c[i].endDate);
            if (rewardsetObj.award_rules__c[i].startDate !== '') {
                rewardsetObj.award_rules__c[i].startDate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2) + ' 00:00:00';
            } else {
                rewardsetObj.award_rules__c[i].startDate = '';
            }
            if (rewardsetObj.award_rules__c[i].endDate !== '') {
                rewardsetObj.award_rules__c[i].endDate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2) + ' 00:00:00';
            } else {
                rewardsetObj.award_rules__c[i].endDate = '';
            }
        }

        for (let i = 0; i < rewardsetObj.redeem_rules__c.length; i++) {
            const sdate = new Date(rewardsetObj.redeem_rules__c[i].startDate);
            const edate = new Date(rewardsetObj.redeem_rules__c[i].endDate);
            if (rewardsetObj.redeem_rules__c[i].startDate !== '') {
                rewardsetObj.redeem_rules__c[i].startDate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2) + ' 00:00:00';
            } else {
                rewardsetObj.redeem_rules__c[i].startDate = '';
            }
            if (rewardsetObj.redeem_rules__c[i].endDate !== '') {
                rewardsetObj.redeem_rules__c[i].endDate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2) + ' 00:00:00';
            } else {
                rewardsetObj.redeem_rules__c[i].endDate = '';
            }
        }
        var rewardsetData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            Name: rewardsetObj.name,
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            Active__c: rewardsetObj.active_c,
            Award_Rules__c: JSON.stringify(rewardsetObj.award_rules__c),
            Redeem_Rules__c: JSON.stringify(rewardsetObj.redeem_rules__c)
        };
        var sqlQuery = 'INSERT INTO ' + config.dbTables.marketingRewards + ' SET ?';
        execute.query(sqlQuery, rewardsetData, function (err, data) {
            if (err !== null) {
                if (err.sqlMessage.indexOf('Name') > 0) {
                    done(err, { statusCode: '2076' });
                } else {
                    logger.error('Error in marketingset dao - post rewards:', err);
                    done(err, { statusCode: '9999' });
                }
            } else {
                done(err, data);
            }
        });
    },
    getPreferenceFromUiName(req, done) {
        var name = req.params.name;
        getPreferenceByName(name, done);
    },
    updateRewards: function (req, done) {
        // try {
        var updateObj = req.body;
        for (let i = 0; i < updateObj.award_rules__c.length; i++) {
            const sdate = new Date(updateObj.award_rules__c[i].startDate);
            const edate = new Date(updateObj.award_rules__c[i].endDate);
            if (updateObj.award_rules__c[i].startDate !== '') {
                updateObj.award_rules__c[i].startDate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2) + ' 00:00:00';
            } else {
                updateObj.award_rules__c[i].startDate = '';
            }
            if (updateObj.award_rules__c[i].endDate !== '') {
                updateObj.award_rules__c[i].endDate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2) + ' 00:00:00';
            } else {
                updateObj.award_rules__c[i].endDate = '';
            }
        }

        for (let i = 0; i < updateObj.redeem_rules__c.length; i++) {
            const sdate = new Date(updateObj.redeem_rules__c[i].startDate);
            const edate = new Date(updateObj.redeem_rules__c[i].endDate);
            if (updateObj.redeem_rules__c[i].startDate !== '') {
                updateObj.redeem_rules__c[i].startDate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2) + ' 00:00:00';
            } else {
                updateObj.redeem_rules__c[i].startDate = '';
            }
            if (updateObj.redeem_rules__c[i].endDate !== '') {
                updateObj.redeem_rules__c[i].endDate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2) + ' 00:00:00';
            } else {
                updateObj.redeem_rules__c[i].endDate = '';
            }
        }
        var sqlQuery = 'UPDATE ' + config.dbTables.marketingRewards
            + ' SET Name = "' + updateObj.name
            + '", Active__c = ' + updateObj.active_c
            + ",Award_Rules__c = '" + JSON.stringify(updateObj.award_rules__c)
            + "',Redeem_Rules__c = '" + JSON.stringify(updateObj.redeem_rules__c)
            + "' WHERE Id = '" + req.params.id + " ' ";
        execute.query(sqlQuery, function (err, result) {
            if (err !== null) {
                if (err.sqlMessage.indexOf('Name') > 0) {
                    done(err, { statusCode: '2076' });
                } else {
                    logger.error('Error in rewards dao - update rewards:', err);
                    done(err, { statusCode: '9999' });
                }
            } else {
                done(err, result);
            }
        });
        // } catch (err) {
        //     logger.error('Unknown error in  rewards DAO - update rewards:', err);
        //     done(err, { statusCode: '9999' });
        // }
    },
};
function getPreferenceByName(preferenceName, cb) {
    // if (preferenceName == null) {
    //     var preferenceMap = [];
    //     var sqlQuery = 'select Name, Checkbox__c, Date__c, Number__c, Text__c, Encrypted__c, JSON__c, LastModifiedDate'
    //         + ' FROM Preference__c ';
    //     execute.query(sqlQuery, function (err, result) {
    //         if (err) {
    //             logger.error('Error in marketingset dao - edit marketingset:', err);
    //             return err;
    //         } else {
    //             // for (Preference__c pref : prefList) {
    //             //     preferenceMap.push(pref.name, pref);
    //             //     //System.debug('* * * adding preference "' + pref.name +  '" to map: ' + pref);
    //             // }
    //             return result;
    //         }
    //     });
    // } else {
    // Preference not found - try to refresh
    var prefList = 'select Name, Checkbox__c, Date__c, Number__c, Text__c, Encrypted__c, JSON__c'
        + ' from Preference__c where Name ="' + preferenceName + '"';
    execute.query(prefList, function (err, result) {
        if (err) {
            logger.error('Error in marketingset dao - edit marketingset:', err);
            cb(err, null);
        } else {
            cb(err, result[0]);

        }
    });

    // }
};
function validateEmailPreferences() {
    // try {
    getPreferenceByName(config.emailApp, function (er, done) {
        getPreferenceByName(config.emailAppSubuser, function (er, done1) {
            var errorMsg = null;
            global = done1.Text__c;
            if ((done === null) || (done.Text__c === null) || (done.Encrypted__c === null)
                || (done1 === null) || (done1.Text__c === null) || (done1.Encrypted__c === null)) {
                var debugMsg = '**** The following SendGrid Email App Preference Parameter(s) have not been set:';
                if (done == null) {
                    debugMsg += ' Primary user.';
                } else {
                    if (done.Text__c === null)
                        debugMsg += ' Primary username.';
                    if (done.Encrypted__c === null)
                        debugMsg += ' Primary user password.';
                }
                if (done1 == null) {
                    debugMsg += ' Subuser ';
                } else {
                    if (done1.Text__c === null)
                        debugMsg += ' Subuser username.';
                    if (done1.Encrypted__c === null)
                        debugMsg += ' Subuser password.';
                }
                errorMsg = debugMsg;
            }
            return errorMsg;
        });
    });
};
// function retrieveMarketingEmailList(){
//     var httpResponse = null;
//     request = createSendGridRequest( 'campaigns?limit=50&offset=0', 'GET' );
//     httpResponse = http.send( request );
// }
// function createSendGridRequest(callURL, method ) {
//     // var request = new HttpRequest();
//     request(config.sendGridEndPoint,callURL, function (error, response, body) {
// });
//     request.setHeader( 'Authorization', 'Basic ' + new Buffer(global).toString('base64'),new Buffer(global, 'base64').toString('ascii'));
//     request.setMethod( method );
//     request.setTimeout( 60000 );	// 60 seconds
//     return request;
// }