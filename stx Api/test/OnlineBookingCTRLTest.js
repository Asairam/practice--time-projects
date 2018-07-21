
var app = require('../app');
var config = require('config');
// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
//var unitTest = require('../config/unitTest');

describe('Onlinebooking CTRL Testing', () => {
    describe('/Create Onlinebooking', () => {
        // Here we passing valid data
        it('Create Onlinebooking - Positive', function(done){
            this.timeout(10000);
            setTimeout(done, 5000);
            let OnlinebookingObj = {
                "bookingWindowStarts": { 
                    "windowStartTime": '2' },
            "bookingWindowEnds": { 
                "windowStartTime": '5', "windowStarts": '5' },
            "allowApptCancellations": true,
            "allowApptChanges": true,
            "onlineBookingEnabled": true,
            "displayOptions": 
             { "ShowTotalDuration": true,
               "ShowTotalPrice": true,
               "NumberofAvailabilities": '5' },
            "OnlineBookingLoginMessage": 'uij',
            "OnlineBookingLoginMessage1": 'uh',
            "pendingDepositHandling": 
             { "deleteFailedOnlineDeposits": true,
               "sendNotificationofFailed": 'Randy Tyrell' }
                };
            chai.request(app).post('/api/appointments/onlinebooking').send(OnlinebookingObj).end((err, res) => {
                if(res.body.status == '1011') {
                    console.log(' ============ ', res.body.message);
                } else{
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Create onlinebooking - Positive', function(done){
            this.timeout(10000);
            setTimeout(done, 5000);
            let OnlinebookingObj = {
                "bookingWindowStarts": { 
                    "windowStartTime": '2' },
            "bookingWindowEnds": { 
                "windowStartTime": '5', "windowStarts": '5' },
            "allowApptCancellations": true,
            "allowApptChanges": true,
            "onlineBookingEnabled": true,
            "displayOptions": 
             { "ShowTotalDuration": true,
               "ShowTotalPrice": true,
               "NumberofAvailabilities": '5' },
            "OnlineBookingLoginMessage": 'uij',
            "OnlineBookingLoginMessage1": 'uh',
            "pendingDepositHandling": 
             { "deleteFailedOnlineDeposits": true,
               "sendNotificationofFailed": 'Randy Tyrell' }
                };
            chai.request(app).post('/api/appointments/onlinebooking').send(OnlinebookingObj).end((err, res) => {
                if(res.body.status == '1011') {
                    console.log(' ============ ', res.body.message);
                } else{
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        });
});