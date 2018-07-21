/**
 * Importing required modules
 */
var logger = require('../lib/logger');
var config = require('config');
var uniqid = require('uniqid');
var mysql = require('mysql');
var execute = require('../db_connection/db');
var moment = require('moment');
var dateFns = require('./../common/dateFunctions');

module.exports = {

    getproductsBySKU: function (req, done) {
        try {
            var sqlQuery = 'SELECT p.* , p.Price__c as price FROM `Product__c` as p WHERE p.Product_Code__c like "%' + req.params.sku + '%"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Inventory dao - getinventoryData:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in inventory dao - getinventoryData:', err);
            return (err, { statusCode: '9999' });
        }
    },

    getProductsList: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM `Product__c` WHERE `Product_Code__c`';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Inventory dao - getinventoryData:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in inventory dao - getinventoryData:', err);
            return (err, { statusCode: '9999' });
        }
    },

    saveInventoryUsageData: function (req, done) {
        try {
            var curDate = new Date();
            var records = [];
            var queries = '';
            var InventoryUsageData = req.body;
            for (var i = 0; i < InventoryUsageData.length; i++) {
                if (InventoryUsageData[i].userId === null || InventoryUsageData[i].userId === undefined || InventoryUsageData[i].userId === 'undefined') {
                    InventoryUsageData[i]['Used_By_c'] = 'Comapany';
                    InventoryUsageData[i]['userId'] = null;
                } else {
                    InventoryUsageData[i]['Used_By_c'] = 'Worker'
                }
                records.push([uniqid(), uniqid(),
                config.booleanFalse,
                InventoryUsageData[i]['Name'],
                dateFns.getUTCDatTmStr(new Date()), uniqid(),
                dateFns.getUTCDatTmStr(new Date()), uniqid(),
                dateFns.getUTCDatTmStr(new Date()),
                InventoryUsageData[i]['Id'],
                InventoryUsageData[i]['Quantity_On_Hand__c'],
                InventoryUsageData[i]['userId'],
                InventoryUsageData[i]['Used_By_c']
                ]);
                queries += mysql.format('update Product__c set Quantity_On_Hand__c = Quantity_On_Hand__c-"' + parseInt(InventoryUsageData[i]['Quantity_On_Hand__c']) + '" where Id= "' + InventoryUsageData[i]['Id'] + '";');
            }
            var insertQuery = 'INSERT INTO ' + config.dbTables.inventoryUsageTBL
                + ' (Id, OwnerId, IsDeleted, Name, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                + ' SystemModstamp, Product_c, Qty_c, Used_By_Worker_c, Used_By_c) VALUES ?';
            execute.query(insertQuery, [records], function (err, result) {
                if (err) {
                    logger.error('Error in WorkerServices dao - updateWorkerService:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    execute.query(queries, '', function (err, result) {
                        if (err) {
                            logger.error('Error in WorkerServices dao - updateWorkerService:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, result);
                        }
                    });
                }
            });
        } catch (err) {
            logger.error('Unknown error in Inventory dao - :', err);
            return (err, { statusCode: '9999' });
        }
    },
    getPurchaseOrdersData: function (req, done) {
        try {
            var sqlQuery = 'SELECT s.Name as supplierName, p.* FROM Purchase_Order__c p join Supplier__c s on p.Supplier__c = s.Id';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Inventory dao - :', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in inventory dao - :', err);
            return (err, { statusCode: '9999' });
        }
    },
    editPurchaseData: function (req, done) {
        var purchaseOrderData = req.body;
        try {
            var records1 = [];
            var queries = '';
            if (req.body.receivedBy) {
                var status = 'Closed';
            } else {
                var status = 'Open';
            }
            var sqlQuery = 'UPDATE ' + config.dbTables.purchaseOrdersTBL
                + ' SET Received_By__c = "' + req.body.receivedBy
            if (req.body.receivedDate !== '' && req.body.receivedDate !== null) {
                sqlQuery += '", Received_Date__c = "' + req.body.receivedDate
            }
            sqlQuery += '", Note__c = "' + req.body.notes
                + '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                + '", Total_Cost__c = "' + req.body.totalActualOrderCost
                + '", Estimated_Cost__c = "' + req.body.totalEstimatedOrderCost
                + '", Status__c = "' + status
                + '" WHERE Id = "' + req.params.id + '" ';
            for (var i = 0; i < req.body.purchaseOrderDetailData.length; i++) {
                if (req.body.purchaseOrderDetailData[i].action) {
                    records1.push([uniqid(),
                    config.booleanFalse,
                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                    dateFns.getUTCDatTmStr(new Date()),
                    req.params.id,
                    purchaseOrderData.purchaseOrderDetailData[i]['Standard_Cost__c'],
                    purchaseOrderData.purchaseOrderDetailData[i]['Quantity_On_Hand__c'],
                    purchaseOrderData.purchaseOrderDetailData[i]['orderQty'],
                        null,
                    purchaseOrderData.purchaseOrderDetailData[i]['Id'],
                    purchaseOrderData.purchaseOrderDetailData[i]['Received_Quantity__c']
                    ]);
                } else {
                    queries += mysql.format('UPDATE ' + config.dbTables.purchaseOrderDetailsTBL
                        + ' SET Order_Quantity__c = "' + req.body.purchaseOrderDetailData[i].orderQty
                        + '", Cost_Each__c = "' + req.body.purchaseOrderDetailData[i].Standard_Cost__c
                        + '", Received_Quantity__c = "' + req.body.purchaseOrderDetailData[i].Received_Quantity__c
                        + '" WHERE Id = "' + req.body.purchaseOrderDetailData[i].prdId + '";');
                }
                queries += mysql.format('update Product__c set Quantity_On_Hand__c = Quantity_On_Hand__c+"' + parseInt(purchaseOrderData.purchaseOrderDetailData[i]['Received_Quantity__c']) + '" where Id= "' + purchaseOrderData.purchaseOrderDetailData[i]['Id'] + '";');
            }
            var insertQuery2 = 'INSERT INTO ' + config.dbTables.purchaseOrderDetailsTBL
                + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                + ' SystemModstamp, Purchase_Order__c, Cost_Each__c, On_Hand_Quantity__c, Order_Quantity__c,'
                + 'Other_PO_Alert__c, Product__c, Received_Quantity__c) VALUES ?';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Inventory dao - :', err);
                    done(err, { statusCode: '9999' });
                } else if (queries.length > 0) {
                    execute.query(queries, '', function (err, result) {
                        if (err) {
                            logger.error('Error in Inventory dao - :', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            if (records1.length > 0) {
                                execute.query(insertQuery2, [records1], function (err, result) {
                                    if (err) {
                                        logger.error('Error in Inventory dao - :', err);
                                        done(err, { statusCode: '9999' });
                                    } else {
                                        done(err, result);
                                    }
                                });
                            } else {
                                done(err, result);
                            }
                        }
                    });
                }
            });
        } catch (err) {
            logger.error('Unknown error in inventory dao - :', err);
            return (err, { statusCode: '9999' });
        }
    },
    getsuppliers: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM Supplier__c where isDeleted=0';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Inventory dao - :', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in inventory dao - :', err);
            return (err, { statusCode: '9999' });
        }
    },
    getProductsBySuppliers: function (req, done) {
        try {
            var sqlQuery = 'SELECT p.Id,p.Name, p.Product_Code__c, CONCAT(p.Size__c," ",p.Unit_of_Measure__c) as Size__c, p.Quantity_On_Hand__c, (p.Minimum_Quantity__c-p.Quantity_On_Hand__c) as orderQty,p.Standard_Cost__c FROM Product__c as p '
                + ' left join ProductSupplier__c as ps on ps.Product__c = p.Id where ps.Supplier__c = "' + req.params.supplierid + '" and (p.Minimum_Quantity__c-p.Quantity_On_Hand__c) > 0 and  p.Product_Code__c like "%' + req.params.sku + '%"  and ps.IsDeleted = 0 and p.IsDeleted = 0'
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Inventory dao - :', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in inventory dao - :', err);
            return (err, { statusCode: '9999' });
        }
    },
    checkIfSupplierAndOrderDateisExist: function (req, done) {
        // var orderDate = req.params.orderdate;
        var orderDate = moment(req.params.orderdate).format('YYYY-MM-DD');
        try {
            var sqlQuery = 'SELECT * FROM `Purchase_Order__c` WHERE Supplier__c = "' + req.params.supplierid + '" AND Order_Date__c = "' + orderDate + '" and isDeleted =0';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Inventory dao - :', err);
                    done(err, { statusCode: '9999' });
                } else if (result && result.length > 0) {
                    done(err, { statusCode: '2033' });
                } else {
                    var prodSql = 'SELECT DISTINCT p.Name, p.Product_Code__c, (p.Minimum_Quantity__c-p.Quantity_On_Hand__c) as orderQty, p.Id,p.Quantity_On_Hand__c,p.Standard_Cost__c,CONCAT(p.Size__c," ",p.Unit_of_Measure__c) as Size__c,p.Quantity_On_Hand__c '
                        + ' FROM Product__c as p LEFT JOIN ProductSupplier__c as ps on ps.Product__c = p.Id WHERE ps.Supplier__c="' + req.params.supplierid + '" '
                        + 'and (p.Minimum_Quantity__c-p.Quantity_On_Hand__c) > 0';
                    execute.query(prodSql, '', function (err, result) {
                        if (err) {
                            logger.error('Error in Inventory dao - :', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, result);
                        }
                    });

                }
            });
        } catch (err) {
            logger.error('Unknown error in inventory dao - :', err);
            return (err, { statusCode: '9999' });
        }
    },
    savePurchaseOrdersData: function (req, done) {
        try {
            var curDate = new Date();
            var records1 = [];
            var purchaseOrderData = req.body;
            var purchaseOrderObjData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                Note__c: purchaseOrderData.notes,
                Status__c: 'Open',
                Estimated_Cost__c: purchaseOrderData.totalEstimatedOrderCost,
                Order_Date__c: purchaseOrderData.orderDate,
                Supplier__c: purchaseOrderData.supplierId
            };
            for (var i = 0; i < purchaseOrderData.purchaseOrderDetailData.length; i++) {
                records1.push([uniqid(),
                config.booleanFalse,
                dateFns.getUTCDatTmStr(new Date()), uniqid(),
                dateFns.getUTCDatTmStr(new Date()), uniqid(),
                dateFns.getUTCDatTmStr(new Date()),
                purchaseOrderObjData.Id,
                purchaseOrderData.purchaseOrderDetailData[i]['Standard_Cost__c'],
                purchaseOrderData.purchaseOrderDetailData[i]['Quantity_On_Hand__c'],
                purchaseOrderData.purchaseOrderDetailData[i]['orderQty'],
                    null,
                purchaseOrderData.purchaseOrderDetailData[i]['Id'],
                purchaseOrderData.purchaseOrderDetailData[i]['Recieved_Quantity']
                ]);
            }
            var insertQuery2 = 'INSERT INTO ' + config.dbTables.purchaseOrderDetailsTBL
                + ' (Id, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                + ' SystemModstamp, Purchase_Order__c, Cost_Each__c, On_Hand_Quantity__c, Order_Quantity__c,'
                + 'Other_PO_Alert__c, Product__c, Received_Quantity__c) VALUES ?';
            var insertQuery = 'INSERT INTO ' + config.dbTables.purchaseOrdersTBL + ' SET ?';
            execute.query(insertQuery, purchaseOrderObjData, function (err1, result1) {
                if (err1) {
                    logger.error('Error in WorkerServices dao - updateWorkerService:', err1);
                    done(err1, { statusCode: '9999' });
                } else {
                    execute.query(insertQuery2, [records1], function (err2, result2) {
                        if (err2) {
                            logger.error('Error in WorkerServices dao - updateWorkerService:', err2);
                            done(err2, { statusCode: '9999' });
                        } else {
                            done(err2, result2);
                        }
                    });
                }
            });

        } catch (err1) {
            logger.error('Unknown error in Inventory dao - :', err1);
            return (err1, { statusCode: '9999' });
        }
    },
    PurchaseOrdersDataBySupplierId: function (req, done) {
        try {
            var sqlQuery1 = 'SELECT pr.Id as prdId, po.Id, po.Note__c, po.Order_Date__c, po.Received_By__c,po.Received_Date__c,po.Supplier__c,po.Total_Cost__c, '
                + ' po.Estimated_Cost__c ,pr.Id as prdId, pr.Cost_Each__c as Standard_Cost__c,pr.On_Hand_Quantity__c as Quantity_On_Hand__c, pr.Order_Quantity__c as orderQty, pr.Product__c,pr.Received_Quantity__c, '
                + ' IFNULL(IF( pr.Received_Quantity__c = 0, pr.Order_Quantity__c * pr.Cost_Each__c, pr.Received_Quantity__c * pr.Cost_Each__c ), pr.Order_Quantity__c * pr.Cost_Each__c) as Order_Cost__c, '
                + ' p.Name, p.Product_Code__c,CONCAT(p.Size__c," ",p.Unit_of_Measure__c) as Size__c FROM Purchase_Order__c po '
                + ' JOIN Purchase_Order_Detail__c pr on po.Id = pr.Purchase_Order__c '
                + ' JOIN Product__c p on p.Id =  pr.Product__c '
                + ' WHERE po.Supplier__c="' + req.params.supplierid + '" and po.Order_Date__c="' + req.params.date + '"'
            // var sqlQuery = 'SELECT p.* from Purchase_Order__c p where p.Id ="' + req.params.supplierid + '" ';
            var sqlQuery = 'SELECT p.*,p.Product_Code__c,pr.Id as prdId, pr.Received_Quantity__c, p.Name, pr.On_Hand_Quantity__c as Quantity_On_Hand__c, pr.Cost_Each__c as Standard_Cost__c, CONCAT(p.Size__c," ",p.Unit_of_Measure__c) as Size__c, IFNULL(IF( pr.Received_Quantity__c = 0, pr.Order_Quantity__c * pr.Cost_Each__c, pr.Received_Quantity__c * pr.Cost_Each__c ), pr.Order_Quantity__c * pr.Cost_Each__c) as Order_Cost__c,  pr.Order_Quantity__c as orderQty FROM `Purchase_Order__c` po LEFT JOIN Purchase_Order_Detail__c pr on po.Id=pr.Purchase_Order__c LEFT JOIN Product__c p on p.Id=pr.Product__c WHERE po.Id=\'' + req.params.id + '\''
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in Inventory dao - :', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in inventory dao - :', err);
            return (err, { statusCode: '9999' });
        }
    },
    searchProducts: function (req, done) {
        try {
            var sqlQry = 'SELECT  * FROM Product__c';
            var tempWr = [];
            if (req.body.inActive == false) {
                tempWr.push('Active__c=1');
            }
            if (req.body.viewOption === 'Retail only') {
                tempWr.push('Taxable__c = 1');
            } else if (req.body.viewOption === 'Professional only') {
                tempWr.push('Professional__c = 1');
            }
            if (req.body.productLine !== 'All') {
                tempWr.push('Product_Line__c = ' + '"' + req.body.productLine + '"');
            }
            if (req.body.inventoryGroup !== 'All') {
                tempWr.push('Inventory_Group__c = ' + '"' + req.body.inventoryGroup + '"');
            }
            for (var i = 0; i < tempWr.length; i++) {
                if (i == 0) {
                    sqlQry += ' WHERE'
                }
                if (i == tempWr.length - 1) {
                    sqlQry += ' ' + tempWr[i];
                } else {
                    sqlQry += ' ' + tempWr[i] + ' AND';
                }
            }
            if (req.body.sortOption === 'Alphabetically') {
                sqlQry = sqlQry + ' ORDER BY Name ASC';
            } else if (req.body.sortOption === 'SKU') {
                sqlQry = sqlQry + ' ORDER BY Product_Code__c ASC';
            }
            execute.query(sqlQry, '', function (err, result) {
                if (err) {
                    logger.error('Error in Inventory dao - :', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in inventory dao - :', err);
            return (err, { statusCode: '9999' });
        }
    },
    updateProducts: function (req, done) {
        try {
            var productsObj = req.body;
            var queries = '';
            for (var i = 0; i < productsObj.length; i++) {
                queries += mysql.format('UPDATE ' + config.dbTables.setupProductTBL
                    + ' SET Product_Code__c = "' + productsObj[i].Product_Code__c
                    + '", Name = "' + productsObj[i].Name
                    + '", Size__c = "' + productsObj[i].Size__c
                    + '", Unit_of_Measure__c = "' + productsObj[i].Unit_of_Measure__c
                    + '", Quantity_On_Hand__c = "' + productsObj[i].Quantity_On_Hand__c
                    + '", Minimum_Quantity__c = "' + productsObj[i].Minimum_Quantity__c
                    + '", Supplier_Minimum__c = "' + productsObj[i].Supplier_Minimum__c
                    + '", Standard_Cost__c = "' + productsObj[i].Standard_Cost__c
                    + '", Price__c = "' + productsObj[i].Price__c
                    + '" WHERE Id = "' + productsObj[i].Id + '";');
            }
            if (queries.length > 0) {
                execute.query(queries, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Product_Code__c') > 0) {
                            done(err, { statusCode: '2043' });
                        } else {
                            logger.error('Error in SetupSuppliersDAO - saveSetupSuppliers:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }
                });
            } else {
                done(null, []);
            }
        } catch (err) {
            logger.error('Unknown error in inventory dao - updateProducts:', err);
            return (err, { statusCode: '9999' });
        }
    },
};