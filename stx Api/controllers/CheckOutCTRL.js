/**
 * Importing required modules
 */
var cfg = require('config');
var CheckOutSRVC = require('../services/CheckOutSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save Client Preferences Check Outs
     */
    app.post('/api/setup/clientpreferences/CheckOut', function (req, res) {
        CheckOutSRVC.saveCheckOut(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get services From service based on workerservice
     */
    app.get('/api/CheckOut/services', function (req, res) {
        CheckOutSRVC.getCheckOutServices(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get services From service based on workerservice
     */
    app.put('/api/checkout/services/:id', function (req, res) {
        CheckOutSRVC.updateCheckOutService(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to delete services from ticket products by Id
     */
    app.delete('/api/checkout/services/:id', function (req, res) {
        CheckOutSRVC.deleteServiceById(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get services from ticket service by apptId
     */
    app.get('/api/checkout/services/:id', function (req, res) {
        CheckOutSRVC.getServicesByApptId(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get Check Outs by ticket Id
     */
    app.get('/api/CheckOut/worker/services/:serviceid', function (req, res) {
        CheckOutSRVC.getServicesByWorker(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get Check Outs list
     */
    app.get('/api/checkout/list', function (req, res) {
        CheckOutSRVC.getCheckOutList(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to add To TicketService
     */
    app.post('/api/checkout/addtoticketservices/:type', function (req, res) {
        CheckOutSRVC.addToTicket(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to add product to Ticket
     */
    app.post('/api/checkout/addtoproduct/:type', function (req, res) {
        CheckOutSRVC.addToProduct(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
   * This API is to get Check Out Products
   */
    app.get('/api/checkout/products', function (req, res) {
        CheckOutSRVC.getCheckOutProducts(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to update products from ticket products by Id
     */
    app.put('/api/checkout/products/:id', function (req, res) {
        CheckOutSRVC.updateProductsById(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to update products from ticket products by Id
     */
    app.delete('/api/checkout/products/:id', function (req, res) {
        CheckOutSRVC.deleteProductsById(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
    * This API is to get Check Out Ticket Products
    */
    app.get('/api/checkout/ticketproducts/:id', function (req, res) {
        CheckOutSRVC.getCheckOutTicketProducts(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
    * This API is to get Check Out Workers
    */
    app.get('/api/checkout/product/workers', function (req, res) {
        CheckOutSRVC.getCheckOutProductWorkers(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to add promotion to the ticketProducts and TicketServices
     */
    app.post('/api/checkout/addpromotion', function (req, res) {
        CheckOutSRVC.addpromotion(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to add client membership to Ticket
     */
    app.post('/api/checkout/clientmembership', function (req, res) {
        CheckOutSRVC.addClientMembership(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to add data to ticketothers
     */
    app.post('/api/checkout/ticketother/:type', function (req, res) {
        CheckOutSRVC.addToTicketOther(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
    * This API is to add data to ticketpayments
    */
    app.post('/api/checkout/ticketpayments', function (req, res) {
        CheckOutSRVC.addToTicketpayments(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
   * This API is to get user data for merchantDetails for payments
   */
    app.get('/api/checkout/ticketpayments/worker/merchant', function (req, res) {
        CheckOutSRVC.getMerchantWorker(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
   * This API is to get user data for merchantDetails for payments
   */
    app.get('/api/checkout/ticketpayments/:id', function (req, res) {
        CheckOutSRVC.getTicketPayments(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to add data to ticketothers
     */
    app.post('/api/checkout/ticketother', function (req, res) {
        CheckOutSRVC.addToTicketOther(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to add data to ticketothers
     */
    app.post('/api/checkout/miscsale/:type', function (req, res) {
        CheckOutSRVC.addToMiscSale(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to add data to ticketothers
     */
    app.get('/api/checkout/ticketother/:type/:id', function (req, res) {
        CheckOutSRVC.getTicketOther(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get services From service based on workerservice
     */
    app.put('/api/checkout/miscsale/:id', function (req, res) {
        CheckOutSRVC.updateMiscSale(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to delete services from ticket products by Id
     */
    app.delete('/api/checkout/miscsale/:id', function (req, res) {
        CheckOutSRVC.deleteMiscSale(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
    * This API is to get services From service based on workerservice
    */
    app.put('/api/checkout/ticketother/:id', function (req, res) {
        CheckOutSRVC.updateTicketOther(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to delete services from ticket products by Id
     */
    app.delete('/api/checkout/ticketother/:id', function (req, res) {
        CheckOutSRVC.deleteTicketOther(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to update the visitType By ApptId
     */
    app.put('/api/checkout/visittype/:id', function (req, res) {
        CheckOutSRVC.editVisitType(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to add data to cash in/out
     */
    app.post('/api/checkout/cashinout', function (req, res) {
        CheckOutSRVC.addToCashInOut(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to refund
     */
    app.post('/api/checkout/refund', function (req, res) {
        CheckOutSRVC.getRefund(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
    * This API is to cashcounting
    */
    app.get('/api/checkout/cashcounting/:date/:drawer', function (req, res) {
        CheckOutSRVC.getCashCounting(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
   * This API is to cashcounting
   */
    app.post('/api/checkout/cashcounting', function (req, res) {
        CheckOutSRVC.saveCashCounting(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
   * This API is to updateCashCounting
   */
  app.put('/api/checkout/cashcounting/:id', function (req, res) {
    CheckOutSRVC.updateCashCounting(req, function (data) {
        utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
    });
});
    /**
    * This API is to get clientmembership
    */
    app.get('/api/checkout/clientmembership', function (req, res) {
        CheckOutSRVC.getClientMembership(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to Add Client To Appt table
     */
    app.put('/api/appointments/client/add/:id', function (req, res) {
        CheckOutSRVC.addClient(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    /**
     * This API is to refund
     */
    app.get('/api/checkout/refund/:id', function (req, res) {
        CheckOutSRVC.getPaymentRefund(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to refund
     */
    app.post('/api/checkout/refund/payment', function (req, res) {
        CheckOutSRVC.saveRefundPayment(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
  * This API is to tips
  */
    app.post('/api/checkout/tips/:type', function (req, res) {
        CheckOutSRVC.saveTips(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
   * This API is to get tips
   */
    app.get('/api/checkout/tips/:id', function (req, res) {
        CheckOutSRVC.getTips(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
    * This API is to update tips
    */
    app.put('/api/checkout/tips/:id', function (req, res) {
        CheckOutSRVC.updateTips(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to delete tips
     */
    app.delete('/api/checkout/tips/:id', function (req, res) {
        CheckOutSRVC.deleteTips(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to delete ticket
     */
    app.delete('/api/checkout/ticket/:id', function (req, res) {
        CheckOutSRVC.deleteTicket(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
     /**
     * This API is to send email reciept
     */
    app.post('/api/checkout/emailreciept', function (req, res) {
        CheckOutSRVC.sendEmailReciept(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
     /**
     * This API is to gift balancing search
     */
    app.get('/api/checkout/giftbalancingsearch/:searchstring', function (req, res) {
        CheckOutSRVC.giftBalancingSearch(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
