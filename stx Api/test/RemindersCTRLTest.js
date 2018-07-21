
var app = require('../app');
var config = require('config');
// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
//var unitTest = require('../config/unitTest');

describe('Reminders CTRL Testing', () => {
    describe('/Send Reminders', () => {
        // Here we passing valid data
        it('Send Reminders - Positive', function(done){
            this.timeout(10000);
            setTimeout(done, 5000);
            let RemindersObj = {
                "sendAppointmentReminders": true,
                "dailyRemindersAt": '01 AM  ',
                "fromTextTag": 'dfg',
                "notificationMessage": 'wedf',
                "whenTimeBeforeAppt": [ { "number": '32', "type": 'hours' } ],
                "fromEmailAddress": 'efd',
                "fromEmailName": 'edfv',
                "subject": 'wedf',
                "mergeField": 'Client Primary Phone'
                };
            chai.request(app).post('/api/appointments/reminders').send(RemindersObj).end((err, res) => {
                if(res.body.status == '1011') {
                    console.log(' ============ ', res.body.message);
                } else{
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Send Reminders - Positive', function(done){
            this.timeout(10000);
            setTimeout(done, 5000);
            let RemindersObj = {
                "sendAppointmentReminders": true,
                "dailyRemindersAt": '01 AM  ',
                "fromTextTag": 'dfg',
                "notificationMessage": 'wedf',
                "whenTimeBeforeAppt": [ { "number": '32', "type": 'hours' } ],
                "fromEmailAddress": 'efd',
                "fromEmailName": 'edfv',
                "subject": 'wedf',
                "mergeField": 'Client Primary Phone'
                };
            chai.request(app).post('/api/appointments/reminders').send(RemindersObj).end((err, res) => {
                if(res.body.status == '1011') {
                    console.log(' ============ ', res.body.message);
                } else{
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        });
});