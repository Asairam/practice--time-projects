/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var moment = require('moment');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');

module.exports = {
    /**
     * This function is to saves WorkerGoals into db
     */
    // saveWorkerGoals: function (req, done) {
    //     var date = new Date();
    //     var workerGoalsObj = req.body.goals;
    //     var records = [];
    //     var i = 0;
    //     var datesdata = 0;
    //     var goalsSQLQuery = 'INSERT INTO ' + config.dbTables.workerGoalsTBL
    //         + ' (Id, OwnerId, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
    //         + ' SystemModstamp,End_Date__c, Goal_Target__c, Goal__c,Start_Date__c,Worker__c) VALUES ?';
    //     for (var j = 0; j < workerGoalsObj.length; j++) {
    //         if (workerGoalsObj[j].startDate > workerGoalsObj[j].endDate) {
    //             datesdata++;
    //         }
    //     }
    //     if (datesdata > 0) {
    //         done(null, { statusCode: '2070' });
    //     } else {
    //         for (var j = 0; j < workerGoalsObj.length; j++) {
    //             if (workerGoalsObj[j].delete) {
    //                 var sqlQuery = 'UPDATE ' + config.dbTables.workerGoalsTBL
    //                     + ' SET IsDeleted = 1'
    //                     + ' WHERE Id = "' + workerGoalsObj[j].Id + '"';
    //                 execute.query(sqlQuery, function (err, result) {
    //                     if (err) {
    //                         logger.error('Error in WorkerGoalsDAO - deleteWorkerGoal:', err);
    //                         done(err, { statusCode: '9999' });
    //                     } else {
    //                         done(err, { statusCode: '2041' });
    //                     }
    //                 });
    //             } else if (workerGoalsObj[j].workerGoalId) {
    //                 var sqlQuery = 'UPDATE ' + config.dbTables.workerGoalsTBL
    //                     + ' SET Start_Date__c = "' + workerGoalsObj[j].startDate
    //                     + '", End_Date__c = "' + workerGoalsObj[j].endDate
    //                     + '", Goal_Target__c = "' + workerGoalsObj[j].target
    //                     + '" WHERE Id = "' + workerGoalsObj[j].workerGoalId + '"';
    //                 execute.query(sqlQuery, function (err, result) {
    //                     if (err) {
    //                         logger.error('Error in PaymentTypes dao - edit PaymentTypes:', err);
    //                         done(err, { statusCode: '9999' });
    //                     }
    //                 });

    //             } else {
    //                 var i = 0;
    //                 records[i] = [uniqid(), uniqid(), 0, date, uniqid(), date,
    //                 uniqid(), date, workerGoalsObj[j].endDate,
    //                 workerGoalsObj[j].goalTarget, workerGoalsObj[j].goalsId,
    //                 workerGoalsObj[j].startDate, req.body.workerId];
    //                 i++;
    //                 if (records.length > 0) {
    //                     execute.query(goalsSQLQuery, [records], function (err1, result1) {
    //                         if (err1) {
    //                             logger.error('Error1 in WorkerGoals dao - saveWorkerGoals:', err1);
    //                             done(err1, { statusCode: '9999' });
    //                         } else {
    //                             done(err1, result1);
    //                         }
    //                     });
    //                 } else {
    //                     done(err, result);
    //                 }

    //             }
    //         }
    //     }
    // },
    /**
     * This function lists the WorkerGoals
     */
    getWorkerGoals: function (req, done) {
        try {
            var type = req.params.type;
            var now = new Date();
            var newDate = moment(now).format('YYYY-MM-DD');
            var sqlQuery = "SELECT wg.Id as workerGoalId, wg.End_Date__c as endDate, wg.Start_Date__c as startDate ,wg.Goal_Target__c as target, g.* FROM Worker_Goal__c as wg INNER JOIN Goal__c as g ON wg.Goal__c = g.Id And g.isDeleted = 0 And wg.isDeleted = 0 And wg.Worker__c= '" + req.params.id + "'";
            if (type === 'true') {
                sqlQuery = sqlQuery + " And '" + newDate + "' >= End_Date__c <= '" + newDate + "' order by wg.Start_Date__c desc"
            } else {
                sqlQuery = sqlQuery + " AND End_Date__c >= '" + newDate + "' order by wg.Start_Date__c desc"
            }
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in WorkerGoals dao - getWorkerGoals:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in WorkerGoals dao - getWorkerGoals:', err);
            return (err, { statusCode: '9999' });
        }
    },
    updtaeCalculateGoal: function (req, done) {
        var calculateVariables = [];
        var calculateGoalResult = 0;
        steps = req.body.Steps__c;
        var startDate = moment(req.body.startDate).format('YYYY-MM-DD HH:MM:SS');
        var endDate = moment(req.body.endDate).format('YYYY-MM-DD HH:MM:SS');
        var goalTarget = req.body.target;
        var sqlQuery = "SELECT SUM(ts.Net_Price__c) as serviceAmount, count(ts.Id) numberOfServices from Ticket_Service__c as ts, Appt_Ticket__c as at"
            + " where ts.Worker__c ='" + req.params.id + "'"
            + " AND at.isTicket__c = 1"
            + " and ts.Is_Booked_Out__c = 0 and ts.Is_Class__c = 0 AND "
            + " ts.Service_Date_Time__c >='" + startDate + "'"
            + " and ts.Do_Not_Deduct_From_Worker__c = 0 "
            + " and ts.Service_Date_Time__c <='" + endDate + "'";
        execute.query(sqlQuery, function (err, result) {
            if (err) {
                logger.error('Error in WorkerGoalsDAO - updtaeCalculateGoal:', err);
                done(err, { statusCode: '9999' });
            } else {
                calculateVariables['Gross Service'] = result[0].serviceAmount;
                calculateVariables['Services Performed'] = result[0].numberOfServices;
            }
            var productsqlQuery = "SELECT SUM(tp.Net_Price__c) as productAmount, count(tp.Qty_Sold__c) numberOfProducts from Ticket_Product__c as tp, Appt_Ticket__c as at"
                + " where tp.Worker__c ='" + req.params.id + "'"
                + " AND at.isTicket__c = 1"
                + " and at.Appt_Date_Time__c >='" + startDate + "'"
                + " and tp.Do_Not_Deduct_From_Worker__c = 0 "
                + " and at.Appt_Date_Time__c <='" + endDate + "'";
            execute.query(productsqlQuery, function (err, result) {
                if (err) {
                    logger.error('Error in WorkerGoalsDAO - updtaeCalculateGoal:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    calculateVariables['Gross Retail'] = result[0].productAmount;
                    calculateVariables['Products Sold'] = result[0].numberOfProducts;
                }
                var TicketCountsqlQuery = "SELECT count(at.Id) ticketCount from Appt_Ticket__c as at"
                    + " where at.isTicket__c = 1"
                    + " and at.isRefund__c = 0 "
                    + " and at.Is_Booked_Out__c = 0 and at.Is_Class__c = 0"
                    + " and at.Appt_Date_Time__c >='" + startDate + "'"
                    + " and at.Appt_Date_Time__c <='" + endDate + "'"
                    + " and at.Id in ( select Appt_Ticket__c from Ticket_Service__c "
                    + " where Worker__c = '" + req.params.id + "' )";
                execute.query(TicketCountsqlQuery, function (err, result) {
                    if (err) {
                        logger.error('Error in WorkerGoalsDAO - updtaeCalculateGoal:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        calculateVariables['Tickets'] = result[0].ticketCount;
                    }
                    var RebookedCountsqlQuery = "SELECT Count(at.Rebooked_Rollup_Max__c ) rebookCount from Appt_Ticket__c as at"
                        + " where at.isRefund__c = 0 "
                        + " and at.Is_Booked_Out__c = 0 and at.Is_Class__c = 0"
                        + " and at.CreatedDate >='" + startDate + "'"
                        + " and at.CreatedDate <='" + endDate + "'"
                        + " and at.Id in ( select Appt_Ticket__c from Ticket_Service__c "
                        + " where Worker__c = '" + req.params.id + "' and Rebooked__c = 1 )";
                    execute.query(RebookedCountsqlQuery, function (err, result) {
                        if (err) {
                            logger.error('Error in WorkerGoalsDAO - updtaeCalculateGoal:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            calculateVariables['Rebooked Appointments'] = result[0].rebookCount;
                            steps = calculateGoal(steps, calculateVariables);
                            // var stepData = JSON.parse(steps);
                            calculatedGoal = steps[steps.length - 1].result;
                            if (goalTarget > 0)
                                var percentOfGoal = Math.round((calculatedGoal / goalTarget)*100);
                            else
                                var percentOfGoal = 0;
                            done(err, { calculatedGoal, percentOfGoal });
                        }
                    });
                });
            });
        });
    },
};
/*
	 *	This calculate method takes a list of Goal steps and a map of calulation variables
	 *	and calculates a result for each step in the list
	 */
function calculateGoal(steps, calculateVariables) {
    var accumulator = 0;
    var stepIndex = 0;
    steps = JSON.parse(steps);
    for (var i = 0; i < steps.length; i++) {
        var operandValue = getOperandValue(stepIndex, steps[i].operand, steps[i].numeral, steps, calculateVariables);
        if (steps[i].operator === 'Start With') {
            steps[i].result = operandValue;
        } else if (steps[i].operator === 'Add')
            steps[i].result = accumulator + operandValue;
        else if (steps[i].operator === 'Subtract')
            steps[i].result = accumulator - operandValue;
        else if (steps[i].operator === 'Multiply By')
            steps[i].result = accumulator * operandValue;
        else if (steps[i].operator === 'Divide By') {
            if (operandValue == 0)	// check for division by zero
                steps[i].result = 0;
            else
                steps[i].result = accumulator / operandValue;
        } else if (steps[i].operator === 'If Less Than')
            steps[i].result = (accumulator <= operandValue ? accumulator : operandValue);
        else if (steps[i].operator === 'If More Than')
            steps[i].result = (accumulator >= operandValue ? accumulator : operandValue);
        accumulator = steps[i].result;
        stepIndex++;

    }
    return steps;

}
/*
 *	This method determines an operand's value given the operand, the Goal steps, and the variable map
 */
function getOperandValue(stepIndex, operand, numeralOnStep, steps,
    calculateVariables) {
    var operandValue = 0;
    //	make sure numeralOnStep is defined
    if (numeralOnStep == null)
        numeralOnStep = 0;

    if (operand === 'Result of Step') {
        if (numeralOnStep > 0 && (steps[numeralOnStep - 1] != undefined))
            operandValue = steps[numeralOnStep - 1].result;
            else
            operandValue = 0;
    } else if (operand === 'Percent')
        operandValue = numeralOnStep / 100;
    else if (operand === 'Numeral')
        operandValue = numeralOnStep;
    else // operand is an aggregated value, retrieve from variableMap
        operandValue = calculateVariables[steps[0].operand];

    //	null check the return value
    if (operandValue == null)
        operandValue = 0;
    return operandValue;
}