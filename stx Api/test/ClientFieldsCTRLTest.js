
var app = require('../app');
var config = require('config');
// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
//var unitTest = require('../config/unitTest');

describe('Clientfields CTRL Testing', () => {
    describe('/Create clientfields', () => {
        // Here we passing valid data
        it('Create clientfields - Positive', function(done){
            this.timeout(10000);
            setTimeout(done, 5000);
            let clientfieldsObj = {"quickAddRequiredFields": 
                { "allowQuickAdd": true,
                  "primaryPhone": true,
                  "mobilePhone": false,
                  "birthDate": false,
                  "mailingAddress": false,
                  "primaryEmail": false,
                  "secondaryEmail": false,
                  "gender": false },
               "clientCardRequiredFields": 
                { "primaryPhone": false,
                  "mobilePhone": false,
                  "birthDate": false,
                  "mailingAddress": false,
                  "primaryEmail": false,
                  "secondaryEmail": true,
                  "gender": false },
               "onlineBookingRequiredFields": { "newRegistrationsRequireApproval": true, "mobilePhone": true }
                };
            chai.request(app).post('/preferences/clientfields').send(clientfieldsObj).end((err, res) => {
                if(res.body.status == '1011') {
                    console.log(' ============ ', res.body.message);
                } else{
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Create clientfields - Positive', function(done){
            this.timeout(10000);
            setTimeout(done, 5000);
            let clientfieldsObj = {"quickAddRequiredFields": 
            { "sdvsdv": true,
              "primaryPhone": true,
              "mobilePhone": false,
              "birthDate": false,
              "mailingAddress": false,
              "primaryEmail": false,
              "secondaryEmail": false,
              "gender": false },
           "sdf": 
            { "primaryPhone": false,
              "mobilePhone": false,
              "birthDate": false,
              "mailingAddress": false,
              "primaryEmail": false,
              "secondaryEmail": true,
              "gender": false },
           "onlineBookingRequiredFields": { "newRegistrationsRequireApproval": true, "mobilePhone": true }
            };
            chai.request(app).post('/preferences/clientfields').send(clientfieldsObj).end((err, res) => {
                if(res.body.status == '1011') {
                    console.log(' ============ ', res.body.message);
                } else{
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        });
});