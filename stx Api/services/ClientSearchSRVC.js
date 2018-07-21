/**
 * Importing required modules
 */
var ClientSearchDAO = require('../dao/ClientSearchDAO');

module.exports = {
   editWorkerDetail: function(req, done) {
        ClientSearchDAO.editWorkerDetail(req, function(err, data) {
            if(data.statusCode == '2033') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data.statusCode == '2038') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data == '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getClientSearch: function(req, done) {
        ClientSearchDAO.getClientSearch(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getClientById: function(req, done) {
        ClientSearchDAO.getClientById(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    bookAppointmentBasedOnClientSearch: function(req, done) {
        ClientSearchDAO.bookAppointmentBasedOnClientSearch(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    clientSearchMembers: function(req, done) {
        ClientSearchDAO.clientSearchMembers(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    searchApptAvailability: function(req, done) {
        ClientSearchDAO.searchApptAvailability(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    quickEditClient: function(req, done) {
        ClientSearchDAO.quickEditClient(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    serviceLogNotes: function(req, done) {
        ClientSearchDAO.serviceLogNotes(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    appointmentbooking: function(req, done) {
        ClientSearchDAO.appointmentbooking(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    editClient: function(req, done) {
        ClientSearchDAO.editClient(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    clientProPIc: function(req, done) {
        ClientSearchDAO.clientProPIc(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    quickAddClient: function(req, done) {
        ClientSearchDAO.quickAddClient(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getClientRewards: function(req, done) {
        ClientSearchDAO.getClientRewards(req, function(err, data) {
            if(err) {
                  done({httpCode: 500, statusCode: '9999', result: {}});
              } else {
                  done({httpCode: 200, statusCode: '1001', result: data});
              }
        });
      },
    getClientEmail: function(req, done) {
        ClientSearchDAO.getClientEmail(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getClientMemberShips: function(req, done) {
        ClientSearchDAO.getClientMemberShips(req, function(err, data) {
            if(err) {
                  done({httpCode: 500, statusCode: '9999', result: {}});
              } else {
                  done({httpCode: 200, statusCode: '1001', result: data});
              }
        });
      },
    getProductLog: function(req, done) {
        ClientSearchDAO.getProductLog(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getClientPackages: function(req, done) {
        ClientSearchDAO.getClientPackages(req, function(err, data) {
            if(err) {
                  done({httpCode: 500, statusCode: '9999', result: {}});
              } else {
                  done({httpCode: 200, statusCode: '1001', result: data});
              }
        });
    },
    getClientAccounts: function(req, done) {
        ClientSearchDAO.getClientAccounts(req, function(err, data) {
            if(err) {
                  done({httpCode: 500, statusCode: '9999', result: {}});
              } else {
                  done({httpCode: 200, statusCode: '1001', result: data});
              }
        });
    },
    getServiceLog: function(req, done) {
        ClientSearchDAO.getServiceLog(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getClassLog: function(req, done) {
        ClientSearchDAO.getClassLog(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    deleteClient: function(req, done) {
        ClientSearchDAO.deleteClient(req, function(err, data) {
        if (data.statusCode === '2040') {
            done({ httpCode: 400, statusCode: data.statusCode, result: {} });
        }  else if(err) {
            done({httpCode: 500, statusCode: '9999', result: {}});
        } else {
            done({httpCode: 200, statusCode: '1001', result: data});
        }
      });
    },
    createClientToken: function(req, done) {
        ClientSearchDAO.createClientToken(req, function(err, data) {
        if (data.statusCode === '2040') {
            done({ httpCode: 400, statusCode: data.statusCode, result: {} });
        }  else if(err) {
            done({httpCode: 500, statusCode: '9999', result: {}});
        } else {
            done({httpCode: 200, statusCode: '1001', result: data});
        }
      });
    },
    getAllclients: function(req, done) {
        ClientSearchDAO.getAllclients(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
};


