/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * This function is to saves Favorites into db
     */
    updateFavorites: function (req, done) {
        var favoritesObj = req.body;
        var sqlQuery = 'SELECT JSON__c FROM ' + config.dbTables.preferenceTBL
            + ' WHERE Name = "' + config.favoriteItems + '"';
        if (favoritesObj.favoriteId && favoritesObj.color && favoritesObj.type) {
            execute.query(sqlQuery, '', function (err, JSON_Cresult) {
                if (JSON_Cresult && JSON_Cresult.length > 0) {
                    var JSON__c_str = JSON.parse(JSON_Cresult[0].JSON__c);
                    for (var i = 0; i < JSON__c_str.length; i++) {
                        if (JSON__c_str[i].order === parseInt(req.params.order)) {
                            JSON__c_str[i].id = favoritesObj.favoriteId;
                            JSON__c_str[i].color = favoritesObj.color;
                            JSON__c_str[i].type = favoritesObj.type;
                        }
                    }
                    var updateQuery = "UPDATE " + config.dbTables.preferenceTBL
                        + " SET JSON__c = '" + JSON.stringify(JSON__c_str)
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Name = '" + config.favoriteItems + "'";
                    execute.query(updateQuery, '', function (err, data) {
                        if (err) {
                            logger.error('Error2 in favorites dao - savefavorites:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                } else {
                    logger.error('Error in Favorites dao - getFavorites:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } else {
            execute.query(sqlQuery, '', function (err, JSON_Cresult) {
                if (err) {
                    logger.error('Error2 in favorites dao - savefavorites:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, JSON_Cresult);
                }
            });

        }
    },
    /**
     * This function lists the Favorites
     */
    getFavorites: function (req, done) {
        try {
            var sqlQuery = 'SELECT JSON__c FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.favoriteItems + '"';
            execute.query(sqlQuery, '', function (err, JSON_Cresult) {
                if (JSON_Cresult && JSON_Cresult.length > 0) {
                    var JSON__c_str = JSON.parse(JSON_Cresult[0].JSON__c);
                    var serviceIds = '';
                    var productIds = '';
                    var promotionIds = '';
                    for (var i = 0; i < JSON__c_str.length; i++) {
                        JSON__c_str[i]['name'] = '';
                        if (JSON__c_str[i].id && JSON__c_str[i].id != '') {
                            if (JSON__c_str[i].type === 'Service') {
                                serviceIds += '\'' + JSON__c_str[i].id + '\',';
                            } else if (JSON__c_str[i].type === 'Product') {
                                productIds += '\'' + JSON__c_str[i].id + '\',';
                            } else if (JSON__c_str[i].type === 'Promotion') {
                                promotionIds += '\'' + JSON__c_str[i].id + '\',';
                            }
                        }
                    }
                    var temp = 0;
                    resultJson = [];
                    if (serviceIds.length > 0) {
                        serviceIds = serviceIds.slice(0, -1);
                        serviceIds = '(' + serviceIds + ')';
                        // var serviceSql = 'SELECT Id, Price__c,  Name  FROM ' + config.dbTables.serviceTBL
                        //     + ' WHERE IsDeleted  = 0 And Id IN ' + serviceIds;
                        var serviceSql = 'SELECT s.Id, s.Price__c, ts.Service_Group_Color__c, s.Name, IFNULL(s.Duration_1__c, ts.Duration_1__c) as Duration_1__c, '
                            + 'IFNULL(s.Duration_2__c, ts.Duration_2__c) as Duration_2__c, IFNULL(s.Duration_3__c, ts.Duration_3__c) as Duration_3__c, '
                            + ' IFNULL(s.Buffer_After__c, ts.Buffer_After__c) as Buffer_After__c, s.Guest_Charge__c FROM Service__c as s '
                            + 'JOIN Ticket_Service__c as ts WHERE s.IsDeleted  = 0 And s.Id IN' + serviceIds;
                        execute.query(serviceSql, '', function (err, result) {
                            if (!err) {
                                // resultJson['serviceNames'] = result;
                                if (result && result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        resultJson.push(result[i]);
                                    }
                                }

                            }
                            temp++;
                            if (temp == 3) {
                                done(err, updateJsonc(JSON__c_str, resultJson));
                            }
                        });
                    } else {
                        if (temp == 3) {
                            // updateJsonc(JSON__c_str, resultJson);
                            done(err, updateJsonc(JSON__c_str, resultJson));
                        }
                    }
                    if (productIds.length > 0) {
                        productIds = productIds.slice(0, -1);
                        productIds = '(' + productIds + ')';
                        var productSql = 'SELECT Id, CONCAT(Name, " - ", Size__c, " ", Unit_of_Measure__c) as Name, Price__c, '
                         + ' Product_Pic__c, Size__c, Taxable__c, Unit_of_Measure__c FROM ' + config.dbTables.setupProductTBL
                            + ' WHERE IsDeleted  = 0 And Id IN ' + productIds;
                        execute.query(productSql, '', function (err, result) {
                            if (!err) {
                                if (result && result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        resultJson.push(result[i]);
                                    }
                                }
                            }
                            temp++;
                            if (temp == 3) {
                                // updateJsonc(JSON__c_str, resultJson);
                                done(err, updateJsonc(JSON__c_str, resultJson));
                            }
                        });

                    } else {
                        temp++;
                        if (temp == 3) {
                            // updateJsonc(JSON__c_str, resultJson);
                            done(err, updateJsonc(JSON__c_str, resultJson));
                        }
                    }
                    if (promotionIds.length > 0) {
                        promotionIds = promotionIds.slice(0, -1);
                        promotionIds = '(' + promotionIds + ')';
                        var promotionSql = 'SELECT Id, Name, Start_Date__c, End_Date__c, Discount_Amount__c, Discount_Percentage__c, Product_Discount__c, Active__c, Service_Discount__c FROM ' + config.dbTables.promotionTBL
                            + ' WHERE IsDeleted  = 0 And Id IN ' + promotionIds;
                        execute.query(promotionSql, '', function (err, result) {
                            if (!err) {
                                if (result && result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        resultJson.push(result[i]);
                                    }
                                }
                            }
                            temp++;
                            if (temp == 3) {
                                // updateJsonc(JSON__c_str, resultJson);
                                done(err, updateJsonc(JSON__c_str, resultJson));
                            }
                        });

                    } else {
                        temp++;
                        if (temp == 3) {
                            // updateJsonc(JSON__c_str, resultJson);
                            done(err, updateJsonc(JSON__c_str, resultJson));
                        }
                    }
                } else {
                    logger.error('Error in Favorites dao - getFavorites:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in Favorites dao - getFavorites:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
     * This function lists the Favorites
     */
    gettypes: function (req, done) {
        try {
            var type = req.params.type;
            if (type === 'Product') {
                var sqlQuery = 'SELECT Id, Name, Color__c FROM ' + config.dbTables.setupProductLineTBL + ' Where IsDeleted = 0';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in Favorites dao - getFavorites:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            } else if (type === 'Promotion') {
                var sqlQuery = 'SELECT Id, Name FROM ' + config.dbTables.promotionTBL + ' Where IsDeleted = 0';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in Favorites dao - getFavorites:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            }

        } catch (err) {
            logger.error('Unknown error in Favorites dao - gettypes:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
    * This function lists the Favorites
    */
    getselecttypes: function (req, done) {
        try {
            var type = req.params.name;
            if (type === 'Service') {
                var sqlQuery = 'SELECT Id, Name , Duration_1__c, Duration_2__c, Duration_3__c FROM ' + config.dbTables.serviceTBL + ' Where IsDeleted = 0 And Service_Group__c ="' + req.params.type + '"';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in Favorites dao - getFavorites:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            } else if (type === 'ApptService') {
                var sqlQuery = ' SELECT s.Id,  CONCAT(s.Id, "$", IF(ws.Duration_1__c = null, s.Duration_1__c, IF(ws.Duration_1__c > 0, ws.Duration_1__c, s.Duration_1__c)), "$", IF(ws.Duration_2__c = null, s.Duration_2__c, IF(ws.Duration_2__c > 0, ws.Duration_2__c, s.Duration_2__c)), "$", '
                    + ' IF(ws.Duration_3__c = null, s.Duration_3__c, IF(ws.Duration_3__c > 0, ws.Duration_3__c, s.Duration_3__c)),"$", IF(ws.Buffer_after__c = null, s.Buffer_after__c, IF(ws.Buffer_after__c > 0, ws.Buffer_after__c, s.Buffer_after__c))) as serviceName, IF(ws.Duration_1__c = null, s.Duration_1__c, IF(ws.Duration_1__c > 0, ws.Duration_1__c, s.Duration_1__c)) as Duration_1__c, '
                    + ' IF(ws.Duration_2__c = null, s.Duration_2__c, IF(ws.Duration_2__c > 0, ws.Duration_2__c, s.Duration_2__c)) as Duration_2__c, IF(ws.Duration_3__c = null, s.Duration_3__c, IF(ws.Duration_3__c > 0, ws.Duration_3__c, s.Duration_3__c)) as Duration_3__c, IF(ws.Buffer_after__c = null, s.Buffer_after__c, IF(ws.Buffer_after__c > 0, ws.Buffer_after__c, s.Buffer_after__c)) as Buffer_After__c, s.Name, s.Guest_Charge__c, ws.Price__c as servicePrice FROM Worker_Service__c as ws'
                    + ' JOIN Service__c as s on s.Id = ws.`Service__c` WHERE s.Service_Group__c = "' + req.params.type + '" GROUP BY s.Name';
                    execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in Favorites dao - getFavorites:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            } else if (type === 'Product') {
                var sqlQuery = 'SELECT Id, Name FROM ' + config.dbTables.setupProductTBL + ' Where IsDeleted = 0 And Product_Line__c ="' + req.params.type + '"';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in Favorites dao - getFavorites:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            } else if (type === 'Package') {
                var sqlQuery = 'SELECT Json__c FROM ' + config.dbTables.packageTBL + ' Where IsDeleted = 0 And Id ="' + req.params.type.split(':')[1] + '"';
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in Favorites dao - getFavorites:', err);
                        done(err, { statusCode: '9999' });
                    } else if (JSON.parse(result[0].Json__c).length > 0) {
                        serviceresultJson = [];
                        var serviceId = [];
                        for (var i = 0; i < JSON.parse(result[0].Json__c).length > 0; i++) {
                            serviceId.push(JSON.parse(result[0].Json__c)[i].serviceId);
                        }
                        var servIdString = '(';
                        if (serviceId.length > 0) {
                            for (i = 0; i < serviceId.length; i++) {
                                servIdString = servIdString + "'" + serviceId[i] + "',";
                            }
                            servIdString = servIdString.slice(0, -1);
                        }
                        servIdString += ')';
                        var productSql = 'SELECT s.Id,  CONCAT(s.Id, "$", IF(ws.Duration_1__c = null, s.Duration_1__c, IF(ws.Duration_1__c > 0, ws.Duration_1__c, s.Duration_1__c)), "$", IF(ws.Duration_2__c = null, s.Duration_2__c, IF(ws.Duration_2__c > 0, ws.Duration_2__c, s.Duration_2__c)), "$", '
                            + ' IF(ws.Duration_3__c = null, s.Duration_3__c, IF(ws.Duration_3__c > 0, ws.Duration_3__c, s.Duration_3__c)),"$", IF(ws.Buffer_after__c = null, s.Buffer_after__c, IF(ws.Buffer_after__c > 0, ws.Buffer_after__c, s.Buffer_after__c))) as serviceName, IF(ws.Duration_1__c = null, s.Duration_1__c, IF(ws.Duration_1__c > 0, ws.Duration_1__c, s.Duration_1__c)) as Duration_1__c, '
                            + ' IF(ws.Duration_2__c = null, s.Duration_2__c, IF(ws.Duration_2__c > 0, ws.Duration_2__c, s.Duration_2__c)) as Duration_2__c, IF(ws.Duration_3__c = null, s.Duration_3__c, IF(ws.Duration_3__c > 0, ws.Duration_3__c, s.Duration_3__c)) as Duration_3__c, IF(ws.Buffer_after__c = null, s.Buffer_after__c, IF(ws.Buffer_after__c > 0, ws.Buffer_after__c, s.Buffer_after__c)) as Buffer_After__c, s.Name, ws.Price__c as servicePrice FROM Worker_Service__c as ws'
                            + ' JOIN Service__c as s on s.Id = ws.Service__c WHERE s.Id In ' + servIdString + ' GROUP BY s.Name';
                        execute.query(productSql, '', function (err, result) {
                            if (!err) {
                                if (result && result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        serviceresultJson.push(result[i]);
                                    }
                                }
                            }
                            done(err, serviceresultJson);
                        });
                    } else {
                        done(err, '');
                    }
                });
            }

        } catch (err) {
            logger.error('Unknown error in Favorites dao - gettypes:', err);
            return (err, { statusCode: '9999' });
        }
    },
    getFavoritesBySearch: function (req, done) {
        var searchString = req.params.searchstring
        query = 'SELECT pc.Id, pc.Name,pl.Color__c FROM Product__c as pc'
            + ' join Product_Line__c as pl on pc.Product_Line__c = pl.Id ';
        if (searchString)
            query = query + ' WHERE Product_Code__c like "%' + searchString + '%" ';
        execute.query(query, function (error, results) {
            if (error) {
                logger.error('Error in getting getFavoritesBySearch: ', error);
                done(error, results);
            } else {
                done(error, results);
            }
        });
    }
};

function updateJsonc(JSON_Cresult, resultJson) {
    for (var i = 0; i < JSON_Cresult.length; i++) {
        for (var j = 0; j < resultJson.length; j++) {
            if (JSON_Cresult[i].type === 'Service' && JSON_Cresult[i].id === resultJson[j].Id) {
                JSON_Cresult[i]['name'] = resultJson[j].Name;
                JSON_Cresult[i]['size'] = '';
                JSON_Cresult[i]['units'] = '';
                JSON_Cresult[i]['price'] = resultJson[j].Price__c;
                JSON_Cresult[i]['Duration_1__c'] = resultJson[j].Duration_1__c;
                JSON_Cresult[i]['Duration_2__c'] = resultJson[j].Duration_2__c;
                JSON_Cresult[i]['Duration_3__c'] = resultJson[j].Duration_3__c;
                JSON_Cresult[i]['Buffer_After__c'] = resultJson[j].Buffer_After__c;
                JSON_Cresult[i]['Service_Group_Color__c'] = resultJson[j].Service_Group_Color__c;
                JSON_Cresult[i]['Guest_Charge__c'] = resultJson[j].Guest_Charge__c;
                JSON_Cresult[i]['Taxable__c'] = '';
                JSON_Cresult[i]['Start_Date__c'] = '';
                JSON_Cresult[i]['End_Date__c'] = '';
                JSON_Cresult[i]['Discount_Amount__c'] = 0;
                JSON_Cresult[i]['Discount_Percentage__c'] = 0;
                JSON_Cresult[i]['Product_Discount__c'] = 0;
                JSON_Cresult[i]['Service_Discount__c'] = 0;
                JSON_Cresult[i]['Active__c'] = '';
                JSON_Cresult[i]['Product_Pic__c'] = '';
            } else if (JSON_Cresult[i].type === 'Product' && JSON_Cresult[i].id === resultJson[j].Id) {
                JSON_Cresult[i]['name'] = resultJson[j].Name;
                JSON_Cresult[i]['size'] = resultJson[j].Size__c;
                JSON_Cresult[i]['units'] = resultJson[j].Unit_of_Measure__c;
                JSON_Cresult[i]['price'] = resultJson[j].Price__c;
                JSON_Cresult[i]['Taxable__c'] = resultJson[j].Taxable__c;
                JSON_Cresult[i]['Duration_1__c'] = null;
                JSON_Cresult[i]['Duration_2__c'] = null;
                JSON_Cresult[i]['Duration_3__c'] = null;
                JSON_Cresult[i]['Buffer_After__c'] = null;
                JSON_Cresult[i]['Service_Group_Color__c'] = '';
                JSON_Cresult[i]['Start_Date__c'] = '';
                JSON_Cresult[i]['End_Date__c'] = '';
                JSON_Cresult[i]['Discount_Amount__c'] = 0;
                JSON_Cresult[i]['Discount_Percentage__c'] = 0;
                JSON_Cresult[i]['Product_Discount__c'] = 0;
                JSON_Cresult[i]['Service_Discount__c'] = 0;
                JSON_Cresult[i]['Active__c'] = '';
                JSON_Cresult[i]['Guest_Charge__c'] = '';
                JSON_Cresult[i]['Product_Pic__c'] = resultJson[j].Product_Pic__c;
            } else if (JSON_Cresult[i].type === 'Promotion' && JSON_Cresult[i].id === resultJson[j].Id) {
                JSON_Cresult[i]['name'] = resultJson[j].Name;
                JSON_Cresult[i]['size'] = '';
                JSON_Cresult[i]['units'] = '';
                JSON_Cresult[i]['price'] = '';
                JSON_Cresult[i]['Taxable__c'] = '';
                JSON_Cresult[i]['Duration_1__c'] = null;
                JSON_Cresult[i]['Duration_2__c'] = null;
                JSON_Cresult[i]['Duration_3__c'] = null;
                JSON_Cresult[i]['Buffer_After__c'] = null;
                JSON_Cresult[i]['Service_Group_Color__c'] = '';
                JSON_Cresult[i]['Start_Date__c'] = resultJson[j].Start_Date__c;
                JSON_Cresult[i]['End_Date__c'] = resultJson[j].End_Date__c;
                JSON_Cresult[i]['Discount_Amount__c'] = resultJson[j].Discount_Amount__c;
                JSON_Cresult[i]['Discount_Percentage__c'] = resultJson[j].Discount_Percentage__c;
                JSON_Cresult[i]['Product_Discount__c'] = resultJson[j].Product_Discount__c;
                JSON_Cresult[i]['Service_Discount__c'] = resultJson[j].Service_Discount__c;
                JSON_Cresult[i]['Active__c'] = resultJson[j].Active__c;
                JSON_Cresult[i]['Guest_Charge__c'] = '';
                JSON_Cresult[i]['Product_Pic__c'] = '';
            }

        }
    }
    return JSON_Cresult;
}