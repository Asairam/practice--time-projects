/**
 * Importing required modules
 */
var CheckOutDAO = require('../dao/CheckOutDAO');

module.exports = {
    /**
     * Dao call to save Check Outs 
     */
    getCheckOutServices: function (req, done) {
        CheckOutDAO.getCheckOutServices(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
    * Dao call to update Check Outs 
    */
    updateCheckOutService: function (req, done) {
        CheckOutDAO.updateCheckOutService(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to delete Check Outs  
     */
    deleteServiceById: function (req, done) {
        CheckOutDAO.deleteServiceById(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
  * Dao call to save Check Outs
  */
    getServicesByApptId: function (req, done) {
        CheckOutDAO.getServicesByApptId(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
    * Dao call to get Services By Worker
    */
    getServicesByWorker: function (req, done) {
        CheckOutDAO.getServicesByWorker(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
    * Dao call to get favouritesForCheckOut
    */
    addToTicket: function (req, done) {
        CheckOutDAO.addToTicket(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
    * Dao call to get favouritesForCheckOut
    */
    addToProduct: function (req, done) {
        CheckOutDAO.addToProduct(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to get Check Outs
     */
    getCheckOutList: function (req, done) {
        CheckOutDAO.getCheckOutList(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to list Check Outs
     */
    getCheckOut: function (req, done) {
        CheckOutDAO.getCheckOut(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
   * Dao call to get products in Check Outs Ticket 
   */
    getCheckOutProducts: function (req, done) {
        CheckOutDAO.getCheckOutProducts(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
   * Dao call to get products in Check Outs Ticket Products
   */
    getCheckOutTicketProducts: function (req, done) {
        CheckOutDAO.getCheckOutTicketProducts(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
 * Dao call to update Check Outs 
 */
    updateProductsById: function (req, done) {
        CheckOutDAO.updateProductsById(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
 * Dao call to delete Check Outs 
 */
    deleteProductsById: function (req, done) {
        CheckOutDAO.deleteProductsById(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
   * Dao call to get workers in Check Outs
   */
    getCheckOutProductWorkers: function (req, done) {
        CheckOutDAO.getCheckOutProductWorkers(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
   * Dao call to addPromotion 
   */
    addpromotion: function (req, done) {
        CheckOutDAO.addpromotion(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
   * Dao call to addClientMembership 
   */
    addClientMembership: function (req, done) {
        CheckOutDAO.addClientMembership(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
      * Dao call to addToTicketOther 
      */
    addToTicketOther: function (req, done) {
        CheckOutDAO.addToTicketOther(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    addToTicketpayments: function (req, done) {
        CheckOutDAO.addToTicketpayments(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    getMerchantWorker: function (req, done) {
        CheckOutDAO.getMerchantWorker(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    getTicketPayments: function (req, done) {
        CheckOutDAO.getTicketPayments(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
   * Dao call to addToTicketOther 
   */
    // addToTicketOther: function (req, done) {
    //     CheckOutDAO.addToTicketOther(req, function (err, data) {
    //         if (data.statusCode === '2050') {
    //             done({ httpCode: 400, statusCode: data.statusCode, result: {} });
    //         } else if (data.statusCode === '2051') {
    //             done({ httpCode: 400, statusCode: data.statusCode, result: {} });
    //         } else if (err) {
    //             done({ httpCode: 500, statusCode: '9999', result: {} });
    //         } else {
    //             done({ httpCode: 200, statusCode: '1001', result: data });
    //         }
    //     });
    // },
    /**
       * Dao call to addToMiscSale 
       */
    addToMiscSale: function (req, done) {
        CheckOutDAO.addToMiscSale(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
      * Dao call to getgetTicketOther 
      */
    getTicketOther: function (req, done) {
        CheckOutDAO.getTicketOther(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to update MiscSale 
     */
    updateMiscSale: function (req, done) {
        CheckOutDAO.updateMiscSale(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
    * Dao call to delete MiscSale 
    */
    deleteMiscSale: function (req, done) {
        CheckOutDAO.deleteMiscSale(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to update MiscSale 
     */
    updateTicketOther: function (req, done) {
        CheckOutDAO.updateTicketOther(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
    * Dao call to delete MiscSale 
    */
    deleteTicketOther: function (req, done) {
        CheckOutDAO.deleteTicketOther(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
    * Dao call to edit VisitType 
    */
    editVisitType: function (req, done) {
        CheckOutDAO.editVisitType(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
       * Dao call to addToCashInOut 
       */
    addToCashInOut: function (req, done) {
        CheckOutDAO.addToCashInOut(req, function (err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
       * Dao call to getRefund 
       */
    getRefund: function (req, done) {
        CheckOutDAO.getRefund(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
       * Dao call to getClientMembership 
       */
    getClientMembership: function (req, done) {
        CheckOutDAO.getClientMembership(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
       * Dao call to addClient 
       */
    addClient: function (req, done) {
        CheckOutDAO.addClient(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
   * Dao call to getPaymentRefund 
   */
    getPaymentRefund: function (req, done) {
        CheckOutDAO.getPaymentRefund(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
       * Dao call to getCashCounting 
       */
      getCashCounting: function (req, done) {
        CheckOutDAO.getCashCounting(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
     /**
       * Dao call to saveCashCounting 
       */
      saveCashCounting: function (req, done) {
        CheckOutDAO.saveCashCounting(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
       * Dao call to updateCashCounting 
       */
      updateCashCounting: function (req, done) {
        CheckOutDAO.updateCashCounting(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
       * Dao call to saveRefundPayment 
       */
      saveRefundPayment: function (req, done) {
        CheckOutDAO.saveRefundPayment(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
       * Dao call to saveTips 
       */
      saveTips: function (req, done) {
        CheckOutDAO.saveTips(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
       * Dao call to getTips 
       */
      getTips: function (req, done) {
        CheckOutDAO.getTips(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
       * Dao call to updateTips 
       */
      updateTips: function (req, done) {
        CheckOutDAO.updateTips(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
    * Dao call to delete deleteTips 
    */
   deleteTips: function (req, done) {
    CheckOutDAO.deleteTips(req, function (err, data) {
        if (err) {
            done({ httpCode: 500, statusCode: '9999', result: {} });
        } else {
            done({ httpCode: 200, statusCode: '1001', result: data });
        }
    });
},
 /**
    * Dao call to delete deleteTicket 
    */
   deleteTicket: function (req, done) {
    CheckOutDAO.deleteTicket(req, function (err, data) {
        if (err) {
            done({ httpCode: 500, statusCode: '9999', result: {} });
        } else {
            done({ httpCode: 200, statusCode: '1001', result: data });
        }
    });
},
/**
    * Dao call to sendEmailReciept 
    */
sendEmailReciept:  function (req, done) {
    CheckOutDAO.sendEmailReciept(req, function (err, data) {
        if (err) {
            done({ httpCode: 500, statusCode: '9999', result: {} });
        } else {
            done({ httpCode: 200, statusCode: '1001', result: data });
        }
    });
},
/**
* Dao call to sendEmailReciept 
*/
giftBalancingSearch:  function (req, done) {
CheckOutDAO.giftBalancingSearch(req, function (err, data) {
    if (err) {
        done({ httpCode: 500, statusCode: '9999', result: {} });
    } else {
        done({ httpCode: 200, statusCode: '1001', result: data });
    }
});
},
};
