
var app = require('../app');
var config = require('config');
// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
//var unitTest = require('../config/unitTest');

describe('Notifications CTRL Testing', () => {
    describe('/Create Notifications', () => {
        // Here we passing valid data
        it('Create Notifications - Positive', function(done){
            this.timeout(10000);
            setTimeout(done, 5000);
            let NotificationsObj = {
                "sendAppointmentNotifications": false,
                "notificationMessage": true,
                "fromTextTag": 'sdfvb',
                "fromEmailAddress": 'fghn@wed.wedf  ',
                "fromEmailName": 'ergh',
                "subject": 'dfgb',
                "mergeField": '',
                "emailTemplate":''
                };
            chai.request(app).post('/api/notifications').send(NotificationsObj).end((err, res) => {
                if(res.body.status == '1011') {
                    console.log(' ============ ', res.body.message);
                } else{
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Create notifications - Positive', function(done){
            this.timeout(10000);
            setTimeout(done, 5000);
            let NotificationsObj = {
                "sendAppointmentNotifications": false,
                "notificationMessage": true,
                "fromTextTag": 'sdfvb',
                "fromEmailAddress": 'fghn@wed.wedf  ',
                "fromEmailName": 'ergh',
                "subject": 'dfgb',
                "mergeField": '',
                "emailTemplate":''
                };
            chai.request(app).post('/api/notifications').send(NotificationsObj).end((err, res) => {
                if(res.body.status == '1011') {
                    console.log(' ============ ', res.body.message);
                } else{
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        });
});